import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/rbac';
import {
  getAdminOverview,
  getUsers,
  updateUser,
  deleteUser,
  getPlaylists,
  updatePlaylist,
  deletePlaylist,
  getSongs,
  deleteSong,
} from './admin.controller';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole('ADMIN'));

// Overview
router.get('/overview', getAdminOverview);

// Users
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Playlists
router.get('/playlists', getPlaylists);
router.put('/playlists/:id', updatePlaylist);
router.delete('/playlists/:id', deletePlaylist);

// Songs
router.get('/songs', getSongs);
router.delete('/songs/:id', deleteSong);

export const adminRoutes = router;
