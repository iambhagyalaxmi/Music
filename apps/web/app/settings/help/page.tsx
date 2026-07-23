"use client";

import React from 'react';
import { HelpCircle, MessageCircle, FileText, Globe, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <HelpCircle className="text-green-400" size={32} />
          Help & Support
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Need assistance? Find answers or get in touch with our support team.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: 'FAQ & Knowledge Base', desc: 'Browse articles on how to use SoundSphere.', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Community Forums', desc: 'Ask questions and share tips with other users.', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { title: 'Contact Support', desc: 'Send a message to our customer service team.', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
          { title: 'Report a Bug', desc: 'Found an issue? Let our engineering team know.', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className="flex flex-col items-start text-left p-6 rounded-2xl border border-[#2A2A3C] bg-[#11111A] hover:bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.1)] transition-all group">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg, item.color)}>
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-white text-lg">{item.title}</h3>
              <p className="text-sm text-[#A0A0B8] mt-1">{item.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">SoundSphere Version</h3>
          <p className="text-xs text-[#6B6B85] mt-1">v2.4.1 (Build 8942) • Latest version installed</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-white text-sm font-semibold hover:bg-[rgba(255,255,255,0.1)] transition-colors">
          Check for Updates
        </button>
      </div>
    </div>
  );
}
