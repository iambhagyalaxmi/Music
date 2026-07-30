import React from 'react';
import { Mic2, ChevronRight, ChevronLeft } from 'lucide-react';
import { CompactMusicCard } from '@/components/discover/CompactMusicCard';

export function FavoriteArtists() {
  const artists = [
    { trackId: '1', title: 'Taylor Swift', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=1' },
    { trackId: '2', title: 'Arijit Singh', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=2' },
    { trackId: '3', title: 'The Weeknd', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=3' },
    { trackId: '4', title: 'Imagine Dragons', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=4' },
    { trackId: '5', title: 'Dua Lipa', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=5' },
    { trackId: '6', title: 'Ed Sheeran', artist: 'Artist', cover: 'https://i.pravatar.cc/150?img=6' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic2 className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-white">Favorite Artists</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
        {artists.map(artist => (
          <div key={artist.trackId} className="min-w-[160px] snap-start [&_img]:rounded-full">
            <CompactMusicCard 
              song={artist}
              onPlay={() => console.log('play', artist.trackId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
