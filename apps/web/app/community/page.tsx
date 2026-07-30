"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { CommunityHero } from '@/components/community/CommunityHero';
import { CommunitySidebarLeft } from '@/components/community/CommunitySidebarLeft';
import { CommunitySidebarRight } from '@/components/community/CommunitySidebarRight';
import { CommunityComposer } from '@/components/community/CommunityComposer';
import { CommunityPostCard } from '@/components/community/CommunityPostCard';
import { CommunityPolls } from '@/components/community/CommunityPolls';
import { CommunityEmptyState } from '@/components/community/CommunityEmptyState';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityNotifications } from '@/components/community/CommunityNotifications';
import { FloatingCreateButton } from '@/components/community/FloatingCreateButton';
import { useCommunityQueries, useCommunitySocket } from '@/components/community/hooks';
import { Loader2 } from 'lucide-react';

export default function CommunityPage() {
  useCommunitySocket(); // Initialize real-time updates
  const { posts, trendingSongs, activeRooms, topContributors } = useCommunityQueries();
  
  const postsList = posts.data || [];

  return (
    <SubscriptionGuard>
      <DashboardLayout>
        <div className="flex-1 flex flex-col pb-20 relative max-w-[1600px] mx-auto w-full">
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold sr-only">Community</h1>
            <div className="w-full max-w-2xl mx-auto flex-1">
              <CommunitySearch />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <CommunityNotifications />
            </div>
          </div>

          <CommunityHero />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <CommunitySidebarLeft activeRooms={activeRooms.data || []} />
            </div>
            
            {/* Center Feed */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
              <CommunityComposer />
              
              {posts.isLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                </div>
              ) : postsList.length === 0 ? (
                <CommunityEmptyState />
              ) : (
                <div className="flex flex-col gap-6">
                  {postsList.map((post: any) => (
                    <CommunityPostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <CommunitySidebarRight trendingSongs={trendingSongs.data || []} topContributors={topContributors.data || []} />
            </div>

          </div>

          <FloatingCreateButton />
        </div>
      </DashboardLayout>
    </SubscriptionGuard>
  );
}
