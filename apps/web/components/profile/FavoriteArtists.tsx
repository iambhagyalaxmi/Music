import React from 'react';
import { Mic2, ChevronRight, ChevronLeft } from 'lucide-react';
import { CompactMusicCard } from '@/components/discover/CompactMusicCard';

export function FavoriteArtists() {
  const artists = [
    { id: '1', title: 'Taylor Swift', type: 'Artist', image: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', title: 'Arijit Singh', type: 'Artist', image: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', title: 'The Weeknd', type: 'Artist', image: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', title: 'Imagine Dragons', type: 'Artist', image: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', title: 'Dua Lipa', type: 'Artist', image: 'https://i.pravatar.cc/150?img=5' },
    { id: '6', title: 'Ed Sheeran', type: 'Artist', image: 'https://i.pravatar.cc/150?img=6' },
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
          <div key={artist.id} className="min-w-[160px] snap-start">
            <CompactMusicCard 
              id={artist.id}
              title={artist.title}
              subtitle={artist.type}
              image={artist.image}
              rounded="full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
