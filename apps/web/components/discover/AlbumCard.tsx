import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AlbumCardProps {
  album: {
    id: string;
    title: string;
    artist: string;
    cover: string;
    year?: string;
  };
  onPlay?: (album: any) => void;
}

export function AlbumCard({ album, onPlay }: AlbumCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="shrink-0 group flex flex-col w-[180px] md:w-[220px] bg-[#171722] hover:bg-[#181824] p-4 rounded-2xl border border-white/5 transition-colors cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md mb-4">
        <img 
          src={album.cover} 
          alt={album.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onPlay?.(album); }}
            className="w-12 h-12 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-white shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Play size={24} className="fill-current ml-1" />
          </motion.button>
        </div>
      </div>
      
      <div className="min-w-0">
        <h4 className="font-bold text-white text-base truncate group-hover:text-[var(--color-accent-pink)] transition-colors">
          {album.title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-1 truncate">
          <span className="truncate">{album.artist}</span>
          {album.year && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              <span>{album.year}</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
