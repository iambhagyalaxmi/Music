import React from 'react';
import { SectionContainer } from './SectionContainer';
import { motion } from 'framer-motion';

const GENRES = [
  { name: 'Pop', color: 'from-pink-500 to-rose-500' },
  { name: 'Rock', color: 'from-orange-500 to-red-500' },
  { name: 'Hip-Hop', color: 'from-blue-500 to-indigo-500' },
  { name: 'EDM', color: 'from-emerald-400 to-cyan-500' },
  { name: 'Bollywood', color: 'from-amber-400 to-orange-500' },
  { name: 'Lo-Fi', color: 'from-purple-500 to-violet-600' },
  { name: 'Jazz', color: 'from-yellow-600 to-red-600' },
  { name: 'Classical', color: 'from-slate-400 to-gray-600' },
  { name: 'Indie', color: 'from-fuchsia-500 to-pink-600' }
];

export function GenresSection() {
  return (
    <SectionContainer>
      <h2 className="text-2xl font-bold mb-6 text-white">Browse Genres</h2>
      
      <div className="flex flex-wrap gap-4">
        {GENRES.map((genre) => (
          <motion.button
            key={genre.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r ${genre.color} opacity-90 hover:opacity-100 transition-opacity`}
          >
            {genre.name}
          </motion.button>
        ))}
      </div>
    </SectionContainer>
  );
}
