import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';

export function ActivityFilters() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Songs', 'Albums', 'Playlists', 'Rooms', 'Friends', 'Likes', 'Comments', 'Shares'];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-[80px] bg-[var(--color-background)] z-30 py-3 border-b border-white/5">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
        <div className="flex items-center gap-2 mr-2 text-gray-500">
          <Filter size={16} />
        </div>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter 
                ? 'bg-pink-500 text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      <div className="relative shrink-0 w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search activity..."
          className="w-full bg-[#111118] border border-white/10 py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50 rounded-full transition-colors"
        />
      </div>
    </div>
  );
}
