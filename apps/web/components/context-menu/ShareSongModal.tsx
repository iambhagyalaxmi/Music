"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, MessageCircle, Mail, Send, Share } from 'lucide-react';
import { Song } from '@/lib/store/useMusicStore';

interface ShareSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export function ShareSongModal({ isOpen, onClose, song }: ShareSongModalProps) {
  const showToast = (msg: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#FF4D8D] text-white px-4 py-2 rounded-full shadow-lg z-[9999] font-bold text-sm pointer-events-none transition-opacity duration-300';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const handleShare = (platform: string) => {
    // In a real app, integrate with native share API or custom popups
    if (platform === 'copy') {
      navigator.clipboard.writeText(`https://soundsphere.app/track/${song?.trackId}`);
      showToast('✓ Link copied');
    } else {
      showToast(`Sharing to ${platform}...`);
    }
    onClose();
  };

  const shareOptions = [
    { id: 'copy', name: 'Copy Link', icon: LinkIcon, color: 'bg-[#1D2230] text-white hover:bg-[#262C3A]' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-[#25D366] text-white hover:bg-[#20bd5a]' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-[#0088cc] text-white hover:bg-[#0077b3]' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-[#EA4335] text-white hover:bg-[#d93c2f]' },
    { id: 'other', name: 'Other', icon: Share, color: 'bg-[#161A23] border border-[#262C3A] text-white hover:bg-[#1D2230]' },
  ];

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

            <h2 className="text-xl font-bold text-white mb-2">Share Song</h2>
            <p className="text-[#A1A1AA] text-sm mb-6 truncate">{song?.title} • {song?.artist}</p>
            
            <div className="grid grid-cols-3 gap-4">
              {shareOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${option.color}`}>
                    <option.icon size={24} />
                  </div>
                  <span className="text-xs text-[#A1A1AA] font-medium group-hover:text-white transition-colors">
                    {option.name}
                  </span>
                </button>
              ))}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
