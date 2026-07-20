import { Router, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';

// ── POST /auth/google ──────────────────────────────────────────────────────
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: 'Token is required' });

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const { email, name, sub: googleId, picture } = payload;

    // Upsert user — find by Google account sub or email
    let user = await db.user.findFirst({
      where: {
        OR: [
          { googleAccount: { googleId } },
          { email },
        ],
      },
      include: { subscription: true, profile: true },
    });

    if (!user) {
      // Derive a unique username from their name/email
      const baseUsername = (name || email.split('@')[0])
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 20);
      const username = `${baseUsername}_${Math.floor(Math.random() * 9999)}`;

      const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      user = await db.user.create({
        data: {
          email,
          username,
          emailVerified: true,
          role: 'USER',
          profile: {
            create: {
              displayName: name || username,
              avatarUrl: picture || null,
              isPublic: true,
            },
          },
          googleAccount: {
            create: {
              googleId,
              email,
              name: name || null,
              picture: picture || null,
            },
          },
          subscription: {
            create: {
              tier: 'FREE_TRIAL',
              status: 'TRIAL',
              trialStartedAt: new Date(),
              trialEndsAt,
            },
          },
        },
        include: { subscription: true, profile: true },
      });
    } else {
      // Update Google account tokens if they changed
      await db.googleAccount.upsert({
        where: { userId: user.id },
        create: { userId: user.id, googleId, email, name: name || null, picture: picture || null },
        update: { picture: picture || null, name: name || null },
      });
    }

    // Sign JWT — include role for RBAC on the frontend/API
    const authToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        profile: user.profile,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// ── GET /auth/me ───────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscription: true,
        googleAccount: { select: { email: true, picture: true } },
        spotifyAccount: { select: { displayName: true, imageUrl: true } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified: user.emailVerified,
      profile: user.profile,
      subscription: user.subscription,
      googleAccount: user.googleAccount,
      spotifyAccount: user.spotifyAccount,
    });
  } catch (error) {
    console.error('Get Me Error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export const authRoutes = router;
