import React from 'react';
import { Calendar } from 'lucide-react';

interface ActivityHeatmapProps {
  data?: { date: string; intensity: number }[];
}

export function ActivityHeatmap({ data = [] }: ActivityHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Generate dummy heatmap data if empty
  const heatmapData = data.length > 0 ? data : Array.from({ length: 52 * 7 }).map((_, i) => ({
    date: `2026-01-${(i % 31) + 1}`,
    intensity: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
  }));

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-white/5';
      case 1: return 'bg-pink-500/30';
      case 2: return 'bg-pink-500/60';
      case 3: return 'bg-pink-500';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="text-pink-500" size={20} />
        <h3 className="font-bold text-lg text-white">Listening Intensity</h3>
      </div>
      
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 mt-4">
          {days.map(day => (
            <span key={day} className="text-[10px] text-gray-500 h-3 leading-3 font-medium w-6">{day}</span>
          ))}
        </div>
        
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <div className="flex gap-1">
            {/* Split data into weeks */}
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const idx = weekIdx * 7 + dayIdx;
                  if (idx >= heatmapData.length) return null;
                  const item = heatmapData[idx];
                  return (
                    <div 
                      key={dayIdx} 
                      className={`w-3 h-3 rounded-sm ${getIntensityColor(item.intensity)} hover:ring-1 ring-white/50 cursor-pointer transition-all`}
                      title={`${item.date}: ${item.intensity} intensity`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-gray-500 font-medium">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-white/5"></div>
          <div className="w-3 h-3 rounded-sm bg-pink-500/30"></div>
          <div className="w-3 h-3 rounded-sm bg-pink-500/60"></div>
          <div className="w-3 h-3 rounded-sm bg-pink-500"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
