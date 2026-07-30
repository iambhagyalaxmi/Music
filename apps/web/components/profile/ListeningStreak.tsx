import React from 'react';
import { Flame, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function ListeningStreak() {
  return (
    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Flame className="text-orange-500" size={20} />
        <h3 className="font-bold text-lg text-white">Listening Streak</h3>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
              <Flame size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Current Streak</p>
              <p className="font-black text-xl text-white">27 Days</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Longest Streak</p>
              <p className="font-black text-xl text-white">84 Days</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Target size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Goal</p>
              <p className="font-black text-xl text-white">100 Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
