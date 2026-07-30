"use client";

import React from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';

interface TrendingSongsProps {
  trending: any[];
}

export function TrendingSongs({ trending }: TrendingSongsProps) {
  const { playSong } = useMusicStore();

  if (!trending || trending.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-sm text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 w-32 bg-white/5 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="h-3 w-24 bg-white/5 rounded mx-auto animate-pulse"></div>
      </div>
    );
  }

  // We assume trending[0].playlist has the top songs
  const songs = trending[0]?.playlist?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-2">
      {songs.map((song: any, idx: number) => (
        <div 
          key={song.trackId || idx}
          className="group flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] rounded-2xl border border-transparent hover:border-white/5 transition-all shadow-sm hover:shadow-md cursor-pointer"
          onClick={() => playSong({
            trackId: song.trackId,
            title: song.songTitle || song.title,
            artist: song.artist,
            cover: song.cover,
            duration: 240
          })}
        >
          {/* Left: Rank, Art, Info */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <span className="text-[var(--color-text-muted)] font-bold text-lg w-6 text-right hidden sm:block">
              {idx + 1}
            </span>
            <div className="relative w-20 h-20 shrink-0">
              <img 
                src={song.cover} 
                alt={song.songTitle} 
                className="w-full h-full rounded-md object-cover shadow-sm"
              />
              <div className="absolute inset-0 bg-black/40 items-center justify-center rounded-md hidden group-hover:flex">
                <Play size={16} className="text-white fill-current" />
              </div>
            </div>
            <div className="flex flex-col min-w-0 pr-4">
              <span className="font-bold text-lg truncate group-hover:text-[var(--color-accent-pink)] transition-colors">
                {song.songTitle || song.title}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)] truncate">
                {song.artist}
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-[var(--color-text-secondary)] hover:text-white" onClick={(e) => { e.stopPropagation(); }}>
              <Heart size={18} />
            </button>
            <button className="text-[var(--color-text-secondary)] hover:text-white" onClick={(e) => { e.stopPropagation(); }}>
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
