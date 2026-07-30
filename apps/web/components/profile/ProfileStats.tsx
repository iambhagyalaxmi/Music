import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Disc, Mic2, ListMusic, Clock, Users, Radio, MessageSquare } from 'lucide-react';

interface ProfileStatsProps {
  stats?: any;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  // Use fallbacks if stats are not provided
  const data = [
    { label: 'Liked Songs', value: stats?.likedSongs || '1,245', icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Albums', value: stats?.albums || '220', icon: <Disc size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Artists', value: stats?.artists || '180', icon: <Mic2 size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Playlists', value: stats?.playlists || '18', icon: <ListMusic size={20} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Listening Hours', value: stats?.listeningHours || '543 hrs', icon: <Clock size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Communities', value: stats?.communitiesJoined || '14', icon: <MessageSquare size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Friends', value: stats?.friends || '38', icon: <Users size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Rooms Joined', value: stats?.roomsJoined || '72', icon: <Radio size={20} />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-[#111118] border border-white/5 rounded-2xl p-5 hover:bg-[#1A1A24] transition-all hover:-translate-y-1 hover:shadow-2xl group relative overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium text-gray-400 leading-tight">{item.label}</p>
          </div>
          <p className="text-2xl font-black text-white relative z-10">{item.value}</p>
          
          {/* Subtle glow on hover */}
          <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-40 transition-opacity ${item.bg.replace('/10', '')}`}></div>
        </motion.div>
      ))}
    </div>
  );
}
