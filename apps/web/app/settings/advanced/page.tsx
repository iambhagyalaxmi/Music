"use client";

import React, { useState } from 'react';
import { Settings, Cpu, Terminal, RefreshCw, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdvancedSettingsPage() {
  const [settings, setSettings] = useState({
    hardwareAcceleration: true,
    developerMode: false,
    diagnosticLogging: false,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Settings className="text-gray-400" size={32} />
          Advanced
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Developer options, hardware acceleration, and experimental features.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Cpu size={20} className="text-gray-400" />
          Performance
        </h3>
        
        <div className="space-y-6">
          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <p className="font-semibold text-white group-hover:text-gray-300 transition-colors">Hardware Acceleration</p>
              <p className="text-sm text-[#A0A0B8] max-w-lg">Use your GPU for smoother animations and audio processing. Disabling this may resolve graphical glitches.</p>
            </div>
            <div className="relative inline-flex items-center">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.hardwareAcceleration}
                onChange={(e) => setSettings({...settings, hardwareAcceleration: e.target.checked})}
              />
              <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:border-gray-800"></div>
            </div>
          </label>

          <div className="pt-4 border-t border-[#2A2A3C] flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Reset App Cache</p>
              <p className="text-sm text-[#A0A0B8]">Clear temporary images, scripts, and interface data.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-semibold transition-colors">
              <RefreshCw size={16} /> Clear Cache
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-2">
          <Terminal size={20} />
          Developer Options
        </h3>
        <p className="text-sm text-[#A0A0B8] mb-6">These options are intended for developers and can cause instability.</p>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <p className="font-semibold text-white group-hover:text-orange-300 transition-colors">Enable Developer Mode</p>
            <div className="relative inline-flex items-center">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.developerMode}
                onChange={(e) => setSettings({...settings, developerMode: e.target.checked})}
              />
              <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </div>
          </label>

          {settings.developerMode && (
            <div className="pt-4 animate-in slide-in-from-top-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-semibold text-white">Verbose Diagnostic Logging</p>
                  <p className="text-xs text-orange-200/50">Writes extensive logs to the console for debugging playback issues.</p>
                </div>
                <div className="relative inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.diagnosticLogging}
                    onChange={(e) => setSettings({...settings, diagnosticLogging: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
