"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Headphones, DownloadCloud, Sliders, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '../../lib/api';
import { SettingsCard } from './SettingsCard';
import { useSettingsContext } from './SettingsContext';

export function AudioSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    streamingQuality: 'HIGH',
    downloadQuality: 'HIGH',
    equalizerPreset: 'NORMAL',
  });

  const { setIsDirty, saveFnRef } = useSettingsContext();

  useEffect(() => {
    if (settings?.audio) {
      const isChanged = 
        formData.streamingQuality !== settings.audio.streamingQuality ||
        formData.downloadQuality !== settings.audio.downloadQuality ||
        formData.equalizerPreset !== settings.audio.equalizerPreset;
      setIsDirty(isChanged);
    }
  }, [formData, settings, setIsDirty]);

  useEffect(() => {
    if (settings?.audio) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        streamingQuality: settings.audio.streamingQuality,
        downloadQuality: settings.audio.downloadQuality,
        equalizerPreset: settings.audio.equalizerPreset,
      });
    }
  }, [settings]);

  const updateAudio = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/audio`, {
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
      await updateAudio.mutateAsync(formData);
    };
  }, [formData, updateAudio, saveFnRef]);

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#A0A0B8]" size={32} /></div>;

  const QUALITY_OPTIONS = [
    { id: 'LOW', label: 'Low (24kbit/s)' },
    { id: 'MEDIUM', label: 'Normal (96kbit/s)' },
    { id: 'HIGH', label: 'High (160kbit/s)' },
    { id: 'LOSSLESS', label: 'Lossless (ALAC/FLAC)' },
  ];

  const EQ_PRESETS = ['NORMAL', 'BASS BOOST', 'VOCAL', 'ROCK', 'POP', 'CLASSICAL', 'CUSTOM'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Audio Quality</h2>
        <p className="mt-2 text-[#A0A0B8]">Tune your listening experience for the best sound.</p>
      </div>

      <SettingsCard title="Audio Configuration">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Headphones size={20} className="text-[#1DB954]" /> Streaming Quality</h3>
          <div className="space-y-3">
            {QUALITY_OPTIONS.map(opt => (
              <label key={`stream-${opt.id}`} className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                formData.streamingQuality === opt.id ? "border-[#1DB954] bg-[rgba(29,185,84,0.05)]" : "border-[#2A2A3C] bg-[#09090B] hover:border-[rgba(255,255,255,0.2)]"
              )}>
                <span className={cn("font-semibold", formData.streamingQuality === opt.id ? "text-[#1DB954]" : "text-white")}>{opt.label}</span>
                <input 
                  type="radio" 
                  name="streamQ" 
                  className="accent-[#1DB954] h-5 w-5"
                  checked={formData.streamingQuality === opt.id}
                  onChange={() => setFormData({ ...formData, streamingQuality: opt.id })}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A3C]" />

        <div>
          <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><DownloadCloud size={20} className="text-[#1DB954]" /> Download Quality</h3>
          <div className="space-y-3">
            {QUALITY_OPTIONS.filter(q => q.id !== 'LOSSLESS').map(opt => (
              <label key={`down-${opt.id}`} className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors",
                formData.downloadQuality === opt.id ? "border-[#1DB954] bg-[rgba(29,185,84,0.05)]" : "border-[#2A2A3C] bg-[#09090B] hover:border-[rgba(255,255,255,0.2)]"
              )}>
                <span className={cn("font-semibold", formData.downloadQuality === opt.id ? "text-[#1DB954]" : "text-white")}>{opt.label}</span>
                <input 
                  type="radio" 
                  name="downQ" 
                  className="accent-[#1DB954] h-5 w-5"
                  checked={formData.downloadQuality === opt.id}
                  onChange={() => setFormData({ ...formData, downloadQuality: opt.id })}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A3C]" />

        <div>
          <h3 className="mb-4 text-lg font-bold text-white flex items-center gap-2"><Sliders size={20} className="text-[#1DB954]" /> Equalizer</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {EQ_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => setFormData({ ...formData, equalizerPreset: preset })}
                className={cn(
                  "rounded-lg border px-4 py-3 text-sm font-bold transition-all",
                  formData.equalizerPreset === preset 
                    ? "border-[#1DB954] bg-[#1DB954] text-[#09090B]" 
                    : "border-[#2A2A3C] bg-[#09090B] text-[#A0A0B8] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                )}
              >
                {preset}
              </button>
            ))}
          </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={() => updateAudio.mutate(formData)}
            disabled={updateAudio.isPending || !settings || (
              settings.audio &&
              formData.streamingQuality === settings.audio.streamingQuality &&
              formData.downloadQuality === settings.audio.downloadQuality &&
              formData.equalizerPreset === settings.audio.equalizerPreset
            )}
            className="flex items-center gap-2 rounded-lg bg-[#1DB954] px-6 py-2.5 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {updateAudio.isPending && <Loader2 size={18} className="animate-spin" />}
            {updateAudio.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
