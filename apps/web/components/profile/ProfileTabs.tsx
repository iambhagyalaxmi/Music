import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Activity, ListMusic, Users, Radio, Settings, Trophy } from 'lucide-react';
import { AchievementsList } from './AchievementsList';
import { ProfileSettings } from './ProfileSettings';

interface ProfileTabsProps {
  isOwnProfile: boolean;
  profileId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: Radio },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

export function ProfileTabs({ isOwnProfile, profileId, activeTab, setActiveTab }: ProfileTabsProps) {

  const tabsToRender = isOwnProfile 
    ? [...TABS, { id: 'settings', label: 'Settings', icon: Settings }] 
    : TABS;

  return (
    <div style={{ marginTop: 'var(--spacing-12)', width: '100%' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 'var(--spacing-2)', overflowX: 'auto', borderBottom: '1px solid var(--color-border)', paddingBottom: '1px' }}>
        {tabsToRender.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', padding: '12px 16px', fontSize: 'var(--text-sm)', fontWeight: '600', color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => !isActive && (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => !isActive && (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Icon size={16} style={{ color: isActive ? 'var(--color-primary)' : 'currentColor', transition: 'transform 0.2s' }} />
              {tab.label}
              
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: 'var(--color-primary)' }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: 'var(--spacing-8)', minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'activity' && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Activity Feed coming soon...</p>
              </div>
            )}
            
            {activeTab === 'playlists' && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Playlists coming soon...</p>
              </div>
            )}
            
            {activeTab === 'friends' && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Friends list coming soon...</p>
              </div>
            )}
            
            {activeTab === 'rooms' && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Rooms history coming soon...</p>
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <AchievementsList />
            )}
            
            {activeTab === 'settings' && isOwnProfile && (
              <ProfileSettings />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
