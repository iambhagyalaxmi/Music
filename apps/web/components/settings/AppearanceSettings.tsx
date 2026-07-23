"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Monitor, Palette, Layout, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '../../lib/api';

export function AppearanceSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    themeMode: 'DARK',
    accentColor: '#1DB954',
    compactMode: false,
    enableAnimations: true,
  });

  useEffect(() => {
    if (settings?.theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        themeMode: settings.theme.themeMode,
        accentColor: settings.theme.accentColor,
        compactMode: settings.theme.compactMode,
        enableAnimations: settings.theme.enableAnimations,
      });
    }
  }, [settings]);

  const updateTheme = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Appearance updated successfully!');
    }
  });

  const handleSave = () => {
    updateTheme.mutate(formData);
  };

  const THEME_OPTIONS = [
    { id: 'DARK', label: 'Dark', icon: Moon },
    { id: 'LIGHT', label: 'Light', icon: Sun },
    { id: 'SYSTEM', label: 'System', icon: Monitor },
  ];

  const COLORS = ['#1DB954', '#FF4D8D', '#8B5CF6', '#3B82F6', '#F59E0B', '#10B981'];

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Appearance</h2>
        <p className="mt-2 text-[#A0A0B8]">Customize how the application looks and feels on your device.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Palette size={20} className="text-[#1DB954]" /> Theme & Colors</h3>
        
        <div className="space-y-6">
          {/* Theme Mode */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#A0A0B8]">Theme Mode</label>
            <div className="grid grid-cols-3 gap-4">
              {THEME_OPTIONS.map((theme) => {
                const Icon = theme.icon;
                const isActive = formData.themeMode === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setFormData({ ...formData, themeMode: theme.id })}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all hover:bg-[rgba(255,255,255,0.02)]",
                      isActive ? "border-[#1DB954] bg-[rgba(29,185,84,0.05)] text-[#1DB954]" : "border-[#2A2A3C] text-[#A0A0B8]"
                    )}
                  >
                    <Icon size={24} />
                    <span className="text-sm font-bold">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#A0A0B8]">Accent Color</label>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, accentColor: color })}
                  className={cn(
                    "h-10 w-10 rounded-full transition-transform hover:scale-110",
                    formData.accentColor === color ? "ring-4 ring-white ring-offset-2 ring-offset-[#11111A]" : ""
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Layout size={20} className="text-[#1DB954]" /> Interface</h3>
        
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#09090B] p-4 border border-[#2A2A3C] transition-colors hover:border-[#1DB954]">
            <div>
              <p className="font-bold text-white">Compact Mode</p>
              <p className="text-sm text-[#A0A0B8]">Reduce spacing to fit more content on screen.</p>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={formData.compactMode}
                onChange={(e) => setFormData({ ...formData, compactMode: e.target.checked })}
              />
              <div className={cn("block h-6 w-10 rounded-full transition-colors", formData.compactMode ? "bg-[#1DB954]" : "bg-[#2A2A3C]")}></div>
              <div className={cn("absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform", formData.compactMode ? "translate-x-4" : "")}></div>
            </div>
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#09090B] p-4 border border-[#2A2A3C] transition-colors hover:border-[#1DB954]">
            <div>
              <p className="font-bold text-white flex items-center gap-2">Enable Animations <MousePointer2 size={14} /></p>
              <p className="text-sm text-[#A0A0B8]">Smooth transitions and motion effects.</p>
            </div>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={formData.enableAnimations}
                onChange={(e) => setFormData({ ...formData, enableAnimations: e.target.checked })}
              />
              <div className={cn("block h-6 w-10 rounded-full transition-colors", formData.enableAnimations ? "bg-[#1DB954]" : "bg-[#2A2A3C]")}></div>
              <div className={cn("absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform", formData.enableAnimations ? "translate-x-4" : "")}></div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={updateTheme.isPending}
          className="rounded-lg bg-[#1DB954] px-8 py-3 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
        >
          {updateTheme.isPending ? 'Saving...' : 'Save Appearance'}
        </button>
      </div>
    </div>
  );
}
