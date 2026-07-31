"use client";

import React, { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/api';
import { useMusicStore } from '@/lib/store/useMusicStore';

import { DiscoverHero } from '@/components/discover/DiscoverHero';
import { TrendingList } from '@/components/discover/TrendingList';
import { DiscoverRecommendations } from '@/components/discover/DiscoverRecommendations';
import { PopularArtistsList } from '@/components/discover/PopularArtistsList';
import { NewReleases } from '@/components/discover/NewReleases';
import { GenresSection } from '@/components/discover/GenresSection';
import { MoodPlaylists } from '@/components/discover/MoodPlaylists';
import { MusicVideosList } from '@/components/discover/MusicVideosList';
import { QuickActions } from '@/components/discover/QuickActions';
import { History, Sparkles, Disc, Music } from 'lucide-react';

export default function DiscoverPage() {
  const { playSong } = useMusicStore();

  // 1. Fetch Explore Data
  const { data: exploreData, isLoading: exploreLoading } = useQuery({
    queryKey: ['ytmusic-explore'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/ytmusic/explore`);
      if (!res.ok) throw new Error('Failed to fetch explore data');
      return res.json();
    }
  });

  // 2. Fetch History Data
  const { data: historyData } = useQuery({
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

  // Safely extract arrays from exploreData
  const exploreItems = Array.isArray(exploreData) ? exploreData : (exploreData?.items || []);
  const trendingData = exploreData?.trending || exploreData?.newReleases || exploreItems || [];
  
  // Format trending into expected PremiumSongCard format
  const formattedTrending = (Array.isArray(trendingData) ? trendingData : []).slice(0, 10).map((item: any) => ({
    trackId: item.trackId || item.id || item.videoId,
    title: item.title || item.songTitle || 'Unknown Title',
    artist: item.artist || 'Unknown Artist',
    cover: item.thumbnail || item.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80',
    duration: item.duration || '3:45'
  }));

  const recommendedData = exploreData?.moodPlaylists?.[0]?.playlist || exploreItems || [];
  const formattedRecommendations = (Array.isArray(recommendedData) ? recommendedData : []).slice(0, 8).map((item: any) => ({
    trackId: item.trackId || item.id || item.videoId,
    title: item.title || item.songTitle || 'Unknown Title',
    artist: item.artist || 'Unknown Artist',
    cover: item.thumbnail || item.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80',
    album: item.album || 'Single',
    duration: '3:30'
  }));

  const popularArtists = [
    { id: '1', name: 'Taylor Swift', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png', monthlyListeners: '109M listeners' },
    { id: '2', name: 'The Weeknd', image: 'https://upload.wikimedia.org/wikipedia/commons/9/95/The_Weeknd_Cannes_2023.png', monthlyListeners: '115M listeners' },
    { id: '3', name: 'Arijit Singh', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Arijit_Singh_2019.jpg/800px-Arijit_Singh_2019.jpg', monthlyListeners: '45M listeners' },
    { id: '4', name: 'Bad Bunny', image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Bad_Bunny_at_the_2019_Billboard_Music_Awards.png', monthlyListeners: '78M listeners' },
    { id: '5', name: 'Drake', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Drake_July_2016.jpg/800px-Drake_July_2016.jpg', monthlyListeners: '85M listeners' },
  ];

  // Using new releases or fallback albums
  const newReleasesData = exploreData?.newReleases || exploreItems || [];
  const newReleases = (Array.isArray(newReleasesData) ? newReleasesData : []).slice(0, 6).map((item: any) => ({
    id: item.trackId || item.title || item.id,
    title: item.title || item.songTitle || 'Unknown Album',
    artist: item.artist || 'Unknown Artist',
    cover: item.thumbnail || item.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80',
    year: new Date().getFullYear().toString()
  })) || [];

  // Music Videos
  const musicVideosData = exploreData?.topTrending || exploreItems || [];
  const musicVideos = (Array.isArray(musicVideosData) ? musicVideosData : []).slice(0, 5).map((item: any) => ({
    trackId: item.trackId || item.id || item.videoId,
    title: item.title || item.songTitle || 'Unknown Video',
    artist: item.artist || 'Unknown Artist',
    thumbnail: (item.thumbnail || item.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&q=80').replace('w120-h120', 'w600-h300'),
  })) || [];

  // Recently Played from History API (historyData could be { items: [...] } or an array)
  const historyItems = Array.isArray(historyData) ? historyData : (historyData?.items || []);
  
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
  const recentlyPlayed = uniqueHistory.slice(0, 4).map((item: any) => ({
    trackId: item.trackId || item.metadata?.videoId || item.videoId || item.id,
    title: item.title || 'Unknown Title',
    artist: item.artist || 'Unknown Artist',
    cover: item.cover || item.thumbnail || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80',
    duration: item.duration || '3:00'
  })) || [];

  const handlePlay = (song: any) => {
    playSong({
      trackId: song.trackId,
      title: song.title,
      artist: song.artist,
      cover: song.cover || song.thumbnail,
      duration: 240
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-[48px] w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[32px] pb-24">
        
        {/* 1. Hero Section */}
        <DiscoverHero />

        {/* Quick Actions */}
        <QuickActions />

        {/* 2. Trending Section */}
        <TrendingList trending={formattedTrending} onPlay={handlePlay} />

        {/* 3. Recommended For You */}
        <DiscoverRecommendations recommendations={formattedRecommendations} onPlay={handlePlay} />

        {/* 7. Continue Listening (Recently Played) */}
        {recentlyPlayed.length > 0 && (
          <DiscoverRecommendations 
            title="Continue Listening" 
            subtitle="Jump back in."
            icon={History}
            recommendations={recentlyPlayed} 
            onPlay={handlePlay} 
          />
        )}

        {/* 4. Popular Artists */}
        <PopularArtistsList artists={popularArtists} />

        {/* 5. Recently Released */}
        <NewReleases albums={newReleases} onPlay={handlePlay} />

        {/* Made For You */}
        <DiscoverRecommendations 
          title="Made For You" 
          subtitle="Personalized recommendations."
          icon={Sparkles}
          recommendations={formattedRecommendations.slice().reverse()} 
          onPlay={handlePlay} 
        />

        {/* 10. Albums You May Like */}
        <NewReleases albums={newReleases.slice().reverse()} onPlay={handlePlay} />

        {/* 9. Music Videos */}
        <MusicVideosList videos={musicVideos} onPlay={handlePlay} />

        {/* Top Charts */}
        <DiscoverRecommendations 
          title="Top Charts" 
          subtitle="Top 10 songs this week."
          icon={Music}
          recommendations={formattedTrending.slice(0, 10)} 
          onPlay={handlePlay} 
        />

        {/* 8. Mood Playlists */}
        <MoodPlaylists />
        
        {/* 6. Genres */}
        <GenresSection />
        
      </div>
    </DashboardLayout>
  );
}
