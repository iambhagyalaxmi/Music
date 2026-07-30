import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Recommendation {
  id: string;
  reason: string; // e.g. "Because you played Blinding Lights"
  title: string;
  artist: string;
  cover: string;
}

interface RecommendationsProps {
  items?: Recommendation[];
}

export function Recommendations({ items = [] }: RecommendationsProps) {
  if (items.length === 0) return null;

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] pointer-events-none"></div>
      
      <div className="flex items-center gap-2 mb-6 relative z-10">
        <Sparkles className="text-yellow-500" size={20} />
        <h3 className="font-bold text-lg text-white">Recommended for You</h3>
      </div>
      
      <div className="flex flex-col gap-5 relative z-10">
        {items.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-3 group"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{item.reason}</p>
            <div className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer relative">
              <div className="relative shrink-0">
                <img src={item.cover} alt={item.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <Play size={14} className="text-white fill-white ml-0.5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white truncate">{item.title}</p>
                <p className="text-xs text-gray-400 truncate">{item.artist}</p>
              </div>
            </div>
            {i < items.length - 1 && <div className="border-b border-white/5 mt-2"></div>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
