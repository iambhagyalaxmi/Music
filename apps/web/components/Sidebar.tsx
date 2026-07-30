"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  Heart, 
  Users, 
  MessageSquare, 
  Radio, 
  Activity, 
  User, 
  Settings,
  Music,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  type NavItem = {
    name: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  };

  type NavGroup = {
    title: string;
    items: NavItem[];
  };

  const navGroups: NavGroup[] = [
    {
      title: 'MAIN',
      items: [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Discover', href: '/discover', icon: Compass },
        { name: 'Library', href: '/library', icon: Heart },
      ]
    },
    {
      title: 'SOCIAL',
      items: [
        { name: 'Friends', href: '/friends', icon: Users, badge: '3' },
        { name: 'Community', href: '/community', icon: MessageSquare, badge: '12' },
        { name: 'Rooms', href: '/rooms', icon: Radio, badge: 'LIVE', badgeColor: 'bg-red-500' },
      ]
    },
    {
      title: 'PERSONAL',
      items: [
        { name: 'Activity', href: '/activity', icon: Activity, badge: '5' },
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Settings', href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex w-[260px] flex-col bg-[#0E1017] border-r border-[#262C3A] h-full shadow-2xl relative z-10 transition-all">
      {/* 1. Logo Area */}
      <div className="py-8 px-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Music className="text-[#FF4D8D]" size={32} />
          <h1 className="text-[26px] font-bold text-white tracking-tight leading-none mt-1">
            SoundSphere
          </h1>
        </div>
        <p className="text-[12px] text-[#A1A1AA] pl-[44px] -mt-1 font-medium">Discover Music Together</p>
      </div>
      
      {/* 2. Navigation */}
      <nav className="flex-1 flex flex-col gap-6 px-4 overflow-y-auto scrollbar-hide pb-4">
        {navGroups.map((group, groupIdx) => (
          <div key={group.title} className="flex flex-col gap-2">
            <h2 className="text-[11px] font-bold text-[#8C93A7] tracking-widest pl-4 mb-2">
              {group.title}
            </h2>
            
            <ul className="flex flex-col gap-[6px]">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={cn(
                        "flex items-center justify-between px-4 h-[44px] rounded-[10px] font-bold transition-all duration-200 relative group",
                        isActive 
                          ? "text-[#FFFFFF] bg-[rgba(255,77,141,0.12)]"
                          : "text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#1A1E29]"
                      )}
                    >
                      {/* Active Left Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#FF4D8D] rounded-l-[10px]" />
                      )}
                      
                      <div className="flex items-center gap-3 transform group-hover:translate-x-1 transition-transform duration-200">
                        <Icon 
                          size={20} 
                          strokeWidth={2.5}
                          className={cn(
                            "transition-transform duration-200 group-hover:rotate-6",
                            isActive ? "text-[#FF4D8D]" : "text-[#A1A1AA] group-hover:text-white"
                          )}
                        />
                        <span className="text-[14px]">{item.name}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={cn(
                          "text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md",
                          item.badgeColor || "bg-[#FF4D8D]"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider after groups except the last one */}
            {groupIdx < navGroups.length - 1 && (
              <div className="h-px bg-[#262C3A] w-full mt-4" />
            )}
          </div>
        ))}
      </nav>

      {/* 3. Footer / User Profile */}
      <div className="p-4 border-t border-[#262C3A] bg-[#0E1017]">
        {user ? (
          <Link href="/profile" className="flex items-center justify-between p-2 hover:bg-[#1A1E29] rounded-[10px] transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <img 
                src={user.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#262C3A] group-hover:border-[#FF4D8D] transition-colors shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm line-clamp-1">{user.profile?.displayName || user.username}</span>
                <span className="text-[#FF4D8D] text-[11px] font-bold tracking-wide uppercase mt-0.5">{user.subscription?.tier === 'PREMIUM' ? 'Premium' : 'Free Plan'}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#A1A1AA] group-hover:text-white transition-colors group-hover:translate-x-1" />
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center gap-1">
            <p className="text-[11px] text-[#A1A1AA] font-medium">Made with ❤️ by SoundSphere</p>
            <p className="text-[10px] text-[#262C3A] font-bold">v1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );
}
