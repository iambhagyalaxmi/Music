"use client";

import React, { useEffect, useRef } from 'react';
import { useMusicStore } from '@/lib/store/useMusicStore';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, ListMusic, MonitorSpeaker, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomPlayer() {
  const { currentSong, isPlaying, togglePlay, progress, setProgress, playNext, playPrevious, volume } = useMusicStore();
  const ytRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync YouTube player with global state
  useEffect(() => {
    if (ytRef.current) {
      if (isPlaying) {
        ytRef.current.playVideo();
      } else {
        ytRef.current.pauseVideo();
      }
    }
  }, [isPlaying, currentSong?.trackId]);

  useEffect(() => {
    if (ytRef.current) {
      ytRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Sync progress smoothly 10 times a second
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(async () => {
        if (ytRef.current && ytRef.current.getCurrentTime) {
          const currentTime = await ytRef.current.getCurrentTime();
          const duration = await ytRef.current.getDuration() || 240;
          setProgress(currentTime / duration);
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, setProgress]);

  const onReady = (event: any) => {
    ytRef.current = event.target;
    event.target.setVolume(volume * 100);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event: any) => {
    // 0 = ended
    if (event.data === 0) {
      playNext();
    }
  };

  if (!currentSong) return null; // Don't show player if nothing has been played yet

  // Helper to format time (e.g. 00:45)
  const formatTime = (percent: number, totalSeconds: number = 240) => {
    const seconds = Math.floor(percent * totalSeconds);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[var(--color-surface)] border-t border-white/5 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between px-4 sm:px-8 backdrop-blur-xl bg-opacity-95">
      
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img 
          src={currentSong.cover || currentSong.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80'} 
          alt={currentSong.title} 
          className="w-14 h-14 rounded-md shadow-md object-cover"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold truncate text-white hover:underline cursor-pointer">{currentSong.title}</span>
          <span className="text-sm text-[var(--color-text-secondary)] truncate hover:underline cursor-pointer">{currentSong.artist}</span>
        </div>
        <button className="text-[var(--color-text-muted)] hover:text-white transition-colors ml-2 hidden sm:block">
          <Heart size={20} />
        </button>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-[40vw]">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={playPrevious} className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <SkipBack size={24} className="fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
          </button>
          
          <button onClick={playNext} className="text-[var(--color-text-secondary)] hover:text-white transition-colors">
            <SkipForward size={24} className="fill-current" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 w-full group">
          <span className="text-xs text-[var(--color-text-secondary)] font-mono">{formatTime(progress)}</span>
          <div 
            className="h-1.5 flex-1 bg-white/10 rounded-full cursor-pointer relative"
            onClick={async (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              setProgress(p);
              if (ytRef.current && ytRef.current.getDuration) {
                const duration = await ytRef.current.getDuration();
                ytRef.current.seekTo(p * duration, true);
              }
            }}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--color-accent-pink)] rounded-full group-hover:bg-[#ff1493]" 
              style={{ width: `${progress * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm" />
            </div>
          </div>
          <span className="text-xs text-[var(--color-text-secondary)] font-mono">
            {formatTime(1, currentSong.duration || 240)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px] text-[var(--color-text-secondary)]">
        <button className="hover:text-white transition-colors hidden md:block" title="Lyrics">
          <Mic2 size={18} />
        </button>
        <button className="hover:text-white transition-colors hidden md:block" title="Queue">
          <ListMusic size={18} />
        </button>
        <button className="hover:text-white transition-colors hidden lg:block" title="Connect to a device">
          <MonitorSpeaker size={18} />
        </button>
        
        <div className="flex items-center gap-2 group w-24">
          <Volume2 size={18} className="hover:text-white transition-colors cursor-pointer" />
          <div className="h-1.5 flex-1 bg-white/10 rounded-full cursor-pointer relative">
            <div className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-[var(--color-accent-pink)] w-full" />
          </div>
        </div>
      </div>
      
      {/* Invisible YouTube Player for Audio Stream */}
      {currentSong?.trackId && (
        <div className="absolute opacity-0 pointer-events-none" style={{ width: '1px', height: '1px', overflow: 'hidden', top: '-9999px', left: '-9999px' }}>
          <YouTube 
            videoId={currentSong.trackId}
            opts={{
              height: '100',
              width: '100',
              playerVars: {
                autoplay: isPlaying ? 1 : 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
              }
            }}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={() => {
              console.error('YouTube player error, skipping track');
              playNext();
            }}
          />
        </div>
      )}
    </div>
  );
}
