import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { MusicVideoCard } from './MusicVideoCard';
import { Carousel } from './Carousel';
import { EmptyState } from './EmptyState';
import { Video } from 'lucide-react';

interface MusicVideosListProps {
  videos: any[];
  onPlay: (video: any) => void;
}

export function MusicVideosList({ videos, onPlay }: MusicVideosListProps) {
  if (!videos || videos.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Music Videos" icon={Video} onViewAll={() => {}} />
        <EmptyState message="No music videos available right now." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Music Videos" icon={Video} onViewAll={() => {}} />
      <Carousel>
        {videos.map((video, idx) => (
          <MusicVideoCard key={`${video.trackId || 'video'}-${idx}`} video={video} onPlay={onPlay} />
        ))}
      </Carousel>
    </SectionContainer>
  );
}
