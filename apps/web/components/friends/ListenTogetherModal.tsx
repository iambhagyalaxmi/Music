import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Headphones, Plus, UserPlus, Music, Users, Shield, Link as LinkIcon } from 'lucide-react';

interface ListenTogetherModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendName?: string;
}

export function ListenTogetherModal({ isOpen, onClose, friendName }: ListenTogetherModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 relative">
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-full bg-[#9D4EDD]/20 text-[#9D4EDD] flex items-center justify-center mb-4">
              <Headphones size={24} />
            </div>
            <h2 className="text-2xl font-bold mb-1">Listen Together</h2>
            <p className="text-gray-400 text-sm">
              {friendName ? `Connect and sync music with ${friendName}.` : 'Start a collaborative listening session.'}
            </p>
          </div>

          <div className="p-6 flex flex-col gap-3">
            <button className="flex items-center justify-between p-4 bg-[#181824] hover:bg-[#20202e] border border-white/5 rounded-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Join Existing Room</h3>
                  <p className="text-xs text-gray-400">See public rooms or enter a code</p>
                </div>
              </div>
            </button>

            <button className="flex items-center justify-between p-4 bg-[#181824] hover:bg-[#20202e] border border-white/5 rounded-xl transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#9D4EDD]/10 text-[#9D4EDD] flex items-center justify-center group-hover:bg-[#9D4EDD] group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Create New Room</h3>
                  <p className="text-xs text-gray-400">Start your own private or public session</p>
                </div>
              </div>
            </button>

            {friendName && (
              <button className="flex items-center justify-between p-4 bg-[#181824] hover:bg-[#20202e] border border-white/5 rounded-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <UserPlus size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-white">Invite to Current Room</h3>
                    <p className="text-xs text-gray-400">Send an invite link directly</p>
                  </div>
                </div>
              </button>
            )}
            
            <button className="mt-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-300 transition-colors flex items-center justify-center gap-2">
              <LinkIcon size={16} /> Copy Invite Link
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
