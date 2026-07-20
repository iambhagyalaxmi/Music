import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { pusher } from '../../realtime';

export const friendsRoutes = Router();

// ==========================================
// 1. Send Friend Request
// ==========================================
friendsRoutes.post('/request/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const senderId = req.user!.userId;
  const receiverId = req.params.userId;

  if (senderId === receiverId) {
    return res.status(400).json({ error: 'You cannot send a friend request to yourself.' });
  }

  try {
    // Check if already friends
    const existingFriend = await db.friend.findFirst({
      where: { userId: senderId, friendId: receiverId },
    });
    if (existingFriend) {
      return res.status(400).json({ error: 'You are already friends.' });
    }

    // Check for existing request
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ],
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'A pending friend request already exists between you two.' });
    }

    const newRequest = await db.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    // Create Notification
    await db.notification.create({
      data: {
        userId: receiverId,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        body: 'Someone sent you a friend request!',
        data: { requestId: newRequest.id, senderId }
      }
    });

    // Emit Real-time event via Pusher
    pusher.trigger('community', 'friend-request-received', {
      requestId: newRequest.id,
      senderId,
      receiverId,
    }).catch(() => {});

    res.json(newRequest);
  } catch (error) {
    console.error('Send Request Error:', error);
    res.status(500).json({ error: 'Failed to send friend request.' });
  }
});

// ==========================================
// 2. Accept Friend Request
// ==========================================
friendsRoutes.post('/accept/:requestId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { requestId } = req.params;

  try {
    const request = await db.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId || request.status !== 'PENDING') {
      return res.status(404).json({ error: 'Valid pending friend request not found.' });
    }

    // Run in transaction to ensure consistency
    await db.$transaction([
      db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      }),
      db.friend.create({ data: { userId: request.senderId, friendId: request.receiverId } }),
      db.friend.create({ data: { userId: request.receiverId, friendId: request.senderId } }),
      db.notification.create({
        data: {
          userId: request.senderId,
          type: 'FRIEND_ACCEPTED',
          title: 'Friend Request Accepted',
          body: 'Your friend request was accepted!',
          data: { friendId: userId }
        }
      })
    ]);

    // Emit Real-time event to sender via Pusher
    pusher.trigger('community', 'friend-request-accepted', {
      friendId: userId,
      senderId: request.senderId,
    }).catch(() => {});

    res.json({ message: 'Friend request accepted.' });
  } catch (error) {
    console.error('Accept Request Error:', error);
    res.status(500).json({ error: 'Failed to accept friend request.' });
  }
});

// ==========================================
// 3. Reject Friend Request
// ==========================================
friendsRoutes.post('/reject/:requestId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { requestId } = req.params;

  try {
    const request = await db.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.receiverId !== userId || request.status !== 'PENDING') {
      return res.status(404).json({ error: 'Valid pending friend request not found.' });
    }

    await db.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' }
    });

    res.json({ message: 'Friend request rejected.' });
  } catch (error) {
    console.error('Reject Request Error:', error);
    res.status(500).json({ error: 'Failed to reject friend request.' });
  }
});

// ==========================================
// 4. Cancel Friend Request (Outgoing)
// ==========================================
friendsRoutes.delete('/request/:requestId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { requestId } = req.params;

  try {
    const request = await db.friendRequest.findUnique({ where: { id: requestId } });
    if (!request || request.senderId !== userId || request.status !== 'PENDING') {
      return res.status(404).json({ error: 'Valid outgoing friend request not found.' });
    }

    await db.friendRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Friend request cancelled.' });
  } catch (error) {
    console.error('Cancel Request Error:', error);
    res.status(500).json({ error: 'Failed to cancel friend request.' });
  }
});

// ==========================================
// 5. Remove Friend
// ==========================================
friendsRoutes.delete('/:friendId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { friendId } = req.params;

  try {
    // Delete bidirectional friendship records
    await db.$transaction([
      db.friend.deleteMany({
        where: { userId, friendId }
      }),
      db.friend.deleteMany({
        where: { userId: friendId, friendId: userId }
      })
    ]);

    res.json({ message: 'Friend removed successfully.' });
  } catch (error) {
    console.error('Remove Friend Error:', error);
    res.status(500).json({ error: 'Failed to remove friend.' });
  }
});

// ==========================================
// 6. Get Friends List
// ==========================================
friendsRoutes.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const friends = await db.friend.findMany({
      where: { userId },
      include: {
        friend: {
          select: {
            id: true,
            username: true,
            profile: true,
            activeSessions: {
              take: 1,
              orderBy: { lastActive: 'desc' }
            }
          }
        }
      }
    });

    // Map active sessions to online status
    const mappedFriends = friends.map(f => {
      const isOnline = f.friend.activeSessions && f.friend.activeSessions.length > 0;
      return {
        id: f.friend.id,
        username: f.friend.username,
        profile: f.friend.profile,
        isOnline,
        friendshipCreatedAt: f.createdAt
      };
    });

    res.json(mappedFriends);
  } catch (error) {
    console.error('Get Friends Error:', error);
    res.status(500).json({ error: 'Failed to fetch friends.' });
  }
});

// ==========================================
// 7. Get Incoming Requests
// ==========================================
friendsRoutes.get('/requests/incoming', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const requests = await db.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: {
          select: { id: true, username: true, profile: true }
        }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error('Incoming Requests Error:', error);
    res.status(500).json({ error: 'Failed to fetch incoming requests.' });
  }
});

// ==========================================
// 8. Get Outgoing Requests
// ==========================================
friendsRoutes.get('/requests/outgoing', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const requests = await db.friendRequest.findMany({
      where: { senderId: userId, status: 'PENDING' },
      include: {
        receiver: {
          select: { id: true, username: true, profile: true }
        }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error('Outgoing Requests Error:', error);
    res.status(500).json({ error: 'Failed to fetch outgoing requests.' });
  }
});

// ==========================================
// 9. Search Friends & Users
// ==========================================
friendsRoutes.get('/search', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const query = req.query.q as string;

  if (!query || query.length < 2) {
    return res.json([]);
  }

  try {
    const users = await db.user.findMany({
      where: {
        id: { not: userId },
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { displayName: { contains: query, mode: 'insensitive' } } }
        ]
      },
      select: {
        id: true,
        username: true,
        profile: true,
        friends: { where: { friendId: userId } },
        receivedFriendRequests: { where: { senderId: userId, status: 'PENDING' } },
        sentFriendRequests: { where: { receiverId: userId, status: 'PENDING' } }
      },
      take: 20
    });

    const mappedUsers = users.map(u => {
      let status = 'NONE';
      if (u.friends.length > 0) status = 'FRIENDS';
      else if (u.receivedFriendRequests.length > 0) status = 'REQUEST_SENT';
      else if (u.sentFriendRequests.length > 0) status = 'REQUEST_RECEIVED';

      return {
        id: u.id,
        username: u.username,
        profile: u.profile,
        friendshipStatus: status
      };
    });

    res.json(mappedUsers);
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ error: 'Failed to search users.' });
  }
});

// ==========================================
// 10. Get Friend Suggestions
// ==========================================
friendsRoutes.get('/suggestions', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    // Simple suggestion: users followed by current user who are not friends yet
    const following = await db.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    
    const followingIds = following.map(f => f.followingId);
    
    const suggestions = await db.user.findMany({
      where: {
        id: { in: followingIds, not: userId },
        friends: { none: { friendId: userId } },
        receivedFriendRequests: { none: { senderId: userId, status: 'PENDING' } }
      },
      select: {
        id: true,
        username: true,
        profile: true,
      },
      take: 10
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions Error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions.' });
  }
});

// ==========================================
// 11. Get Mutual Friends
// ==========================================
friendsRoutes.get('/mutual/:targetUserId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { targetUserId } = req.params;

  try {
    const myFriends = await db.friend.findMany({
      where: { userId },
      select: { friendId: true }
    });
    const myFriendIds = myFriends.map(f => f.friendId);

    const mutuals = await db.friend.findMany({
      where: {
        userId: targetUserId,
        friendId: { in: myFriendIds }
      },
      include: {
        friend: {
          select: { id: true, username: true, profile: true }
        }
      }
    });

    res.json(mutuals.map(m => m.friend));
  } catch (error) {
    console.error('Mutual Friends Error:', error);
    res.status(500).json({ error: 'Failed to fetch mutual friends.' });
  }
});
