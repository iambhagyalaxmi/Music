import React from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSongContextMenu } from '../context-menu/SongContextMenuProvider';

export interface CompactMusicCardProps {
  song: {
    trackId: string;
    title: string;
    artist: string;
    album?: string;
    cover: string;
  };
  onPlay: (song: any) => void;
}

export function CompactMusicCard({ song, onPlay }: CompactMusicCardProps) {
  const { openMenu } = useSongContextMenu();

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -4 }}
      onContextMenu={(e) => openMenu(song as any, e)}
      className="group relative flex flex-col w-[180px] p-[14px] rounded-[18px] bg-[#161A23] border border-[#23293A] hover:border-[#FF4D8D]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] cursor-pointer"
      onClick={() => onPlay(song)}
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-square rounded-[12px] overflow-hidden shadow-md mb-3">
        <img 
          src={song.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80'} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
          
          <button 
            onClick={(e) => { e.stopPropagation(); openMenu(song as any, e); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-[#1D2230] text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
            className="w-10 h-10 rounded-full bg-[#FF4D8D] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,77,141,0.5)] translate-y-2 group-hover:translate-y-0 transition-all duration-300 ml-auto"
          >
            <Play size={20} className="fill-current ml-1" />
          </motion.button>
        </div>
      </div>
      
      {/* Metadata */}
      <div className="flex flex-col min-w-0">
        <h4 className="font-bold text-[#F8FAFC] text-[15px] truncate group-hover:text-[#FF4D8D] transition-colors leading-tight mb-1">
          {song.title}
        </h4>
        <span className="text-[13px] text-[#A1A1AA] truncate leading-tight">
          {song.artist}
        </span>
      </div>

    </motion.div>
  );
}
