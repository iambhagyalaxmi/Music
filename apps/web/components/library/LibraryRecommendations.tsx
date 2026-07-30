import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { Carousel } from '../discover/Carousel';
import { CompactMusicCard } from '../discover/CompactMusicCard';
import { EmptyState } from '../discover/EmptyState';
import { Sparkles } from 'lucide-react';

interface LibraryRecommendationsProps {
  recommendations: any[];
  onPlay: (song: any) => void;
}

export function LibraryRecommendations({ recommendations, onPlay }: LibraryRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Recommended For You" icon={Sparkles} />
        <EmptyState message="Listen to more music to get personalized recommendations." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader 
        title="Recommended For You" 
        subtitle="Based on your Liked Songs and Listening History."
        icon={Sparkles} 
        onViewAll={() => {}} 
      />
      <Carousel>
        {recommendations.map((song, idx) => (
          <CompactMusicCard 
            key={`${song.trackId || 'rec'}-${idx}`} 
            song={song} 
            onPlay={onPlay} 
          />
        ))}
      </Carousel>
    </SectionContainer>
  );
}
