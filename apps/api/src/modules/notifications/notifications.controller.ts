import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

// ── GET /notifications ─────────────────────────────────────────────────────
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 20;

  try {
    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.notification.count({ where: { userId, isRead: false } }),
    ]);

    res.json({ notifications, unreadCount, page });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ── PATCH /notifications/read-all ──────────────────────────────────────────
router.patch('/read-all', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
});

// ── PATCH /notifications/:id/read ─────────────────────────────────────────
router.patch('/:id/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    await db.notification.updateMany({
      where: { id: req.params.id, userId },
      data: { isRead: true },
    });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

export const notificationsRoutes = router;
