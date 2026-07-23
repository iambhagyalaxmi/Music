import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { API_URL } from '../../lib/api';

// Mock API Call - Will integrate with real API
const fetchAchievements = async () => {
  const res = await fetch(`${API_URL}/api/profile/achievements`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` }
  });
  if (!res.ok) {
    // Return mock data for UI testing before backend is fully populated
    return [
      { id: '1', achievement: { name: 'First Song Played', description: 'You listened to your first track!', iconUrl: '🎵', points: 10 } },
      { id: '2', achievement: { name: '100 Songs', description: 'Listened to 100 songs.', iconUrl: '💯', points: 50 } },
      { id: '3', achievement: { name: 'Night Owl', description: 'Listened to music past midnight.', iconUrl: '🦉', points: 20 } },
    ];
  }
  return res.json();
};

export function AchievementsList() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
  });

  if (isLoading) {
    return <div style={{ color: 'var(--color-text-secondary)' }}>Loading achievements...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-4)' }}>
      {achievements?.map((item: any, i: number) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', padding: '16px', transition: 'border-color 0.2s', cursor: 'default' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        >
          <div style={{ display: 'flex', height: '48px', width: '48px', flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(29,185,84,0.1)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>
            {item.achievement.iconUrl || '🏆'}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 'bold', color: '#fff' }}>{item.achievement.name}</h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{item.achievement.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
