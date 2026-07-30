import React, { useState } from 'react';
import { Music, Disc, ListMusic, BarChart2, Image as ImageIcon, Smile, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function CommunityComposer() {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-lg">
      <div className="flex gap-4 mb-4">
        <img 
          src="https://i.pravatar.cc/150?img=9" 
          alt="Avatar" 
          className="w-12 h-12 rounded-full object-cover border-2 border-white/5"
        />
        <div className="flex-1 bg-[#181824] rounded-xl border border-white/5 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind? Share a track, ask for recommendations..."
            className="w-full bg-transparent resize-none h-20 p-4 text-white focus:outline-none focus:ring-1 focus:ring-pink-500/50 rounded-xl transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Share Song">
            <Music size={16} className="text-pink-500" /> <span className="hidden sm:inline">Song</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Share Album">
            <Disc size={16} className="text-purple-500" /> <span className="hidden sm:inline">Album</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Share Playlist">
            <ListMusic size={16} className="text-blue-500" /> <span className="hidden sm:inline">Playlist</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Create Poll">
            <BarChart2 size={16} className="text-green-500" /> <span className="hidden sm:inline">Poll</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Upload Image">
            <ImageIcon size={16} className="text-yellow-500" />
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors" title="Emoji">
            <Smile size={16} className="text-gray-300" />
          </button>
        </div>
        
        <button 
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all shadow-lg ${text.trim().length > 0 ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/20' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
          disabled={text.trim().length === 0}
        >
          Post <Send size={16} />
        </button>
      </div>
    </div>
  );
}
