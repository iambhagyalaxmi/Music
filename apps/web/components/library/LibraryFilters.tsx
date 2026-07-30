import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface LibraryFiltersProps {
  currentFilter: string;
  setFilter: (f: string) => void;
  sort: string;
  setSort: (s: string) => void;
}

export function LibraryFilters({ currentFilter, setFilter, sort, setSort }: LibraryFiltersProps) {
  const filters = ['All', 'Songs', 'Albums', 'Playlists', 'Artists', 'Downloads'];
  const sorts = ['Recently Added', 'Recently Played', 'Alphabetical', 'Most Played', 'Newest'];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left side: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-[240px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
          <input 
            type="text"
            placeholder="Search your library..."
            className="w-full bg-[#161A23] border border-[#262C3A] rounded-full py-2 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FF4D8D] focus:shadow-[0_0_0_2px_rgba(255,77,141,0.2)] transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full scrollbar-hide pb-1 sm:pb-0">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                currentFilter === f 
                  ? 'bg-[#FF4D8D] text-white border-[#FF4D8D]' 
                  : 'bg-transparent text-[#A1A1AA] border-[#262C3A] hover:text-white hover:border-[#A1A1AA]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Sort */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm text-[#A1A1AA] font-medium hidden sm:block">Sort by:</span>
        <div className="relative group">
          <button className="flex items-center gap-2 bg-transparent hover:bg-[#1D2230] border border-transparent hover:border-[#262C3A] px-3 py-1.5 rounded-lg text-sm font-bold text-white transition-all">
            {sort}
            <ChevronDown size={16} className="text-[#A1A1AA] group-hover:text-white transition-colors" />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#161A23] border border-[#262C3A] rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-right scale-95 group-hover:scale-100">
            {sorts.map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#1D2230] transition-colors ${sort === s ? 'text-[#FF4D8D] font-bold' : 'text-[#A1A1AA] hover:text-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
