"use client";

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from './TopNav';
import { BottomPlayer } from '../BottomPlayer';
import { SubscriptionGuard } from '@/lib/SubscriptionGuard';

import { SongContextMenuProvider } from '@/components/context-menu/SongContextMenuProvider';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionGuard>
      <SongContextMenuProvider>
        <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden text-[var(--color-text-primary)]">
          
          {/* Left Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            
            {/* Scrollable Container (accounts for bottom player) */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32 relative">
              
              {/* Top Navigation */}
              <TopNav />
              
              {/* Page Content */}
              <main className="p-6 lg:p-8 min-w-0">
                {children}
              </main>
              
            </div>
            
          </div>
          
          {/* Global Bottom Player */}
          <BottomPlayer />
          
        </div>
      </SongContextMenuProvider>
    </SubscriptionGuard>
  );
}
