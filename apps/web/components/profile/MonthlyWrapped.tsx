import React from 'react';
import { Calendar, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export function MonthlyWrapped() {
  return (
    <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-2xl p-8 relative overflow-hidden text-white shadow-2xl">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/20 rounded-full blur-[60px] pointer-events-none mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <Calendar size={16} className="text-white/80" />
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest">This Month</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Your Monthly<br/>Wrapped</h2>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 min-w-[120px] text-center border border-white/10">
              <p className="text-3xl font-black mb-1">34</p>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Hours</p>
            </div>
            <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 min-w-[120px] text-center border border-white/10">
              <p className="text-3xl font-black mb-1">526</p>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Songs</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-4 group cursor-pointer hover:bg-black/30 transition-colors">
            <img src="https://i.pravatar.cc/150?img=1" alt="Top Artist" className="w-16 h-16 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform" />
            <div>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-1">Top Artist</p>
              <p className="text-xl font-bold">Taylor Swift</p>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-4 group cursor-pointer hover:bg-black/30 transition-colors relative">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-lg">
              <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" alt="Top Song" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={20} className="fill-white" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-1">Top Song</p>
              <p className="text-xl font-bold truncate">Cruel Summer</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
