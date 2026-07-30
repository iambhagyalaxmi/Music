import React from 'react';
import { PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export function MusicTaste() {
  const genres = [
    { name: 'Pop', percentage: 45, color: 'bg-pink-500' },
    { name: 'Rock', percentage: 20, color: 'bg-purple-500' },
    { name: 'EDM', percentage: 15, color: 'bg-blue-500' },
    { name: 'Hip Hop', percentage: 10, color: 'bg-yellow-500' },
    { name: 'Indie', percentage: 10, color: 'bg-green-500' }
  ];

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="text-pink-500" size={20} />
          <h3 className="font-bold text-lg text-white">Music Taste</h3>
        </div>
      </div>
      
      {/* Visual Bar */}
      <div className="w-full h-4 rounded-full overflow-hidden flex mb-6">
        {genres.map((genre, i) => (
          <motion.div
            key={genre.name}
            initial={{ width: 0 }}
            animate={{ width: `${genre.percentage}%` }}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            className={`h-full ${genre.color}`}
            title={`${genre.name} - ${genre.percentage}%`}
          />
        ))}
      </div>
      
      {/* Legend list */}
      <div className="flex flex-col gap-3">
        {genres.map((genre, i) => (
          <motion.div 
            key={genre.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-sm ${genre.color}`}></div>
              <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{genre.name}</span>
            </div>
            <span className="text-sm font-bold text-white">{genre.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
