import React from 'react';
import { motion } from 'framer-motion';
import { Play, Compass, Flame } from 'lucide-react';

export function DiscoverHero() {
  return (
    <section 
      className="relative w-full rounded-[24px] overflow-hidden min-h-[300px] flex flex-col md:flex-row items-center border border-[#262C3A] shadow-xl mb-[48px]"
      style={{
        background: `radial-gradient(circle at top left, rgba(255,77,141,.18), transparent 45%), radial-gradient(circle at bottom right, rgba(139,92,246,.15), transparent 45%), #12131A`
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex-1 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
            <Flame size={14} className="text-[#FF8A00]" /> Trending Today
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Discover New <br/><span className="bg-gradient-to-r from-[var(--color-accent-pink)] to-[#FF8A00] bg-clip-text text-transparent">Music</span>
        </h1>
        
        <p className="text-[var(--color-text-secondary)] text-lg mb-8 max-w-md">
          Explore trending songs, albums and artists from around the world tailored to your taste.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[var(--color-accent-pink)] text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,77,141,0.4)] hover:shadow-[0_0_30px_rgba(255,77,141,0.6)] transition-shadow flex items-center gap-2"
          >
            <Play size={20} className="fill-current" /> Play Mix
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold backdrop-blur-md border border-white/10 transition-colors flex items-center gap-2"
          >
            <Compass size={20} /> Explore
          </motion.button>
        </div>
      </div>

      {/* Featured Artwork Graphic (Hidden on mobile for space) */}
      <div className="relative z-10 hidden md:flex flex-1 items-center justify-center p-8">
        <div className="relative w-64 h-64">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-accent-pink)]/30"
          />
          <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" 
            alt="Featured Artwork" 
            className="absolute inset-4 rounded-full object-cover shadow-[0_0_40px_rgba(255,77,141,0.3)]"
          />
          {/* Decorative floating elements */}
          <div className="absolute -top-4 -right-4 bg-[#171722] p-3 rounded-2xl border border-white/10 shadow-xl">
            <span className="block text-xs text-[var(--color-text-secondary)] font-bold mb-1">Top Artist</span>
            <div className="flex -space-x-2">
               <img src="https://ui-avatars.com/api/?name=Taylor&background=random" className="w-8 h-8 rounded-full border-2 border-[#171722]" alt=""/>
               <img src="https://ui-avatars.com/api/?name=Weeknd&background=random" className="w-8 h-8 rounded-full border-2 border-[#171722]" alt=""/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
