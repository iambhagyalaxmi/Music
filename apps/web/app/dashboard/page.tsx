"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { API_URL } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import { HeroSection } from '@/components/dashboard/HeroSection';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ContinueListening } from '@/components/dashboard/ContinueListening';
import { TrendingSongs } from '@/components/dashboard/TrendingSongs';
import { FriendActivity } from '@/components/dashboard/FriendActivity';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { WeeklySummary } from '@/components/dashboard/WeeklySummary';
import { RecentlyPlayedList } from '@/components/dashboard/RecentlyPlayedList';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, token } = useAuth();

  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [friendsActivity, setFriendsActivity] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Recently Played
        const historyRes = await fetch(`${API_URL}/api/ytmusic/history`, { headers });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          const items = historyData.items || [];
          const seen = new Set();
          const uniqueItems = items.filter((item: any) => {
            const id = item.metadata?.videoId || item.videoId || item.title || item.id;
            if (!id) return true;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });

          setRecentlyPlayed(uniqueItems.map((item: any) => ({
            id: item.id,
            trackId: item.metadata?.videoId || item.videoId,
            title: item.title,
            artist: item.artist,
            time: new Date(item.createdAt).toLocaleDateString(),
            cover: item.cover,
            duration: 240
          })));
        }

        // 2. Fetch Friends Activity
        const friendsRes = await fetch(`${API_URL}/api/community-social/friends-activity`, { headers });
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriendsActivity(friendsData.map((f: any) => ({
            id: f.user.id,
            name: f.user.displayName || f.user.username,
            listeningTo: f.currentlyPlaying ? `${f.currentlyPlaying.title}` : (f.isOnline ? 'Online' : 'Offline'),
            status: f.isOnline ? (f.currentlyPlaying ? 'Listening solo' : 'In a room') : 'Offline',
            avatar: f.user.avatarUrl || `https://ui-avatars.com/api/?name=${f.user.displayName || f.user.username}&background=random`
          })));
        }

        // 3. Fetch Trending
        const exploreRes = await fetch(`${API_URL}/api/ytmusic/explore?category=trending`, { headers });
        if (exploreRes.ok) {
          const exploreData = await exploreRes.json();
          setTrending([
            {
              id: 1,
              title: 'Global Top 50',
              playlist: exploreData.items.map((i: any) => ({
                trackId: i.trackId,
                songTitle: i.title,
                artist: i.artist,
                cover: i.cover
              }))
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-12 h-12 border-4 border-[var(--color-accent-pink)] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <DashboardLayout>
      {/* 1. Hero Section */}
      <HeroSection recentlyPlayed={recentlyPlayed} />

      {/* 2. Quick Stats */}
      <QuickStats friendsOnline={friendsActivity.filter(f => f.status !== 'Offline').length} />

      {/* 3. Continue Listening Carousel */}
      <ContinueListening recentlyPlayed={recentlyPlayed} />

      {/* 4. Split View: Trending & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        
        {/* Left Col (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Trending Songs</h2>
              <button className="text-sm text-[var(--color-accent-pink)] hover:underline font-bold">View All</button>
            </div>
            <TrendingSongs trending={trending} />
          </section>

          <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
            <Recommendations />
          </section>

        </div>

        {/* Right Col (1/3 width on large screens) */}
        <div className="flex flex-col gap-10">
          
          <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              Friends Activity <span className="bg-[var(--color-accent-pink)] text-white text-xs px-2 py-0.5 rounded-full">{friendsActivity.filter(f => f.status !== 'Offline').length}</span>
            </h2>
            <FriendActivity friendsActivity={friendsActivity} />
          </section>

          <WeeklySummary />

          <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Recently Played</h2>
            <RecentlyPlayedList recentlyPlayed={recentlyPlayed} />
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}
