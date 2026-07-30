import React from 'react';
import { Play, Share2, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export function ActivityHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 p-6 md:p-10 flex flex-col gap-6"
         style={{ background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.15) 0%, rgba(157, 78, 221, 0.15) 100%)' }}>
      
      {/* Background Elements */}
      <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[50px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
      
      {/* Floating Music Notes Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 200, x: Math.random() * 400 - 200, opacity: 0 }}
            animate={{ 
              y: -100, 
              opacity: [0, 1, 0],
              x: Math.random() * 400 - 200 + (Math.random() > 0.5 ? 50 : -50)
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute bottom-0 left-[20%] text-pink-500/20"
          >
            <Music size={24 + Math.random() * 24} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Your Music Journey
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-lg mb-6 leading-relaxed">
            Track your listening history, discover what friends are enjoying, and relive your favorite moments all in one place.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(255,77,141,0.4)] transition-transform hover:scale-105 active:scale-95">
              <Play size={18} fill="currentColor" /> View Wrapped
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 border border-white/5">
              <Share2 size={18} /> Share Activity
            </button>
          </div>
        </div>

        {/* Decorative Waveform / Collage Area */}
        <div className="hidden md:flex flex-col gap-2 shrink-0 w-64 h-32 justify-end relative z-10">
          <div className="flex items-end justify-center gap-1.5 h-full">
            {[40, 70, 45, 90, 60, 100, 75, 50, 85, 55, 30, 80].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: '10%' }}
                animate={{ height: `${height}%` }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="w-3 rounded-t-full bg-gradient-to-t from-pink-500 to-purple-500"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
