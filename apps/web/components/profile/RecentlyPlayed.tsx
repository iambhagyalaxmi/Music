import React from 'react';
import { History } from 'lucide-react';
import { PremiumSongCard } from '@/components/discover/PremiumSongCard';

export function RecentlyPlayed() {
  const songs = [
    { trackId: '1', title: 'Blinding Lights', artist: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', album: 'After Hours', duration: '2 mins ago' },
    { trackId: '2', title: 'Save Your Tears', artist: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', album: 'After Hours', duration: '1 hour ago' },
    { trackId: '3', title: 'Levitating', artist: 'Dua Lipa', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', album: 'Future Nostalgia', duration: '3 hours ago' },
    { trackId: '4', title: 'Watermelon Sugar', artist: 'Harry Styles', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', album: 'Fine Line', duration: 'Yesterday' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="text-pink-500" size={24} />
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
        </div>
        <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">See All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs.map(song => (
          <PremiumSongCard 
            key={song.trackId}
            song={song}
            onPlay={() => console.log('play', song.trackId)}
          />
        ))}
      </div>
    </div>
  );
}
