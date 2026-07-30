"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check } from 'lucide-react';
import { Song, useMusicStore } from '@/lib/store/useMusicStore';
import { CreatePlaylistModal } from '../library/LibraryPlaylists';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

export function AddToPlaylistModal({ isOpen, onClose, song }: AddToPlaylistModalProps) {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const { userPlaylists, createPlaylist, addSongToPlaylist, removeSongFromPlaylist } = useMusicStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [coverUrl, setCoverUrl] = useState('');

  const togglePlaylist = (id: string) => {
    const isAdding = !selectedPlaylists.includes(id);
    
    setSelectedPlaylists(prev => 
      isAdding ? [...prev, id] : prev.filter(p => p !== id)
    );
    
    if (song) {
      if (isAdding) {
        addSongToPlaylist(id, song);
        showToast(`✓ Added to Playlist`);
      } else {
        removeSongFromPlaylist(id, song.trackId);
        showToast(`Removed from Playlist`);
      }
    }
  };

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlaylist = {
      id: Math.random().toString(),
      title: name,
      description,
      creator: 'You',
      songCount: song ? 1 : 0,
      lastUpdated: 'Just now',
      images: coverUrl ? [coverUrl] : (song?.cover ? [song.cover] : [`https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80`])
    };

    createPlaylist(newPlaylist);
    if (song) {
      setSelectedPlaylists(prev => [...prev, newPlaylist.id]);
      showToast(`✓ Created and added to ${name}`);
    }
    
    setIsCreateModalOpen(false);
    setName('');
    setDescription('');
    setCoverUrl('');
    setVisibility('Public');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !isCreateModalOpen && (
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

              <h2 className="text-xl font-bold text-white mb-6">Add to Playlist</h2>
              
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {userPlaylists.length === 0 && (
                  <div className="text-center text-[#A1A1AA] text-sm py-4">
                    No playlists yet.
                  </div>
                )}
                {userPlaylists.map(pl => {
                  const isSelected = selectedPlaylists.includes(pl.id);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => togglePlaylist(pl.id)}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#1D2230] transition-colors text-left"
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#FF4D8D] border-[#FF4D8D]' : 'border-[#A1A1AA]'}`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <span className="text-[#F8FAFC] font-medium">{pl.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-[#262C3A]">
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-[#1D2230] text-[#FF4D8D] transition-colors text-left font-bold"
                >
                  <Plus size={20} />
                  Create New Playlist
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePlaylistModal 
        isOpen={isOpen && isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        name={name} setName={setName}
        description={description} setDescription={setDescription}
        visibility={visibility} setVisibility={setVisibility}
        coverUrl={coverUrl} setCoverUrl={setCoverUrl}
      />
    </>
  );
}
