import React from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Plus, Mic2, Disc, UserPlus, Share, Play } from 'lucide-react';

interface Activity {
  id: string;
  user: { name: string; avatar: string };
  type: 'listen' | 'like' | 'add_playlist' | 'room' | 'save_album' | 'friend' | 'share';
  target: string;
  time: string;
}

interface FriendActivityFeedProps {
  activities: Activity[];
}

export function FriendActivityFeed({ activities }: FriendActivityFeedProps) {
  if (!activities || activities.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'listen': return <Music size={16} className="text-purple-400" />;
      case 'like': return <Heart size={16} className="text-pink-500 fill-pink-500" />;
      case 'add_playlist': return <Plus size={16} className="text-blue-400" />;
      case 'room': return <Mic2 size={16} className="text-green-500" />;
      case 'save_album': return <Disc size={16} className="text-yellow-400" />;
      case 'friend': return <UserPlus size={16} className="text-gray-300" />;
      case 'share': return <Share size={16} className="text-indigo-400" />;
      default: return <Music size={16} />;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'listen': return 'started listening to';
      case 'like': return 'liked a song';
      case 'add_playlist': return 'added a playlist';
      case 'room': return 'joined a room';
      case 'save_album': return 'saved an album';
      case 'friend': return 'became friends with someone';
      case 'share': return 'shared a playlist';
      default: return 'interacted with';
    }
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {activities.map((act, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={act.id} 
            className="snap-start shrink-0 w-[300px] bg-[#111118] border border-white/5 p-4 rounded-xl flex flex-col gap-3 hover:bg-[#181824] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img src={act.user.avatar} alt={act.user.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{act.user.name}</p>
                <p className="text-xs text-gray-400 truncate">{act.time}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                {getIcon(act.type)}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">{getActionText(act.type)}</p>
              <p className="text-base font-bold text-white truncate">{act.target}</p>
            </div>
            <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-end">
              <button className="text-xs font-bold text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {act.type === 'room' ? 'Join Room' : 'Play'} <Play size={12} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
