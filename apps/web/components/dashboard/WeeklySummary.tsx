import React from 'react';

export function WeeklySummary() {
  // Mock data for the weekly summary chart
  const days = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 65 },
    { day: 'Wed', value: 30 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 100 },
    { day: 'Sat', value: 75 },
    { day: 'Sun', value: 50 },
  ];

  return (
    <section className="bg-[var(--color-surface)] p-6 rounded-2xl border border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Weekly Listening Summary</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">You listened 30% more this week.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[var(--color-accent-pink)]">18h 42m</div>
          <p className="text-xs text-[var(--color-text-muted)]">Total Time</p>
        </div>
      </div>
      
      {/* Mini Bar Chart */}
      <div className="flex items-end justify-between h-32 gap-2 mt-4">
        {days.map((d, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 gap-2 group">
            {/* The Bar */}
            <div className="w-full relative bg-white/5 rounded-t-md overflow-hidden flex-1 flex flex-col justify-end transition-colors group-hover:bg-white/10 cursor-pointer">
              <div 
                className="w-full bg-gradient-to-t from-[var(--color-accent-pink)] to-[#ff8a00] rounded-t-md transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,20,147,0.2)] group-hover:shadow-[0_0_15px_rgba(255,20,147,0.5)] group-hover:brightness-110"
                style={{ height: `${d.value}%` }}
              ></div>
              
              {/* Tooltip on hover */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white bg-black/50 px-1.5 py-0.5 rounded pointer-events-none">
                {d.value}%
              </div>
            </div>
            
            {/* Label */}
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">{d.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
