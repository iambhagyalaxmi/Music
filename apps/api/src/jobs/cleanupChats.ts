import cron from 'node-cron';
import { db } from '../db';

export function scheduleChatCleanup() {
  // Run every day at midnight to delete messages older than 7 days
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily chat cleanup job...');
    
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const deleted = await db.message.deleteMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo
          }
        }
      });
      
      console.log(`[Cron] Chat cleanup complete. Deleted ${deleted.count} old messages.`);
    } catch (error) {
      console.error('[Cron] Error during chat cleanup:', error);
    }
  });
}
