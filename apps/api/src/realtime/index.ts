import { Router, Request, Response } from 'express';
import Pusher from 'pusher';
import { db } from '../db';

// ── Pusher Instance ────────────────────────────────────────────────────────
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || 'ap2',
  useTLS: true,
});

export { pusher };

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  edited: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of usernames/ids
}

// In-memory mock player state (will reset on serverless cold starts)
const mockPlaybackState: Record<string, { trackId: string | null; isPlaying: boolean; positionMs: number; updatedAt: number }> = {};
const mockQueue: Record<string, any[]> = {};

// ── Helper Functions ───────────────────────────────────────────────────────

const getConversation = async (roomId: string) => {
  let conv = await db.conversation.findFirst({ where: { name: roomId } });
  if (!conv) {
    conv = await db.conversation.create({ data: { name: roomId, isGroup: true } });
  }
  return conv;
};

const getSenderUser = async (username: string) => {
  let user = await db.user.findFirst({ where: { username } });
  if (!user) {
    // Fallback to demo user if the sender name doesn't match a DB user
    user = await db.user.findUnique({ where: { email: 'demo@soundsphere.io' } });
  }
  return user;
};

// Helper to safely extract roomId as string from Express 5 params
const getRoomId = (req: Request): string => {
  const roomId = req.params.roomId;
  return Array.isArray(roomId) ? roomId[0] : roomId;
};

const router = Router();

// GET /api/realtime/room/:roomId/state — Fetch initial room state
router.get('/room/:roomId/state', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);

  try {
    // Initialize playback state if not present
    if (!mockPlaybackState[roomId]) {
      mockPlaybackState[roomId] = {
        trackId: null,
        isPlaying: false,
        positionMs: 0,
        updatedAt: Date.now(),
      };
    }
    if (!mockQueue[roomId]) {
      mockQueue[roomId] = [];
    }

    // Fetch chat history from DB (Last 7 days)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);

    let chatHistory: ChatMessage[] = [];
    const conv = await db.conversation.findFirst({ where: { name: roomId } });
    if (conv) {
      const dbMessages = await db.message.findMany({
        where: {
          conversationId: conv.id,
          createdAt: { gte: sevenDaysAgo },
        },
        include: { sender: true },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });

      chatHistory = dbMessages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender.username,
        text: msg.content || '',
        timestamp: msg.createdAt.getTime(),
        edited: msg.isEdited,
      }));
    }

    res.json({
      playbackState: mockPlaybackState[roomId],
      queue: mockQueue[roomId],
      chatHistory,
    });
  } catch (error) {
    console.error('Failed to fetch room state:', error);
    res.status(500).json({ error: 'Failed to fetch room state' });
  }
});

// POST /api/realtime/room/:roomId/queue/add
router.post('/room/:roomId/queue/add', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { trackId, title, artist, duration, thumbnail } = req.body;

  if (!mockPlaybackState[roomId]) {
    mockPlaybackState[roomId] = { trackId: null, isPlaying: false, positionMs: 0, updatedAt: Date.now() };
  }
  if (!mockQueue[roomId]) {
    mockQueue[roomId] = [];
  }

  const newItem = {
    id: Math.random().toString(36).substring(7),
    trackId,
    title,
    artist,
    duration,
    thumbnail,
    addedAt: Date.now(),
  };

  // Auto-play if nothing is playing
  if (!mockPlaybackState[roomId].trackId) {
    mockPlaybackState[roomId] = {
      trackId,
      isPlaying: true,
      positionMs: 0,
      updatedAt: Date.now(),
    };
    await pusher.trigger(`room-${roomId}`, 'playback-sync', mockPlaybackState[roomId]);
  }

  mockQueue[roomId].push(newItem);
  await pusher.trigger(`room-${roomId}`, 'queue-added', newItem);

  res.json({ ok: true, item: newItem });
});

// POST /api/realtime/room/:roomId/playback/load
router.post('/room/:roomId/playback/load', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { trackId } = req.body;

  mockPlaybackState[roomId] = { trackId, isPlaying: true, positionMs: 0, updatedAt: Date.now() };
  await pusher.trigger(`room-${roomId}`, 'playback-sync', mockPlaybackState[roomId]);

  res.json({ ok: true });
});

// POST /api/realtime/room/:roomId/playback/play
router.post('/room/:roomId/playback/play', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { positionMs } = req.body;

  if (!mockPlaybackState[roomId]) {
    return res.status(400).json({ error: 'No playback state for this room' });
  }

  mockPlaybackState[roomId].isPlaying = true;
  mockPlaybackState[roomId].positionMs = positionMs;
  mockPlaybackState[roomId].updatedAt = Date.now();
  await pusher.trigger(`room-${roomId}`, 'playback-sync', mockPlaybackState[roomId]);

  res.json({ ok: true });
});

// POST /api/realtime/room/:roomId/playback/pause
router.post('/room/:roomId/playback/pause', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { positionMs } = req.body;

  if (!mockPlaybackState[roomId]) {
    return res.status(400).json({ error: 'No playback state for this room' });
  }

  mockPlaybackState[roomId].isPlaying = false;
  mockPlaybackState[roomId].positionMs = positionMs;
  mockPlaybackState[roomId].updatedAt = Date.now();
  await pusher.trigger(`room-${roomId}`, 'playback-sync', mockPlaybackState[roomId]);

  res.json({ ok: true });
});

// POST /api/realtime/room/:roomId/playback/seek
router.post('/room/:roomId/playback/seek', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { positionMs } = req.body;

  if (!mockPlaybackState[roomId]) {
    return res.status(400).json({ error: 'No playback state for this room' });
  }

  mockPlaybackState[roomId].positionMs = positionMs;
  mockPlaybackState[roomId].updatedAt = Date.now();
  await pusher.trigger(`room-${roomId}`, 'playback-sync', mockPlaybackState[roomId]);

  res.json({ ok: true });
});

// POST /api/realtime/room/:roomId/chat/send
router.post('/room/:roomId/chat/send', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { sender, text } = req.body;

  try {
    const conv = await getConversation(roomId);
    const user = await getSenderUser(sender);

    if (user) {
      const dbMsg = await db.message.create({
        data: {
          conversationId: conv.id,
          senderId: user.id,
          content: text,
          type: 'TEXT',
        },
      });

      const newMessage: ChatMessage = {
        id: dbMsg.id,
        sender: sender || 'Anonymous',
        text,
        timestamp: dbMsg.createdAt.getTime(),
        edited: false,
      };
      await pusher.trigger(`room-${roomId}`, 'chat-message', newMessage);
      return res.json({ ok: true, message: newMessage });
    }
    res.status(400).json({ error: 'User not found' });
  } catch (err) {
    console.error('Failed to save message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// POST /api/realtime/room/:roomId/chat/edit
router.post('/room/:roomId/chat/edit', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { id, text } = req.body;

  try {
    const dbMsg = await db.message.update({
      where: { id },
      data: { content: text, isEdited: true },
      include: { sender: true },
    });

    const msg: ChatMessage = {
      id: dbMsg.id,
      sender: dbMsg.sender.username,
      text: dbMsg.content || '',
      timestamp: dbMsg.createdAt.getTime(),
      edited: true,
    };
    await pusher.trigger(`room-${roomId}`, 'chat-updated', msg);
    res.json({ ok: true, message: msg });
  } catch (err) {
    console.error('Edit failed:', err);
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

// POST /api/realtime/room/:roomId/chat/delete
router.post('/room/:roomId/chat/delete', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { id } = req.body;

  try {
    await db.message.delete({ where: { id } });
    await pusher.trigger(`room-${roomId}`, 'chat-deleted', id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete failed:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// POST /api/realtime/room/:roomId/chat/react
router.post('/room/:roomId/chat/react', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { emoji, sender } = req.body;

  try {
    await pusher.trigger(`room-${roomId}`, 'song-reaction-received', {
      id: Math.random().toString(36),
      emoji,
      sender,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to react' });
  }
});

// POST /api/realtime/room/:roomId/song/react
router.post('/room/:roomId/song/react', async (req: Request, res: Response) => {
  const roomId = getRoomId(req);
  const { emoji, sender } = req.body;

  await pusher.trigger(`room-${roomId}`, 'song-reaction-received', {
    id: Math.random().toString(36).substring(7),
    emoji,
    sender,
    timestamp: Date.now(),
  });

  res.json({ ok: true });
});

export { router as realtimeRoutes };
