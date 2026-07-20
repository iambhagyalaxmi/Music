import { db } from '../db';

/**
 * Expire FREE_TRIAL subscriptions that have passed their trialEndsAt date.
 * Run this as a daily cron job (e.g., at midnight UTC).
 *
 * Example with node-cron:
 *   cron.schedule('0 0 * * *', expireTrials);
 */
export const expireTrials = async (): Promise<void> => {
  try {
    const result = await db.subscription.updateMany({
      where: {
        status: 'TRIAL',
        trialEndsAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });

    if (result.count > 0) {
      console.log(`[expireTrials] Expired ${result.count} trial subscription(s).`);
    }
  } catch (error) {
    console.error('[expireTrials] Error expiring trials:', error);
  }
};
