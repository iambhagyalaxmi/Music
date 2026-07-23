"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  User, Palette, Bell, Play, Headphones, Mic, MessageSquare, Smartphone, 
  ShieldCheck, Brain, Link as LinkIcon, Download, Globe, CreditCard, 
  BarChart, Settings, HelpCircle, LogOut 
} from 'lucide-react';

const SECTIONS = [
  {
    title: 'Profile & Preferences',
    items: [
      { id: 'account', label: 'Account', icon: User, path: '/settings/account' },
      { id: 'appearance', label: 'Appearance', icon: Palette, path: '/settings/appearance' },
      { id: 'notifications', label: 'Notifications', icon: Bell, path: '/settings/notifications' },
      { id: 'language', label: 'Language & Region', icon: Globe, path: '/settings/language' },
    ]
  },
  {
    title: 'Streaming & Audio',
    items: [
      { id: 'playback', label: 'Playback', icon: Play, path: '/settings/playback' },
      { id: 'audio', label: 'Audio Quality', icon: Headphones, path: '/settings/audio' },
      { id: 'downloads', label: 'Downloads', icon: Download, path: '/settings/downloads' },
    ]
  },
  {
    title: 'Social & Communication',
    items: [
      { id: 'voice', label: 'Voice Chat', icon: Mic, path: '/settings/voice' },
      { id: 'chat', label: 'Chat', icon: MessageSquare, path: '/settings/chat' },
      { id: 'connections', label: 'Connected Accounts', icon: LinkIcon, path: '/settings/connections' },
    ]
  },
  {
    title: 'Security & Data',
    items: [
      { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck, path: '/settings/privacy' },
      { id: 'devices', label: 'Devices', icon: Smartphone, path: '/settings/devices' },
      { id: 'ai', label: 'AI Preferences', icon: Brain, path: '/settings/ai' },
      { id: 'analytics', label: 'Data & Analytics', icon: BarChart, path: '/settings/analytics' },
    ]
  },
  {
    title: 'Billing & Support',
    items: [
      { id: 'subscription', label: 'Subscription', icon: CreditCard, path: '/settings/subscription' },
      { id: 'advanced', label: 'Advanced', icon: Settings, path: '/settings/advanced' },
      { id: 'help', label: 'Help & Support', icon: HelpCircle, path: '/settings/help' },
    ]
  }
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:h-[calc(100vh-80px)] lg:w-72 shrink-0 overflow-x-auto lg:overflow-y-auto lg:border-r border-b lg:border-b-0 border-[rgba(255,255,255,0.05)] bg-[rgba(9,9,11,0.6)] backdrop-blur-xl lg:pb-20 scrollbar-hide z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
      <div className="p-4 lg:p-8 pb-4 hidden lg:block sticky top-0 bg-[rgba(9,9,11,0.8)] backdrop-blur-md z-20 border-b border-[rgba(255,255,255,0.02)]">
        <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Settings</h2>
      </div>

      <div className="flex lg:flex-col p-3 lg:p-4 gap-2 lg:gap-8 lg:space-y-2 w-max lg:w-full">
        {SECTIONS.map((section, i) => (
          <div key={i} className="flex lg:block items-center lg:items-start gap-2">
            <h3 className="hidden lg:flex items-center gap-2 mb-3 px-4 text-xs font-black uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
              {section.title}
              <span className="h-px bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent flex-1 ml-2 block"></span>
            </h3>
            <ul className="flex lg:flex-col lg:space-y-1 gap-2 lg:gap-0">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.path}
                      className={cn(
                        "group flex items-center gap-3 rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap relative overflow-hidden",
                        isActive 
                          ? "bg-gradient-to-r from-[var(--color-accent-pink)]/20 to-[var(--color-accent-pink)]/5 text-[var(--color-accent-pink)] shadow-[inset_2px_0_0_var(--color-accent-pink)] lg:shadow-[inset_3px_0_0_var(--color-accent-pink)]" 
                          : "text-gray-400 bg-white/5 lg:bg-transparent hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {isActive && <div className="absolute inset-0 bg-[var(--color-accent-pink)]/10 blur-xl rounded-full"></div>}
                      <Icon size={18} className={cn(
                        "transition-all duration-300 relative z-10", 
                        isActive ? "text-[var(--color-accent-pink)] drop-shadow-[0_0_8px_rgba(255,77,141,0.5)]" : "group-hover:scale-110"
                      )} />
                      <span className="relative z-10 tracking-wide">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        
        <div className="pt-2 lg:pt-6 lg:mt-4 lg:border-t border-[rgba(255,255,255,0.05)] lg:px-4">
          <button className="flex w-full items-center gap-3 rounded-full lg:rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300 hover:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.2)]">
            <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// Force HMR update
