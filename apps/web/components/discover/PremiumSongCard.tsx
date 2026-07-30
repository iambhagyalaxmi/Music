import React from 'react';
import { Play, Heart, Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSongContextMenu } from '../context-menu/SongContextMenuProvider';
import { useMusicStore } from '@/lib/store/useMusicStore';

export interface PremiumSongCardProps {
  song: {
    trackId: string;
    title: string;
    artist: string;
    album?: string;
    year?: string;
    duration?: string | number;
    cover: string;
  };
  onPlay: (song: any) => void;
  index?: number;
  showRank?: boolean;
}

export function PremiumSongCard({ song, onPlay, index, showRank }: PremiumSongCardProps) {
  const { openMenu } = useSongContextMenu();
  const { likedSongs, toggleLike } = useMusicStore();
  const isLiked = likedSongs.includes(song.trackId);

  // Format duration if it's a number (seconds)
  const formattedDuration = typeof song.duration === 'number' 
    ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
    : (song.duration || '3:42');

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      onContextMenu={(e) => openMenu(song as any, e)}
      className="group relative flex flex-col sm:flex-row items-center gap-4 bg-[#171A24] hover:bg-[#1E2433] p-[16px] rounded-[18px] border border-[#23293A] hover:border-[#FF4D8D]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] min-h-[110px]"
    >
      {showRank && typeof index === 'number' && (
        <span className="text-[var(--color-text-muted)] font-bold text-xl w-6 text-right shrink-0">
          {index + 1}
        </span>
      )}
      
      {/* Cover Artwork */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden shadow-md cursor-pointer" onClick={() => onPlay(song)}>
        <img 
          src={song.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80'} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onPlay(song); }}
            className="w-10 h-10 rounded-full bg-[var(--color-accent-pink)] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,77,141,0.5)]"
          >
            <Play size={20} className="fill-current ml-1" />
          </motion.button>
        </div>
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => onPlay(song)}>
        <h4 className="font-bold text-white text-lg truncate group-hover:text-[var(--color-accent-pink)] transition-colors">
          {song.title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-1 truncate">
          <span className="truncate">{song.artist}</span>
          {song.album && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              <span className="truncate">{song.album}</span>
            </>
          )}
          {song.year && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
              <span>{song.year}</span>
            </>
          )}
        </div>
      </div>
      
      {/* Actions & Duration */}
      <div className="flex items-center gap-4 mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium text-[var(--color-text-muted)] w-10 text-right hidden sm:block">
          {formattedDuration}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLike(song.trackId); }}
          className={`transition-colors p-2 ${isLiked ? 'text-[var(--color-accent-pink)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-accent-pink)]'}`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); openMenu(song as any, e); }}
          className="text-[var(--color-text-secondary)] hover:text-white transition-colors p-2"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>
    </motion.div>
  );
}
