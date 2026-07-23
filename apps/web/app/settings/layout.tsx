import React from 'react';
import { SettingsSidebar } from '../../components/settings/SettingsSidebar';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:min-h-screen bg-[#09090B] pb-20 lg:pb-0">
      <SettingsSidebar />
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  );
}
