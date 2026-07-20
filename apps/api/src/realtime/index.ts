import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { db } from '../db';
import jwt from 'jsonwebtoken';

let ioInstance: Server;
export const getIO = () => ioInstance;

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  edited: boolean;
  reactions?: Record<string, string[]>; // emoji -> array of usernames/ids
}

// In-memory mock player state for Phase 2 sync testing
const mockPlaybackState: Record<string, { trackId: string | null; isPlaying: boolean; positionMs: number; updatedAt: number }> = {};

export function setupSocketIO(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict this
      methods: ['GET', 'POST']
    }
  });
  
  ioInstance = io;

  // ==========================================
  // COMMUNITY NAMESPACE
  // ==========================================
  const communityNamespace = io.of('/community');

  communityNamespace.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Authentication error: Missing token'));

    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  communityNamespace.on('connection', (socket: Socket) => {
    const userId = socket.data.user?.userId;
    if (userId) {
      socket.join(userId);
      console.log(`Socket connected to /community, joined room ${userId}`);
    }

    socket.on('disconnect', () => {
      console.log(`Socket disconnected from /community room ${userId}`);
    });
  });

  // ==========================================
  // ROOMS NAMESPACE
  // ==========================================
  const roomsNamespace = io.of(/^\/room:[a-zA-Z0-9-]+$/);

  roomsNamespace.on('connection', (socket: Socket) => {
    const namespaceName = socket.nsp.name; // e.g., /room:123
    const roomId = namespaceName.split(':')[1];
    
    console.log(`Socket connected to room ${roomId}`);
    
    // Initialize playback state if not present
    if (!mockPlaybackState[roomId]) {
      mockPlaybackState[roomId] = {
        trackId: null,
        isPlaying: false,
        positionMs: 0,
        updatedAt: Date.now()
      };
    }
    
    // Fetch chat history from DB (Last 7 days)
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS);
    
    // We fetch this async and emit when ready
    db.conversation.findFirst({ where: { name: roomId } }).then(async (conv: any) => {
      if (conv) {
        const dbMessages = await db.message.findMany({
          where: { 
            conversationId: conv.id,
            createdAt: { gte: sevenDaysAgo }
          },
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
          take: 100 // Limit to latest 100 for safety
        });
        
        const history: ChatMessage[] = dbMessages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender.username,
          text: msg.content || '',
          timestamp: msg.createdAt.getTime(),
          edited: msg.isEdited
        }));
        socket.emit('chat:history', history);
      } else {
        socket.emit('chat:history', []);
      }
    }).catch((err: any) => {
      console.error('Failed to fetch chat history:', err);
      socket.emit('chat:history', []);
    });

    socket.emit('playback:sync', mockPlaybackState[roomId]);

    // --- QUEUE & PLAYBACK EVENTS ---
    socket.on('queue:add', async (data) => {
      const { trackId, title, artist, duration, thumbnail } = data;
      const newItem = { 
        id: Math.random().toString(36).substring(7), 
        trackId, 
        title, 
        artist, 
        duration, 
        thumbnail, 
        addedAt: Date.now() 
      };
      
      if (!mockPlaybackState[roomId].trackId) {
        mockPlaybackState[roomId] = {
          trackId,
          isPlaying: true,
          positionMs: 0,
          updatedAt: Date.now()
        };
        socket.nsp.emit('playback:sync', mockPlaybackState[roomId]);
      }
      
      socket.nsp.emit('queue:added', newItem);
    });

    socket.on('playback:loadTrack', (trackId: string) => {
      mockPlaybackState[roomId] = { trackId, isPlaying: true, positionMs: 0, updatedAt: Date.now() };
      socket.nsp.emit('playback:sync', mockPlaybackState[roomId]);
    });

    socket.on('playback:play', (positionMs: number) => {
      mockPlaybackState[roomId].isPlaying = true;
      mockPlaybackState[roomId].positionMs = positionMs;
      mockPlaybackState[roomId].updatedAt = Date.now();
      socket.nsp.emit('playback:sync', mockPlaybackState[roomId]);
    });

    socket.on('playback:pause', (positionMs: number) => {
      mockPlaybackState[roomId].isPlaying = false;
      mockPlaybackState[roomId].positionMs = positionMs;
      mockPlaybackState[roomId].updatedAt = Date.now();
      socket.nsp.emit('playback:sync', mockPlaybackState[roomId]);
    });
    
    socket.on('playback:seek', (positionMs: number) => {
      mockPlaybackState[roomId].positionMs = positionMs;
      mockPlaybackState[roomId].updatedAt = Date.now();
      socket.nsp.emit('playback:sync', mockPlaybackState[roomId]);
    });

    // --- CHAT EVENTS (CRUD with DB Persistence) ---
    const getConversation = async () => {
      let conv = await db.conversation.findFirst({ where: { name: roomId } });
      if (!conv) {
        conv = await db.conversation.create({ data: { name: roomId, isGroup: true } });
      }
      return conv;
    };

    const getSenderUser = async (username: string) => {
      let user = await db.user.findFirst({ where: { username } });
      if (!user) {
        // Fallback to demo user if the socket sender name doesn't match a DB user
        user = await db.user.findUnique({ where: { email: 'demo@soundsphere.io' } });
      }
      return user;
    };

    socket.on('chat:send', async (data: { sender: string, text: string }) => {
      try {
        const conv = await getConversation();
        const user = await getSenderUser(data.sender);

        if (user) {
          const dbMsg = await db.message.create({
            data: {
              conversationId: conv.id,
              senderId: user.id,
              content: data.text,
              type: 'TEXT'
            }
          });

          const newMessage: ChatMessage = {
            id: dbMsg.id,
            sender: data.sender || 'Anonymous',
            text: data.text,
            timestamp: dbMsg.createdAt.getTime(),
            edited: false
          };
          socket.nsp.emit('chat:message', newMessage);
        }
      } catch (err) {
        console.error('Failed to save message:', err);
      }
    });

    socket.on('chat:edit', async (data: { id: string, text: string }) => {
      try {
        const dbMsg = await db.message.update({
          where: { id: data.id },
          data: { content: data.text, isEdited: true },
          include: { sender: true }
        });
        
        const msg: ChatMessage = {
          id: dbMsg.id,
          sender: dbMsg.sender.username,
          text: dbMsg.content || '',
          timestamp: dbMsg.createdAt.getTime(),
          edited: true
        };
        socket.nsp.emit('chat:updated', msg);
      } catch (err) {
        console.error('Edit failed:', err);
      }
    });

    socket.on('chat:delete', async (data: { id: string }) => {
      try {
        await db.message.delete({ where: { id: data.id } });
        socket.nsp.emit('chat:deleted', data.id);
      } catch (err) {
        console.error('Delete failed:', err);
      }
    });

    socket.on('chat:react', async (data: { messageId: string, emoji: string, sender: string }) => {
      try {
        const user = await getSenderUser(data.sender);
        if (!user) return;

        // Map frontend emoji to enum if possible, or just skip if it doesn't match
        // For simplicity we will broadcast it ephemerally or you could persist to MessageReaction table
        socket.nsp.emit('song:reaction_received', { id: Math.random().toString(36), emoji: data.emoji, sender: data.sender });
      } catch (e) {}
    });

    // --- SONG REACTION EVENTS ---
    socket.on('song:react', (data: { emoji: string, sender: string }) => {
      socket.nsp.emit('song:reaction_received', { 
        id: Math.random().toString(36).substring(7),
        emoji: data.emoji, 
        sender: data.sender,
        timestamp: Date.now()
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected from room ${roomId}`);
    });
  });

  return io;
}
