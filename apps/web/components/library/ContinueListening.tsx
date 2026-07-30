import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { Carousel } from '../discover/Carousel';
import { EmptyState } from '../discover/EmptyState';
import { Headphones, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContinueListeningProps {
  history: any[];
  onPlay: (song: any) => void;
}

export function ContinueListening({ history, onPlay }: ContinueListeningProps) {
  if (!history || history.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Continue Listening" icon={Headphones} />
        <EmptyState message="No recent playback found. Play a track to resume here." />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <SectionHeader title="Continue Listening" icon={Headphones} onViewAll={() => {}} />
      <Carousel>
        {history.slice(0, 6).map((item, idx) => (
          <ListeningProgressCard key={`${item.trackId || 'resume'}-${idx}`} item={item} onPlay={onPlay} />
        ))}
      </Carousel>
    </SectionContainer>
  );
}

function ListeningProgressCard({ item, onPlay }: { item: any, onPlay: (s: any) => void }) {
  // Mock progress percentage (40-85%)
  const progress = Math.floor(Math.random() * 45) + 40;

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative flex flex-col w-[220px] p-[16px] rounded-[18px] bg-[#161A23] border border-[#23293A] hover:border-[#FF4D8D]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] cursor-pointer"
      onClick={() => onPlay(item)}
    >
      <div className="flex gap-4 items-center mb-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
          <img 
            src={item.cover || item.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80'} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={20} className="fill-white text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#F8FAFC] text-[15px] truncate group-hover:text-[#FF4D8D] transition-colors">{item.title}</h4>
          <p className="text-[13px] text-[#A1A1AA] truncate mt-0.5">{item.artist}</p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-center text-[11px] font-bold text-[#8C93A7] mb-1.5 uppercase tracking-wide">
          <span>{progress}% Completed</span>
          <span className="text-[#A1A1AA]">Resume</span>
        </div>
        <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden border border-[#262C3A]">
          <div 
            className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#F97316] rounded-full group-hover:shadow-[0_0_10px_rgba(255,77,141,0.5)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
