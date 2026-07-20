import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

// ── GET /subscriptions/me ──────────────────────────────────────────────────
// Returns current subscription including trial expiry status
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    const sub = await db.subscription.findUnique({ where: { userId } });
    if (!sub) return res.status(404).json({ error: 'No subscription found' });

    const now = new Date();
    const trialDaysLeft =
      sub.status === 'TRIAL'
        ? Math.max(0, Math.ceil((sub.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    res.json({
      ...sub,
      trialDaysLeft,
      isPremium: sub.status === 'ACTIVE',
      isTrial: sub.status === 'TRIAL',
      isExpired: sub.status === 'EXPIRED' || sub.status === 'CANCELLED',
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// ── POST /subscriptions/upgrade ────────────────────────────────────────────
// Called by your Stripe webhook after a successful payment
// In production: verify the Stripe signature and trigger from Stripe webhook
router.post('/upgrade', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { stripeCustomerId, stripeSubId, priceId, tier } = req.body;

  try {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const sub = await db.subscription.update({
      where: { userId },
      data: {
        tier: tier || 'PREMIUM',
        status: 'ACTIVE',
        stripeCustomerId: stripeCustomerId || undefined,
        stripeSubId: stripeSubId || undefined,
        priceId: priceId || undefined,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      },
    });

    res.json({ message: 'Subscription upgraded successfully', subscription: sub });
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    res.status(500).json({ error: 'Failed to upgrade subscription' });
  }
});

// ── POST /subscriptions/cancel ─────────────────────────────────────────────
router.post('/cancel', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    const sub = await db.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    res.json({ message: 'Subscription cancelled', subscription: sub });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export const subscriptionsRoutes = router;
