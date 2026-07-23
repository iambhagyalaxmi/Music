"use client";

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';

const INITIAL_POSTS = [
  {
    id: 1,
    user: 'Sarah Miller',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    time: '2 hours ago',
    content: 'Just discovered this amazing indie synthwave playlist! The transitions between tracks are flawless. Highly recommend checking it out if you need focus music.',
    likes: 124,
    comments: 18,
    tags: ['#synthwave', '#focus', '#indie'],
    isLiked: false,
    showComments: false
  },
  {
    id: 2,
    user: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    time: '5 hours ago',
    content: 'Anyone else going to the virtual concert tonight? The setlist looks incredible. I am super excited for the special guest appearance!',
    likes: 89,
    comments: 42,
    tags: ['#live', '#concert'],
    isLiked: false,
    showComments: false
  },
  {
    id: 3,
    user: 'David Chen',
    avatar: 'https://i.pravatar.cc/150?u=david',
    time: '1 day ago',
    content: 'I made a collaborative playlist for the weekend road trip. Feel free to add your favorite driving songs! 🚗💨',
    likes: 256,
    comments: 64,
    tags: ['#playlist', '#roadtrip'],
    isLiked: false,
    showComments: false
  }
];

const LATEST_POSTS = [
  {
    id: 101,
    user: 'Emily Rose',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    time: '5 minutes ago',
    content: 'Who else is obsessed with the new Sabrina Carpenter album? Every song is a bop! 🎀✨',
    likes: 12,
    comments: 4,
    tags: ['#pop', '#newmusic'],
    isLiked: false,
    showComments: false
  },
  {
    id: 102,
    user: 'Marcus Johnson',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    time: '15 minutes ago',
    content: 'Just created a new lofi room to study. Join me if you need some background noise!',
    likes: 5,
    comments: 1,
    tags: ['#lofi', '#study'],
    isLiked: false,
    showComments: false
  },
  {
    id: 103,
    user: 'Sarah Miller',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    time: '30 minutes ago',
    content: 'What is everyone\'s favorite workout playlist? I need some high energy recommendations.',
    likes: 24,
    comments: 8,
    tags: ['#workout', '#gym'],
    isLiked: false,
    showComments: false
  }
];

export function CommunityFeed({ activeTab }: { activeTab?: string }) {
  const [trendingPosts, setTrendingPosts] = useState(INITIAL_POSTS);
  const [latestPosts, setLatestPosts] = useState(LATEST_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const posts = activeTab === 'latest' ? latestPosts : trendingPosts;
  const setPosts = activeTab === 'latest' ? setLatestPosts : setTrendingPosts;

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, showComments: !post.showComments };
      }
      return post;
    }));
  };

  const handleShare = (postId: number) => {
    // In a real app, this would use navigator.share or copy to clipboard
    alert('Link copied to clipboard!');
  };

  const handlePostSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPostContent.trim()) {
      const newPost = {
        id: Math.random(),
        user: 'You',
        avatar: 'https://ui-avatars.com/api/?name=You&background=random',
        time: 'Just now',
        content: newPostContent,
        likes: 0,
        comments: 0,
        tags: [],
        isLiked: false,
        showComments: false
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    }
  };

  return (
    <div className="feed-column">
      {/* Create Post Placeholder */}
      <div className="composer-card">
        <div className="composer-avatar">
          <img src="https://ui-avatars.com/api/?name=You&background=random" alt="Avatar" />
        </div>
        <div style={{ flex: 1 }}>
          <input 
            className="composer-input"
            type="text" 
            placeholder="Share a track, ask for recommendations, or post an update... (Press Enter to post)"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onKeyDown={handlePostSubmit}
            style={{ width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {/* Feed Posts */}
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-user-info">
              <img src={post.avatar} alt={post.user} className="post-avatar" />
              <div>
                <h4 className="post-user-name">{post.user}</h4>
                <span className="post-time">{post.time}</span>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                className="post-options-btn"
                onClick={() => setOpenDropdownId(openDropdownId === post.id ? null : post.id)}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {openDropdownId === post.id && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--color-surface-2)', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', zIndex: 10, minWidth: '150px', overflow: 'hidden' }}>
                  <button onClick={() => { setOpenDropdownId(null); alert('Post hidden'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
                    Hide Post
                  </button>
                  <button onClick={() => { setOpenDropdownId(null); handleShare(post.id); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}>
                    Copy Link
                  </button>
                  <button onClick={() => { setOpenDropdownId(null); alert('Post reported'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="post-content">
            {post.content}
          </p>

          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="post-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="post-actions" style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
            <button 
              className={`action-btn like-btn group ${post.isLiked ? 'liked' : ''}`}
              onClick={() => toggleLike(post.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'none', border: 'none', color: post.isLiked ? 'var(--color-accent-pink)' : 'var(--color-text-secondary)', transition: 'color 0.2s' }}
            >
              <Heart className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} />
              <span style={{ fontWeight: post.isLiked ? 'bold' : 'normal' }}>{post.likes}</span>
            </button>
            <button 
              className="action-btn comment-btn"
              onClick={() => toggleComments(post.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'none', border: 'none', color: post.showComments ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', transition: 'color 0.2s' }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments}</span>
            </button>
            <button 
              className="action-btn share-btn"
              onClick={() => handleShare(post.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-text-secondary)', marginLeft: 'auto' }}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {post.showComments && (
            <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-3)' }}>
              <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  style={{ width: '100%', padding: '8px 40px 8px 16px', borderRadius: '16px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-primary)', outline: 'none' }}
                />
                <button style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-accent-pink)', cursor: 'pointer' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
