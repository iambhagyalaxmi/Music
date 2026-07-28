import React from 'react';
import { Radio, Users, PlayCircle, Clock, Plus } from 'lucide-react';

const MOCK_ROOMS = [
  {
    id: 1,
    title: 'Friday Chill Vibes',
    host: 'Sarah Miller',
    listeners: 14,
    status: 'Live',
    coverColor: 'linear-gradient(to right, #8a2387, #e94057, #f27121)',
    startedAt: '2 hours ago'
  },
  {
    id: 2,
    title: 'Deep Focus / Coding',
    host: 'Alex Johnson',
    listeners: 42,
    status: 'Live',
    coverColor: 'linear-gradient(to right, #00c6ff, #0072ff)',
    startedAt: '4 hours ago'
  },
  {
    id: 3,
    title: 'Weekend Party Anthems',
    host: 'David Chen',
    listeners: 8,
    status: 'Ended',
    coverColor: 'linear-gradient(to right, #f12711, #f5af19)',
    startedAt: '2 days ago'
  },
  {
    id: 4,
    title: 'Late Night Jazz',
    host: 'Emma Roberts',
    listeners: 112,
    status: 'Ended',
    coverColor: 'linear-gradient(to right, #141e30, #243b55)',
    startedAt: '3 days ago'
  }
];

export function ProfileRooms() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0 }}>Listening Rooms</h3>
        <button style={{ backgroundColor: 'transparent', color: 'var(--color-primary)', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Create Room
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
        {MOCK_ROOMS.map((room) => (
          <div key={room.id} style={{ 
            backgroundColor: 'var(--color-surface)', 
            padding: 'var(--spacing-5)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--color-border)', 
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-4)',
            transition: 'transform 0.2s, box-shadow 0.2s', 
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; 
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = 'none'; 
          }}
          >
            {/* Top colorful accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: room.coverColor }}></div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>
                  {room.title}
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Hosted by {room.host}
                </p>
              </div>
              <span style={{ 
                backgroundColor: room.status === 'Live' ? 'rgba(29, 185, 84, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                color: room.status === 'Live' ? '#1DB954' : 'var(--color-text-secondary)', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {room.status === 'Live' && <Radio size={12} />}
                {room.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <Users size={16} /> {room.listeners}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  <Clock size={16} /> {room.startedAt}
                </span>
              </div>

              {room.status === 'Live' && (
                <button style={{ 
                  backgroundColor: 'var(--color-primary)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '20px', 
                  padding: '6px 16px', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <PlayCircle size={16} /> Join
                </button>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
