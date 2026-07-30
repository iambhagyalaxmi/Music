import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { CompactMusicCard } from './CompactMusicCard';
import { Carousel } from './Carousel';
import { EmptyState } from './EmptyState';
import { Sparkles, LucideIcon } from 'lucide-react';

interface DiscoverRecommendationsProps {
  recommendations: any[];
  onPlay: (song: any) => void;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function DiscoverRecommendations({ 
  recommendations, 
  onPlay, 
  title = "Recommended For You",
  subtitle = "Based on your recent listening history.",
  icon = Sparkles
}: DiscoverRecommendationsProps) {
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title={title} subtitle={subtitle} icon={icon} onViewAll={() => {}} />
        <EmptyState message="No recommendations available at the moment." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title={title} subtitle={subtitle} icon={icon} onViewAll={() => {}} />
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
