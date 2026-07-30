import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, History, ListMusic, Heart, Disc, Mic2, Activity, Users, Trophy, Info } from 'lucide-react';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'Overview', icon: LayoutDashboard },
  { id: 'Recently Played', icon: History },
  { id: 'Playlists', icon: ListMusic },
  { id: 'Liked Songs', icon: Heart },
  { id: 'Albums', icon: Disc },
  { id: 'Artists', icon: Mic2 },
  { id: 'Activity', icon: Activity },
  { id: 'Friends', icon: Users },
  { id: 'Achievements', icon: Trophy },
  { id: 'About', icon: Info },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="sticky top-[70px] z-30 bg-[#09090B]/90 backdrop-blur-xl border-b border-white/5 py-2 mt-4">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-pink-500' : 'text-gray-500'} />
              {tab.id}
              
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute inset-0 border border-white/10 bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
