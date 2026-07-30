"use client";

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ActivityPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
        <section className="relative rounded-3xl overflow-hidden p-8 min-h-[300px] flex flex-col justify-center items-center text-center shadow-xl border border-white/5 bg-[var(--color-surface)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-pink)]/10 to-orange-500/10 opacity-50" />
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Activity</h1>
            <p className="text-[var(--color-text-secondary)] text-lg max-w-lg mx-auto">
              This page is currently under construction. Check back soon for your listening history and friend updates.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
