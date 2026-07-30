import React from 'react';
import { Disc, ChevronRight, ChevronLeft } from 'lucide-react';
import { CompactMusicCard } from '@/components/discover/CompactMusicCard';

export function FavoriteAlbums() {
  const albums = [
    { trackId: '1', title: 'After Hours', artist: 'The Weeknd', album: '2020', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { trackId: '2', title: 'Future Nostalgia', artist: 'Dua Lipa', album: '2020', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { trackId: '3', title: 'Fine Line', artist: 'Harry Styles', album: '2019', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { trackId: '4', title: '1989', artist: 'Taylor Swift', album: '2014', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
    { trackId: '5', title: 'Divide', artist: 'Ed Sheeran', album: '2017', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80' },
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
          <div key={album.trackId} className="min-w-[160px] snap-start">
            <CompactMusicCard 
              song={album}
              onPlay={() => console.log('play', album.trackId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
