"use client";

import React, { useState } from 'react';
import { Brain, Sparkles, SlidersHorizontal, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AISettingsPage() {
  const [settings, setSettings] = useState({
    aiDjEnabled: true,
    autoPlaylists: true,
    smartTransitions: true,
    discoveryStrictness: 50,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Brain className="text-blue-400" size={32} />
          AI Preferences
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Customize how SoundSphere's AI algorithms recommend songs and analyze your habits.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#11111A] to-blue-900/10 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Mic2 size={100} />
          </div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI DJ Voice
              </h3>
              <p className="text-sm text-[#A0A0B8] mt-2 mb-6 max-w-[200px]">Let your personal AI DJ introduce songs and narrate your daily mixes.</p>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.aiDjEnabled} onChange={(e) => setSettings({...settings, aiDjEnabled: e.target.checked})} />
              <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </div>
          </div>
          <button className="w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 font-semibold text-sm hover:bg-blue-500/20 transition-colors">
            Customize Voice
          </button>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#11111A] to-indigo-900/10 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles size={100} />
          </div>
          <div className="flex items-start justify-between relative z-10 h-full flex-col">
            <div className="w-full flex justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Smart Playlists
                </h3>
                <p className="text-sm text-[#A0A0B8] mt-2 mb-6 max-w-[200px]">Automatically generate playlists based on your listening patterns.</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.autoPlaylists} onChange={(e) => setSettings({...settings, autoPlaylists: e.target.checked})} />
                <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <SlidersHorizontal size={20} className="text-blue-400" />
          Discovery Algorithm
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-white">Recommendation Scope</span>
              <span className="text-blue-400 font-bold">
                {settings.discoveryStrictness < 33 ? 'Familiar' : settings.discoveryStrictness < 66 ? 'Balanced' : 'Experimental'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={settings.discoveryStrictness}
              onChange={(e) => setSettings({...settings, discoveryStrictness: parseInt(e.target.value)})}
              className="w-full h-2 bg-[#2A2A3C] rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-[#6B6B85] mt-2">
              <span>Play what I know</span>
              <span>Mix it up</span>
              <span>Find obscure tracks</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2A2A3C]">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">Smart Audio Transitions</p>
                <p className="text-sm text-[#A0A0B8]">Use AI to analyze beats and seamlessly crossfade between tracks.</p>
              </div>
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.smartTransitions}
                  onChange={(e) => setSettings({...settings, smartTransitions: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
