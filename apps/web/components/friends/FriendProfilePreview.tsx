import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Headphones, UserPlus, Music, Disc, Shield, ShieldAlert, Flag, UserMinus } from 'lucide-react';

interface FriendProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  friend: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    status: string;
    bio?: string;
    favoriteGenres?: string[];
    mutualFriends?: number;
    recentlyPlayed?: { title: string; artist: string }[];
  } | null;
}

export function FriendProfilePreview({ isOpen, onClose, friend }: FriendProfilePreviewProps) {
  if (!friend) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#111118] border-l border-white/5 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header / Cover */}
            <div className="h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-6 relative pb-6 border-b border-white/5">
              <div className="absolute -top-12 left-6">
                <img 
                  src={friend.avatarUrl || `https://i.pravatar.cc/150?u=${friend.username}`}
                  alt={friend.username}
                  className="w-24 h-24 rounded-full border-4 border-[#111118] object-cover bg-[#181824]"
                />
              </div>
              <div className="pt-14">
                <h2 className="text-2xl font-bold">{friend.displayName || friend.username}</h2>
                <p className="text-gray-400">@{friend.username}</p>
                {friend.bio && (
                  <p className="mt-3 text-sm text-gray-300 leading-relaxed">{friend.bio}</p>
                )}
                
                <div className="flex gap-4 mt-4 text-sm text-gray-400">
                  {friend.mutualFriends !== undefined && (
                    <div className="flex items-center gap-1"><UserPlus size={14} /> {friend.mutualFriends} Mutuals</div>
                  )}
                  {friend.status === 'online' && (
                    <div className="flex items-center gap-1 text-green-500"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 grid grid-cols-2 gap-3 border-b border-white/5 bg-[#181824]/50">
              <button className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-xl font-bold transition-colors">
                <MessageCircle size={16} /> Chat
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#9D4EDD] hover:bg-[#8B3DCC] text-white py-2.5 rounded-xl font-bold transition-colors">
                <Headphones size={16} /> Listen
              </button>
              <button className="col-span-2 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-bold transition-colors">
                View Full Profile
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {friend.favoriteGenres && friend.favoriteGenres.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-sm text-gray-400 uppercase tracking-wider">Favorite Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {friend.favoriteGenres.map(g => (
                      <span key={g} className="px-3 py-1 bg-white/5 rounded-full text-sm">{g}</span>
                    ))}
                  </div>
                </div>
              )}

              {friend.recentlyPlayed && friend.recentlyPlayed.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-sm text-gray-400 uppercase tracking-wider">Recently Played</h3>
                  <div className="flex flex-col gap-3">
                    {friend.recentlyPlayed.map((song, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-500"><Music size={16}/></div>
                        <div>
                          <p className="text-sm font-bold truncate">{song.title}</p>
                          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 flex items-center justify-center gap-4">
              <button className="p-2 text-gray-500 hover:text-red-400 transition-colors" title="Remove Friend"><UserMinus size={18} /></button>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Block User"><ShieldAlert size={18} /></button>
              <button className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Report"><Flag size={18} /></button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
