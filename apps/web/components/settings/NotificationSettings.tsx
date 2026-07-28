"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Mail, UserPlus, Users, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { API_URL } from '../../lib/api';
import { SettingsCard } from './SettingsCard';
import { useSettingsContext } from './SettingsContext';
import { cn } from '@/lib/utils';

export function NotificationSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } 
      });
      if (!res.ok) throw new Error('Failed to load settings');
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newFollower: true,
    friendRequests: true,
    messages: true,
    recommendations: true,
  });

  const { setIsDirty, saveFnRef } = useSettingsContext();

  useEffect(() => {
    if (settings?.notifications) {
      setFormData(settings.notifications);
    }
  }, [settings]);

  useEffect(() => {
    if (settings?.notifications) {
      const isChanged = 
        formData.emailNotifications !== settings.notifications.emailNotifications ||
        formData.pushNotifications !== settings.notifications.pushNotifications ||
        formData.newFollower !== settings.notifications.newFollower ||
        formData.friendRequests !== settings.notifications.friendRequests ||
        formData.messages !== settings.notifications.messages ||
        formData.recommendations !== settings.notifications.recommendations;
      
      setIsDirty(isChanged);
    }
  }, [formData, settings, setIsDirty]);

  const updateNotifications = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/settings/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update notifications');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setIsDirty(false);
    }
  });

  useEffect(() => {
    saveFnRef.current = async () => {
      await updateNotifications.mutateAsync(formData);
    };
  }, [formData, updateNotifications, saveFnRef]);

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#A0A0B8]" size={32} /></div>;

  const toggleSetting = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  const ToggleRow = ({ title, description, checked, onChange, icon: Icon }: any) => (
    <label className="flex cursor-pointer items-start justify-between rounded-xl bg-[#09090B] p-4 border border-[#2A2A3C] transition-colors hover:border-[#1DB954] group">
      <div className="flex gap-4">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.02)] transition-colors group-hover:bg-[rgba(29,185,84,0.1)] group-hover:text-[#1DB954] text-[#A0A0B8]">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-white">{title}</p>
          <p className="mt-1 text-sm text-[#A0A0B8] leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="relative ml-4 mt-2 shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={cn("block h-6 w-10 rounded-full transition-colors", checked ? "bg-[#1DB954]" : "bg-[#2A2A3C]")}></div>
        <div className={cn("absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform", checked ? "translate-x-4" : "")}></div>
      </div>
    </label>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Notifications</h2>
        <p className="mt-2 text-[#A0A0B8]">Customize your push notifications, email alerts, and in-app updates to stay on top of your community activity.</p>
      </div>

      <SettingsCard title="Notification Channels">
        <div className="space-y-4">
          <ToggleRow 
            title="Push Notifications" 
            description="Receive push notifications on your device." 
            checked={formData.pushNotifications} 
            onChange={() => toggleSetting('pushNotifications')} 
            icon={Bell}
          />
          <ToggleRow 
            title="Email Alerts" 
            description="Receive important updates and weekly digests via email." 
            checked={formData.emailNotifications} 
            onChange={() => toggleSetting('emailNotifications')} 
            icon={Mail}
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Community & Social">
        <div className="space-y-4">
          <ToggleRow 
            title="New Followers" 
            description="Get notified when someone starts following you." 
            checked={formData.newFollower} 
            onChange={() => toggleSetting('newFollower')} 
            icon={UserPlus}
          />
          <ToggleRow 
            title="Friend Requests" 
            description="Alert me when I receive a new friend request." 
            checked={formData.friendRequests} 
            onChange={() => toggleSetting('friendRequests')} 
            icon={Users}
          />
          <ToggleRow 
            title="Direct Messages" 
            description="Notify me about new direct messages." 
            checked={formData.messages} 
            onChange={() => toggleSetting('messages')} 
            icon={MessageSquare}
          />
          <ToggleRow 
            title="Music Recommendations" 
            description="Receive personalized music and room recommendations." 
            checked={formData.recommendations} 
            onChange={() => toggleSetting('recommendations')} 
            icon={Sparkles}
          />
        </div>
        
        <div className="flex justify-end pt-6">
          <button
            onClick={() => updateNotifications.mutate(formData)}
            disabled={updateNotifications.isPending || !settings || (
              settings.notifications &&
              formData.emailNotifications === settings.notifications.emailNotifications &&
              formData.pushNotifications === settings.notifications.pushNotifications &&
              formData.newFollower === settings.notifications.newFollower &&
              formData.friendRequests === settings.notifications.friendRequests &&
              formData.messages === settings.notifications.messages &&
              formData.recommendations === settings.notifications.recommendations
            )}
            className="flex items-center gap-2 rounded-lg bg-[#1DB954] px-6 py-2.5 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {updateNotifications.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
