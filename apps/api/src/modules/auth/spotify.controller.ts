import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/api/auth/callback/spotify';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-do-not-use-in-prod';

// ── GET /auth/spotify/url ──────────────────────────────────────────────────
router.get('/url', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const state = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });

  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state',
  ].join(' ');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    state,
  });

  res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
});

// ── GET /auth/spotify/callback ─────────────────────────────────────────────
router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;

  if (!code || !state) return res.status(400).send('Missing code or state');

  try {
    const decoded = jwt.verify(state, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({ code, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' }),
    });

    if (!tokenResponse.ok) {
      console.error('Spotify token exchange failed:', await tokenResponse.text());
      return res.status(400).send('Spotify authorization failed');
    }

    const tokenData = await tokenResponse.json();
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Fetch Spotify profile
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = profileRes.ok ? await profileRes.json() : {};

    // Persist to SpotifyAccount (new schema) — hard upsert
    await db.spotifyAccount.upsert({
      where: { userId },
      create: {
        userId,
        spotifyId: profile.id || userId,
        email: profile.email || '',
        displayName: profile.display_name || null,
        imageUrl: profile.images?.[0]?.url || null,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || null,
        expiresAt,
        scopes: tokenData.scope || null,
      },
      update: {
        accessToken: tokenData.access_token,
        ...(tokenData.refresh_token && { refreshToken: tokenData.refresh_token }),
        expiresAt,
        displayName: profile.display_name || null,
        imageUrl: profile.images?.[0]?.url || null,
      },
    });

    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Spotify Callback Error:', error);
    res.status(500).send('Internal Server Error during Spotify linking');
  }
});

// ── GET /auth/spotify/token ────────────────────────────────────────────────
router.get('/token', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const account = await db.spotifyAccount.findUnique({ where: { userId } });

    if (!account) {
      return res.status(404).json({ error: 'Spotify account not linked' });
    }

    // Auto-refresh if expired
    if (account.expiresAt && account.expiresAt < new Date()) {
      if (!account.refreshToken) {
        return res.status(401).json({ error: 'Spotify token expired. Please re-link your account.' });
      }

      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: account.refreshToken }),
      });

      if (!refreshResponse.ok) {
        return res.status(401).json({ error: 'Spotify token refresh failed. Please re-link your account.' });
      }

      const data = await refreshResponse.json();
      const newExpiresAt = new Date(Date.now() + data.expires_in * 1000);

      await db.spotifyAccount.update({
        where: { userId },
        data: {
          accessToken: data.access_token,
          ...(data.refresh_token && { refreshToken: data.refresh_token }),
          expiresAt: newExpiresAt,
        },
      });

      return res.json({ accessToken: data.access_token });
    }

    res.json({ accessToken: account.accessToken });
  } catch (error) {
    console.error('Spotify Token Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const spotifyRoutes = router;
