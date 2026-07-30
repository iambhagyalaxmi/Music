import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { PopularArtistCard } from './PopularArtistCard';
import { Carousel } from './Carousel';
import { EmptyState } from './EmptyState';
import { Users } from 'lucide-react';

interface PopularArtistsListProps {
  artists: any[];
}

export function PopularArtistsList({ artists }: PopularArtistsListProps) {
  if (!artists || artists.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Popular Artists" icon={Users} onViewAll={() => {}} />
        <EmptyState message="No artists to display right now." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Popular Artists" icon={Users} onViewAll={() => {}} />
      <Carousel>
        {artists.map((artist, idx) => (
          <PopularArtistCard key={`${artist.id || 'artist'}-${idx}`} artist={artist} />
        ))}
      </Carousel>
    </SectionContainer>
  );
}
