import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { AlbumCard } from './AlbumCard';
import { Carousel } from './Carousel';
import { EmptyState } from './EmptyState';
import { Disc } from 'lucide-react';

interface NewReleasesProps {
  albums: any[];
  onPlay?: (album: any) => void;
}

export function NewReleases({ albums, onPlay }: NewReleasesProps) {
  if (!albums || albums.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Recently Released" icon={Disc} onViewAll={() => {}} />
        <EmptyState message="No new releases available right now." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Recently Released" icon={Disc} onViewAll={() => {}} />
      <Carousel>
        {albums.map((album, idx) => (
          <AlbumCard key={`${album.id || 'album'}-${idx}`} album={album} onPlay={onPlay} />
        ))}
      </Carousel>
    </SectionContainer>
  );
}
