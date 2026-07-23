"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ProfileHeader } from '../../../components/profile/ProfileHeader';
import { ProfileStats } from '../../../components/profile/ProfileStats';
import { ProfileTabs } from '../../../components/profile/ProfileTabs';
import { API_URL } from '../../../lib/api';

const fetchUserProfile = async (username: string) => {
  const res = await fetch(`${API_URL}/api/profile/${username}`);
  if (!res.ok) {
    throw new Error('Profile not found');
  }
  return res.json();
};

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState('activity');

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchUserProfile(username),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090B]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2A2A3C] border-t-[#1DB954]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#09090B] text-white">
        <h1 className="text-4xl font-black text-[#1DB954]">404</h1>
        <p className="mt-2 text-[#A0A0B8]">User not found or profile is private.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] pb-20">
      <ProfileHeader 
        profile={data?.profile} 
        stats={data?.stats} 
        isOwnProfile={false}
        followersCount={data?.followersCount || 0}
        followingCount={data?.followingCount || 0}
      />
      
      <div className="mx-auto max-w-5xl px-6">
        <ProfileStats stats={data?.stats} />
        <ProfileTabs isOwnProfile={false} profileId={data?.id} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
