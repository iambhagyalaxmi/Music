import React from 'react';
import { Calendar } from 'lucide-react';

export function ListeningCalendar() {
  const data = [
    { label: 'Today', value: '8 Songs' },
    { label: 'Yesterday', value: '24 Songs' },
    { label: 'This Week', value: '138 Songs' },
    { label: 'This Month', value: '712 Songs' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {data.map((item) => (
        <div key={item.label} className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{item.label}</p>
          <p className="font-black text-xl text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
