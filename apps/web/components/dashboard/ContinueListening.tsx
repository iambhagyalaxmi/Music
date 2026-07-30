"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';

interface ContinueListeningProps {
  recentlyPlayed: any[];
}

export function ContinueListening({ recentlyPlayed }: ContinueListeningProps) {
  const { playSong } = useMusicStore();

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return null;
  }

  // Take up to 8 tracks
  const tracks = recentlyPlayed.slice(0, 8);

  return (
    <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Continue Listening</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {tracks.map((track) => (
          <div 
            key={track.id || track.trackId} 
            className="group relative shrink-0 w-32 sm:w-40 snap-start cursor-pointer transition-transform hover:-translate-y-1"
            onClick={() => playSong({
              trackId: track.trackId,
              title: track.title,
              artist: track.artist,
              cover: track.cover,
              duration: track.duration || 240
            })}
          >
            {/* Album Art */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden shadow-md">
              <img 
                src={track.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80'} 
                alt={track.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-pink)] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <Play size={24} className="fill-current ml-1" />
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <div className="font-bold text-sm truncate">{track.title}</div>
              <div className="text-xs text-[var(--color-text-secondary)] truncate">{track.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
