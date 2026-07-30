import React from 'react';
import { motion } from 'framer-motion';
import { UserX, Search, Mail, Users, Headphones, MessageCircle, Music, Disc } from 'lucide-react';

interface FriendsEmptyStateProps {
  type: 'no-friends' | 'no-requests' | 'no-rooms';
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

export function FriendsEmptyState({ type, onAction, onSecondaryAction }: FriendsEmptyStateProps) {
  if (type === 'no-requests') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#111118] border border-white/5 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4">
          <Users size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          You don't have any pending friend requests right now.
        </p>
      </div>
    );
  }

  if (type === 'no-rooms') {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#111118] border border-white/5 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-[#9D4EDD]/10 flex items-center justify-center text-[#9D4EDD] mb-4">
          <Headphones size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">No Active Rooms</h3>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          None of your friends are currently listening together. Start your own room and invite them!
        </p>
        <div className="flex gap-4">
          <button onClick={onAction} className="px-6 py-2 bg-[#9D4EDD] hover:bg-[#8B3DCC] text-white rounded-full font-bold transition-colors">
            Create Room
          </button>
          <button onClick={onSecondaryAction} className="px-6 py-2 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-full font-bold transition-colors">
            Browse Public
          </button>
        </div>
      </div>
    );
  }

  // default to no-friends
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 py-16 px-6 text-center lg:text-left bg-[#111118] border border-white/5 rounded-3xl">
      <div className="flex-1 max-w-md">
        <div className="w-20 h-20 mx-auto lg:mx-0 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 mb-6">
          <UserX size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4">It's quiet in here...</h2>
        <p className="text-gray-400 text-base mb-8 leading-relaxed">
          You don't have any friends added yet. Connect with people to share music, create collaborative playlists, and listen together in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
          <button 
            onClick={onAction}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition-colors shadow-lg shadow-pink-500/20"
          >
            <Search size={18} /> Find Friends
          </button>
          <button 
            onClick={onSecondaryAction}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-full font-bold transition-colors"
          >
            <Mail size={18} /> Invite via Link
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-sm w-full bg-[#181824] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 blur-[40px] pointer-events-none rounded-full"></div>
        <h3 className="font-bold text-lg mb-6">Why add friends?</h3>
        <ul className="flex flex-col gap-5 text-sm text-gray-300">
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-pink-400"><Disc size={16} /></div>
            Share your favorite playlists
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400"><Headphones size={16} /></div>
            Listen to the same song together
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-green-400"><Music size={16} /></div>
            Discover new music through activity
          </li>
          <li className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400"><MessageCircle size={16} /></div>
            Chat seamlessly while listening
          </li>
        </ul>
      </div>
    </div>
  );
}
