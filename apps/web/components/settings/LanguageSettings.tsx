"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Globe, MapPin, Clock, CalendarDays, Loader2 } from 'lucide-react';
import { API_URL } from '../../lib/api';
import { SettingsCard } from './SettingsCard';
import { useSettingsContext } from './SettingsContext';

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

  const { setIsDirty, saveFnRef } = useSettingsContext();

  useEffect(() => {
    if (settings?.language) {
      const isChanged = 
        formData.language !== settings.language.language ||
        formData.country !== settings.language.country ||
        formData.timeZone !== settings.language.timeZone ||
        formData.dateFormat !== settings.language.dateFormat ||
        formData.timeFormat !== settings.language.timeFormat;
      setIsDirty(isChanged);
    }
  }, [formData, settings, setIsDirty]);

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
      setIsDirty(false);
    }
  });

  useEffect(() => {
    saveFnRef.current = async () => {
      await updateLanguage.mutateAsync(formData);
    };
  }, [formData, updateLanguage, saveFnRef]);

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#A0A0B8]" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Language & Region</h2>
        <p className="mt-2 text-[#A0A0B8]">Customize how dates, times, and content are displayed.</p>
      </div>

      <SettingsCard title="Regional Preferences">
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

        <div className="flex justify-end pt-6">
          <button
            onClick={() => updateLanguage.mutate(formData)}
            disabled={updateLanguage.isPending || !settings || (
              settings.language &&
              formData.language === settings.language.language &&
              formData.country === settings.language.country &&
              formData.timeZone === settings.language.timeZone &&
              formData.dateFormat === settings.language.dateFormat &&
              formData.timeFormat === settings.language.timeFormat
            )}
            className="flex items-center gap-2 rounded-lg bg-[#1DB954] px-6 py-2.5 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {updateLanguage.isPending && <Loader2 size={18} className="animate-spin" />}
            {updateLanguage.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
