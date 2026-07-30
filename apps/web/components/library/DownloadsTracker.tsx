import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { EmptyState } from '../discover/EmptyState';
import { Download, HardDrive, Play, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PremiumSongCard } from '../discover/PremiumSongCard';

interface DownloadsTrackerProps {
  downloads: any[];
  onPlay: (song: any) => void;
}

export function DownloadsTracker({ downloads, onPlay }: DownloadsTrackerProps) {
  if (!downloads || downloads.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Downloaded Music" icon={Download} />
        <EmptyState message="You haven't downloaded any music for offline listening." actionText="Browse Music" onAction={() => {}} />
      </SectionContainer>
    );
  }

  // Assuming max storage limit 5GB for calculation
  const usageGB = 1.8;
  const maxGB = 5.0;
  const usagePercentage = (usageGB / maxGB) * 100;

  return (
    <SectionContainer>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Download className="text-[#3B82F6]" size={24} />
            Downloaded Music
          </h2>
          <p className="text-sm text-[#A1A1AA]">Listen to your favorite tracks offline.</p>
        </div>

        {/* Storage Widget */}
        <div className="flex items-center gap-4 bg-[#09090B] border border-[#262C3A] rounded-2xl p-4 w-full md:w-[320px]">
          <div className="w-10 h-10 rounded-full bg-[#161A23] border border-[#262C3A] flex items-center justify-center shrink-0">
            <HardDrive size={18} className="text-[#3B82F6]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-bold text-white">{downloads.length} Songs</span>
              <span className="text-[11px] text-[#A1A1AA] font-medium">{usageGB} GB / {maxGB} GB</span>
            </div>
            <div className="w-full h-1.5 bg-[#161A23] rounded-full overflow-hidden border border-[#262C3A]">
              <div 
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2 rounded-full font-bold text-sm transition-colors"
        >
          <Play size={16} className="fill-current" />
          Play All Offline
        </motion.button>
        <button className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#FF4D8D] text-sm font-bold transition-colors">
          <Trash2 size={16} />
          Free Up Space
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {downloads.map((song, idx) => (
          <PremiumSongCard 
            key={`${song.trackId || 'dl'}-${idx}`} 
            song={song} 
            onPlay={onPlay} 
          />
        ))}
      </div>
    </SectionContainer>
  );
}
