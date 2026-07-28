import React from 'react';
import { UserPlus, MessageCircle, MoreHorizontal } from 'lucide-react';

const MOCK_FRIENDS = [
  {
    id: 1,
    name: 'Sarah Miller',
    username: '@sarah_m',
    mutualFriends: 12,
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    isOnline: true
  },
  {
    id: 2,
    name: 'Alex Johnson',
    username: '@alexj',
    mutualFriends: 5,
    avatar: 'https://i.pravatar.cc/150?u=alex',
    isOnline: true
  },
  {
    id: 3,
    name: 'David Chen',
    username: '@davidc',
    mutualFriends: 24,
    avatar: 'https://i.pravatar.cc/150?u=david',
    isOnline: false
  },
  {
    id: 4,
    name: 'Emma Roberts',
    username: '@emmar',
    mutualFriends: 8,
    avatar: 'https://i.pravatar.cc/150?u=emma',
    isOnline: false
  },
  {
    id: 5,
    name: 'Lucas Miller',
    username: '@lucasm',
    mutualFriends: 15,
    avatar: 'https://i.pravatar.cc/150?u=lucas',
    isOnline: true
  },
  {
    id: 6,
    name: 'Jessica Wong',
    username: '@jessw',
    mutualFriends: 3,
    avatar: 'https://i.pravatar.cc/150?u=jessica',
    isOnline: false
  }
];

export function ProfileFriends() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0 }}>Friends ({MOCK_FRIENDS.length})</h3>
        <button style={{ backgroundColor: 'transparent', color: 'var(--color-primary)', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} /> Find Friends
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
        {MOCK_FRIENDS.map((friend) => (
          <div key={friend.id} style={{ 
            backgroundColor: 'var(--color-surface)', 
            padding: 'var(--spacing-4)', 
            borderRadius: 'var(--radius-lg)', 
            border: '1px solid var(--color-border)', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s, box-shadow 0.2s', 
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { 
            e.currentTarget.style.transform = 'translateY(-2px)'; 
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; 
          }}
          onMouseLeave={(e) => { 
            e.currentTarget.style.transform = 'translateY(0)'; 
            e.currentTarget.style.boxShadow = 'none'; 
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div style={{ position: 'relative' }}>
                <img src={friend.avatar} alt={friend.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                {friend.isOnline && (
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-accent-green, #1DB954)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>
                  {friend.name}
                </h4>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {friend.mutualFriends} mutual friends
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <button style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                      title="Message"
              >
                <MessageCircle size={18} />
              </button>
              <button style={{ backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                      title="More options"
              >
                <MoreHorizontal size={18} />
              </button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
