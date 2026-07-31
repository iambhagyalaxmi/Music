import React from 'react';
import { motion } from 'framer-motion';

export interface PopularArtistCardProps {
  artist: {
    id: string;
    name: string;
    image: string;
    monthlyListeners?: string;
  };
}

export function PopularArtistCard({ artist }: PopularArtistCardProps) {
  const [imgSrc, setImgSrc] = React.useState(artist.image);
  const fallbackImage = '/artist-placeholder.svg';

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="shrink-0 flex flex-col items-center gap-4 w-[160px] md:w-[200px] p-4 bg-[#171722] hover:bg-[#181824] rounded-2xl border border-white/5 transition-colors cursor-pointer group"
    >
      <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-[var(--color-accent-pink)]/30 transition-colors">
        <img 
          src={imgSrc} 
          alt={artist.name} 
          onError={(e) => {
            if (imgSrc !== fallbackImage) {
              setImgSrc(fallbackImage);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="text-center w-full min-w-0">
        <h4 className="font-bold text-white text-lg truncate group-hover:text-[var(--color-accent-pink)] transition-colors">
          {artist.name}
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          {artist.monthlyListeners || '1M+ listeners'}
        </p>
      </div>
      
      <button className="px-5 py-1.5 rounded-full border border-white/20 text-white text-sm font-bold hover:bg-white/10 hover:border-white transition-all w-full">
        Follow
      </button>
    </motion.div>
  );
}
