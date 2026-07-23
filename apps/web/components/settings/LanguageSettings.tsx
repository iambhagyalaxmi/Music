"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, MapPin, Clock, CalendarDays } from 'lucide-react';
import { API_URL } from '../../lib/api';

export function LanguageSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    language: 'en-US',
    country: 'US',
    timeZone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12H',
  });

  useEffect(() => {
    if (settings?.language) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        language: settings.language.language,
        country: settings.language.country,
        timeZone: settings.language.timeZone,
        dateFormat: settings.language.dateFormat,
        timeFormat: settings.language.timeFormat,
      });
    }
  }, [settings]);

  const updateLanguage = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/language`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Language & Region updated!');
    }
  });

  const handleSave = () => updateLanguage.mutate(formData);

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Language & Region</h2>
        <p className="mt-2 text-[#A0A0B8]">Customize how dates, times, and content are displayed.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl space-y-6">
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><Globe size={16} className="text-[#1DB954]"/> Language</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
              <option value="fr-FR">Français</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><MapPin size={16} className="text-[#1DB954]"/> Country/Region</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A3C]" />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><Clock size={16} className="text-[#1DB954]"/> Time Format</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.timeFormat}
              onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
            >
              <option value="12H">12-hour (1:00 PM)</option>
              <option value="24H">24-hour (13:00)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><CalendarDays size={16} className="text-[#1DB954]"/> Date Format</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.dateFormat}
              onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            </select>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={updateLanguage.isPending}
          className="rounded-lg bg-[#1DB954] px-8 py-3 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
        >
          {updateLanguage.isPending ? 'Saving...' : 'Save Language Settings'}
        </button>
      </div>
    </div>
  );
}
