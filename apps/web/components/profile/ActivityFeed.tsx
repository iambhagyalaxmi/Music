import React, { useState } from 'react';
import { PlayCircle, ListPlus, Radio, UserPlus, Heart } from 'lucide-react';

const ACTIVITIES = [
  {
    id: 1,
    type: 'listen',
    title: 'Listened to "Midnight City"',
    subtitle: 'by M83',
    time: '2 hours ago',
    icon: PlayCircle,
    color: 'var(--color-primary)',
    bgColor: 'rgba(255, 77, 141, 0.1)',
  },
  {
    id: 2,
    type: 'playlist',
    title: 'Created a new playlist',
    subtitle: '"Late Night Drives"',
    time: '5 hours ago',
    icon: ListPlus,
    color: '#9D4EDD', // accent-purple
    bgColor: 'rgba(157, 78, 221, 0.1)',
  },
  {
    id: 3,
    type: 'room',
    title: 'Started a listening room',
    subtitle: 'Friday Chill Vibes',
    time: '1 day ago',
    icon: Radio,
    color: '#1DB954', // accent-green
    bgColor: 'rgba(29, 185, 84, 0.1)',
  },
  {
    id: 4,
    type: 'friend',
    title: 'Became friends with',
    subtitle: 'Sarah Miller',
    time: '2 days ago',
    icon: UserPlus,
    color: '#3B82F6', // blue
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  {
    id: 5,
    type: 'like',
    title: 'Liked the album',
    subtitle: '"After Hours" by The Weeknd',
    time: '3 days ago',
    icon: Heart,
    color: '#EF4444', // red
    bgColor: 'rgba(239, 68, 68, 0.1)',
  }
];

export function ActivityFeed() {
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Recent Activity</h3>
      
      <div style={{ position: 'relative' }}>
        {/* Vertical line connecting timeline items */}
        <div style={{ position: 'absolute', top: '24px', bottom: '24px', left: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>
        
        {ACTIVITIES.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: index === ACTIVITIES.length - 1 ? 0 : 'var(--spacing-6)', position: 'relative', zIndex: 1 }}>
              
              {/* Icon Container */}
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: activity.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '4px solid #09090B' }}>
                <Icon size={20} style={{ color: activity.color }} />
              </div>

              {/* Content Card */}
              <div style={{ 
                flex: 1, 
                backgroundColor: selectedActivityId === activity.id ? 'rgba(255,255,255,0.02)' : 'var(--color-surface)', 
                padding: 'var(--spacing-4)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid',
                borderColor: selectedActivityId === activity.id ? activity.color : 'var(--color-border)', 
                transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s', 
                cursor: 'pointer',
                transform: selectedActivityId === activity.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: selectedActivityId === activity.id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }} 
                   onClick={() => setSelectedActivityId(activity.id)}
                   onMouseEnter={(e) => { 
                     if (selectedActivityId !== activity.id) {
                       e.currentTarget.style.transform = 'translateY(-2px)'; 
                       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; 
                       e.currentTarget.style.borderColor = activity.color; 
                     }
                   }}
                   onMouseLeave={(e) => { 
                     if (selectedActivityId !== activity.id) {
                       e.currentTarget.style.transform = 'translateY(0)'; 
                       e.currentTarget.style.boxShadow = 'none'; 
                       e.currentTarget.style.borderColor = 'var(--color-border)'; 
                     }
                   }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>{activity.title}</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>{activity.subtitle}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                    {activity.time}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
