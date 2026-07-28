import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'danger';
}

export function Dialog({ isOpen, onClose, title, description, children, footer, variant = 'default' }: DialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isMounted) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div 
        className={cn(
          "relative z-50 w-full max-w-md scale-100 transform overflow-hidden rounded-2xl border bg-[#11111A] p-6 text-left align-middle shadow-2xl transition-all",
          variant === 'danger' ? "border-[#FF4D8D]/20 shadow-[0_8px_32px_-8px_rgba(255,77,141,0.2)]" : "border-[#2A2A3C]"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#A0A0B8] transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white" id="modal-headline">
          {title}
        </h3>
        
        {description && (
          <p className="mt-2 text-sm text-[#A0A0B8]">
            {description}
          </p>
        )}

        <div className="mt-6">
          {children}
        </div>

        {footer && (
          <div className="mt-8 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
