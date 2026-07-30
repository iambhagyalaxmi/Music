import React from 'react';
import { MessageSquare, Plus, Music } from 'lucide-react';

export function CommunityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#111118] border border-white/5 rounded-2xl my-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-[30px]"></div>
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-pink-500 relative z-10 border border-white/10 shadow-xl">
          <MessageSquare size={32} />
        </div>
      </div>
      
      <h2 className="text-2xl font-black mb-3">Start the conversation!</h2>
      <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
        It's quiet here right now. Be the first to share your favorite song, ask for playlist recommendations, or create a poll.
      </p>
      
      <div className="flex gap-4">
        <button className="flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-pink-500/20">
          <Music size={18} /> Share Playlist
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-full font-bold transition-colors">
          <Plus size={18} /> Create Post
        </button>
      </div>
    </div>
  );
}
