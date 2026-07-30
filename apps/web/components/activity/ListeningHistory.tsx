import React from 'react';
import { History, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryItem {
  id: string;
  song: string;
  artist: string;
  cover: string;
  duration: string;
  playedAt: string;
}

interface ListeningHistoryProps {
  history?: HistoryItem[];
}

export function ListeningHistory({ history = [] }: ListeningHistoryProps) {
  
  if (history.length === 0) return null;

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="text-pink-500" size={20} />
          <h3 className="font-bold text-lg text-white">Listening History</h3>
        </div>
        <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex flex-col gap-2">
        {history.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={item.cover} alt={item.song} className="w-12 h-12 rounded-lg object-cover shadow-md" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <Play size={16} className="text-white fill-white" />
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-sm">{item.song}</p>
                <p className="text-xs text-gray-400">{item.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-right">
              <p className="text-xs text-gray-500 hidden sm:block">{item.duration}</p>
              <p className="text-xs text-gray-400 font-medium w-20">{item.playedAt}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
