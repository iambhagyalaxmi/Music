import { Router, Request, Response } from 'express';
import { expireTrials } from './expireTrials';
import { db } from '../db';

const router = Router();

/**
 * Vercel Cron Job endpoints.
 * Configure these in vercel.json under the "crons" key.
 * Each endpoint validates the CRON_SECRET header to prevent unauthorized access.
 */

// Middleware to validate cron secret (protects cron endpoints on Vercel)
const validateCronSecret = (req: Request, res: Response, next: Function) => {
  // In local dev, skip auth
  if (!process.env.VERCEL) return next();

  const secret = req.headers['authorization'];
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// POST /api/cron/expire-trials
router.post('/expire-trials', validateCronSecret, async (_req: Request, res: Response) => {
  try {
    await expireTrials();
    res.json({ ok: true, message: 'Trial expiration job completed.' });
  } catch (error) {
    console.error('[Cron] expire-trials error:', error);
    res.status(500).json({ error: 'Failed to run expire trials job' });
  }
});

// POST /api/cron/cleanup-chats
router.post('/cleanup-chats', validateCronSecret, async (_req: Request, res: Response) => {
  try {
    console.log('[Cron] Running chat cleanup job...');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const deleted = await db.message.deleteMany({
      where: {
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`[Cron] Chat cleanup complete. Deleted ${deleted.count} old messages.`);
    res.json({ ok: true, message: `Deleted ${deleted.count} old messages.` });
  } catch (error) {
    console.error('[Cron] cleanup-chats error:', error);
    res.status(500).json({ error: 'Failed to run chat cleanup job' });
  }
});

export { router as cronRoutes };
