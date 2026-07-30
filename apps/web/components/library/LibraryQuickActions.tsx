import React from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, Plus, Download, Heart } from 'lucide-react';

export function LibraryQuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#FF4D8D] hover:bg-[#FF3377] text-white px-6 py-3 rounded-full font-bold transition-colors shadow-[0_0_20px_rgba(255,77,141,0.3)]"
      >
        <Play size={18} className="fill-current" />
        Play All
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#1D2230] hover:bg-[#262C3A] text-white px-6 py-3 rounded-full font-bold transition-colors border border-[#262C3A]"
      >
        <Shuffle size={18} />
        Shuffle
      </motion.button>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#1D2230] hover:bg-[#262C3A] text-white px-6 py-3 rounded-full font-bold transition-colors border border-[#262C3A]"
      >
        <Plus size={18} />
        New Playlist
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#1D2230] hover:bg-[#262C3A] text-white px-6 py-3 rounded-full font-bold transition-colors border border-[#262C3A]"
      >
        <Download size={18} />
        Downloads
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 bg-[#1D2230] hover:bg-[#262C3A] text-white px-6 py-3 rounded-full font-bold transition-colors border border-[#262C3A]"
      >
        <Heart size={18} />
        Favorites
      </motion.button>
    </div>
  );
}
