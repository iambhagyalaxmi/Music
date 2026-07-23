"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Eye, Image as ImageIcon, Smile, FileImage } from 'lucide-react';
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

export function ChatSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    readReceipts: true,
    typingIndicator: true,
    messagePreview: true,
    autoDownloadMedia: true,
    emojiSuggestions: true,
    gifSupport: true,
  });

  useEffect(() => {
    if (settings?.chat) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        readReceipts: settings.chat.readReceipts,
        typingIndicator: settings.chat.typingIndicator,
        messagePreview: settings.chat.messagePreview,
        autoDownloadMedia: settings.chat.autoDownloadMedia,
        emojiSuggestions: settings.chat.emojiSuggestions,
        gifSupport: settings.chat.gifSupport,
      });
    }
  }, [settings]);

  const updateChat = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/chat`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Chat settings updated!');
    }
  });

  const handleSave = () => updateChat.mutate(formData);

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Chat</h2>
        <p className="mt-2 text-[#A0A0B8]">Customize your messaging experience and privacy.</p>
      </div>

      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl space-y-4">
        
        <ToggleRow 
          title="Read Receipts" 
          description="Let others know when you have read their messages." 
          checked={formData.readReceipts} 
          onChange={() => toggleSetting('readReceipts')} 
          icon={Eye}
        />
        
        <ToggleRow 
          title="Typing Indicator" 
          description="Show others when you are typing." 
          checked={formData.typingIndicator} 
          onChange={() => toggleSetting('typingIndicator')} 
          icon={MessageSquare}
        />
        
        <ToggleRow 
          title="Message Preview" 
          description="Show message content in push notifications." 
          checked={formData.messagePreview} 
          onChange={() => toggleSetting('messagePreview')} 
        />
        
        <ToggleRow 
          title="Auto-Download Media" 
          description="Automatically download images and videos over Wi-Fi." 
          checked={formData.autoDownloadMedia} 
          onChange={() => toggleSetting('autoDownloadMedia')} 
          icon={ImageIcon}
        />
        
        <ToggleRow 
          title="Emoji Suggestions" 
          description="Suggest emojis as you type words." 
          checked={formData.emojiSuggestions} 
          onChange={() => toggleSetting('emojiSuggestions')} 
          icon={Smile}
        />

        <ToggleRow 
          title="GIF Support" 
          description="Enable GIF search and rendering in chat." 
          checked={formData.gifSupport} 
          onChange={() => toggleSetting('gifSupport')} 
          icon={FileImage}
        />

      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={updateChat.isPending}
          className="rounded-lg bg-[#1DB954] px-8 py-3 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
        >
          {updateChat.isPending ? 'Saving...' : 'Save Chat Settings'}
        </button>
      </div>
    </div>
  );
}
