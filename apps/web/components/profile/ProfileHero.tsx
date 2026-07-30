import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Edit2, UserPlus, MessageSquare, MoreHorizontal, Link2 } from 'lucide-react';

interface ProfileHeroProps {
  profile?: any;
  isOwnProfile?: boolean;
}

export function ProfileHero({ profile, isOwnProfile = true }: ProfileHeroProps) {
  // Use fallbacks if profile not fully loaded yet
  const user = {
    name: profile?.name || 'Bhagyalaxmi Sahoo',
    username: profile?.username || '@bhagyalaxmi_sahoo',
    avatar: profile?.avatar || 'https://i.pravatar.cc/150?u=bhagyalaxmi_sahoo',
    memberSince: profile?.memberSince || '2026',
    likes: profile?.likes || '1,245',
    hours: profile?.hours || '310',
    followers: profile?.followers || 45,
    following: profile?.following || 62,
    friends: profile?.friends || 38,
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#111118]">
      
      {/* Background Cover & Effects */}
      <div className="h-48 md:h-64 relative overflow-hidden bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20">
        <div className="absolute inset-0 backdrop-blur-3xl bg-black/40"></div>
        
        {/* Animated Waveform */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: '10%' }}
              animate={{ height: `${20 + Math.random() * 80}%` }}
              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, repeatType: 'reverse' }}
              className="w-2 md:w-4 bg-white rounded-t-full"
            />
          ))}
        </div>
        
        {/* Vinyl Rotation Effect */}
        <div className="absolute top-1/2 -translate-y-1/2 right-10 md:right-32 w-32 md:w-48 h-32 md:w-48 opacity-40 blur-sm pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full rounded-full border-[10px] border-[#181824] bg-black flex items-center justify-center relative shadow-2xl"
          >
            <div className="w-1/3 h-1/3 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Details Area */}
      <div className="px-6 md:px-10 pb-8 relative">
        <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 md:-mt-20">
          
          <div className="relative shrink-0 z-20">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#111118] object-cover bg-[#1A1A24] shadow-xl"
            />
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-[#111118] rounded-full shadow-lg"></div>
          </div>
          
          <div className="flex-1 pb-2 flex flex-col md:flex-row md:justify-between md:items-end gap-6 z-20">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-1">{user.name}</h1>
              <p className="text-pink-500 font-bold mb-3">{user.username}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 font-medium">
                <span className="bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] font-black border border-pink-500/20">
                  Premium Member
                </span>
                <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1">
                  🎵 Listening Since {user.memberSince}
                </span>
                <span className="flex items-center gap-1">❤️ {user.likes} Liked</span>
                <span className="flex items-center gap-1">🎧 {user.hours} Hours</span>
              </div>
            </div>
            
            <div className="flex gap-6 shrink-0">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-white">{user.followers}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-white">{user.following}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Following</p>
              </div>
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-white">{user.friends}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Friends</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {isOwnProfile ? (
            <>
              <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-sm">
                <Edit2 size={16} /> Edit Profile
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 text-sm">
                <Share2 size={16} /> Share
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-full font-bold transition-colors text-sm">
                <Link2 size={16} /> Copy Link
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full font-bold shadow-[0_4px_12px_rgba(255,77,141,0.3)] transition-transform hover:scale-105 active:scale-95 text-sm">
                <UserPlus size={16} /> Add Friend
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 text-sm">
                <MessageSquare size={16} /> Message
              </button>
              <button className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-5 py-2.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 border border-purple-500/30 text-sm">
                Invite to Room
              </button>
            </>
          )}
          <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 ml-auto transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
