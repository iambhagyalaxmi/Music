"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs } from '@/components/profile/ProfileTabs';
import { MusicIdentityCard } from '@/components/profile/MusicIdentityCard';
import { NowPlayingSidebar } from '@/components/profile/NowPlayingSidebar';
import { ProfileCompletion } from '@/components/profile/ProfileCompletion';
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const { profile, stats } = useProfileQueries();
  const { timeline, heatmap } = useActivityQueries();

  if (profile.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/10 border-t-pink-500 rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (profile.error) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-center p-6 bg-[#111118] border border-white/5 rounded-2xl">
            <h2 className="text-white text-xl font-bold mb-2">Profile Unavailable</h2>
            <p className="text-gray-400">Failed to load your profile or you are not logged in.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
        
        {/* Top Header Area */}
        <ProfileHero profile={profile.data?.profile} isOwnProfile={true} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MusicIdentityCard />
          </div>
          <div className="md:col-span-1">
            <ProfileCompletion />
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

            {/* Placeholder for other tabs */}
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
