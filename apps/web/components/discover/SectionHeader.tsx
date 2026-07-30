import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onViewAll?: () => void;
}

export function SectionHeader({ title, subtitle, icon: Icon, onViewAll }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          {Icon && <Icon className="text-[var(--color-accent-pink)]" size={24} />}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>
      
      {onViewAll && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="text-sm font-bold text-[var(--color-accent-pink)] hover:text-white transition-colors flex items-center gap-1"
        >
          View All <span aria-hidden="true">&rarr;</span>
        </motion.button>
      )}
    </div>
  );
}
