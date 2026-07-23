"use client";

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, UserX, Smartphone, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState({
    profileVisibility: 'friends', // public, friends, private
    showOnlineStatus: true,
    showListeningActivity: true,
    allowFriendRequests: 'everyone', // everyone, friends_of_friends, nobody
    twoFactorEnabled: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Privacy & Security settings updated successfully!');
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <ShieldCheck className="text-emerald-400" size={32} />
          Privacy & Security
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Manage who can see your activity, control your online status, and secure your account.</p>
      </div>

      {/* Visibility & Activity */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl relative overflow-hidden">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Eye size={20} className="text-emerald-400" />
          Visibility & Activity
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-medium text-white">Profile Visibility</label>
            <p className="text-sm text-[#A0A0B8] mb-4">Choose who can view your profile, playlists, and followers.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'public', label: 'Public', desc: 'Anyone can view' },
                { id: 'friends', label: 'Friends Only', desc: 'Approved followers' },
                { id: 'private', label: 'Private', desc: 'Only you' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSettings({...settings, profileVisibility: option.id})}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left",
                    settings.profileVisibility === option.id 
                      ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                      : "border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] hover:border-emerald-500/50 hover:bg-[rgba(255,255,255,0.05)]"
                  )}
                >
                  <span className={cn("font-bold", settings.profileVisibility === option.id ? "text-emerald-400" : "text-white")}>
                    {option.label}
                  </span>
                  <span className="text-xs text-[#6B6B85] mt-1">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-[#2A2A3C]" />

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Show Online Status</p>
                <p className="text-sm text-[#A0A0B8]">Let friends see when you are active on SoundSphere.</p>
              </div>
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.showOnlineStatus}
                  onChange={(e) => setSettings({...settings, showOnlineStatus: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Share Listening Activity</p>
                <p className="text-sm text-[#A0A0B8]">Display the track you are currently listening to on your profile.</p>
              </div>
              <div className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.showListeningActivity}
                  onChange={(e) => setSettings({...settings, showListeningActivity: e.target.checked})}
                />
                <div className="w-11 h-6 bg-[#2A2A3C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Security (2FA) */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Lock size={20} className="text-[#FF4D8D]" />
          Account Security
        </h3>
        <p className="text-sm text-[#A0A0B8] mb-6">Enhance your account security by enabling two-factor authentication.</p>
        
        <div className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-transparent p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-full flex items-center justify-center shrink-0", settings.twoFactorEnabled ? "bg-[#1DB954]/20 text-[#1DB954]" : "bg-[#2A2A3C] text-gray-400")}>
              {settings.twoFactorEnabled ? <Key size={24} /> : <Smartphone size={24} />}
            </div>
            <div>
              <p className="font-bold text-white">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-[#A0A0B8]">
                {settings.twoFactorEnabled 
                  ? "2FA is currently enabled via Authenticator App." 
                  : "Add an extra layer of security to your account."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSettings({...settings, twoFactorEnabled: !settings.twoFactorEnabled})}
            className={cn(
              "shrink-0 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300",
              settings.twoFactorEnabled
                ? "bg-[rgba(255,255,255,0.05)] text-white hover:bg-red-500/10 hover:text-red-400"
                : "bg-white text-black hover:bg-gray-200"
            )}
          >
            {settings.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* Blocked Users */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserX size={20} className="text-gray-400" />
              Blocked Users
            </h3>
            <p className="text-sm text-[#A0A0B8] mt-1">Manage people you have blocked from interacting with you.</p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] text-white text-sm font-semibold hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            Manage List
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-8 py-3 font-bold text-[#09090B] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-70 disabled:scale-100 flex items-center gap-2"
        >
          {isSaving ? 'Saving Preferences...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
