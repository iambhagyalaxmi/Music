import React from 'react';
import { Music, Disc, Mic2, Clock, Heart, ListMusic, Users, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityStatsProps {
  stats?: {
    songsPlayed: number | string;
    albumsPlayed: number | string;
    artistsPlayed: number | string;
    listeningHours: number | string;
    likedSongs: number | string;
    playlistsCreated: number | string;
    friendsActive: number | string;
    roomsJoined: number | string;
  };
}

export function ActivityStats({ 
  stats = {
    songsPlayed: '-', albumsPlayed: '-', artistsPlayed: '-', listeningHours: '-',
    likedSongs: '-', playlistsCreated: '-', friendsActive: '-', roomsJoined: '-'
  }
}: ActivityStatsProps) {
  
  const cards = [
    { label: 'Songs Played', value: stats.songsPlayed, icon: <Music size={20} />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Albums Played', value: stats.albumsPlayed, icon: <Disc size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Artists Played', value: stats.artistsPlayed, icon: <Mic2 size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Listening Hours', value: stats.listeningHours, icon: <Clock size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Liked Songs', value: stats.likedSongs, icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Playlists Created', value: stats.playlistsCreated, icon: <ListMusic size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Friends Active', value: stats.friendsActive, icon: <Users size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Rooms Joined', value: stats.roomsJoined, icon: <Radio size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div 
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-[#111118] border border-white/5 rounded-xl p-5 hover:bg-[#1A1A24] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg ${card.bg} ${card.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              {card.icon}
            </div>
            <p className="text-sm font-medium text-gray-400 leading-tight">{card.label}</p>
          </div>
          <p className="text-2xl font-black text-white">{card.value}</p>
          
          {/* Subtle glow on hover */}
          <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${card.bg.replace('/10', '')}`}></div>
        </motion.div>
      ))}
    </div>
  );
}
