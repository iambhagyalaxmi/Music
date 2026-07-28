import React from 'react';
import { SettingsSidebar } from '../../components/settings/SettingsSidebar';
import { SettingsProvider } from '../../components/settings/SettingsContext';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <div className="flex flex-col lg:flex-row h-screen lg:h-screen bg-[#09090B] overflow-hidden">
        <SettingsSidebar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12 bg-gradient-to-b from-[#09090B] to-[#11111A]">
          <div className="mx-auto max-w-5xl pb-24">
            {children}
          </div>
        </main>
      </div>
    </SettingsProvider>
  );
}
