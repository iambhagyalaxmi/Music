import React from 'react';
import { motion } from 'framer-motion';
import { Music, ListMusic, Disc, Mic2, Clock } from 'lucide-react';

interface LibraryHeroProps {
  user: any;
  stats: {
    songs: number;
    playlists: number;
    albums: number;
    artists: number;
    hours: number;
  };
}

export function LibraryHero({ user, stats }: LibraryHeroProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="relative w-full h-[300px] rounded-[28px] overflow-hidden bg-[#121722] border border-[#262C3A] flex shadow-2xl">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #121722 0%, #19152B 50%, #0F172A 100%)',
          opacity: 0.9
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,77,141,0.15),transparent_50%)] pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-10 w-full md:w-[60%]">
        <div className="flex items-center gap-4 mb-4">
          <img 
            src={user?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=random`} 
            alt="Profile" 
            className="w-16 h-16 rounded-full border-2 border-[#FF4D8D] shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {getGreeting()}, {user?.profile?.displayName || user?.username || 'Guest'}
            </h1>
            <span className="inline-block mt-1 px-3 py-0.5 bg-[#FF4D8D]/20 text-[#FF4D8D] text-xs font-bold uppercase tracking-wider rounded-full border border-[#FF4D8D]/30">
              {user?.subscription?.tier === 'PREMIUM' ? 'Premium Member' : 'Free Plan'}
            </span>
          </div>
        </div>

        <p className="text-[#A1A1AA] text-sm max-w-md leading-relaxed mb-6">
          Keep all your favorite music in one place. Your library is personalized to your unique taste.
        </p>

        {/* Mini stats row */}
        <div className="flex flex-wrap items-center gap-6 text-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-[#FF4D8D]" />
            <span className="font-semibold">{stats.songs} Songs</span>
          </div>
          <div className="flex items-center gap-2">
            <ListMusic size={16} className="text-[#8B5CF6]" />
            <span className="font-semibold">{stats.playlists} Playlists</span>
          </div>
          <div className="flex items-center gap-2">
            <Disc size={16} className="text-[#22C55E]" />
            <span className="font-semibold">{stats.albums} Albums</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic2 size={16} className="text-[#F97316]" />
            <span className="font-semibold">{stats.artists} Artists</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#3B82F6]" />
            <span className="font-semibold">{stats.hours} Hours</span>
          </div>
        </div>
      </div>

      {/* Right Side Collage */}
      <div className="relative hidden md:block w-[40%] h-full overflow-hidden">
        {/* We'll use a CSS grid of album covers to create a nice collage */}
        <div className="absolute inset-0 grid grid-cols-3 gap-2 p-6 rotate-12 scale-125 opacity-40">
          {[...Array(12)].map((_, i) => (
            <motion.img 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              src={`https://images.unsplash.com/photo-${1614613535308 + i}-eb5fbd3d2c17?w=150&q=80`}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              alt="Collage"
            />
          ))}
        </div>
        {/* Gradient fade to blend into the left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#19152B]/50 to-[#09090B]/80" />
      </div>
    </div>
  );
}
