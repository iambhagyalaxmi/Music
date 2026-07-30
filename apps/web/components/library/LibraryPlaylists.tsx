import React, { useState, useEffect } from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { ListMusic, Play, Plus, Search, Heart, Share2, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '@/lib/store/useMusicStore';

interface LibraryPlaylistsProps {
  playlists?: any[]; // optional now, as we use global state
  onPlay: (p: any) => void;
}

export function LibraryPlaylists({ onPlay }: LibraryPlaylistsProps) {
  const { userPlaylists, createPlaylist } = useMusicStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Modal form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [coverUrl, setCoverUrl] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPlaylist = {
      id: Math.random().toString(),
      title: name,
      description,
      creator: 'You',
      songCount: 0,
      lastUpdated: 'Just now',
      images: coverUrl ? [coverUrl] : [
        `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80`
      ]
    };

    createPlaylist(newPlaylist);
    setIsModalOpen(false);
    setName('');
    setDescription('');
    setCoverUrl('');
    setVisibility('Public');
  };

  if (!userPlaylists || userPlaylists.length === 0) {
    return (
      <SectionContainer>
        <SectionHeader title="Your Playlists" icon={ListMusic} />
        
        {/* New Premium Empty State */}
        <div className="relative w-full rounded-[24px] bg-[#161A23] border border-[#262C3A] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-10 shadow-lg h-auto md:h-[240px]">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex flex-col flex-1 z-10 w-full md:w-auto text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">No Playlists Yet</h3>
            <p className="text-[#A1A1AA] text-sm max-w-md mb-6 mx-auto md:mx-0 leading-relaxed">
              Build your personal music library. Create playlists for every mood, occasion, or genre.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#FF4D8D] hover:bg-[#FF3377] text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,77,141,0.3)] transition-all w-full sm:w-auto"
              >
                <Plus size={18} strokeWidth={3} />
                Create Your First Playlist
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-[#1D2230] text-[#F8FAFC] border border-[#262C3A] hover:border-[#F8FAFC] px-6 py-3 rounded-full font-bold transition-all w-full sm:w-auto"
              >
                <Search size={18} />
                Browse Music
              </motion.button>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-3 pl-10 border-l border-[#262C3A] z-10 w-[300px] shrink-0">
            <div className="flex items-center gap-3 text-[#A1A1AA]">
              <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#FF4D8D]">
                <Heart size={14} />
              </div>
              <span className="text-sm font-medium">Save favorite songs</span>
            </div>
            <div className="flex items-center gap-3 text-[#A1A1AA]">
              <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#8B5CF6]">
                <Sparkles size={14} />
              </div>
              <span className="text-sm font-medium">Organize by mood</span>
            </div>
            <div className="flex items-center gap-3 text-[#A1A1AA]">
              <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#3B82F6]">
                <Share2 size={14} />
              </div>
              <span className="text-sm font-medium">Share with friends</span>
            </div>
          </div>
        </div>

        <CreatePlaylistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          name={name} setName={setName}
          description={description} setDescription={setDescription}
          visibility={visibility} setVisibility={setVisibility}
          coverUrl={coverUrl} setCoverUrl={setCoverUrl}
        />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Your Playlists" icon={ListMusic} onViewAll={() => {}} />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-[#FF4D8D] hover:bg-[#FF3377] text-white px-4 py-2 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(255,77,141,0.25)] transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          New Playlist
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {userPlaylists.map((playlist, idx) => (
          <PlaylistCard key={`${playlist.id || 'pl'}-${idx}`} playlist={playlist} onPlay={onPlay} />
        ))}
      </div>

      <CreatePlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        name={name} setName={setName}
        description={description} setDescription={setDescription}
        visibility={visibility} setVisibility={setVisibility}
        coverUrl={coverUrl} setCoverUrl={setCoverUrl}
      />
    </SectionContainer>
  );
}

export function CreatePlaylistModal({ 
  isOpen, onClose, onSubmit, 
  name, setName, 
  description, setDescription, 
  visibility, setVisibility,
  coverUrl, setCoverUrl
}: any) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#11131B] border border-[#262C3A] rounded-[24px] w-full max-w-lg p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Create Playlist</h2>
              
              <form onSubmit={onSubmit} className="flex flex-col gap-5">
                
                {/* Form Fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#A1A1AA]">Name <span className="text-[#FF4D8D]">*</span></label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="My Awesome Playlist"
                    className="w-full bg-[#161A23] border border-[#262C3A] focus:border-[#FF4D8D] rounded-xl px-4 py-3 text-white placeholder-[#8C93A7] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#A1A1AA]">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add an optional description"
                    rows={2}
                    className="w-full bg-[#161A23] border border-[#262C3A] focus:border-[#FF4D8D] rounded-xl px-4 py-3 text-white placeholder-[#8C93A7] outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#A1A1AA]">Visibility</label>
                    <div className="flex bg-[#161A23] rounded-xl p-1 border border-[#262C3A]">
                      {['Public', 'Private'].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setVisibility(v)}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${visibility === v ? 'bg-[#FF4D8D] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white'}`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-[#A1A1AA]">Cover Image URL</label>
                    <div className="relative">
                      <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                      <input 
                        type="url" 
                        value={coverUrl}
                        onChange={e => setCoverUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#161A23] border border-[#262C3A] focus:border-[#FF4D8D] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#8C93A7] text-sm outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#262C3A]">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full font-bold text-[#F8FAFC] hover:bg-[#1D2230] transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!name.trim()}
                    className="px-6 py-2.5 rounded-full font-bold text-white bg-[#FF4D8D] hover:bg-[#FF3377] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,77,141,0.2)]"
                  >
                    Create
                  </motion.button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PlaylistCard({ playlist, onPlay }: { playlist: any, onPlay: (p: any) => void }) {
  const images = playlist.images || [
    `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80`,
    `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80`,
    `https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80`,
    `https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=150&q=80`
  ];

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -4 }}
      className="group relative flex flex-col p-4 rounded-[18px] bg-[#161A23] border border-[#23293A] hover:border-[#8B5CF6]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] cursor-pointer"
      onClick={() => onPlay(playlist)}
    >
      <div className="relative w-full aspect-square rounded-[12px] overflow-hidden mb-4 shadow-md bg-[#09090B]">
        {images.length >= 4 ? (
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
            {images.slice(0, 4).map((img: string, i: number) => (
              <img key={i} src={img} alt="Playlist Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ))}
          </div>
        ) : (
          <img src={images[0]} alt="Playlist Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPlay(playlist);
            }}
            className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <Play size={24} className="fill-current ml-1" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col min-w-0">
        <h4 className="font-bold text-[#F8FAFC] text-[16px] truncate group-hover:text-[#8B5CF6] transition-colors mb-1">
          {playlist.title || 'My Playlist'}
        </h4>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-[#A1A1AA] truncate">
            {playlist.songCount || 0} Songs • {playlist.creator || 'You'}
          </span>
          <span className="text-[11px] text-[#8C93A7] uppercase tracking-wide font-bold mt-1">
            Updated {playlist.lastUpdated || 'Just now'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
