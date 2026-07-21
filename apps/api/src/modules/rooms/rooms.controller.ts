import { Router, Request, Response } from 'express';
import { db } from '../../db';

const router = Router();

// GET /rooms: Fetch all active public rooms
router.get('/', async (req: Request, res: Response) => {
  try {
    // We treat Group Conversations as Rooms
    const rooms = await db.conversation.findMany({
      where: { isGroup: true },
      include: {
        members: {
          include: { user: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });
    
    // Map them to match expected room frontend format
    const formattedRooms = rooms.map((conv: any) => ({
      id: conv.name || conv.id, // we use name as roomId for realtime socket
      name: conv.name || 'Untitled Room',
      members: conv.members.length,
      host: conv.members.find((m: any) => m.isAdmin)?.user?.username || 'System',
      isPublic: true,
      nowPlaying: null // Managed by realtime socket in memory
    }));
    
    res.json(formattedRooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch public rooms' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerId, isPublic, maxMembers } = req.body;
    
    // Create a group conversation to represent the room
    const roomId = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    
    // In a real app, ownerId comes from the authenticated session (req.user)
    // If no ownerId is provided, fallback to demo user for testing
    let resolvedOwnerId = ownerId;
    if (!resolvedOwnerId) {
      const demoUser = await db.user.findUnique({ where: { email: 'demo@soundsphere.io' } });
      if (demoUser) resolvedOwnerId = demoUser.id;
    }

    const roomData: any = {
      name: roomId,
      isGroup: true
    };
    
    if (resolvedOwnerId) {
      roomData.members = {
        create: {
          userId: resolvedOwnerId,
          isAdmin: true
        }
      };
    }

    const room = await db.conversation.create({
      data: roomData,
      include: {
        members: true
      }
    });
    
    // Map to expected frontend format
    res.status(201).json({
      id: room.name,
      name: room.name
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const room = await db.conversation.findFirst({
      where: { name: id, isGroup: true },
      include: {
        members: {
          include: { user: true }
        }
      }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({
      id: room.name,
      name: room.name,
      members: room.members.map((m: any) => ({
        id: m.userId,
        username: m.user.username,
        isAdmin: m.isAdmin
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export const roomsRoutes = router;
