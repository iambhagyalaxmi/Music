"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Camera, Mail, Phone, Lock, LogOut, Trash2, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../../lib/api';

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
      alert('Account updated successfully!');
    }
  });

  if (isLoading) return <div className="animate-pulse text-[#A0A0B8]">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-white">Account Settings</h2>
        <p className="mt-2 text-[#A0A0B8]">Manage your account details and security.</p>
      </div>

      {/* Profile Pictures */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">Profile Images</h3>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 rounded-full bg-[#1A1A27]">
            <button className="absolute bottom-0 right-0 rounded-full bg-[#1DB954] p-2 text-[#09090B] hover:scale-105 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[#A0A0B8]">Upload a profile picture. Recommended size: 400x400px.</p>
            <div className="mt-3 flex gap-3">
              <button className="rounded-lg bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[rgba(255,255,255,0.1)]">
                Change Picture
              </button>
              <button className="rounded-lg bg-[rgba(255,255,255,0.05)] px-4 py-2 text-sm font-semibold text-[#FF4D8D] transition-colors hover:bg-[rgba(255,77,141,0.1)]">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white">Personal Information</h3>
        <form 
          className="mt-6 space-y-5"
          onSubmit={(e) => { e.preventDefault(); updateAccount.mutate(formData); }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#A0A0B8]">Username</label>
              <input
                type="text"
                className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] px-4 py-2.5 text-white outline-none focus:border-[#1DB954]"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#A0A0B8]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border border-[#2A2A3C] bg-[#09090B] px-4 py-2.5 text-white outline-none focus:border-[#1DB954]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <span className="absolute right-3 top-3 text-[#1DB954]" title="Verified">
                  <CheckCircle2 size={16} />
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={updateAccount.isPending}
              className="rounded-lg bg-[#1DB954] px-6 py-2.5 font-bold text-[#09090B] transition-transform hover:scale-105 disabled:opacity-50"
            >
              {updateAccount.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-[#FF4D8D]">Danger Zone</h3>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Logout from All Devices</p>
              <p className="text-sm text-[#A0A0B8]">This will revoke all active sessions instantly.</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-[#2A2A3C] bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[rgba(255,255,255,0.05)]">
              <LogOut size={16} /> Logout All
            </button>
          </div>
          <div className="h-px w-full bg-[#2A2A3C]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Delete Account</p>
              <p className="text-sm text-[#A0A0B8]">Permanently delete your account and data.</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-[#FF4D8D] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
