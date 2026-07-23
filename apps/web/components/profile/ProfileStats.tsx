import React from 'react';
import { motion } from 'framer-motion';
import { Play, Video, Clock, ListMusic, Users, Headphones, Heart, Download, Search, Flame, Calendar, Activity, Music, Mic } from 'lucide-react';

interface ProfileStatsProps {
  stats: any;
}

const formatNumber = (num: number) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatTime = (secs: number) => {
  if (!secs) return '0h';
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours} hours`;
  if (minutes > 0) return `${minutes}m`;
  return '0h';
};

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { label: 'Songs Played', value: formatNumber(stats?.songsPlayed), icon: Play, color: '#1DB954' },
    { label: 'Videos Watched', value: formatNumber(stats?.musicVideosWatched), icon: Video, color: '#FF4D8D' },
    { label: 'Listening Time', value: formatTime(stats?.totalListeningSecs), icon: Clock, color: '#8B5CF6' },
    { label: 'Total Playlists', value: formatNumber(stats?.totalPlaylists), icon: ListMusic, color: '#3B82F6' },
    { label: 'Friends', value: formatNumber(stats?.friendsCount), icon: Users, color: '#3DD68C' },
    { label: 'Rooms Joined', value: formatNumber(stats?.roomsJoined), icon: Headphones, color: '#F5B93D' },
    { label: 'Songs Liked', value: formatNumber(stats?.songsLiked), icon: Heart, color: '#EF4444' },
    { label: 'Downloads', value: formatNumber(stats?.downloads), icon: Download, color: '#10B981' },
    { label: 'Searches', value: formatNumber(stats?.searches), icon: Search, color: '#6366F1' },
    { label: 'Streak', value: `${stats?.streak || 0} Days`, icon: Flame, color: '#F97316' },
    { label: 'Consecutive Days', value: formatNumber(stats?.consecutiveDays), icon: Calendar, color: '#EC4899' },
    { label: 'Avg Daily', value: `${formatTime(stats?.avgDailyListening)}/day`, icon: Activity, color: '#14B8A6' },
    { label: 'Favorite Genre', value: stats?.favoriteGenre || 'N/A', icon: Music, color: '#D946EF' },
    { label: 'Favorite Artist', value: stats?.favoriteArtist || 'N/A', icon: Mic, color: '#F43F5E' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--spacing-4)' }}
    >
      {statItems.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            variants={item}
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', backgroundColor: 'var(--color-surface)', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background-color 0.2s, border-color 0.2s', cursor: 'default' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-2)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            }}
          >
            <div style={{ marginBottom: '12px', display: 'inline-flex', borderRadius: '12px', backgroundColor: stat.color, padding: '10px', color: '#fff', boxShadow: `0 4px 12px ${stat.color}40` }}>
              <Icon size={20} />
            </div>
            <div style={{ marginTop: '4px', fontSize: '1.5rem', fontWeight: '900', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={String(stat.value)}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-secondary)' }}>{stat.label}</div>
            
            {/* Glossy overlay effect */}
            <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to top right, rgba(255,255,255,0), rgba(255,255,255,0.05), rgba(255,255,255,0))', opacity: 0, transition: 'opacity 0.5s' }} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
