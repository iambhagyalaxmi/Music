import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

// ── GET /playlists ─────────────────────────────────────────────────────────
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playlists = await db.playlist.findMany({
      where: { isPublic: true },
      include: {
        user: { include: { profile: true } },
        _count: { select: { songs: true, followers: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// ── GET /playlists/me ──────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    const playlists = await db.playlist.findMany({
      where: { userId },
      include: { _count: { select: { songs: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch your playlists' });
  }
});

// ── GET /playlists/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const playlist = await db.playlist.findUnique({
      where: { id: req.params.id },
      include: {
        user: { include: { profile: true } },
        songs: {
          include: { song: { include: { artist: true } } },
          orderBy: { position: 'asc' },
        },
        _count: { select: { followers: true } },
      },
    });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// ── POST /playlists ────────────────────────────────────────────────────────
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { title, description, isPublic, coverUrl } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const playlist = await db.playlist.create({
      data: { userId, title, description, isPublic: isPublic ?? true, coverUrl },
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// ── PUT /playlists/:id ─────────────────────────────────────────────────────
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { title, description, isPublic, coverUrl } = req.body;

  try {
    const playlist = await db.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this playlist' });
    }
    const updated = await db.playlist.update({
      where: { id: req.params.id },
      data: { title, description, isPublic, coverUrl },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

// ── DELETE /playlists/:id ─────────────────────────────────────────────────
// Soft-delete middleware converts this to an update { deletedAt: now() }
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    const playlist = await db.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this playlist' });
    }
    await db.playlist.delete({ where: { id: req.params.id } }); // Intercepted by soft-delete middleware
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// ── POST /playlists/:id/songs ──────────────────────────────────────────────
router.post('/:id/songs', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { songId } = req.body;

  if (!songId) return res.status(400).json({ error: 'songId is required' });

  try {
    const playlist = await db.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const count = await db.playlistSong.count({ where: { playlistId: req.params.id } });

    const entry = await db.playlistSong.create({
      data: {
        playlistId: req.params.id,
        songId,
        addedById: userId,
        position: count + 1,
      },
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
});

// ── DELETE /playlists/:id/songs/:songId ────────────────────────────────────
router.delete('/:id/songs/:songId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  try {
    const playlist = await db.playlist.findUnique({ where: { id: req.params.id } });
    if (!playlist || playlist.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await db.playlistSong.deleteMany({
      where: { playlistId: req.params.id, songId: req.params.songId },
    });
    res.json({ message: 'Song removed from playlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove song' });
  }
});

export const playlistsRoutes = router;
