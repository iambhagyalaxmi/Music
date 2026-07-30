import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Music, BarChart2, Headphones } from 'lucide-react';

export function QuickActions() {
  const actions = [
    { label: 'Trending', icon: Flame, color: 'text-[#FF8A00]' },
    { label: 'New Releases', icon: Music, color: 'text-[#8B5CF6]' },
    { label: 'Top Charts', icon: BarChart2, color: 'text-[#22C55E]' },
    { label: 'Mood Playlists', icon: Headphones, color: 'text-[#FF4D8D]' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-[48px]">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.label}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 p-4 bg-[#161A23] hover:bg-[#1D2230] rounded-[16px] border border-[#262C3A] hover:border-[#FF4D8D]/30 transition-all shadow-sm hover:shadow-md group"
          >
            <div className={`w-10 h-10 rounded-full bg-[#09090B] flex items-center justify-center shrink-0 border border-[#262C3A] group-hover:border-[#FF4D8D]/50 transition-colors`}>
              <Icon size={18} className={action.color} />
            </div>
            <span className="font-bold text-[#F8FAFC] text-sm group-hover:text-white transition-colors">{action.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
