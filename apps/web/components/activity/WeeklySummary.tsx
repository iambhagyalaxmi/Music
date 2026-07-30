import React from 'react';
import { BarChart2, Star, TrendingUp, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeeklySummaryProps {
  summary?: {
    songs: number | string;
    artists: number | string;
    albums: number | string;
    hours: number | string;
    topGenre: string;
    topArtist: string;
    topSong: string;
  };
}

export function WeeklySummary({ 
  summary = { songs: '-', artists: '-', albums: '-', hours: '-', topGenre: '-', topArtist: '-', topSong: '-' } 
}: WeeklySummaryProps) {
  
  return (
    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-[40px]"></div>
      
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="text-pink-400" size={20} />
        <h3 className="font-bold text-lg text-white">Weekly Summary</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-black text-white">{summary.songs}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Songs</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-black text-white">{summary.artists}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Artists</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-black text-white">{summary.albums}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Albums</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <p className="text-xl font-black text-white">{summary.hours}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Hours</p>
        </div>
      </div>
      
      <div className="bg-[#111118]/80 backdrop-blur-sm rounded-xl p-4 border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Star size={14} className="text-yellow-500" /> Top Genre
          </div>
          <span className="font-bold text-white">{summary.topGenre}</span>
        </div>
        <div className="border-b border-white/5"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp size={14} className="text-blue-500" /> Top Artist
          </div>
          <span className="font-bold text-white">{summary.topArtist}</span>
        </div>
        <div className="border-b border-white/5"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Play size={14} className="text-pink-500" /> Top Song
          </div>
          <span className="font-bold text-white">{summary.topSong}</span>
        </div>
      </div>
    </div>
  );
}
