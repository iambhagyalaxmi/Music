import React from 'react';
import { Music, Compass, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-[#111118] border border-white/5 rounded-2xl relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="relative mb-8 z-10">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,77,141,0.3)] mx-auto relative z-20"
        >
          <Music size={40} />
        </motion.div>
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -top-4 -right-12 w-16 h-16 bg-[#181824] rounded-xl border border-white/10 flex items-center justify-center text-pink-500 shadow-xl z-10"
        >
          <Compass size={24} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-4 -left-12 w-16 h-16 bg-[#181824] rounded-xl border border-white/10 flex items-center justify-center text-purple-500 shadow-xl z-10"
        >
          <Users size={24} />
        </motion.div>
      </div>
      
      <h2 className="text-3xl font-black text-white mb-4 relative z-10">No Activity Yet</h2>
      <p className="text-gray-400 text-base max-w-md mb-10 leading-relaxed relative z-10">
        Start listening to your favorite music. Your listening history, liked songs, shared playlists, and friend interactions will appear here.
      </p>
      
      <div className="flex flex-wrap gap-4 relative z-10">
        <button className="flex items-center gap-2 px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-[0_4px_15px_rgba(255,77,141,0.4)] transition-transform hover:scale-105 active:scale-95">
          <Compass size={18} /> Discover Music
        </button>
        <button className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold border border-white/5 transition-transform hover:scale-105 active:scale-95">
          <Users size={18} /> Join Community
        </button>
      </div>
    </div>
  );
}
