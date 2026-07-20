import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

// ── GET /users/:username ───────────────────────────────────────────────────
router.get('/:username', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await db.user.findFirst({
      where: { username: req.params.username },
      include: {
        profile: true,
        _count: {
          select: { playlists: true, followedBy: true, following: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Don't expose sensitive fields on public profiles
    res.json({
      id: user.id,
      username: user.username,
      profile: user.profile,
      stats: user._count,
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ── PUT /users/me/profile ──────────────────────────────────────────────────
router.put('/me/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { displayName, bio, avatarUrl, isPublic, country, website } = req.body;

  try {
    const profile = await db.userProfile.upsert({
      where: { userId },
      create: { userId, displayName, bio, avatarUrl, isPublic, country, website },
      update: { displayName, bio, avatarUrl, isPublic, country, website },
    });
    res.json(profile);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ── POST /users/:id/follow ─────────────────────────────────────────────────
router.post('/:id/follow', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const followerId = req.user!.userId;
  const followingId = req.params.id;

  if (followerId === followingId) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  try {
    await db.follower.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: followingId,
        type: 'NEW_FOLLOWER',
        title: 'New Follower',
        body: `Someone started following you!`,
        data: { followerId },
      },
    });

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow Error:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// ── DELETE /users/:id/follow ───────────────────────────────────────────────
router.delete('/:id/follow', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const followerId = req.user!.userId;
  const followingId = req.params.id;

  try {
    await db.follower.deleteMany({ where: { followerId, followingId } });
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow Error:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

// ── GET /users/:id/followers ───────────────────────────────────────────────
router.get('/:id/followers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const followers = await db.follower.findMany({
      where: { followingId: req.params.id },
      include: { follower: { include: { profile: true } } },
      take: 50,
    });
    res.json(followers.map((f: any) => f.follower));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

export const usersRoutes = router;
