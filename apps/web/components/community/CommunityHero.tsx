import React from 'react';
import { Users, FileText, Music, Mic2, Plus, BarChart2 } from 'lucide-react';

export function CommunityHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col gap-6"
         style={{ background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.15) 0%, rgba(157, 78, 221, 0.15) 100%)' }}>
      
      <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] bg-pink-500/30 rounded-full blur-[50px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black mb-2 flex items-center gap-2 justify-center md:justify-start">
            Community <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest relative -top-2 animate-pulse">Live</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Discover music lovers, share playlists, join discussions, and explore trending music.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(255,77,141,0.3)] transition-transform hover:scale-105 active:scale-95">
            <Plus size={18} /> Create Post
          </button>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95">
            <BarChart2 size={18} /> Create Poll
          </button>
          <button className="flex items-center gap-2 bg-[#9D4EDD] hover:bg-[#8B3DCC] text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(157,78,221,0.3)] transition-transform hover:scale-105 active:scale-95">
            <Mic2 size={18} /> Join Room
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <div className="bg-[#111118]/60 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">14,280</p>
            <p className="text-xs text-gray-400">Members</p>
          </div>
        </div>
        <div className="bg-[#111118]/60 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">2,400</p>
            <p className="text-xs text-gray-400">Posts Today</p>
          </div>
        </div>
        <div className="bg-[#111118]/60 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <Music size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">540</p>
            <p className="text-xs text-gray-400">Songs Shared</p>
          </div>
        </div>
        <div className="bg-[#111118]/60 backdrop-blur-md p-4 rounded-xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Mic2 size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">86</p>
            <p className="text-xs text-gray-400">Active Rooms</p>
          </div>
        </div>
      </div>

    </div>
  );
}
