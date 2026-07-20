import { Router } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

export const settingsRoutes = Router();

// Middleware to ensure req is strongly typed
const auth = requireAuth as any;

// ── GET ALL SETTINGS ────────────────────────────────────────────────────────
settingsRoutes.get('/', auth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        playbackSettings: true,
        audioSettings: true,
        voiceSettings: true,
        chatSettings: true,
        themeSettings: true,
        languageSettings: true,
        privacySettings: true,
        notificationSettings: true,
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      playback: user.playbackSettings,
      audio: user.audioSettings,
      voice: user.voiceSettings,
      chat: user.chatSettings,
      theme: user.themeSettings,
      language: user.languageSettings,
      privacy: user.privacySettings,
      notifications: user.notificationSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GENERIC UPSERT HELPER ───────────────────────────────────────────────────
const handleSettingsUpdate = async (req: any, res: any, modelName: string) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const data = req.body;

    // We use dynamic access on the db object
    const dbModel = (db as any)[modelName];
    
    const updatedSettings = await dbModel.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });

    res.json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── UPDATE ENDPOINTS ────────────────────────────────────────────────────────
settingsRoutes.put('/playback', auth, (req, res) => handleSettingsUpdate(req, res, 'playbackSettings'));
settingsRoutes.put('/audio', auth, (req, res) => handleSettingsUpdate(req, res, 'audioSettings'));
settingsRoutes.put('/voice', auth, (req, res) => handleSettingsUpdate(req, res, 'voiceSettings'));
settingsRoutes.put('/chat', auth, (req, res) => handleSettingsUpdate(req, res, 'chatSettings'));
settingsRoutes.put('/theme', auth, (req, res) => handleSettingsUpdate(req, res, 'themeSettings'));
settingsRoutes.put('/language', auth, (req, res) => handleSettingsUpdate(req, res, 'languageSettings'));
settingsRoutes.put('/privacy', auth, (req, res) => handleSettingsUpdate(req, res, 'privacySettings'));
settingsRoutes.put('/notifications', auth, (req, res) => handleSettingsUpdate(req, res, 'notificationSettings'));

// ── DEVICES ───────────────────────────────────────────────────────────────
settingsRoutes.get('/devices', auth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).user!.userId;
    const devices = await db.userDevice.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' }
    });
    
    const activeSessions = await db.activeSession.findMany({
      where: { userId },
      orderBy: { lastPingAt: 'desc' }
    });

    res.json({ devices, activeSessions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});
