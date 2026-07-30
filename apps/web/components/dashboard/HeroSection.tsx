"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Flame, Headphones, Users, Play, Radio, Music } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  recentlyPlayed: any[];
}

export function HeroSection({ recentlyPlayed }: HeroSectionProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { currentSong, isPlaying, progress, playSong } = useMusicStore();
  
  // State for hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Determine what to display
  const displaySong = mounted && currentSong 
    ? currentSong 
    : (recentlyPlayed.length > 0 ? recentlyPlayed[0] : null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleResume = () => {
    if (currentSong) {
      // Just toggle play if there is a current song (or play it)
      playSong(currentSong);
    } else if (recentlyPlayed.length > 0) {
      playSong({
        trackId: recentlyPlayed[0].trackId,
        title: recentlyPlayed[0].title,
        artist: recentlyPlayed[0].artist,
        cover: recentlyPlayed[0].cover,
        duration: recentlyPlayed[0].duration || 240
      });
    }
  };

  const handleJoinRoom = () => {
    const roomId = Math.random().toString(36).substring(7);
    router.push(`/rooms/${roomId}`);
  };

  // Helper to format time (e.g. 00:45)
  const formatTime = (percent: number, totalSeconds: number = 240) => {
    const seconds = Math.floor(percent * totalSeconds);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 min-h-[320px] lg:min-h-[340px] flex flex-col justify-end shadow-xl group">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.35] transition-transform duration-700 group-hover:scale-105"
        style={{ 
          backgroundImage: `url("${displaySong?.cover || displaySong?.thumbnail || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80'}")` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-end justify-between">
        
        {/* Left Side: Greeting & Now Playing */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white/90">
            🎵 {getGreeting()}, {(user?.profile?.displayName || user?.username || 'Guest').split(' ')[0]} 👋
          </h1>
          
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent-pink)]">
              {currentSong ? 'Now Playing' : 'Continue Listening'}
            </span>
            
            {displaySong ? (
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <img 
                  src={displaySong.cover || displaySong.thumbnail} 
                  alt={displaySong.title}
                  className="w-16 h-16 rounded-lg shadow-md object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-white truncate max-w-[200px] sm:max-w-[300px]">{displaySong.title}</span>
                  <span className="text-sm text-white/60 truncate max-w-[200px]">{displaySong.artist}</span>
                  
                  {/* Progress Bar (if playing) */}
                  {currentSong && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-accent-pink)] rounded-full" style={{ width: `${progress * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-white/50">
                        {formatTime(progress)} / {formatTime(1, currentSong.duration || 240)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-white/60">Ready to discover new music?</div>
            )}
          </div>
        </div>

        {/* Right Side: Stats & Actions */}
        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 md:items-end">
          
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <Flame className="text-orange-500" size={14} /> 5 Day Streak
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <Headphones className="text-blue-400" size={14} /> 248 Songs This Week
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <Users className="text-green-400" size={14} /> 3 Friends Listening
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto mt-2">
            <button 
              onClick={handleResume}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[var(--color-accent-pink)] hover:bg-[#ff1493] text-white py-2.5 px-6 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(255,20,147,0.3)] hover:shadow-[0_0_25px_rgba(255,20,147,0.5)]"
            >
              <Play size={18} className="fill-current" />
              {currentSong && isPlaying ? 'Pause' : 'Resume'}
            </button>
            <button 
              onClick={handleJoinRoom}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white py-2.5 px-6 rounded-full font-bold transition-all"
            >
              <Radio size={18} />
              Join Room
            </button>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
