"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';
import { useMusicStore } from '@/lib/store/useMusicStore';
import { useAuth } from '@/lib/AuthContext';

// Components (We will create these next)
import { LibraryHero } from '@/components/library/LibraryHero';
import { QuickStats } from '@/components/library/QuickStats';
import { LibraryQuickActions } from '@/components/library/LibraryQuickActions';
import { ContinueListening } from '@/components/library/ContinueListening';
import { LibraryFilters } from '@/components/library/LibraryFilters';
import { LikedSongsGrid } from '@/components/library/LikedSongsGrid';
import { LibraryPlaylists } from '@/components/library/LibraryPlaylists';
import { LibraryAlbums } from '@/components/library/LibraryAlbums';
import { LibraryArtists } from '@/components/library/LibraryArtists';
import { DownloadsTracker } from '@/components/library/DownloadsTracker';
import { ListeningHistoryTimeline } from '@/components/library/ListeningHistoryTimeline';
import { LibraryRecommendations } from '@/components/library/LibraryRecommendations';

export default function LibraryPage() {
  const { playSong } = useMusicStore();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Recently Added');

  // Fetch History Data (for Continue Listening, Recently Played, Timeline)
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['ytmusic-history'],
    queryFn: async () => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/ytmusic/history`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    }
  });

  // Fetch Explore Data (for Recommendations)
  const { data: exploreData } = useQuery({
    queryKey: ['ytmusic-explore'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/ytmusic/explore`);
      if (!res.ok) throw new Error('Failed to fetch explore data');
      return res.json();
    }
  });

  // Data processing
  const historyItems = Array.isArray(historyData) ? historyData : (historyData?.items || []);
  const exploreItems = Array.isArray(exploreData) ? exploreData : (exploreData?.items || []);
  
  // Deduplicate helper
  const deduplicate = (items: any[]) => {
    const seen = new Set();
    return items.filter(item => {
      const id = item.trackId || item.metadata?.videoId || item.videoId || item.title || item.id;
      if (!id) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  const uniqueHistory = deduplicate(historyItems);

  // Mocks / Derived for now
  const likedSongs = uniqueHistory.slice(0, 12);
  const playlists: any[] = []; // To be replaced with actual API when ready
  const albums: any[] = []; 
  const artists: any[] = [];
  const downloads: any[] = [];

  const handlePlay = (song: any) => {
    playSong({
      trackId: song.trackId || song.videoId || song.id,
      title: song.title || 'Unknown Title',
      artist: song.artist || 'Unknown Artist',
      cover: song.cover || song.thumbnail,
      duration: 240
    });
  };

  const stats = {
    songs: uniqueHistory.length,
    playlists: playlists.length,
    albums: new Set(uniqueHistory.map((s: any) => s.album).filter(Boolean)).size,
    artists: new Set(uniqueHistory.map((s: any) => s.artist).filter(Boolean)).size,
    hours: Math.round(uniqueHistory.reduce((acc, curr: any) => acc + (curr.duration ? parseInt(curr.duration.split(':')[0]) || 0 : 3), 0) / 60) || 0,
    downloads: downloads.length
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[48px] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[32px] pb-24">
        
        {/* 1. Hero & Stats */}
        <LibraryHero user={user} stats={stats} history={uniqueHistory} />
        <QuickStats stats={stats} />
        
        {/* 2. Actions & Filters */}
        <LibraryQuickActions />
        <div className="sticky top-[72px] z-30 bg-[rgba(9,9,11,0.9)] backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-[32px] lg:px-[32px] border-b border-[#262C3A]">
          <LibraryFilters currentFilter={filter} setFilter={setFilter} sort={sort} setSort={setSort} />
        </div>

        {/* 3. Core Content */}
        {(filter === 'All' || filter === 'Songs') && (
          <>
            <ContinueListening history={uniqueHistory} onPlay={handlePlay} />
            <LikedSongsGrid songs={likedSongs} onPlay={handlePlay} />
          </>
        )}

        {(filter === 'All' || filter === 'Playlists') && (
          <LibraryPlaylists playlists={playlists} onPlay={handlePlay} />
        )}

        {(filter === 'All' || filter === 'Albums') && (
          <LibraryAlbums albums={albums} onPlay={handlePlay} />
        )}

        {(filter === 'All' || filter === 'Artists') && (
          <LibraryArtists artists={artists} />
        )}

        {(filter === 'All' || filter === 'Downloads') && (
          <DownloadsTracker downloads={downloads} onPlay={handlePlay} />
        )}

        {/* 4. History & Discovery */}
        {filter === 'All' && (
          <>
            <ListeningHistoryTimeline history={historyItems} onPlay={handlePlay} />
            <LibraryRecommendations recommendations={exploreItems.slice(0, 10)} onPlay={handlePlay} />
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
