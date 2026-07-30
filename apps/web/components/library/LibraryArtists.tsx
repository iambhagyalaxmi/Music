import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { Carousel } from '../discover/Carousel';
import { EmptyState } from '../discover/EmptyState';
import { Users, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface LibraryArtistsProps {
  artists: any[];
}

export function LibraryArtists({ artists }: LibraryArtistsProps) {
  if (!artists || artists.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Your Artists" icon={Users} />
        <EmptyState message="You aren't following any artists yet." actionText="Find Artists" onAction={() => {}} />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Your Artists" icon={Users} onViewAll={() => {}} />
      <Carousel>
        {artists.map((artist, idx) => (
          <LibraryArtistCard key={`${artist.id || 'art'}-${idx}`} artist={artist} />
        ))}
      </Carousel>
    </SectionContainer>
  );
}

function LibraryArtistCard({ artist }: { artist: any }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -4 }}
      className="group relative flex flex-col items-center w-[180px] p-6 rounded-[24px] bg-[#161A23] border border-[#23293A] hover:border-[#F97316]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] cursor-pointer text-center"
    >
      <div className="w-28 h-28 rounded-full overflow-hidden mb-4 shadow-lg group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all bg-[#09090B]">
        <img 
          src={artist.image || `https://ui-avatars.com/api/?name=${artist.name || 'Artist'}&background=random`} 
          alt={artist.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <h4 className="font-bold text-[#F8FAFC] text-[16px] truncate w-full group-hover:text-[#F97316] transition-colors mb-1">
        {artist.name || 'Unknown Artist'}
      </h4>
      <p className="text-[12px] text-[#A1A1AA] mb-4">
        {artist.monthlyListeners || '1.2M Listeners'}
      </p>

      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-full border border-[#262C3A] text-[#F8FAFC] text-xs font-bold hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-colors"
      >
        <UserPlus size={14} />
        Following
      </motion.button>
    </motion.div>
  );
}
