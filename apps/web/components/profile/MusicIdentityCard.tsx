import React from 'react';
import { Sparkles, Music, Star, Flame, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function MusicIdentityCard() {
  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Sparkles className="text-purple-400" size={20} />
        <h3 className="font-bold text-lg text-white">Music Identity</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Music size={16} className="text-pink-500 mb-2" />
          <span className="text-sm font-bold text-white">Explorer</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Star size={16} className="text-yellow-500 mb-2" />
          <span className="text-sm font-bold text-white text-center">Curator</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Flame size={16} className="text-orange-500 mb-2" />
          <span className="text-sm font-bold text-white">27 Day Streak</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <Clock size={16} className="text-blue-500 mb-2" />
          <span className="text-sm font-bold text-white">512 Hours</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 bg-[#111118]/80 backdrop-blur-sm rounded-xl p-4 border border-white/5 relative z-10">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Top Genre</p>
          <p className="font-bold text-white text-sm">Pop</p>
        </div>
        <div className="border-l border-white/5 pl-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Favorite Artist</p>
          <p className="font-bold text-white text-sm">The Weeknd</p>
        </div>
        <div className="border-l border-white/5 pl-4">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Personality</p>
          <p className="font-bold text-pink-400 text-sm">Night Owl</p>
        </div>
      </div>
    </div>
  );
}
