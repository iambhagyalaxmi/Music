"use client";

import React, { useState } from 'react';
import { Download, Trash2, HardDrive, Settings2, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DownloadsSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    audioQuality: 'high',
    storageLimit: 10,
    offlineMode: false,
    downloadOnWifiOnly: true,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Download settings saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Download className="text-[#1DB954]" size={32} />
          Downloads
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Manage your offline music library, download quality, and storage limits.</p>
      </div>

      {/* Storage Management */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HardDrive size={20} className="text-[#1DB954]" />
            Storage Management
          </h3>
          
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">Storage Limit</span>
                <span className="text-[#1DB954] font-bold">{settings.storageLimit} GB</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={settings.storageLimit}
                onChange={(e) => setSettings({...settings, storageLimit: parseInt(e.target.value)})}
                className="w-full h-2 bg-[#2A2A3C] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
              />
              <div className="flex justify-between text-xs text-[#6B6B85] mt-1">
                <span>1 GB</span>
                <span>50 GB</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#2A2A3C] flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Clear All Downloads</p>
                <p className="text-sm text-[#A0A0B8]">Remove all downloaded songs and playlists.</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-[rgba(255,255,255,0.05)] px-4 py-2.5 text-sm font-bold text-[#FF4D8D] transition-all hover:bg-[#FF4D8D]/10 hover:shadow-[0_0_15px_rgba(255,77,141,0.2)]">
                <Trash2 size={16} /> Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Quality & Network */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings2 size={20} className="text-[#4D9FFF]" />
          Quality & Network
        </h3>
        
        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-[#A0A0B8]">Download Audio Quality</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'low', label: 'Low', desc: 'Space saver' },
                { id: 'normal', label: 'Normal', desc: 'Standard' },
                { id: 'high', label: 'High', desc: 'Recommended' },
                { id: 'lossless', label: 'Lossless', desc: 'Best audio' }
              ].map((quality) => (
                <button
                  key={quality.id}
                  onClick={() => setSettings({...settings, audioQuality: quality.id})}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                    settings.audioQuality === quality.id 
                      ? "border-[#4D9FFF] bg-[#4D9FFF]/10 shadow-[0_0_15px_rgba(77,159,255,0.15)]" 
                      : "border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] hover:border-[#4D9FFF]/50"
                  )}
                >
                  <span className={cn("font-bold", settings.audioQuality === quality.id ? "text-[#4D9FFF]" : "text-white")}>
                    {quality.label}
                  </span>
                  <span className="text-xs text-[#6B6B85] mt-1">{quality.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-semibold text-white group-hover:text-[#4D9FFF] transition-colors">Download over Wi-Fi only</p>
                <p className="text-sm text-[#A0A0B8]">Save cellular data by pausing downloads on mobile networks.</p>
              </div>
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.downloadOnWifiOnly}
                  onChange={(e) => setSettings({...settings, downloadOnWifiOnly: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4D9FFF]"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Offline Mode */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.05)] bg-gradient-to-br from-[#11111A] to-[#1A1A27] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-full transition-colors", settings.offlineMode ? "bg-[#1DB954]/20 text-[#1DB954]" : "bg-white/5 text-gray-400")}>
              <WifiOff size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Offline Mode</h3>
              <p className="text-sm text-[#A0A0B8]">Only show music that is downloaded and available offline.</p>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.offlineMode}
              onChange={(e) => setSettings({...settings, offlineMode: e.target.checked})}
            />
            <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-gradient-to-r from-[#1DB954] to-[#1ED760] px-8 py-3 font-bold text-[#09090B] shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
        >
          {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
