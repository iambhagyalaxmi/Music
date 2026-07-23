"use client";

import React, { useState } from 'react';
import { Smartphone, Laptop, Monitor, LogOut, CheckCircle2, Speaker } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DevicesSettingsPage() {
  const [crossDevice, setCrossDevice] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <Smartphone className="text-purple-400" size={32} />
          Devices
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Manage the devices you are currently logged into and configure cross-device playback control.</p>
      </div>

      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#11111A] to-purple-900/10 p-6 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Speaker size={20} className="text-purple-400" />
            Cross-Device Playback
          </h3>
          <p className="text-sm text-[#A0A0B8] mt-1 max-w-md">Allow other devices logged into your account to control playback on this device.</p>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={crossDevice}
            onChange={(e) => setCrossDevice(e.target.checked)}
          />
          <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">Active Devices</h3>
        
        <div className="space-y-4">
          {/* Current Device */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Laptop size={24} />
              </div>
              <div>
                <p className="font-bold text-white flex items-center gap-2">
                  MacBook Pro <span className="text-[10px] uppercase tracking-wider bg-purple-500 text-white px-2 py-0.5 rounded-full">Current Device</span>
                </p>
                <p className="text-xs text-[#A0A0B8]">Chrome • New York, USA • Active now</p>
              </div>
            </div>
          </div>

          {/* Other Devices */}
          <div className="p-4 rounded-xl border border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] flex items-center justify-between group hover:border-[#2A2A3C] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <Smartphone size={24} />
              </div>
              <div>
                <p className="font-bold text-white">iPhone 14 Pro</p>
                <p className="text-xs text-[#A0A0B8]">SoundSphere App • London, UK • Last active 2 hours ago</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
              Log out
            </button>
          </div>

          <div className="p-4 rounded-xl border border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] flex items-center justify-between group hover:border-[#2A2A3C] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <Monitor size={24} />
              </div>
              <div>
                <p className="font-bold text-white">Windows Desktop</p>
                <p className="text-xs text-[#A0A0B8]">Desktop App • New York, USA • Last active yesterday</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
              Log out
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2A2A3C] flex justify-end">
          <button className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-transparent px-6 py-2.5 text-sm font-bold text-red-400 transition-colors hover:bg-red-500/10">
            <LogOut size={16} /> Log Out All Other Devices
          </button>
        </div>
      </div>
    </div>
  );
}
