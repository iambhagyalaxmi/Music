"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { TrendingSongs } from '@/components/dashboard/TrendingSongs';
import { Search } from 'lucide-react';

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
        
        {/* Header Section */}
        <section className="relative rounded-2xl overflow-hidden p-8 min-h-[200px] flex flex-col justify-end shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-pink)] to-purple-600 opacity-20" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Discover New Music</h1>
            <p className="text-[var(--color-text-secondary)]">Explore the latest hits, personalized recommendations, and trending tracks.</p>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
              <Recommendations />
            </section>
          </div>

          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Trending Now</h2>
              {/* Passing undefined to TrendingSongs will make it render a skeleton state, 
                  until we fetch real data here in the future */}
              <TrendingSongs trending={[]} />
            </section>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
