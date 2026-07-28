import React from 'react';
import { SettingsCard } from './SettingsCard';

export function ComingSoon({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">{title}</h2>
        <p className="mt-2 text-[#A0A0B8]">{description}</p>
      </div>
      <SettingsCard title="Coming Soon">
        <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
            <Icon size={32} className="text-[#A0A0B8]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Under Construction</h2>
          <p className="text-[#A0A0B8] max-w-md text-sm">
            We are working hard to bring you this feature in a future update.
          </p>
          <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 text-xs font-semibold text-[#A0A0B8] uppercase tracking-wider">
            Coming Soon
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
