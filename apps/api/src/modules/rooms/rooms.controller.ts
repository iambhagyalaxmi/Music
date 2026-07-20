import { Router, Request, Response } from 'express';
import { db } from '../../db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, ownerId } = req.body;
    
    // In a real app, ownerId comes from the authenticated session (req.user)
    const room = await db.room.create({
      data: {
        name,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: true
      }
    });
    
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const room = await db.room.findUnique({
      where: { id },
      include: {
        queue: true,
        members: {
          include: { user: true }
        }
      }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export const roomsRoutes = router;
