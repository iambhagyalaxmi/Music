"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { useActivityQueries, useActivitySocket } from '@/components/activity/hooks';
import { ActivityHero } from '@/components/activity/ActivityHero';
import { ActivityStats } from '@/components/activity/ActivityStats';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { ActivityHeatmap } from '@/components/activity/ActivityHeatmap';
import { ListeningHistory } from '@/components/activity/ListeningHistory';
import { WeeklySummary } from '@/components/activity/WeeklySummary';
import { FriendsActivity } from '@/components/activity/FriendsActivity';
import { RecentlyPlayedTogether } from '@/components/activity/RecentlyPlayedTogether';
import { Recommendations } from '@/components/activity/Recommendations';
import { ActivityEmptyState } from '@/components/activity/ActivityEmptyState';
import { Loader2 } from 'lucide-react';

export default function ActivityPage() {
  useActivitySocket(); // Initialize real-time tracking
  
  const { 
    stats, 
    timeline, 
    friendsActivity, 
    heatmap, 
    recentTogether, 
    recommendations 
  } = useActivityQueries();

  const isLoading = timeline.isLoading || stats.isLoading;
  const hasNoData = !isLoading && (!timeline.data || timeline.data.length === 0);

  return (
    <SubscriptionGuard>
      <DashboardLayout>
        <div className="flex-1 flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
          
          <h1 className="text-2xl font-bold sr-only">Activity</h1>
          
          <ActivityHero />
          
          <div className="mt-8">
            <ActivityStats stats={stats.data || undefined} />
          </div>

          {isLoading ? (
            <div className="flex justify-center p-20">
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
            </div>
          ) : hasNoData ? (
            <div className="mt-8">
              <ActivityEmptyState />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Feed (Left Column) */}
              <div className="col-span-1 lg:col-span-8 flex flex-col gap-8">
                <ActivityFilters />
                
                <ActivityTimeline items={timeline.data} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  <ListeningHistory history={[]} /> {/* Need an endpoint for history list, fallback to empty */}
                  <WeeklySummary summary={undefined} />
                </div>
                
                <ActivityHeatmap data={heatmap.data} />
              </div>

              {/* Sidebar (Right Column) */}
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
                <FriendsActivity activity={friendsActivity.data} />
                <RecentlyPlayedTogether sessions={recentTogether.data} />
                <Recommendations items={recommendations.data} />
              </div>

            </div>
          )}

        </div>
      </DashboardLayout>
    </SubscriptionGuard>
  );
}
