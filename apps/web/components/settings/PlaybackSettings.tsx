"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Volume2, FastForward, Repeat, Shuffle, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_URL } from '../../lib/api';

interface ToggleRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ElementType;
}

const ToggleRow = ({ title, description, checked, onChange, icon: Icon }: ToggleRowProps) => (
  <label className="flex cursor-pointer items-center justify-between rounded-xl bg-[#09090B] p-4 border border-[#2A2A3C] transition-colors hover:border-[#1DB954]">
    <div>
      <p className="font-bold text-white flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[#1DB954]" />} {title}
      </p>
      <p className="text-sm text-[#A0A0B8]">{description}</p>
    </div>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={cn("block h-6 w-10 rounded-full transition-colors", checked ? "bg-[#1DB954]" : "bg-[#2A2A3C]")}></div>
      <div className={cn("absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform", checked ? "translate-x-4" : "")}></div>
    </div>
  </label>
);

export function PlaybackSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    autoPlay: true,
    crossfadeMs: 0,
    gaplessPlayback: true,
    normalizeVolume: true,
    autoplaySimilarSongs: true,
  });

  useEffect(() => {
    if (settings?.playback) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        autoPlay: settings.playback.autoPlay,
        crossfadeMs: settings.playback.crossfadeMs,
        gaplessPlayback: settings.playback.gaplessPlayback,
        normalizeVolume: settings.playback.normalizeVolume,
        autoplaySimilarSongs: settings.playback.autoplaySimilarSongs,
      });
    }
  }, [settings]);

  const updatePlayback = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/playback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Playback settings updated!');
    }
  });

  const handleSave = () => updatePlayback.mutate(formData);

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Playback</h2>
        <p className="mt-2 text-[#A0A0B8]">Control how your music transitions and plays continuously.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl space-y-4">
        
        <ToggleRow 
          title="Auto Play" 
          description="Enjoy non-stop music. We'll play similar songs when your queue ends." 
          checked={formData.autoPlay} 
          onChange={() => toggleSetting('autoPlay')} 
          icon={FastForward}
        />

        <ToggleRow 
          title="Gapless Playback" 
          description="Allow songs to transition without any silent gaps." 
          checked={formData.gaplessPlayback} 
          onChange={() => toggleSetting('gaplessPlayback')} 
          icon={AudioLines}
        />

        <ToggleRow 
          title="Normalize Volume" 
          description="Set the same volume level for all tracks." 
          checked={formData.normalizeVolume} 
          onChange={() => toggleSetting('normalizeVolume')} 
          icon={Volume2}
        />

        <ToggleRow 
          title="Autoplay Similar Songs" 
          description="Keep the party going using our AI recommendation engine." 
          checked={formData.autoplaySimilarSongs} 
          onChange={() => toggleSetting('autoplaySimilarSongs')} 
          icon={Repeat}
        />

        <div className="rounded-xl bg-[#09090B] p-4 border border-[#2A2A3C]">
          <p className="font-bold text-white flex items-center gap-2">
            <Shuffle size={16} className="text-[#1DB954]" /> Crossfade Duration
          </p>
          <p className="mb-4 text-sm text-[#A0A0B8]">Overlap songs smoothly.</p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#A0A0B8]">0s</span>
            <input 
              type="range" 
              min="0" 
              max="12" 
              value={formData.crossfadeMs / 1000}
              onChange={(e) => setFormData({ ...formData, crossfadeMs: parseInt(e.target.value) * 1000 })}
              className="flex-1 accent-[#1DB954]"
            />
            <span className="text-sm font-bold text-[#A0A0B8]">12s</span>
          </div>
          <div className="mt-2 text-center text-sm font-bold text-[#1DB954]">
            {formData.crossfadeMs / 1000} seconds
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={updatePlayback.isPending}
          className="rounded-lg bg-[#1DB954] px-8 py-3 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
        >
          {updatePlayback.isPending ? 'Saving...' : 'Save Playback Settings'}
        </button>
      </div>
    </div>
  );
}
