import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { TrendingRow } from './TrendingRow';
import { EmptyState } from './EmptyState';
import { Flame } from 'lucide-react';

interface TrendingListProps {
  trending: any[];
  onPlay: (song: any) => void;
}

export function TrendingList({ trending, onPlay }: TrendingListProps) {
  if (!trending || trending.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Trending Today" subtitle="Most played songs this week." icon={Flame} />
        <EmptyState message="Trending data is not available right now." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Trending Today" subtitle="Most played songs this week." icon={Flame} />
      
      <div className="flex flex-col gap-3">
        {trending.slice(0, 5).map((song, idx) => (
          <TrendingRow 
            key={`${song.trackId || 'trend'}-${idx}`} 
            song={song} 
            onPlay={onPlay} 
            index={idx}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
