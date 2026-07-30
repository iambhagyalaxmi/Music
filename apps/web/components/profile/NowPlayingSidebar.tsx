import React from 'react';
import { Play, SkipForward, SkipBack, Heart, Music, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function NowPlayingSidebar() {
  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 sticky top-[80px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h3 className="font-bold text-lg text-white">Now Playing</h3>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Maximize2 size={16} />
        </button>
      </div>
      
      {/* Current Song */}
      <div className="group relative">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" 
            alt="Album Cover" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <SkipBack size={20} className="fill-white" />
            </button>
            <button className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-colors hover:scale-105 shadow-[0_4px_15px_rgba(255,77,141,0.5)]">
              <Play size={24} className="fill-white ml-1" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors">
              <SkipForward size={20} className="fill-white" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <div className="min-w-0 flex-1">
            <h4 className="text-xl font-bold text-white truncate hover:underline cursor-pointer">Blinding Lights</h4>
            <p className="text-sm text-gray-400 truncate hover:underline cursor-pointer">The Weeknd</p>
          </div>
          <button className="text-red-500 hover:scale-110 transition-transform">
            <Heart size={20} fill="currentColor" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 w-1/3 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,77,141,1)]"></div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px] text-gray-500 font-bold">
            <span>1:24</span>
            <span>3:22</span>
          </div>
        </div>
      </div>
      
      {/* Mini Queue */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Next Up</h4>
        <div className="flex flex-col gap-3">
          {[
            { id: 1, title: 'Save Your Tears', artist: 'The Weeknd' },
            { id: 2, title: 'Starboy', artist: 'The Weeknd, Daft Punk' },
            { id: 3, title: 'I Feel It Coming', artist: 'The Weeknd' }
          ].map((song) => (
            <div key={song.id} className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-pink-500/20 transition-colors">
                <Music size={14} className="text-gray-400 group-hover:text-pink-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-pink-500 transition-colors">{song.title}</p>
                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
