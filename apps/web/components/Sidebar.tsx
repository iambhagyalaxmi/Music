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
  Music
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Library', href: '/library', icon: Heart },
    { name: 'Friends', href: '/friends', icon: Users, badge: 3 },
    { name: 'Community', href: '/community', icon: MessageSquare, badge: 7 },
    { name: 'Rooms', href: '/rooms', icon: Radio },
    { name: 'Activity', href: '/activity', icon: Activity },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="dashboard-sidebar-left hidden lg:flex w-64 flex-col gap-4">
      {/* Logo */}
      <div className="bg-[var(--color-surface)] py-4 px-6 rounded-[var(--radius-lg)] shadow-md flex items-center gap-2">
        <Music className="text-[var(--color-accent-pink)]" size={28} />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-accent-pink)] to-[#ff8a00] bg-clip-text text-transparent">
          SoundSphere
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-lg)] shadow-md flex-1">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md font-bold transition-all duration-300 relative group overflow-hidden",
                    isActive 
                      ? "text-white bg-white/10"
                      : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5"
                  )}
                >
                  {/* Active Indicator Line */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-accent-pink)] rounded-r-md shadow-[0_0_8px_rgba(255,20,147,0.8)]" />
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Icon 
                      size={20} 
                      className={cn(
                        "transition-all duration-300",
                        isActive ? "text-[var(--color-accent-pink)] drop-shadow-[0_0_8px_rgba(255,20,147,0.5)]" : "group-hover:text-[var(--color-accent-pink)] group-hover:drop-shadow-[0_0_8px_rgba(255,20,147,0.5)]"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="bg-[var(--color-accent-pink)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
