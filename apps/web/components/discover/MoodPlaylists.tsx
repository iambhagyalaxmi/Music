import React from 'react';
import { SectionContainer } from './SectionContainer';
import { SectionHeader } from './SectionHeader';
import { motion } from 'framer-motion';
import { Smile } from 'lucide-react';

const MOODS = [
  { name: 'Chill', color: 'bg-blue-500/20 text-blue-400', image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=300&q=80' },
  { name: 'Workout', color: 'bg-orange-500/20 text-orange-400', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80' },
  { name: 'Party', color: 'bg-pink-500/20 text-pink-400', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&q=80' },
  { name: 'Focus', color: 'bg-emerald-500/20 text-emerald-400', image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=300&q=80' },
  { name: 'Sleep', color: 'bg-indigo-500/20 text-indigo-400', image: 'https://images.unsplash.com/photo-1517816743773-6e0fd5ce925c?w=300&q=80' },
];

export function MoodPlaylists() {
  return (
    <SectionContainer>
      <SectionHeader title="Mood Playlists" icon={Smile} onViewAll={() => {}} />
      
      <div className="flex gap-[20px] overflow-x-auto pb-4 scrollbar-hide snap-x">
        {MOODS.map((mood) => (
          <motion.div
            key={mood.name}
            whileHover={{ scale: 1.05 }}
            className="shrink-0 snap-start relative w-[160px] md:w-[200px] aspect-square rounded-2xl overflow-hidden cursor-pointer group"
          >
            <img 
              src={mood.image} 
              alt={mood.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 filter brightness-[0.6]"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">{mood.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
