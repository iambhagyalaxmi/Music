"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { CommunitySearchBar } from '../../components/community/CommunitySearchBar';
import { CommunityFeed } from '../../components/community/CommunityFeed';
import { TrendingSongs } from '../../components/community/TrendingSongs';
import { TrendingVideos } from '../../components/community/TrendingVideos';
import './community.css';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('trending');

  return (
    <SubscriptionGuard>
      <div className="community-container flex-col lg:flex-row pb-20 lg:pb-0">
        
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo-container">
            <h1 className="sidebar-logo">SoundSphere</h1>
          </div>
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              <li>
                <Link href="/dashboard" className="sidebar-link">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/community" className="sidebar-link active">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/friends" className="sidebar-link">
                  Friends
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="sidebar-link">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/profile" className="sidebar-link">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="sidebar-link">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content w-full flex-1">
          <header className="page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Community</h2>
            <CommunitySearchBar />
          </header>
          
          <div className="community-grid">
            {/* Left Column: Feed */}
            <div className="feed-column">
              <div className="feed-header">
                <div className="feed-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'latest' ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTab('latest')}
                  >
                    Latest
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'trending' ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTab('trending')}
                  >
                    Trending
                  </button>
                </div>
              </div>
              <CommunityFeed activeTab={activeTab} />
            </div>

            {/* Right Column: Widgets */}
            <div className="widgets-column">
              <TrendingSongs />
              <TrendingVideos />
            </div>
          </div>
        </main>
      </div>
    </SubscriptionGuard>
  );
}

