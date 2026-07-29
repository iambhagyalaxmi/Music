import React from 'react';
import { Music, Clock, Users, Radio } from 'lucide-react';

interface QuickStatsProps {
  friendsOnline?: number;
}

export function QuickStats({ friendsOnline = 0 }: QuickStatsProps) {
  const stats = [
    { label: 'Songs Played', value: '34', icon: Music, color: 'text-purple-400' },
    { label: 'Listening Time', value: '2h 41m', icon: Clock, color: 'text-blue-400' },
    { label: 'Friends Online', value: friendsOnline.toString(), icon: Users, color: 'text-green-400' },
    { label: 'Active Rooms', value: '5', icon: Radio, color: 'text-orange-400' },
  ];

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Today's Activity</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-[var(--color-surface)] p-4 rounded-xl border border-white/5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className={stat.color} size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
