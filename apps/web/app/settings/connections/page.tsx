"use client";

import React, { useState } from 'react';
import { Link as LinkIcon, Music, MessageSquare, Radio, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  username?: string;
  color: string;
  bgColor: string;
  features?: string[];
}

export default function ConnectionsSettingsPage() {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: 'spotify',
      name: 'Spotify',
      description: 'Sync your listening history and import playlists directly from Spotify.',
      icon: Music,
      connected: true,
      username: 'spotifyuser_123',
      color: '#1DB954',
      bgColor: 'bg-[#1DB954]',
      features: ['Import Playlists', 'Sync Listening History', 'Cross-playback'],
    },
    {
      id: 'applemusic',
      name: 'Apple Music',
      description: 'Connect to stream Apple Music tracks directly within SoundSphere.',
      icon: Music, // Using Music icon as a generic substitute for Apple
      connected: false,
      color: '#FA243C',
      bgColor: 'bg-[#FA243C]',
      features: ['Library Sync', 'High-Res Audio'],
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Display what you are listening to on your Discord profile as a rich presence.',
      icon: MessageSquare,
      connected: true,
      username: 'GamerDude#9999',
      color: '#5865F2',
      bgColor: 'bg-[#5865F2]',
      features: ['Rich Presence', 'Join via Discord'],
    },
    {
      id: 'lastfm',
      name: 'Last.fm',
      description: 'Automatically scrobble everything you listen to on SoundSphere.',
      icon: Radio,
      connected: false,
      color: '#D51007',
      bgColor: 'bg-[#D51007]',
      features: ['Scrobbling', 'Listening Stats'],
    }
  ]);

  const toggleConnection = (id: string) => {
    setProviders(providers.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          connected: !p.connected, 
          username: !p.connected ? `${p.name.toLowerCase()}_user` : undefined 
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-white flex items-center gap-3">
          <LinkIcon className="text-[#4D9FFF]" size={32} />
          Connected Accounts
        </h2>
        <p className="mt-2 text-[#A0A0B8]">Link your music and social accounts to enhance your SoundSphere experience.</p>
      </div>

      <div className="grid gap-6">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <div 
              key={provider.id}
              className={cn(
                "rounded-2xl border bg-[#11111A] p-6 transition-all duration-300 relative overflow-hidden",
                provider.connected 
                  ? "border-[rgba(255,255,255,0.1)] shadow-lg" 
                  : "border-[#2A2A3C] opacity-80 hover:opacity-100 hover:border-[rgba(255,255,255,0.05)]"
              )}
            >
              {provider.connected && (
                <div 
                  className="absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full pointer-events-none opacity-20"
                  style={{ backgroundColor: provider.color }}
                ></div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                      provider.bgColor
                    )}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {provider.name}
                      {provider.connected && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1DB954] text-[#09090B]">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-[#A0A0B8] mt-1 max-w-md">{provider.description}</p>
                    
                    {provider.connected && provider.username && (
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <span className="text-[#6B6B85]">Connected as</span>
                        <span className="font-semibold text-white px-2 py-1 rounded bg-[rgba(255,255,255,0.05)]">
                          {provider.username}
                        </span>
                      </div>
                    )}

                    {provider.features && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {provider.features.map(feature => (
                          <span key={feature} className="text-xs font-medium text-[#6B6B85] px-2.5 py-1 rounded-full border border-[#2A2A3C] bg-[rgba(255,255,255,0.02)]">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center justify-between sm:items-end gap-3 sm:gap-2">
                  <button
                    onClick={() => toggleConnection(provider.id)}
                    className={cn(
                      "px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2",
                      provider.connected
                        ? "bg-[rgba(255,255,255,0.05)] text-white hover:bg-red-500/10 hover:text-red-400"
                        : `${provider.bgColor} text-white hover:brightness-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                    )}
                  >
                    {provider.connected ? 'Disconnect' : 'Connect'}
                  </button>
                  
                  {!provider.connected && (
                    <button className="text-xs text-[#A0A0B8] hover:text-white flex items-center gap-1 transition-colors">
                      Learn more <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3 mt-8">
        <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-blue-200/70">
          SoundSphere will never post to your social accounts without your explicit permission. You can revoke access at any time from your provider's security settings.
        </p>
      </div>
    </div>
  );
}
