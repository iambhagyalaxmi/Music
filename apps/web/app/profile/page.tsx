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
    throw new Error('Failed to fetch profile. Please log in.');
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

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>Profile Unavailable</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Failed to load your profile or you are not logged in.</p>
        </div>
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
