import { Request, Response } from 'express';
import { db } from '../../db';

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const totalUsers = await db.user.count();
    const totalPlaylists = await db.playlist.count();
    const totalSongs = await db.song.count();

    res.json({ totalUsers, totalPlaylists, totalSongs });
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ error: 'Failed to fetch admin overview' });
  }
};

// Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: { id: true, username: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100, // pagination could be added
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    const user = await db.user.update({
      where: { id },
      data: { role, isActive },
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Playlists
export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await db.playlist.findMany({
      select: { id: true, title: true, isPublic: true, createdAt: true, user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, isPublic } = req.body;
    const playlist = await db.playlist.update({
      where: { id },
      data: { title, isPublic },
    });
    res.json(playlist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Failed to update playlist' });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.playlist.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
};

// Songs (Cached records)
export const getSongs = async (req: Request, res: Response) => {
  try {
    const songs = await db.song.findMany({
      select: { id: true, title: true, artist: { select: { name: true } }, playCount: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.song.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
};
