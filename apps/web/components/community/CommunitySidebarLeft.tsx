import React from 'react';
import { Hash, Radio, Users, Compass } from 'lucide-react';

export function CommunitySidebarLeft() {
  const tags = ['IndieRock', 'ArijitSingh', 'Workout', 'LoFi', 'PartyMix', 'RoadTrip'];
  const communities = [
    { name: 'Indie Rock Lovers', members: '12.4k' },
    { name: 'Bollywood Fans', members: '41k' },
    { name: 'EDM World', members: '89k' }
  ];
  const rooms = [
    { name: 'Rock Night', listeners: 26 },
    { name: 'Pop Hits', listeners: 13 },
    { name: 'Study Focus', listeners: 45 }
  ];

  return (
    <div className="flex flex-col gap-6 sticky top-[80px]">
      
      {/* Trending Tags */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Hash className="text-pink-500" size={18} /> Trending Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button key={tag} className="px-3 py-1.5 bg-[#181824] hover:bg-white/10 border border-white/5 rounded-lg text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Communities */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Compass className="text-blue-500" size={18} /> Suggested Groups
        </h3>
        <div className="flex flex-col gap-4">
          {communities.map((comm, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate text-white">{comm.name}</p>
                  <p className="text-xs text-gray-400">{comm.members} Members</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-500 hover:text-white text-xs font-bold text-white transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Rooms */}
      <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Radio className="text-purple-500" size={18} /> Active Rooms
        </h3>
        <div className="flex flex-col gap-4">
          {rooms.map((room, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <p className="font-bold text-sm text-white">{room.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <p className="text-xs text-gray-400">{room.listeners} Listening</p>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500 hover:text-white text-xs font-bold text-white transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
