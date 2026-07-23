"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function CommunitySearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="search-container">
      <div className="search-icon-wrapper">
        <Search className="w-5 h-5 text-[#A0A0B8]" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search community posts, tags, or users..."
        className="search-input"
      />
    </div>
  );
}
