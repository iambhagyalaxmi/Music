"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mic, Volume2, Settings2, ShieldCheck, Zap } from 'lucide-react';
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

export function VoiceSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    microphoneId: 'default',
    speakerId: 'default',
    noiseCancellation: true,
    echoCancellation: true,
    pushToTalk: false,
    autoGainControl: true,
    voiceActivityDetect: true,
  });

  useEffect(() => {
    if (settings?.voice) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        microphoneId: settings.voice.microphoneId || 'default',
        speakerId: settings.voice.speakerId || 'default',
        noiseCancellation: settings.voice.noiseCancellation,
        echoCancellation: settings.voice.echoCancellation,
        pushToTalk: settings.voice.pushToTalk,
        autoGainControl: settings.voice.autoGainControl,
        voiceActivityDetect: settings.voice.voiceActivityDetect,
      });
    }
  }, [settings]);

  const updateVoice = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/voice`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Voice settings updated!');
    }
  });

  const handleSave = () => updateVoice.mutate(formData);

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Voice Chat</h2>
        <p className="mt-2 text-[#A0A0B8]">Configure your hardware and voice processing settings.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl space-y-6">
        
        {/* Hardware Selection */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><Mic size={16} className="text-[#1DB954]"/> Input Device</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.microphoneId}
              onChange={(e) => setFormData({ ...formData, microphoneId: e.target.value })}
            >
              <option value="default">Default Microphone</option>
              <option value="mic1">External USB Mic</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-white flex items-center gap-2"><Volume2 size={16} className="text-[#1DB954]"/> Output Device</label>
            <select 
              className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] p-3 text-white outline-none focus:border-[#1DB954]"
              value={formData.speakerId}
              onChange={(e) => setFormData({ ...formData, speakerId: e.target.value })}
            >
              <option value="default">Default Speakers</option>
              <option value="speaker1">Headphones</option>
            </select>
          </div>
        </div>

        <div className="h-px w-full bg-[#2A2A3C]" />

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings2 size={20} className="text-[#1DB954]" /> Processing</h3>
          
          <ToggleRow 
            title="Noise Cancellation" 
            description="Filter out background noise automatically." 
            checked={formData.noiseCancellation} 
            onChange={() => toggleSetting('noiseCancellation')} 
            icon={ShieldCheck}
          />
          
          <ToggleRow 
            title="Echo Cancellation" 
            description="Prevent your mic from picking up speaker output." 
            checked={formData.echoCancellation} 
            onChange={() => toggleSetting('echoCancellation')} 
            icon={Zap}
          />
          
          <ToggleRow 
            title="Push to Talk" 
            description="Only transmit voice when holding a hotkey." 
            checked={formData.pushToTalk} 
            onChange={() => toggleSetting('pushToTalk')} 
          />
          
          <ToggleRow 
            title="Automatic Gain Control" 
            description="Automatically adjust mic volume based on how loud you speak." 
            checked={formData.autoGainControl} 
            onChange={() => toggleSetting('autoGainControl')} 
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={updateVoice.isPending}
          className="rounded-lg bg-[#1DB954] px-8 py-3 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
        >
          {updateVoice.isPending ? 'Saving...' : 'Save Voice Settings'}
        </button>
      </div>
    </div>
  );
}
