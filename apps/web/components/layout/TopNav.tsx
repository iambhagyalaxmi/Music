"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Search, Bell, MessageSquare, Users, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useMusicStore } from '@/lib/store/useMusicStore';

export function TopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/ytmusic/search?q=${encodeURIComponent(searchQuery)}`);
        const ytData = res.ok ? await res.json() : { items: [] };
        
        // In a real app we'd fetch active rooms that match from backend here
        // const matchingRooms = ...
        
        const matchingSongs = (ytData.items || []).map((s: any) => ({ ...s, type: 'song' }));

        setSearchResults([...matchingSongs]); // Add rooms back when endpoint exists
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const { playSong } = useMusicStore();

  const handleSearchResultClick = (item: any) => {
    if (item.type === 'room') {
      router.push(`/rooms/room-${item.id}`);
    } else if (item.type === 'song') {
      // Instead of going to room immediately, just play it in the global player for now
      // Or go to a room if desired. Let's start the global player.
      playSong({
        trackId: item.trackId,
        title: item.title,
        artist: item.artist,
        cover: item.thumbnail,
        duration: item.duration || 240
      });
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center bg-[var(--color-surface)] p-[var(--spacing-4)] lg:px-[var(--spacing-6)] rounded-[var(--radius-lg)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] gap-4 sticky top-0 z-40">
      
      {/* Search Bar */}
      <div className="flex-1 flex justify-start relative w-full sm:w-auto max-w-[500px]" ref={searchRef}>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            placeholder="Search for songs, artists, or friends..." 
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-pink)] transition-colors focus:bg-white/10"
          />
        </div>
        
        {/* Search Dropdown */}
        {showSearch && searchQuery.trim() !== '' && (
          <div className="absolute top-full left-0 w-full z-50 bg-[var(--color-surface-2)] rounded-lg mt-2 p-2 border border-white/10 max-h-[300px] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2">
            {isSearching ? (
              <div className="p-4 text-center text-[var(--color-text-muted)]">Searching...</div>
            ) : searchResults.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {searchResults.map((item, idx) => (
                  <li 
                    key={item.id || idx}
                    onClick={() => handleSearchResultClick(item)}
                    className="flex items-center gap-3 p-2 cursor-pointer rounded-md hover:bg-white/5 transition-colors group"
                  >
                    {item.type === 'room' && (
                      <div className="w-10 h-10 rounded-md bg-[var(--color-surface)] flex items-center justify-center text-lg">🏠</div>
                    )}
                    {item.type === 'song' && item.thumbnail && (
                      <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-md object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate group-hover:text-[var(--color-accent-pink)] transition-colors">{item.title}</div>
                      <div className="text-sm text-[var(--color-text-secondary)] truncate">
                        {item.type === 'room' ? 'Room' : item.artist}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-[var(--color-text-muted)]">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        
        {/* Icons */}
        <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
          <button className="relative hover:text-white transition-colors" title="Notifications">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[var(--color-surface)]">
              4
            </span>
          </button>
          
          <button className="relative hover:text-white transition-colors" title="Messages">
            <MessageSquare size={20} />
          </button>
          
          <button className="relative hover:text-white transition-colors" title="Friend Requests">
            <Users size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--color-accent-pink)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[var(--color-surface)]">
              2
            </span>
          </button>
        </div>

        <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-white/5 p-1 pr-3 rounded-full transition-colors"
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.profile?.displayName || user?.username || 'Guest'}&background=random`} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full shadow-sm" 
            />
            <span className="font-bold text-sm hidden sm:block max-w-[120px] truncate">
              {user?.profile?.displayName || user?.username || 'Guest'}
            </span>
            <ChevronDown size={16} className="text-[var(--color-text-muted)] hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface-2)] border border-white/10 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => { setShowProfileMenu(false); router.push('/profile'); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-white">
                <User size={16} /> Profile
              </button>
              <button onClick={() => { setShowProfileMenu(false); router.push('/settings'); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm flex items-center gap-3 text-[var(--color-text-secondary)] hover:text-white">
                <Settings size={16} /> Settings
              </button>
              <div className="h-px bg-white/10 my-1" />
              <button onClick={() => { setShowProfileMenu(false); logout(); }} className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm flex items-center gap-3 text-red-400 hover:text-red-300">
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
