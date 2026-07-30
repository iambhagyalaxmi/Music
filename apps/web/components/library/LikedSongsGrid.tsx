import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { PremiumSongCard } from '../discover/PremiumSongCard';
import { EmptyState } from '../discover/EmptyState';
import { Heart } from 'lucide-react';

interface LikedSongsGridProps {
  songs: any[];
  onPlay: (song: any) => void;
}

export function LikedSongsGrid({ songs, onPlay }: LikedSongsGridProps) {
  if (!songs || songs.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Liked Songs" icon={Heart} />
        <EmptyState message="You haven't liked any songs yet." actionText="Explore Music" onAction={() => {}} />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Liked Songs" icon={Heart} onViewAll={() => {}} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {songs.map((song, idx) => (
          <PremiumSongCard 
            key={`${song.trackId || 'liked'}-${idx}`} 
            song={song} 
            onPlay={onPlay} 
          />
        ))}
      </div>
    </SectionContainer>
  );
}
