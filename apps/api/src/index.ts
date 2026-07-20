import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
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
import { setupSocketIO } from './realtime';
import { expireTrials } from './jobs/expireTrials';
import { scheduleChatCleanup } from './jobs/cleanupChats';

// ── Express App ────────────────────────────────────────────────────────────
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// ── HTTP Server + Socket.IO ────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
const server = createServer(app);
setupSocketIO(server);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ── Daily Cron: Expire Free Trials ─────────────────────────────────────────
// Run at midnight every day. In production use a proper scheduler (node-cron, BullMQ, etc.)
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
expireTrials(); // Run once on startup to catch any missed expirations
setInterval(expireTrials, TWENTY_FOUR_HOURS);

// ── Daily Cron: Chat Cleanup ───────────────────────────────────────────────
scheduleChatCleanup();
