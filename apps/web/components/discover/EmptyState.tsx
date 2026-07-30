import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title = "No data available", 
  message, 
  actionText = "Explore Music", 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-[18px] bg-white/5 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md">{message}</p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-[var(--color-accent-pink)] text-white px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(255,77,141,0.3)] hover:shadow-[0_0_25px_rgba(255,77,141,0.5)] transition-shadow"
        >
          {actionText}
        </motion.button>
      )}
    </div>
  );
}
