import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { pusher } from '../../realtime';

const router = Router();

// ==========================================
// 1. FAN CLUBS
// ==========================================

router.post('/fan-clubs', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    const fanClub = await db.fanClub.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          create: { userId } // Owner automatically joins
        }
      }
    });
    res.status(201).json(fanClub);
  } catch (err) {
    console.error('Create Fan Club Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/fan-clubs/:id/join', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const fanClubId = req.params.id;

    const club = await db.fanClub.findUnique({ where: { id: fanClubId, deletedAt: null } });
    if (!club) return res.status(404).json({ error: 'Fan Club not found' });

    const existing = await db.fanClubMember.findUnique({ where: { fanClubId_userId: { fanClubId, userId } } });
    if (existing) return res.status(400).json({ error: 'Already a member' });

    await db.fanClubMember.create({ data: { fanClubId, userId } });
    res.status(200).json({ message: 'Joined successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/fan-clubs/:id/leave', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const fanClubId = req.params.id;

    await db.fanClubMember.delete({ where: { fanClubId_userId: { fanClubId, userId } } });
    res.status(200).json({ message: 'Left successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fan-clubs', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const clubs = await db.fanClub.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { members: true } } }
    });
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 2. COMMUNITY POLLS
// ==========================================

router.post('/polls', requireAuth, async (req: Request, res: Response) => {
  try {
    const { question, options, expiresAt } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Question and at least 2 options required' });
    }

    const poll = await db.communityPoll.create({
      data: {
        question,
        creatorId: userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        options: {
          create: options.map(opt => ({ text: opt }))
        }
      },
      include: { options: true }
    });
    pusher.trigger('community', 'feed-update', { type: 'POLL', poll }).catch(() => {});
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/polls/:pollId/vote', requireAuth, async (req: Request, res: Response) => {
  try {
    const { optionId } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const pollId = req.params.pollId;

    const poll = await db.communityPoll.findUnique({ where: { id: pollId, deletedAt: null } });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.expiresAt && new Date() > poll.expiresAt) return res.status(400).json({ error: 'Poll expired' });

    const option = await db.communityPollOption.findFirst({ where: { id: optionId, pollId } });
    if (!option) return res.status(400).json({ error: 'Invalid option' });

    const existingVote = await db.communityPollVote.findFirst({
      where: { userId, option: { pollId } }
    });

    if (existingVote) {
      if (existingVote.optionId === optionId) return res.status(400).json({ error: 'Already voted for this option' });
      await db.communityPollVote.delete({ where: { id: existingVote.id } });
    }

    const vote = await db.communityPollVote.create({ data: { optionId, userId } });
    pusher.trigger('community', 'poll-vote', { pollId, optionId, userId }).catch(() => {});
    res.status(200).json({ message: 'Voted successfully', vote });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 3. FRIENDS ACTIVITY
// ==========================================

router.get('/friends-activity', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;

    const friends = await db.friend.findMany({
      where: { OR: [{ userId1: userId }, { userId2: userId }], status: 'ACCEPTED' }
    });
    
    const friendIds = friends.map((f: any) => f.userId1 === userId ? f.userId2 : f.userId1);
    if (friendIds.length === 0) return res.json([]);

    const activities = await db.user.findMany({
      where: { id: { in: friendIds } },
      select: {
        id: true,
        username: true,
        profile: { select: { displayName: true, avatarUrl: true } },
        activeSessions: { orderBy: { lastPingAt: 'desc' }, take: 1 },
        playbackHistory: { orderBy: { playedAt: 'desc' }, take: 5, include: { song: true } }
      }
    });

    const formatted = activities.map((friend: any) => {
      const isOnline = friend.activeSessions.length > 0 && 
                      (new Date().getTime() - friend.activeSessions[0].lastPingAt.getTime() < 5 * 60 * 1000);
      return {
        user: { id: friend.id, username: friend.username, ...friend.profile },
        isOnline,
        currentlyPlaying: isOnline && friend.playbackHistory.length > 0 ? friend.playbackHistory[0].song : null,
        recentSongs: friend.playbackHistory.map((h: any) => h.song)
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 4. LEADERBOARDS
// ==========================================

router.get('/leaderboards', requireAuth, async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string || 'songsPlayed';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const validCategories = ['songsPlayed', 'totalListeningSecs', 'playlistsCreated', 'friendsCount'];
    if (!validCategories.includes(category)) return res.status(400).json({ error: 'Invalid category' });

    const stats = await db.userStatistics.findMany({
      orderBy: { [category]: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { id: true, username: true, profile: { select: { displayName: true, avatarUrl: true } } } }
      }
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ==========================================
// 5. NOTIFICATIONS
// ==========================================

router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const notifs = await db.notification.findMany({
      where: { userId, type: { in: ['COMMUNITY_ALERT', 'FAN_CLUB_INVITE'] } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router as communitySocialRoutes };
