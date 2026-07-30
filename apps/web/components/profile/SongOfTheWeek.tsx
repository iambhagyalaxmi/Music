import React from 'react';
import { Play, Star, MoreHorizontal } from 'lucide-react';

export function SongOfTheWeek() {
  return (
    <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-2xl shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" 
            alt="Blinding Lights" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
        </div>
        
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
          <div className="flex items-center gap-2 mb-2 bg-white/10 px-3 py-1 rounded-full w-fit">
            <Star size={14} className="text-yellow-500" fill="currentColor" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Song of the Week</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-white mb-1 hover:underline cursor-pointer">Blinding Lights</h3>
          <p className="text-pink-400 font-bold mb-4 hover:underline cursor-pointer">The Weeknd</p>
          
          <div className="flex items-center gap-4 w-full justify-center md:justify-start">
            <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(255,77,141,0.3)] transition-transform hover:scale-105 active:scale-95">
              <Play size={16} fill="currentColor" /> Play Again
            </button>
            <div className="text-sm font-bold text-gray-300">
              Played <span className="text-white">42 Times</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 ml-auto md:ml-4 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
