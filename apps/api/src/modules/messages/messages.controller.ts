import { Router, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

// GET /api/messages - Fetch recent DM conversations and unread counts
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  
  try {
    // 1. Find all 1-on-1 conversations this user is part of
    const memberships = await db.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: {
              include: { user: { select: { id: true, username: true, profile: true } } }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: { sender: { select: { id: true, username: true } } }
            }
          }
        }
      }
    });

    const conversations = memberships
      .filter((m: any) => !m.conversation.isGroup) // Only 1-on-1 DMs
      .map((m: any) => {
        const conv = m.conversation;
        const otherMember = conv.members.find((member: any) => member.user.id !== userId);
        const lastMessage = conv.messages[0] || null;
        
        return {
          id: conv.id,
          name: conv.name,
          otherUser: otherMember?.user || null,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            senderId: lastMessage.senderId,
            senderName: lastMessage.sender.username,
            createdAt: lastMessage.createdAt
          } : null,
          unreadCount: 0 // We will calculate this next
        };
      })
      .filter((c: any) => c.otherUser !== null)
      .sort((a: any, b: any) => {
        const dateA = a.lastMessage?.createdAt.getTime() || 0;
        const dateB = b.lastMessage?.createdAt.getTime() || 0;
        return dateB - dateA;
      });

    // 2. Fetch unread counts for these conversations
    const conversationIds = conversations.map((c: any) => c.id);
    
    if (conversationIds.length > 0) {
      const unreadCounts = await db.message.groupBy({
        by: ['conversationId'],
        where: {
          conversationId: { in: conversationIds },
          senderId: { not: userId },
          readStatuses: {
            none: { userId }
          }
        },
        _count: { id: true }
      });
      
      const unreadMap = new Map(unreadCounts.map((u: any) => [u.conversationId, u._count.id]));
      
      conversations.forEach((c: any) => {
        c.unreadCount = unreadMap.get(c.id) || 0;
      });
    }

    const totalUnreadCount = conversations.reduce((sum: number, c: any) => sum + c.unreadCount, 0);

    res.json({ conversations, totalUnreadCount });
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/messages/:userId - Fetch 1-on-1 chat history with a specific user
router.get('/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user!.userId;
  const targetUserId = req.params.userId as string;
  
  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: 'Cannot chat with yourself' });
  }

  try {
    const targetUser = await db.user.findUnique({ where: { id: targetUserId }, select: { id: true, username: true, profile: true } });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let conversation = await db.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } }
        ]
      }
    });

    if (!conversation) {
      return res.json({ messages: [], targetUser });
    }

    const messages = await db.message.findMany({
      where: { conversationId: conversation.id },
      include: {
        sender: { select: { id: true, username: true } },
        readStatuses: { where: { userId: targetUserId } }
      },
      orderBy: { createdAt: 'asc' },
      take: 100
    });

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender.id,
      sender: msg.sender.username,
      text: msg.content || '',
      timestamp: msg.createdAt.getTime(),
      edited: msg.isEdited,
      isRead: msg.senderId === currentUserId ? msg.readStatuses.length > 0 : true
    }));

    res.json({ messages: formattedMessages, targetUser, conversationId: conversation.id });
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// POST /api/messages/:userId/send - Send a direct message
router.post('/:userId/send', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user!.userId;
  const targetUserId = req.params.userId as string;
  const { text } = req.body;
  
  if (!text) return res.status(400).json({ error: 'Message text is required' });

  try {
    let conversation = await db.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } }
        ]
      }
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          isGroup: false,
          name: `dm-${currentUserId}-${targetUserId}`,
          members: {
            create: [
              { userId: currentUserId, role: 'MEMBER' },
              { userId: targetUserId, role: 'MEMBER' }
            ]
          }
        }
      });
    }

    const message = await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: currentUserId,
        content: text,
        type: 'TEXT'
      },
      include: { sender: { select: { id: true, username: true } } }
    });
    
    await db.messageReadStatus.create({
      data: {
        messageId: message.id,
        userId: currentUserId
      }
    });

    const formattedMessage = {
      id: message.id,
      senderId: message.sender.id,
      sender: message.sender.username,
      text: message.content || '',
      timestamp: message.createdAt.getTime(),
      edited: message.isEdited,
      isRead: false
    };

    import('./messages.socket').then(({ emitToUser }) => {
      emitToUser(targetUserId, 'dm:new', {
        conversationId: conversation!.id,
        message: formattedMessage,
        otherUser: { id: currentUserId, username: message.sender.username }
      });
      emitToUser(currentUserId, 'dm:new', {
        conversationId: conversation!.id,
        message: formattedMessage,
        otherUser: { id: targetUserId }
      });
    });

    res.json({ message: formattedMessage });
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// PATCH /api/messages/:userId/read - Mark conversation as read
router.patch('/:userId/read', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user!.userId;
  const targetUserId = req.params.userId as string;

  try {
    const conversation = await db.conversation.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUserId } } }
        ]
      }
    });

    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const unreadMessages = await db.message.findMany({
      where: {
        conversationId: conversation.id,
        senderId: targetUserId,
        readStatuses: { none: { userId: currentUserId } }
      },
      select: { id: true }
    });

    if (unreadMessages.length > 0) {
      await db.messageReadStatus.createMany({
        data: unreadMessages.map((m: any) => ({ messageId: m.id, userId: currentUserId })),
        skipDuplicates: true
      });

      import('./messages.socket').then(({ emitToUser }) => {
        emitToUser(targetUserId, 'dm:read', {
          conversationId: conversation.id,
          readBy: currentUserId,
          messageIds: unreadMessages.map((m: any) => m.id)
        });
      });
    }

    res.json({ ok: true, markedCount: unreadMessages.length });
  } catch (error) {
    console.error('Failed to mark as read:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// PATCH /api/messages/read-all - Mark all messages as read
router.patch('/read-all', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user!.userId;

  try {
    const memberships = await db.conversationMember.findMany({
      where: { userId: currentUserId },
      include: { conversation: true }
    });
    
    const dmConvIds = memberships.filter((m: any) => !m.conversation.isGroup).map((m: any) => m.conversationId);

    if (dmConvIds.length > 0) {
      const unreadMessages = await db.message.findMany({
        where: {
          conversationId: { in: dmConvIds },
          senderId: { not: currentUserId },
          readStatuses: { none: { userId: currentUserId } }
        },
        select: { id: true, senderId: true, conversationId: true }
      });

      if (unreadMessages.length > 0) {
        await db.messageReadStatus.createMany({
          data: unreadMessages.map((m: any) => ({ messageId: m.id, userId: currentUserId })),
          skipDuplicates: true
        });

        import('./messages.socket').then(({ emitToUser }) => {
          const bySender = unreadMessages.reduce((acc: any, msg: any) => {
            if (!acc[msg.senderId]) acc[msg.senderId] = { conversationId: msg.conversationId, ids: [] };
            acc[msg.senderId].ids.push(msg.id);
            return acc;
          }, {} as Record<string, { conversationId: string, ids: string[] }>);
          
          Object.entries(bySender).forEach(([senderId, data]: [string, any]) => {
            emitToUser(senderId, 'dm:read', {
              conversationId: data.conversationId,
              readBy: currentUserId,
              messageIds: data.ids
            });
          });
        });
      }
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export { router as messagesRoutes };
