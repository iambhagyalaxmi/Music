import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MusicVideoCardProps {
  video: {
    trackId: string;
    title: string;
    artist: string;
    thumbnail: string;
    duration?: number;
  };
  onPlay: (video: any) => void;
}

export function MusicVideoCard({ video, onPlay }: MusicVideoCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="shrink-0 group relative w-[280px] md:w-[350px] aspect-video rounded-[18px] overflow-hidden cursor-pointer shadow-lg border border-white/5"
      onClick={() => onPlay(video)}
    >
      <img 
        src={video.thumbnail} 
        alt={video.title} 
        className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.4] transition-all duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 border border-white/30">
          <Play size={28} className="fill-white text-white ml-1" />
        </div>
        <span className="font-bold tracking-wider text-sm text-white drop-shadow-md uppercase">Play Video</span>
      </div>
      
      {/* Gradient & Info */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h4 className="font-bold text-white text-lg truncate drop-shadow-sm">{video.title}</h4>
        <p className="text-sm text-white/70 truncate drop-shadow-sm">{video.artist}</p>
      </div>
    </motion.div>
  );
}
