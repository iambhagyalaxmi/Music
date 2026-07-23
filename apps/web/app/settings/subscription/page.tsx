"use client";

import React from 'react';
import { CreditCard, Check, Zap, Shield, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <CreditCard className="text-[#FFD700]" size={32} />
          Subscription
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Manage your premium membership, view billing history, and update payment methods.</p>
      </div>

      {/* Current Plan */}
      <div className="rounded-3xl border-2 border-[#FFD700]/30 bg-gradient-to-br from-[#11111A] to-[#FFD700]/10 p-8 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Crown size={150} />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold uppercase tracking-wider mb-4 border border-[#FFD700]/30">
              Current Plan
            </div>
            <h3 className="text-4xl font-black text-white flex items-center gap-3">
              SoundSphere <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-orange-400">Premium</span>
            </h3>
            <p className="text-[#A0A0B8] mt-2 text-lg">Next billing date: <strong>August 14, 2026</strong></p>
            
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2.5 rounded-xl bg-[#FFD700] text-black font-bold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                Manage Plan
              </button>
              <button className="px-6 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-white font-bold hover:bg-[rgba(255,255,255,0.1)] transition-all">
                Cancel Subscription
              </button>
            </div>
          </div>
          
          <div className="shrink-0 bg-[#09090B]/50 backdrop-blur-sm rounded-2xl p-6 border border-[rgba(255,255,255,0.05)] w-full md:w-64">
            <p className="text-sm text-[#A0A0B8] font-medium uppercase tracking-wider mb-4">Your Benefits</p>
            <ul className="space-y-3">
              {[
                { text: 'Ad-free listening', icon: Shield },
                { text: 'High-res audio', icon: Zap },
                { text: 'Offline downloads', icon: Check },
                { text: 'AI DJ Features', icon: Crown }
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white">
                  <benefit.icon size={16} className="text-[#FFD700]" />
                  {benefit.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-[#2A2A3C] bg-[#11111A] p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6">Payment Method</h3>
        <div className="p-4 rounded-xl border border-[#2A2A3C] bg-[rgba(255,255,255,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-10 rounded bg-[#2A2A3C] flex items-center justify-center font-black italic text-white shadow-inner">
              VISA
            </div>
            <div>
              <p className="font-bold text-white">Visa ending in 4242</p>
              <p className="text-xs text-[#A0A0B8]">Expires 12/28</p>
            </div>
          </div>
          <button className="text-sm font-semibold text-[#4D9FFF] hover:text-white transition-colors">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
