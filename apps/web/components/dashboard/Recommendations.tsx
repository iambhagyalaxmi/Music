"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';

interface RecommendationsProps {
  recommendations?: any[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const { playSong } = useMusicStore();

  // If no real recommendations are passed, we mock them for visual demonstration
  // as per the requirement to build API-ready components with visual placeholders
  // when endpoints don't exist yet.
  const data = recommendations || [
    {
      id: 1,
      reason: 'Because you listened to Arijit Singh',
      songs: [
        { trackId: 'BddP6PYo2gs', title: 'Kesariya', artist: 'Pritam, Arijit Singh', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80' },
        { trackId: 'cbMlKuBRTIU', title: 'Apna Bana Le', artist: 'Sachin-Jigar, Arijit Singh', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=300&q=80' },
        { trackId: 'Umqb9KENgmk', title: 'Tum Hi Ho', artist: 'Mithoon, Arijit Singh', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80' },
      ]
    },
    {
      id: 2,
      reason: 'Because you like Indie Rock',
      songs: [
        { trackId: 'bpOSxM0rNPM', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80' },
        { trackId: 'yKNxeF4KMsY', title: 'Yellow', artist: 'Coldplay', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
        { trackId: 'Ijk4j-r7qPA', title: 'Take Me Out', artist: 'Franz Ferdinand', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80' },
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {data.map((section) => (
        <section key={section.id}>
          <h2 className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            {section.reason}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {section.songs.map((song: any, idx: number) => (
              <div 
                key={idx}
                className="group flex items-center gap-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] p-3 rounded-xl border border-white/5 shadow-sm transition-all cursor-pointer"
                onClick={() => playSong({
                  trackId: song.trackId,
                  title: song.title,
                  artist: song.artist,
                  cover: song.cover,
                  duration: 240
                })}
              >
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={20} className="text-white fill-current" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm truncate group-hover:text-[var(--color-accent-pink)] transition-colors">{song.title}</span>
                  <span className="text-xs text-[var(--color-text-secondary)] truncate">{song.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
