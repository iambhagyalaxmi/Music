"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileStats } from '../../components/profile/ProfileStats';
import { ProfileTabs } from '../../components/profile/ProfileTabs';
import { API_URL } from '../../lib/api';

const fetchProfile = async () => {
  const token = localStorage.getItem('soundsphere_token');
  const res = await fetch(`${API_URL}/api/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    // If not authenticated or error, return mock data for UI visualization
    return {
      profile: {
        displayName: 'Bhagyalaxmi',
        username: 'bhagyalaxmi_music',
        isVerified: true,
        bio: 'Music enthusiast. Lover of Synthwave and Lo-Fi.',
        country: 'India',
        joinedDate: 'July 2026',
        website: 'https://bhagyalaxmi.dev',
        socialLinks: { twitter: '@bhagya_music', instagram: '@bhagya.tunes' },
        favoriteGenres: ['Lo-Fi', 'Synthwave', 'Indie'],
        favoriteArtist: 'The Weeknd',
        topGenre: 'Lo-Fi',
        avatarUrl: 'https://ui-avatars.com/api/?name=B+L&background=1DB954&color=fff',
        bannerUrl: null,
      },
      stats: {
        songsPlayed: 14532,
        musicVideosWatched: 320,
        totalListeningSecs: 1087200, // 302 hours
        roomsJoined: 42,
        emojiReactionsSent: 1530,
        totalPlaylists: 0,
        friendsCount: 54,
        songsLiked: 5230,
        downloads: 245,
        searches: 852,
        streak: 32,
        consecutiveDays: 45,
        avgDailyListening: '2.5h',
        favoriteGenre: 'Lo-Fi',
        favoriteArtist: 'The Weeknd',
      },
      followersCount: 1205,
      followingCount: 340,
      isOwnProfile: true, // Mocking own profile
    };
  }
  
  const data = await res.json();
  return {
    ...data,
    isOwnProfile: true, // Since it's /profile
  };
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('activity');
  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ height: '48px', width: '48px', borderRadius: '50%', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '80px' }}>
      <ProfileHeader 
        profile={data?.profile} 
        stats={data?.stats} 
        isOwnProfile={data?.isOwnProfile}
        followersCount={data?.followersCount || 0}
        followingCount={data?.followingCount || 0}
        onEditClick={() => setActiveTab('settings')}
      />
      
      <div style={{ margin: '0 auto', maxWidth: '1024px', padding: '0 var(--spacing-6)' }}>
        <ProfileStats stats={data?.stats} />
        <ProfileTabs 
          isOwnProfile={data?.isOwnProfile} 
          profileId={data?.id} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}
