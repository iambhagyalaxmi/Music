"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag } from 'lucide-react';
import { Song } from '@/lib/store/useMusicStore';

interface ReportSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export function ReportSongModal({ isOpen, onClose, song }: ReportSongModalProps) {
  const [selectedReason, setSelectedReason] = useState('');

  const reasons = [
    'Wrong metadata (Title/Artist)',
    'Explicit content not marked',
    'Audio quality issue',
    'Copyright violation',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    // API call would go here
    
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-[9999] font-bold text-sm pointer-events-none transition-opacity duration-300';
    toast.innerText = '✓ Report submitted';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);

    onClose();
    setTimeout(() => setSelectedReason(''), 300); // clear after animation
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#11131B] border border-[#262C3A] rounded-[24px] w-full max-w-sm p-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-[#A1A1AA] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Flag size={20} className="text-red-400" />
              Report Song
            </h2>
            <p className="text-[#A1A1AA] text-sm mb-6 truncate">What's wrong with "{song?.title}"?</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {reasons.map(reason => (
                  <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-[#262C3A] hover:bg-[#1D2230] cursor-pointer transition-colors">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedReason === reason ? 'border-[#FF4D8D]' : 'border-[#A1A1AA]'}`}>
                      {selectedReason === reason && <div className="w-2.5 h-2.5 bg-[#FF4D8D] rounded-full" />}
                    </div>
                    <span className="text-[#F8FAFC] text-sm font-medium">{reason}</span>
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={reason} 
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="hidden" 
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#262C3A]">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full font-bold text-[#F8FAFC] hover:bg-[#1D2230] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!selectedReason}
                  className="px-6 py-2.5 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
