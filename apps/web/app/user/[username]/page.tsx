"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { MusicIdentityCard } from '@/components/profile/MusicIdentityCard';
import { NowPlayingSidebar } from '@/components/profile/NowPlayingSidebar';
import { ListeningStreak } from '@/components/profile/ListeningStreak';
import { MusicTaste } from '@/components/profile/MusicTaste';
import { SongOfTheWeek } from '@/components/profile/SongOfTheWeek';
import { MonthlyWrapped } from '@/components/profile/MonthlyWrapped';
import { RecentlyPlayed } from '@/components/profile/RecentlyPlayed';
import { FavoriteArtists } from '@/components/profile/FavoriteArtists';
import { FavoriteAlbums } from '@/components/profile/FavoriteAlbums';
import { TopDevices } from '@/components/profile/TopDevices';
import { ConnectedAccounts } from '@/components/profile/ConnectedAccounts';
import { ListeningCalendar } from '@/components/profile/ListeningCalendar';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { ActivityHeatmap } from '@/components/activity/ActivityHeatmap';
import { useProfileQueries } from '@/components/profile/hooks';
import { useActivityQueries } from '@/components/activity/hooks';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [activeTab, setActiveTab] = useState('Overview');
  const { profile, stats } = useProfileQueries(username);
  const { timeline, heatmap } = useActivityQueries(); // Assuming we use same hooks for now

  if (profile.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (profile.error || !profile.data) {
    return (
      <DashboardLayout>
        <div className="flex h-screen flex-col items-center justify-center bg-[#09090B] text-white">
          <h1 className="text-4xl font-black text-pink-500">404</h1>
          <p className="mt-2 text-gray-400">User not found or profile is private.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
        
        {/* Top Header Area */}
        <ProfileHero profile={profile.data?.profile} isOwnProfile={false} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <MusicIdentityCard />
          </div>
        </div>
        
        <div className="mt-8">
          <ProfileStats stats={stats.data} />
        </div>
        
        <div className="mt-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* 70/30 Grid Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (70%) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-10">
            {activeTab === 'Overview' && (
              <>
                <SongOfTheWeek />
                <RecentlyPlayed />
                <FavoriteArtists />
                <FavoriteAlbums />
              </>
            )}

            {activeTab === 'Activity' && (
              <>
                <MonthlyWrapped />
                <ActivityHeatmap data={heatmap.data} />
                <ListeningCalendar />
                <div className="mt-4">
                  <ActivityTimeline items={timeline.data} />
                </div>
              </>
            )}

            {activeTab !== 'Overview' && activeTab !== 'Activity' && (
              <div className="p-8 bg-[#111118] border border-white/5 rounded-2xl flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Content for {activeTab} will appear here.</p>
              </div>
            )}
          </div>
          
          {/* Right Column (30%) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <NowPlayingSidebar />
            <ListeningStreak />
            <MusicTaste />
            <TopDevices />
            <ConnectedAccounts />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
