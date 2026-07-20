import { Router, Request, Response } from 'express';
import { db } from '../../db';
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ReactionEmoji } from '@prisma/client';
import { pusher } from '../../realtime';

const router = Router();

// Create Post
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { content, tags, parentId, fanClubId, sharedSongId, sharedPlaylistId } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await db.communityPost.create({
      data: {
        userId,
        content,
        tags: tags || [],
        parentId,
        fanClubId,
        sharedSongId,
        sharedPlaylistId
      },
      include: {
        user: { select: { username: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        _count: { select: { reactions: true } }
      }
    });

    if (post.parentId) {
      pusher.trigger('community', 'post-comment', post).catch(() => {});
    } else {
      pusher.trigger('community', 'feed-update', post).catch(() => {});
    }

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Fetch Posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await db.communityPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { username: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        _count: { select: { reactions: true } }
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Fetch Single Post
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const post = await db.communityPost.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { username: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        reactions: {
          include: { user: { select: { username: true, profile: { select: { displayName: true, avatarUrl: true } } } } }
        },
        _count: { select: { reactions: true } }
      }
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Update Post
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { content, tags } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const postId = req.params.id;

    const post = await db.communityPost.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ error: 'Unauthorized to update this post' });

    const updatedPost = await db.communityPost.update({
      where: { id: postId },
      data: {
        content: content !== undefined ? content : post.content,
        tags: tags !== undefined ? tags : post.tags,
      },
      include: {
        user: { select: { username: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        _count: { select: { reactions: true } }
      }
    });

    pusher.trigger('community', 'feed-update', updatedPost).catch(() => {});

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete Post
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const postId = req.params.id;

    const post = await db.communityPost.findUnique({ where: { id: postId } });

    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.userId !== userId) return res.status(403).json({ error: 'Unauthorized to delete this post' });

    await db.communityPost.delete({ where: { id: postId } });

    pusher.trigger('community', 'feed-update', { id: postId, deleted: true }).catch(() => {});

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// React to a Post
router.post('/:id/react', requireAuth, async (req: Request, res: Response) => {
  try {
    const { emoji } = req.body;
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.userId;
    const postId = req.params.id;

    if (!Object.values(ReactionEmoji).includes(emoji as ReactionEmoji)) {
      return res.status(400).json({ error: 'Invalid emoji type' });
    }

    const post = await db.communityPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const existingReaction = await db.communityPostReaction.findUnique({
      where: { postId_userId: { postId, userId } }
    });

    if (existingReaction) {
      if (existingReaction.emoji === emoji) {
        // Toggle off
        await db.communityPostReaction.delete({
          where: { id: existingReaction.id }
        });
        return res.json({ message: 'Reaction removed' });
      } else {
        // Update reaction
        const updatedReaction = await db.communityPostReaction.update({
          where: { id: existingReaction.id },
          data: { emoji: emoji as ReactionEmoji }
        });
        pusher.trigger('community', 'post-reaction', { postId, reaction: updatedReaction }).catch(() => {});
        return res.json({ message: 'Reaction updated', reaction: updatedReaction });
      }
    }

    // New reaction
    const newReaction = await db.communityPostReaction.create({
      data: {
        postId,
        userId,
        emoji: emoji as ReactionEmoji
      }
    });

    pusher.trigger('community', 'post-reaction', { postId, reaction: newReaction }).catch(() => {});
    res.status(201).json({ message: 'Reaction added', reaction: newReaction });
  } catch (error) {
    console.error('Error reacting to post:', error);
    res.status(500).json({ error: 'Failed to react to post' });
  }
});

export { router as communityRoutes };
