import { Router } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const profileRoutes = Router();

// GET /api/profile (My Profile)
profileRoutes.get('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userStatistics: true,
        privacySettings: true,
        _count: {
          select: {
            followers: true,
            following: true,
            friends: true,
          }
        }
      }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.profile,
      stats: user.userStatistics,
      privacy: user.privacySettings,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      friendsCount: user._count.friends,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/profile/stats
profileRoutes.get('/stats', requireAuth, async (req, res) => {
  try {
    const stats = await db.userStatistics.findUnique({
      where: { userId: (req as AuthenticatedRequest).user!.userId }
    });
    res.json(stats || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// PUT /api/profile
profileRoutes.put('/', requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const { displayName, bio, country, website } = req.body;
    
    const profile = await db.userProfile.upsert({
      where: { userId },
      update: { displayName, bio, country, website },
      create: { userId, displayName: displayName || 'User', bio, country, website }
    });
    
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/achievements
profileRoutes.get('/achievements', requireAuth, async (req, res) => {
  try {
    const achievements = await db.userAchievement.findMany({
      where: { userId: (req as AuthenticatedRequest).user!.userId },
      include: { achievement: true }
    });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// POST /api/profile/privacy
profileRoutes.post('/privacy', requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const data = req.body;
    
    const settings = await db.privacySettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
    
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update privacy settings' });
  }
});

// GET /api/profile/:username (Public Profile)
profileRoutes.get('/:username', async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { username: req.params.username },
      include: {
        profile: true,
        userStatistics: true,
        _count: { select: { followers: true, following: true } }
      }
    });
    
    if (!user || !user.profile?.isPublic) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      profile: user.profile,
      stats: user.userStatistics,
      followersCount: user._count.followers,
      followingCount: user._count.following,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
