import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { EmptyState } from '../discover/EmptyState';
import { History, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface ListeningHistoryTimelineProps {
  history: any[];
  onPlay: (song: any) => void;
}

export function ListeningHistoryTimeline({ history, onPlay }: ListeningHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Listening History" icon={History} />
        <EmptyState message="You haven't listened to anything yet." />
      </SectionContainer>
    );
  }

  // Mock grouping
  const groups = [
    { title: 'Today', items: history.slice(0, 3) },
    { title: 'Yesterday', items: history.slice(3, 7) },
    { title: 'Earlier This Week', items: history.slice(7, 12) }
  ].filter(g => g.items.length > 0);

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <History className="text-[#FF4D8D]" size={24} />
            Listening History
          </h2>
          <p className="text-sm text-[#A1A1AA]">Relive your recent musical moments.</p>
        </div>
        
        <div className="flex bg-[#09090B] border border-[#262C3A] rounded-xl p-1">
          {['Today', 'Yesterday', 'This Week', 'This Month'].map((filter, i) => (
            <button 
              key={filter}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-[#FF4D8D] text-white' : 'text-[#A1A1AA] hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 relative">
        {/* Timeline Line */}
        <div className="absolute left-[28px] top-4 bottom-4 w-px bg-[#262C3A]" />

        {groups.map((group, idx) => (
          <div key={group.title} className="relative z-10">
            {/* Group Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-6 bg-[#1D2230] border border-[#262C3A] rounded-full flex items-center justify-center shrink-0 z-10">
                <div className="w-2 h-2 rounded-full bg-[#FF4D8D]" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{group.title}</h3>
            </div>
            
            {/* Group Items */}
            <div className="flex flex-col gap-3 pl-14">
              {group.items.map((item, i) => (
                <HistoryRow key={`${item.trackId || 'hist'}-${i}`} item={item} onPlay={onPlay} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

function HistoryRow({ item, onPlay }: { item: any, onPlay: (s: any) => void }) {
  // Mock time
  const time = `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`;

  return (
    <motion.div 
      whileHover={{ x: 4 }}
      className="group flex items-center justify-between p-3 rounded-xl bg-transparent hover:bg-[#1D2230] border border-transparent hover:border-[#262C3A] transition-all cursor-pointer"
      onClick={() => onPlay(item)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
          <img 
            src={item.cover || item.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80'} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={16} className="fill-white text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#F8FAFC] text-[15px] truncate group-hover:text-[#FF4D8D] transition-colors leading-snug">{item.title}</h4>
          <p className="text-[13px] text-[#A1A1AA] truncate">{item.artist}</p>
        </div>
      </div>
      
      <div className="text-[12px] font-medium text-[#8C93A7] group-hover:text-white transition-colors pl-4 shrink-0">
        {time}
      </div>
    </motion.div>
  );
}
