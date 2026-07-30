import React from 'react';
import { Users, Music, Heart, MessageSquare, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FriendActivityItem {
  id: string;
  user: { name: string; avatar: string };
  type: 'listen' | 'like' | 'room' | 'share' | 'comment';
  target: string;
  time: string;
}

interface FriendsActivityProps {
  activity?: FriendActivityItem[];
}

export function FriendsActivity({ activity = [] }: FriendsActivityProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'listen': return <Music size={12} className="text-pink-500" />;
      case 'like': return <Heart size={12} className="text-red-500 fill-red-500" />;
      case 'room': return <Radio size={12} className="text-purple-500" />;
      case 'comment': return <MessageSquare size={12} className="text-blue-500" />;
      default: return <Music size={12} className="text-gray-400" />;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'listen': return 'is listening to';
      case 'like': return 'liked';
      case 'room': return 'joined';
      case 'share': return 'shared';
      case 'comment': return 'commented on';
      default: return 'interacted with';
    }
  };

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-5 sticky top-[80px]">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-pink-500" size={20} />
        <h3 className="font-bold text-lg text-white">Friends Activity</h3>
      </div>
      
      {activity.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No recent friend activity.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0 relative">
          <AnimatePresence>
            {activity.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <div className="py-4 flex gap-3 group">
                  <div className="relative shrink-0">
                    <img src={item.user.avatar || `https://i.pravatar.cc/150?u=${item.user.name}`} alt={item.user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#181824] rounded-full flex items-center justify-center border-2 border-[#111118]">
                      {getIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-tight">
                      <span className="font-bold text-white cursor-pointer hover:underline">{item.user.name}</span>{' '}
                      {getActionText(item.type)}{' '}
                      <span className="font-bold text-white cursor-pointer hover:underline">{item.target}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">{item.time}</p>
                  </div>
                </div>
                {index < activity.length - 1 && <div className="border-b border-white/5 mx-2"></div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
