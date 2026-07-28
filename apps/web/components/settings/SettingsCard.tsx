import React from 'react';
import { cn } from '@/lib/utils';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger';
}

export function SettingsCard({ title, description, children, className, variant = 'default' }: SettingsCardProps) {
  return (
    <div 
      className={cn(
        "rounded-3xl border bg-[#11111A]/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
        variant === 'danger' ? "border-[#FF4D8D]/30 bg-[rgba(255,77,141,0.03)]" : "border-[rgba(255,255,255,0.05)]",
        className
      )}
    >
      <div className="mb-6">
        <h3 className={cn("text-lg font-bold", variant === 'danger' ? "text-[#FF4D8D]" : "text-white")}>
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-[#A0A0B8]">
            {description}
          </p>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
