"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Mail, User, Lock, LogOut, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { API_URL } from '../../lib/api';
import { SettingsCard } from './SettingsCard';
import { Dialog } from '../ui/Dialog';
import { useSettingsContext } from './SettingsContext';

export function AccountSettings() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}` } });
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    }
  });

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
  });

  const { setIsDirty, saveFnRef } = useSettingsContext();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const isChanged = formData.username !== user.username || formData.email !== user.email;
      setIsDirty(isChanged);
    }
  }, [formData, user, setIsDirty]);

  const updateAccount = useMutation({
    mutationFn: async (data: typeof formData) => {
      // In a real app this would go to an account-specific endpoint
      const res = await fetch(`${API_URL}/api/users/me`, {
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
      // Optional: Add a toast notification here
    }
  });

  useEffect(() => {
    saveFnRef.current = async () => {
      await updateAccount.mutateAsync(formData);
    };
  }, [formData, updateAccount, saveFnRef]);

  if (isLoading) return <div className="flex h-40 items-center justify-center"><Loader2 className="animate-spin text-[#A0A0B8]" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Account Settings</h2>
        <p className="mt-2 text-[#A0A0B8]">Manage your account details and security.</p>
      </div>

      {/* Profile Pictures */}
      <SettingsCard 
        title="Profile Images"
        description="Personalize your account with a custom avatar."
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#1A1A27] border-2 border-[#2A2A3C] shadow-inner group">
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera size={24} className="text-white drop-shadow-md" />
            </div>
            {/* Avatar image would go here */}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex gap-3">
              <button className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                Upload Photo
              </button>
              <button className="rounded-lg bg-transparent border border-red-500/20 px-4 py-2 text-sm font-semibold text-[#FF4D8D] transition-colors hover:bg-red-500/10">
                Remove Photo
              </button>
            </div>
            <p className="text-xs text-[#A0A0B8]">Recommended size: 400x400px. Maximum file size: 5MB.</p>
          </div>
        </div>
      </SettingsCard>

      {/* Personal Info */}
      <SettingsCard title="Personal Information">
        <form 
          className="space-y-6"
          onSubmit={(e) => { e.preventDefault(); updateAccount.mutate(formData); }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#A0A0B8]">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#A0A0B8]">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="settings-input pl-11"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#A0A0B8]">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#A0A0B8]">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="settings-input pl-11 pr-11"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <span className="absolute right-3 top-3 text-[#1DB954]" title="Verified">
                  <CheckCircle2 size={18} />
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateAccount.isPending || (formData.username === user?.username && formData.email === user?.email)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {updateAccount.isPending && <Loader2 size={18} className="animate-spin" />}
              {updateAccount.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </SettingsCard>

      {/* Danger Zone */}
      <SettingsCard title="Danger Zone" variant="danger">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">Logout from All Devices</p>
              <p className="text-sm text-[#A0A0B8] mt-1">This will revoke all active sessions instantly.</p>
            </div>
            <button 
              onClick={() => setLogoutDialogOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-[#2A2A3C] bg-black/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              <LogOut size={16} /> Logout All
            </button>
          </div>
          <div className="h-px w-full bg-[#2A2A3C]/50" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">Delete Account</p>
              <p className="text-sm text-[#A0A0B8] mt-1">Permanently delete your account and all associated data.</p>
            </div>
            <button 
              onClick={() => setDeleteDialogOpen(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#FF4D8D]/10 text-[#FF4D8D] px-4 py-2.5 text-sm font-bold transition-colors hover:bg-[#FF4D8D]/20"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Logout Confirmation */}
      <Dialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        title="Logout from all devices?"
        description="You will be signed out from all other browsers and devices. You will need to log back in to access your account."
        footer={
          <>
            <button onClick={() => setLogoutDialogOpen(false)} className="rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10">Cancel</button>
            <button onClick={() => { setLogoutDialogOpen(false); alert('Logged out'); }} className="rounded-lg bg-white px-4 py-2 font-bold text-black hover:bg-gray-200">Confirm Logout</button>
          </>
        }
      >
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete Account"
        description="Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
        variant="danger"
        footer={
          <>
            <button onClick={() => setDeleteDialogOpen(false)} className="rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10">Cancel</button>
            <button onClick={() => { setDeleteDialogOpen(false); alert('Account deleted'); }} className="rounded-lg bg-[#FF4D8D] px-4 py-2 font-bold text-white hover:brightness-110">Delete Account</button>
          </>
        }
      >
      </Dialog>
    </div>
  );
}
