"use client";

import React from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';
import { useSongContextMenu } from '../context-menu/SongContextMenuProvider';

interface RecentlyPlayedListProps {
  recentlyPlayed: any[];
}

export function RecentlyPlayedList({ recentlyPlayed }: RecentlyPlayedListProps) {
  const { playSong } = useMusicStore();
  const { openMenu } = useSongContextMenu();

  if (!recentlyPlayed || recentlyPlayed.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] p-6 rounded-xl border border-white/5 shadow-sm text-center">
        <div className="text-[var(--color-text-muted)] text-sm">No recently played songs.</div>
      </div>
    );
  }

  const today = recentlyPlayed.slice(0, 3);
  const yesterday = recentlyPlayed.slice(3, 5);
  const thisWeek = recentlyPlayed.slice(5, 8);

  const groups = [
    { label: 'Today', items: today },
    { label: 'Yesterday', items: yesterday },
    { label: 'This Week', items: thisWeek },
  ].filter(g => g.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            {group.label}
          </h3>
          <div className="flex flex-col gap-2">
            {group.items.map((song, idx) => (
              <div 
                key={idx}
                onContextMenu={(e) => openMenu(song, e)}
                className="group flex items-center justify-between p-2 hover:bg-[var(--color-surface-2)] rounded-lg transition-colors cursor-pointer"
                onClick={() => playSong({
                  trackId: song.trackId,
                  title: song.title,
                  artist: song.artist,
                  cover: song.cover,
                  duration: 240
                })}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 shrink-0">
                    <img src={song.cover} alt={song.title} className="w-full h-full rounded object-cover" />
                    <div className="absolute inset-0 bg-black/40 items-center justify-center rounded hidden group-hover:flex">
                      <Play size={14} className="text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm truncate group-hover:text-[var(--color-accent-pink)] transition-colors">{song.title}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] truncate">{song.artist}</span>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); openMenu(song, e); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-[var(--color-text-secondary)] hover:text-white"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
