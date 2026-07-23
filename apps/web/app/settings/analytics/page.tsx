"use client";

import React from 'react';
import { BarChart, Download, Trash2, Clock, Music, Disc } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <BarChart className="text-orange-400" size={32} />
          Data & Analytics
        </h2>
        <p className="mt-2 text-[#A0A0B8]">View your lifetime statistics, request your data exports, and manage your history.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Playtime', value: '1,420 hrs', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Tracks Played', value: '14,293', icon: Music, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Top Genre', value: 'Electronic', icon: Disc, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-5 shadow-lg flex flex-col justify-center items-center text-center">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", stat.bg, stat.color)}>
                <Icon size={24} />
              </div>
              <p className="text-[#A0A0B8] text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">Data Management</h3>
        
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">Download Your Data</p>
              <p className="text-sm text-[#A0A0B8] mt-1 max-w-md">Request a copy of your listening history, playlists, and account data in JSON format.</p>
            </div>
            <button className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors">
              <Download size={18} /> Request Export
            </button>
          </div>

          <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white">Clear Listening History</p>
              <p className="text-sm text-[#A0A0B8] mt-1 max-w-md">This will permanently delete your listening history and reset your algorithmic recommendations.</p>
            </div>
            <button className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-bold transition-colors">
              <Trash2 size={18} /> Clear History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
