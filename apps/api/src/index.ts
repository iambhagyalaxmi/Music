import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { db } from './db';
import { authRoutes } from './modules/auth/auth.controller';
import { spotifyRoutes } from './modules/auth/spotify.controller';
import { ytmusicRoutes } from './modules/ytmusic/ytmusic.controller';
import { roomsRoutes } from './modules/rooms/rooms.controller';
import { usersRoutes } from './modules/users/users.controller';
import { subscriptionsRoutes } from './modules/subscriptions/subscriptions.controller';
import { notificationsRoutes } from './modules/notifications/notifications.controller';
import { playlistsRoutes } from './modules/playlists/playlists.controller';
import { profileRoutes } from './modules/profile/profile.controller';
import { settingsRoutes } from './modules/settings/settings.controller';
import { communityRoutes } from './modules/community/community.controller';
import { communitySocialRoutes } from './modules/community/community-social.controller';
import { friendsRoutes } from './modules/friends/friends.controller';
import { realtimeRoutes } from './realtime';
import { cronRoutes } from './jobs/cron.controller';

// ── Express App ────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/auth/spotify', spotifyRoutes);
app.use('/auth', authRoutes);
app.use('/api/ytmusic', ytmusicRoutes);
app.use('/rooms', roomsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/community-social', communitySocialRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/realtime', realtimeRoutes);
app.use('/api/cron', cronRoutes);

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── Local Development Server ───────────────────────────────────────────────
// Only start the server when NOT running on Vercel (serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // ── Background Cron Jobs (local only) ────────────────────────────────────
  // These run in-process during local development.
  // On Vercel, use Vercel Cron Jobs to call /api/cron/* endpoints instead.
  const { expireTrials } = require('./jobs/expireTrials');
  const { scheduleChatCleanup } = require('./jobs/cleanupChats');

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  expireTrials(); // Run once on startup to catch any missed expirations
  setInterval(expireTrials, TWENTY_FOUR_HOURS);
  scheduleChatCleanup();
}

// ── Export for Vercel Serverless ────────────────────────────────────────────
export default app;
