import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, CheckCircle2, Bookmark } from 'lucide-react';

interface CommunityPostCardProps {
  post: {
    id: string;
    user: { username: string; avatarUrl: string; isVerified?: boolean };
    content: string;
    time: string;
    genre?: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    sharedSong?: {
      title: string;
      artist: string;
      coverUrl: string;
    };
  };
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all hover:shadow-[0_8px_30px_rgba(255,77,141,0.05)] flex flex-col gap-4 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.user.avatarUrl} alt={post.user.username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-white leading-none">{post.user.username}</h3>
              {post.user.isVerified && <CheckCircle2 size={14} className="text-blue-400" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">{post.time}</span>
              {post.genre && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">{post.genre}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-500 hover:text-white rounded-full hover:bg-white/10 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {post.sharedSong && (
        <div className="relative mt-2 bg-[#181824] border border-white/5 rounded-xl p-3 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group/song overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/5 to-purple-500/10 opacity-0 group-hover/song:opacity-100 transition-opacity"></div>
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-lg">
            <img src={post.sharedSong.coverUrl} alt={post.sharedSong.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/song:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover/song:scale-100 transition-transform">
                <Play size={14} className="ml-0.5" fill="currentColor" />
              </button>
            </div>
          </div>
          <div className="flex-1 min-w-0 z-10">
            <p className="font-bold text-white truncate text-base">{post.sharedSong.title}</p>
            <p className="text-sm text-gray-400 truncate">{post.sharedSong.artist}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-1">
        <div className="flex items-center gap-6">
          <button className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'}`}>
            <Heart size={18} className={post.isLiked ? 'fill-current' : ''} /> 
            <span>{post.likesCount}</span>
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <MessageCircle size={18} /> 
            <span>{post.commentsCount}</span>
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <Share2 size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
           <button className="text-gray-400 hover:text-white transition-colors" title="Play Full Post Context">
             <Play size={18} />
           </button>
           <button className="text-gray-400 hover:text-white transition-colors" title="Save">
             <Bookmark size={18} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
