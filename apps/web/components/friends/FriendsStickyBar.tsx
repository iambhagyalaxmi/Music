import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FriendsStickyBarProps {
  onSearch: (query: string) => void;
  onAddFriend: () => void;
  pendingCount: number;
}

export function FriendsStickyBar({ onSearch, onAddFriend, pendingCount }: FriendsStickyBarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      // Approximate hero height is 300px
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`z-40 transition-all duration-300 ${isSticky ? 'sticky top-[80px] bg-[#09090B]/90 backdrop-blur-md pb-4 pt-4 border-b border-white/5 -mx-6 px-6' : 'relative mt-8 mb-6'}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search friends by Name, Username, or Email..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-[#181824] border border-white/5 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-[#181824] hover:bg-[#20202e] border border-white/5 px-4 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            >
              <Filter size={16} className="text-gray-400" />
              {activeFilter}
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 right-0 bg-[#181824] border border-white/10 rounded-xl shadow-2xl w-48 overflow-hidden z-50"
                >
                  {['All', 'Online', 'Listening', 'Recently Active'].map(filter => (
                    <button 
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${activeFilter === filter ? 'text-pink-500 font-bold bg-pink-500/5' : 'text-gray-300'}`}
                    >
                      {filter}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={onAddFriend}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-colors relative"
          >
            <UserPlus size={16} /> Add Friend
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
