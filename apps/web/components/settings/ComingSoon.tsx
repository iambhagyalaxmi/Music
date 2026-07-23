import React from 'react';

export function ComingSoon({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white">{title}</h1>
      </div>
      <div className="bg-[rgba(17,17,26,0.5)] backdrop-blur-sm rounded-xl p-8 border border-[rgba(255,255,255,0.05)] shadow-lg relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-pink)]/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col items-center justify-center text-center gap-4 py-12 relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl"></div>
            <Icon size={32} className="text-gray-400 relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title} is under construction</h2>
          <p className="text-[#A0A0B8] max-w-md text-lg leading-relaxed">
            {description}
          </p>
          <div className="mt-8 px-6 py-2.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full border border-white/10 text-sm font-semibold text-gray-300 tracking-wide uppercase shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            Coming in a future update
          </div>
        </div>
      </div>
    </div>
  );
}
