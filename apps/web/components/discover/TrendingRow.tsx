import React from 'react';
import { Play, Heart, Plus, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSongContextMenu } from '../context-menu/SongContextMenuProvider';
import { useMusicStore } from '@/lib/store/useMusicStore';

export interface TrendingRowProps {
  song: {
    trackId: string;
    title: string;
    artist: string;
    duration?: string | number;
    cover: string;
  };
  onPlay: (song: any) => void;
  index: number;
}

export function TrendingRow({ song, onPlay, index }: TrendingRowProps) {
  const { openMenu } = useSongContextMenu();
  const { likedSongs, toggleLike } = useMusicStore();
  const isLiked = likedSongs.includes(song.trackId);

  // Format duration if it's a number (seconds)
  const formattedDuration = typeof song.duration === 'number' 
    ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`
    : (song.duration || '3:47');

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      onContextMenu={(e) => openMenu(song as any, e)}
      className="group flex items-center justify-between h-[84px] p-[16px] rounded-[16px] bg-[#161A23] hover:bg-[#1D2230] border border-[#262C3A] hover:border-[#FF4D8D]/30 transition-all shadow-sm hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)] cursor-pointer"
      onClick={() => onPlay(song)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span className="text-[#8C93A7] font-bold text-lg w-6 text-right shrink-0">
          {index + 1}
        </span>
        
        {/* Cover Artwork */}
        <div className="relative w-[56px] h-[56px] shrink-0 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
          <img 
            src={song.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80'} 
            alt={song.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(song); }}
              className="w-8 h-8 rounded-full bg-[#FF4D8D] flex items-center justify-center text-white shadow-lg"
            >
              <Play size={14} className="fill-current ml-0.5" />
            </button>
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-bold text-[#F8FAFC] text-[15px] truncate group-hover:text-[#FF4D8D] transition-colors leading-snug">
            {song.title}
          </h4>
          <span className="text-sm text-[#A1A1AA] truncate leading-tight mt-0.5">{song.artist}</span>
        </div>
      </div>
      
      {/* Actions & Duration */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[#8C93A7] w-12 text-right hidden sm:block">
          {formattedDuration}
        </span>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleLike(song.trackId); }}
            className={`transition-colors p-2 ${isLiked ? 'text-[#FF4D8D]' : 'text-[#A1A1AA] hover:text-[#FF4D8D]'}`}
          >
            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); openMenu(song as any, e); }}
            className="text-[#A1A1AA] hover:text-white transition-colors p-2"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
