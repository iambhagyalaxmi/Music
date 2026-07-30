"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore, Song } from '@/lib/store/useMusicStore';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  ListPlus, 
  Heart, 
  Disc, 
  Radio, 
  Mic2, 
  Download, 
  Share2, 
  Link as LinkIcon, 
  EyeOff, 
  Flag,
  ArrowRightToLine
} from 'lucide-react';
import { AddToPlaylistModal } from './AddToPlaylistModal';
import { ShareSongModal } from './ShareSongModal';
import { ReportSongModal } from './ReportSongModal';

interface ContextMenuContextType {
  openMenu: (song: Song, e: React.MouseEvent | { clientX: number; clientY: number }) => void;
  closeMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

export function useSongContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("useSongContextMenu must be used within SongContextMenuProvider");
  return context;
}

export function SongContextMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const { playSong, insertNext, addToQueue, toggleLike, likedSongs } = useMusicStore();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const openMenu = (targetSong: Song, e: React.MouseEvent | { clientX: number; clientY: number }) => {
    if ('preventDefault' in e) (e as any).preventDefault();
    setSong(targetSong);
    
    // Calculate position to keep it in viewport
    let x = e.clientX;
    let y = e.clientY;
    
    // Very rough estimation of menu dimensions
    const menuWidth = 240;
    const menuHeight = 450;
    
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    
    setPosition({ x, y });
    setIsOpen(true);
  };

  const closeMenu = () => setIsOpen(false);

  const handleAction = (action: () => void) => {
    action();
    if (!isMobile) closeMenu(); 
    closeMenu();
  };

  // Toast mock (In a real app, use react-hot-toast or similar)
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

  const isLiked = song ? likedSongs.includes(song.trackId) : false;

  const MenuContent = () => {
    if (!song) return null;

    return (
      <div className="flex flex-col w-full">
        {/* Header (Mostly for mobile) */}
        {isMobile && (
          <div className="flex items-center gap-3 p-4 border-b border-[#262C3A] mb-2">
            <img src={song.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&q=80'} className="w-12 h-12 rounded-md object-cover" />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white truncate">{song.title}</span>
              <span className="text-sm text-[#A1A1AA] truncate">{song.artist}</span>
            </div>
          </div>
        )}

        <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <MenuItem icon={Play} label="Play Now" onClick={() => handleAction(() => playSong(song))} />
          <MenuItem icon={ArrowRightToLine} label="Play Next" onClick={() => handleAction(() => { insertNext(song); showToast('✓ Added to play next'); })} />
          <MenuItem icon={ListPlus} label="Add to Queue" onClick={() => handleAction(() => { addToQueue(song); showToast('✓ Added to queue'); })} />
          
          <div className="h-px bg-[#262C3A] my-1 mx-2" />
          
          <MenuItem 
            icon={Heart} 
            label={isLiked ? "Liked" : "Like Song"} 
            active={isLiked}
            onClick={() => {
              toggleLike(song.trackId);
              showToast(isLiked ? 'Removed from Liked Songs' : '✓ Added to Liked Songs');
            }} 
          />
          <MenuItem icon={Disc} label="Add to Playlist" onClick={() => { setPlaylistModalOpen(true); closeMenu(); }} />
          
          <div className="h-px bg-[#262C3A] my-1 mx-2" />
          
          <MenuItem icon={Radio} label="Start Song Radio" onClick={() => handleAction(() => showToast('Radio started'))} />
          <MenuItem icon={Mic2} label="Go to Artist" onClick={() => handleAction(() => router.push(`/artist/${song.artist}`))} />
          <MenuItem icon={Disc} label="Go to Album" onClick={() => handleAction(() => router.push(`/album/${song.trackId}`))} />
          
          <div className="h-px bg-[#262C3A] my-1 mx-2" />
          
          <MenuItem icon={Download} label="Download" onClick={() => handleAction(() => showToast('Downloading...'))} />
          <MenuItem icon={Share2} label="Share" onClick={() => { setShareModalOpen(true); closeMenu(); }} />
          <MenuItem icon={LinkIcon} label="Copy Song Link" onClick={() => handleAction(() => {
            navigator.clipboard.writeText(`https://soundsphere.app/track/${song.trackId}`);
            showToast('✓ Link copied');
          })} />
          
          <div className="h-px bg-[#262C3A] my-1 mx-2" />
          
          <MenuItem icon={EyeOff} label="Hide Song" onClick={() => handleAction(() => showToast('Song hidden'))} />
          <MenuItem icon={Flag} label="Report" onClick={() => { setReportModalOpen(true); closeMenu(); }} className="text-red-400 hover:text-red-300 hover:bg-red-400/10" />
        </div>
      </div>
    );
  };

  return (
    <ContextMenuContext.Provider value={{ openMenu, closeMenu }}>
      {children}

      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ top: position.y, left: position.x }}
            className="fixed z-[100] w-[240px] bg-[#161A23]/95 backdrop-blur-xl border border-[#262C3A] rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <MenuContent />
          </motion.div>
        )}

        {isOpen && isMobile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[100] bg-[#161A23] border-t border-[#262C3A] rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-6"
            >
              <div className="w-12 h-1.5 bg-[#262C3A] rounded-full mx-auto my-3" />
              <MenuContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddToPlaylistModal isOpen={playlistModalOpen} onClose={() => setPlaylistModalOpen(false)} song={song} />
      <ShareSongModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} song={song} />
      <ReportSongModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} song={song} />
    </ContextMenuContext.Provider>
  );
}

function MenuItem({ icon: Icon, label, onClick, active, className = '' }: any) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200
        ${active ? 'text-[#FF4D8D]' : 'text-[#F8FAFC]'}
        ${!className && 'hover:bg-[#1D2230]'}
        ${className}
      `}
    >
      <Icon size={16} className={active ? "fill-current" : ""} />
      {label}
    </button>
  );
}
