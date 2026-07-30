import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Headphones, Share, User, MoreVertical, Heart, BellOff, UserMinus, ShieldAlert, Flag, Music } from 'lucide-react';

interface FriendCardProps {
  friend: {
    id: string;
    username: string;
    avatarUrl?: string;
    displayName?: string;
    status: 'online' | 'listening' | 'voice' | 'away' | 'offline';
    currentSong?: string;
    mutualFriends?: number;
    lastActive?: string;
    favoriteGenre?: string;
  };
  onClick?: () => void;
}

export function FriendCard({ friend, onClick }: FriendCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'listening': return 'bg-purple-500';
      case 'voice': return 'bg-blue-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative bg-[#111118] border border-white/5 rounded-2xl p-5 hover:shadow-[0_8px_30px_rgba(255,77,141,0.15)] hover:border-pink-500/30 transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <MoreVertical size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-[#181824] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50"
            >
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"><MessageCircle size={14}/> Message</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"><Headphones size={14}/> Listen Together</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"><Share size={14}/> Invite to Room</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"><User size={14}/> View Profile</button>
              <div className="h-px bg-white/10 my-1"></div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 text-pink-400"><Heart size={14}/> Favorite Friend</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 text-yellow-400"><BellOff size={14}/> Mute Activity</button>
              <div className="h-px bg-white/10 my-1"></div>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 flex items-center gap-2 text-red-400"><UserMinus size={14}/> Remove Friend</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 flex items-center gap-2 text-red-500"><ShieldAlert size={14}/> Block User</button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 flex items-center gap-2 text-red-500"><Flag size={14}/> Report User</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative">
          <img 
            src={friend.avatarUrl || `https://i.pravatar.cc/150?u=${friend.username}`} 
            alt={friend.username} 
            className="w-20 h-20 rounded-full object-cover border-2 border-[#111118] group-hover:border-pink-500/50 transition-colors"
          />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#111118] ${getStatusColor(friend.status)}`} title={friend.status}></div>
        </div>

        <div>
          <h3 className="font-bold text-lg leading-tight">{friend.displayName || friend.username}</h3>
          <p className="text-sm text-gray-400">@{friend.username}</p>
        </div>

        {friend.currentSong ? (
          <div className="w-full bg-white/5 rounded-lg py-2 px-3 flex items-center justify-center gap-2">
            <Music size={12} className="text-purple-400 animate-pulse" />
            <span className="text-xs font-medium truncate max-w-[150px]">{friend.currentSong}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>Last active: {friend.lastActive || 'Recently'}</span>
          </div>
        )}

        <div className="flex gap-4 text-xs text-gray-400 mt-1">
          {friend.mutualFriends !== undefined && <span>{friend.mutualFriends} mutuals</span>}
          {friend.favoriteGenre && <span>{friend.favoriteGenre}</span>}
        </div>
      </div>

      <div className="absolute inset-0 bg-[#111118]/80 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto z-10">
        <div className="flex gap-3">
          <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-transform hover:scale-110 shadow-lg" title="Chat">
            <MessageCircle size={18} />
          </button>
          <button className="bg-[#9D4EDD] hover:bg-[#8B3DCC] text-white p-3 rounded-full transition-transform hover:scale-110 shadow-lg" title="Listen Together">
            <Headphones size={18} />
          </button>
        </div>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105" onClick={onClick}>
          View Profile
        </button>
      </div>
    </motion.div>
  );
}
