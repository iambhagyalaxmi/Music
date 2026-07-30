import React from 'react';
import { Users, Activity, UserPlus, Headphones } from 'lucide-react';

interface FriendsHeroProps {
  stats: {
    total: number;
    online: number;
    requests: number;
  };
  onAddFriend: () => void;
  onCreateRoom: () => void;
  onInviteFriend: () => void;
  userAvatar?: string;
  userName?: string;
}

export function FriendsHero({ stats, onAddFriend, onCreateRoom, onInviteFriend, userAvatar, userName }: FriendsHeroProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Gradient Header */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)' }}
      >
        <div className="absolute -top-[50%] -left-[10%] w-[300px] h-[300px] bg-pink-500/40 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
          <div className="relative">
            <img 
              src={userAvatar || "https://i.pravatar.cc/150?img=1"} 
              alt="User" 
              className="w-20 h-20 rounded-full border-4 border-white/10 object-cover"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-[#111118] rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black mb-1">Friends</h1>
            <p className="text-gray-400 text-base max-w-md">
              Welcome back, {userName || 'Music Lover'}! You have <strong className="text-white">{stats.online}</strong> friends online right now. Let's listen together.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-3">
          <button 
            onClick={onAddFriend}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(255,77,141,0.3)] transition-transform hover:scale-105 active:scale-95"
          >
            <UserPlus size={18} /> Add Friend
          </button>
          <button 
            onClick={onCreateRoom}
            className="flex items-center gap-2 bg-[#9D4EDD] hover:bg-[#8B3DCC] text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(157,78,221,0.3)] transition-transform hover:scale-105 active:scale-95"
          >
            <Headphones size={18} /> Create Room
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#181824] p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Friends</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-300">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-[#181824] p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Online Now</h3>
            <p className="text-2xl font-bold">{stats.online}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <Activity size={24} />
          </div>
        </div>
        <div className="bg-[#181824] p-5 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Pending Requests</h3>
            <p className="text-2xl font-bold">{stats.requests}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
            <UserPlus size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
