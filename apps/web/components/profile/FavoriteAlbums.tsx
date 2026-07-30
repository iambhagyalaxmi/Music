import React from 'react';
import { Disc, ChevronRight, ChevronLeft } from 'lucide-react';
import { CompactMusicCard } from '@/components/discover/CompactMusicCard';

export function FavoriteAlbums() {
  const albums = [
    { id: '1', title: 'After Hours', subtitle: 'The Weeknd • 2020', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { id: '2', title: 'Future Nostalgia', subtitle: 'Dua Lipa • 2020', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { id: '3', title: 'Fine Line', subtitle: 'Harry Styles • 2019', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { id: '4', title: '1989', subtitle: 'Taylor Swift • 2014', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { id: '5', title: 'Divide', subtitle: 'Ed Sheeran • 2017', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
  ];

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Disc className="text-purple-500" size={24} />
          <h2 className="text-2xl font-bold text-white">Favorite Albums</h2>
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
        {albums.map(album => (
          <div key={album.id} className="min-w-[160px] snap-start">
            <CompactMusicCard 
              id={album.id}
              title={album.title}
              subtitle={album.subtitle}
              image={album.image}
              rounded="xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
