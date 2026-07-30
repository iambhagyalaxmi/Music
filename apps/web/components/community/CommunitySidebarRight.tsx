import React, { useState } from 'react';
import { Flame, Play, Trophy, Users, Calendar } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  artworkUrl?: string;
}

interface Contributor {
  id?: string;
  name: string;
  posts: number;
  avatar?: string;
  avatarUrl?: string;
}

interface CommunitySidebarRightProps {
  trendingSongs?: Song[];
  topContributors?: Contributor[];
}

export function CommunitySidebarRight({ trendingSongs = [], topContributors = [] }: CommunitySidebarRightProps) {
  const [activeTab, setActiveTab] = useState('Songs');
  
  const popularArtists: { name: string; avatar: string }[] = [];

  return (
    <div className="flex flex-col gap-6 sticky top-[80px]">
      
      {/* Trending Section */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Flame className="text-orange-500" size={18} /> Trending
        </h3>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {['Songs', 'Artists', 'Albums', 'Tags'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Songs' && (
          <div className="flex flex-col gap-3">
            {trendingSongs.length === 0 ? (
              <p className="text-sm text-gray-500">No trending songs right now.</p>
            ) : trendingSongs.map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors -mx-2">
                <p className="text-gray-500 font-bold w-4 text-center group-hover:hidden">{i + 1}</p>
                <button className="hidden group-hover:flex items-center justify-center w-4 text-pink-500">
                  <Play size={12} fill="currentColor" />
                </button>
                <img src={song.cover || song.artworkUrl || 'https://via.placeholder.com/150'} alt={song.title} className="w-10 h-10 rounded-lg object-cover shadow-md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Placeholder for other tabs if they were clicked */}
        {activeTab !== 'Songs' && (
          <div className="py-8 text-center text-gray-500 text-sm">
            Check back later for trending {activeTab.toLowerCase()}.
          </div>
        )}
      </div>

      {/* Popular Artists */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="text-pink-500" size={18} /> Popular Artists
        </h3>
        <div className="flex flex-col gap-4">
          {popularArtists.map((artist, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={artist.avatar} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                <p className="font-bold text-sm text-white truncate max-w-[100px]">{artist.name}</p>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-pink-500 hover:text-white text-xs font-bold text-white transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" size={18} /> Top Contributors
        </h3>
        <div className="flex flex-col gap-4">
          {topContributors.length === 0 ? (
            <p className="text-sm text-gray-500">No top contributors yet.</p>
          ) : topContributors.map((user, i) => (
            <div key={i} className="flex items-center gap-3 relative">
              <div className="relative">
                <img src={user.avatar || user.avatarUrl || `https://i.pravatar.cc/150?u=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#111118]" />
                {i === 0 && <span className="absolute -bottom-1 -right-1 text-lg leading-none filter drop-shadow-md">👑</span>}
                {i === 1 && <span className="absolute -bottom-1 -right-1 text-lg leading-none filter drop-shadow-md">🥈</span>}
                {i === 2 && <span className="absolute -bottom-1 -right-1 text-lg leading-none filter drop-shadow-md">🥉</span>}
              </div>
              <div>
                <p className="font-bold text-sm text-white">{user.name}</p>
                <p className="text-xs text-pink-400 font-medium">{user.posts} Posts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
