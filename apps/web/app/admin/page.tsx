"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';
import { Users, ListMusic, Music } from 'lucide-react';

const fetchOverview = async () => {
  const token = localStorage.getItem('soundsphere_token');
  const res = await fetch(`${API_URL}/api/admin/overview`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch overview');
  return res.json();
};

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: fetchOverview
  });

  if (isLoading) {
    return <div style={{ color: 'var(--color-text-secondary)' }}>Loading overview stats...</div>;
  }

  if (error) {
    return <div style={{ color: '#ff4d4d' }}>Error loading stats. Check if you have admin privileges.</div>;
  }

  const stats = [
    { title: 'Total Users', value: data?.totalUsers || 0, icon: Users, color: 'var(--color-accent-pink)' },
    { title: 'Total Playlists', value: data?.totalPlaylists || 0, icon: ListMusic, color: 'var(--color-accent-purple, #9D4EDD)' },
    { title: 'Cached Songs', value: data?.totalSongs || 0, icon: Music, color: 'var(--color-accent-green)' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: '0 0 var(--spacing-6) 0' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)' }}>{stat.title}</h3>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `color-mix(in srgb, ${stat.color} 10%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-text-primary)' }}>{stat.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
