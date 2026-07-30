import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ListMusic, Disc, Download, Play } from 'lucide-react';

interface QuickStatsProps {
  stats: {
    songs: number;
    playlists: number;
    albums: number;
    downloads: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    { label: 'Liked Songs', count: stats.songs, icon: Heart, color: 'text-[#FF4D8D]', suffix: 'Songs' },
    { label: 'Playlists', count: stats.playlists, icon: ListMusic, color: 'text-[#8B5CF6]', suffix: 'Playlists' },
    { label: 'Albums', count: stats.albums, icon: Disc, color: 'text-[#22C55E]', suffix: 'Albums' },
    { label: 'Downloads', count: stats.downloads, icon: Download, color: 'text-[#3B82F6]', suffix: 'Downloads' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative flex flex-col p-6 rounded-[18px] bg-[#161A23] border border-[#262C3A] hover:border-[#FF4D8D]/50 transition-all cursor-pointer shadow-sm hover:shadow-[0_10px_24px_rgba(255,77,141,0.15)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-[#FF4D8D]/10 transition-colors pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4 z-10">
              <div className={`w-12 h-12 rounded-2xl bg-[#09090B] flex items-center justify-center border border-[#262C3A] group-hover:border-[#FF4D8D]/30 transition-colors`}>
                <Icon size={24} className={item.color} />
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 text-xs font-bold text-[#A1A1AA] group-hover:text-white transition-colors bg-[#1D2230] px-3 py-1.5 rounded-full"
              >
                <Play size={10} className="fill-current" />
                Open
              </motion.button>
            </div>
            
            <div className="z-10">
              <h3 className="text-3xl font-bold text-white mb-1">{item.count}</h3>
              <p className="text-sm text-[#A1A1AA] font-medium">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
