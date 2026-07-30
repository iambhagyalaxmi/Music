import React, { useState } from 'react';
import { Search, Music, User, Disc, ListMusic, Hash } from 'lucide-react';

export function CommunitySearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Mock autocomplete suggestions
  const suggestions = [
    { type: 'song', text: 'Blinding Lights', icon: <Music size={14}/> },
    { type: 'user', text: '@sarah_miller', icon: <User size={14}/> },
    { type: 'album', text: 'After Hours', icon: <Disc size={14}/> },
    { type: 'playlist', text: 'Synthwave 2026', icon: <ListMusic size={14}/> },
    { type: 'tag', text: '#IndieRock', icon: <Hash size={14}/> },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 z-40">
      <div className={`relative flex items-center bg-[#181824] border ${isFocused ? 'border-pink-500/50' : 'border-white/5'} rounded-full transition-colors`}>
        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search for Songs, Users, Artists, Playlists, or #Hashtags..."
          className="w-full bg-transparent py-3 pl-12 pr-6 text-white focus:outline-none rounded-full"
        />
      </div>

      {isFocused && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-[#181824] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="p-2 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-[#111118]">
            Quick Results
          </div>
          {suggestions.filter(s => s.text.toLowerCase().includes(query.toLowerCase())).map((item, i) => (
            <button key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{item.text}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.type}</p>
              </div>
            </button>
          ))}
          {suggestions.filter(s => s.text.toLowerCase().includes(query.toLowerCase())).length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No results found for "{query}"
            </div>
          )}
          <button className="p-3 bg-white/5 hover:bg-white/10 text-center text-sm font-bold text-pink-500 transition-colors">
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
