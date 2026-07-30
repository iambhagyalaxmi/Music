import React from 'react';
import { SectionContainer } from '../discover/SectionContainer';
import { SectionHeader } from '../discover/SectionHeader';
import { Disc, Play, Search, Heart, Music, ListMusic, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusicStore } from '@/lib/store/useMusicStore';
import { useRouter } from 'next/navigation';

interface LibraryAlbumsProps {
  albums?: any[]; // optional now, as we use global state
  onPlay: (a: any) => void;
}

export function LibraryAlbums({ onPlay }: LibraryAlbumsProps) {
  const { savedAlbums, toggleSaveAlbum } = useMusicStore();
  const router = useRouter();

  // Mock recommended albums
  const recommendedAlbums = [
    { id: 'rec-1', title: 'After Hours', artist: 'The Weeknd', year: 2020, songCount: 14, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80' },
    { id: 'rec-2', title: 'Future Nostalgia', artist: 'Dua Lipa', year: 2020, songCount: 11, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80' },
    { id: 'rec-3', title: 'Midnights', artist: 'Taylor Swift', year: 2022, songCount: 13, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80' },
    { id: 'rec-4', title: 'Renaissance', artist: 'Beyoncé', year: 2022, songCount: 16, cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=300&q=80' },
    { id: 'rec-5', title: 'Dawn FM', artist: 'The Weeknd', year: 2022, songCount: 16, cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80' },
  ];

  if (!savedAlbums || savedAlbums.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <SectionContainer>
          <SectionHeader title="Saved Albums" icon={Disc} />
          
          {/* Premium Empty State */}
          <div className="relative w-full rounded-[24px] bg-[#161A23] border border-[#262C3A] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 md:p-10 shadow-lg h-auto md:h-[240px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="flex flex-col flex-1 z-10 w-full md:w-auto text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">No Saved Albums Yet</h3>
              <p className="text-[#A1A1AA] text-sm max-w-md mb-6 mx-auto md:mx-0 leading-relaxed">
                Build your collection. Save your favorite albums to access them quickly and enjoy full-length listening experiences.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('recommended-albums')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#1CA04D] text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all w-full sm:w-auto"
                >
                  <Disc size={18} strokeWidth={3} />
                  Explore Albums
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/discover')}
                  className="flex items-center justify-center gap-2 bg-transparent hover:bg-[#1D2230] text-[#F8FAFC] border border-[#262C3A] hover:border-[#F8FAFC] px-6 py-3 rounded-full font-bold transition-all w-full sm:w-auto"
                >
                  <Search size={18} />
                  Discover Trending Albums
                </motion.button>
              </div>
            </div>

            <div className="hidden md:flex flex-col gap-3 pl-10 border-l border-[#262C3A] z-10 w-[300px] shrink-0">
              <div className="flex items-center gap-3 text-[#A1A1AA]">
                <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#22C55E]">
                  <Heart size={14} />
                </div>
                <span className="text-sm font-medium">Save full records</span>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA]">
                <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#FF4D8D]">
                  <Music size={14} />
                </div>
                <span className="text-sm font-medium">Listen in order</span>
              </div>
              <div className="flex items-center gap-3 text-[#A1A1AA]">
                <div className="w-8 h-8 rounded-full bg-[#1D2230] flex items-center justify-center text-[#3B82F6]">
                  <ListMusic size={14} />
                </div>
                <span className="text-sm font-medium">Build your library</span>
              </div>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer id="recommended-albums">
          <SectionHeader title="Recommended Albums" icon={Disc} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recommendedAlbums.map((album, idx) => (
              <LibraryAlbumCard 
                key={`rec-${idx}`} 
                album={album} 
                onPlay={onPlay} 
                isSaved={savedAlbums.some(a => a.id === album.id)}
                onToggleSave={() => toggleSaveAlbum(album)}
              />
            ))}
          </div>
        </SectionContainer>
      </div>
    );
  }

  return (
    <SectionContainer>
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Saved Albums" icon={Disc} onViewAll={() => {}} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {savedAlbums.map((album, idx) => (
          <LibraryAlbumCard 
            key={`${album.id || 'al'}-${idx}`} 
            album={album} 
            onPlay={onPlay} 
            isSaved={true}
            onToggleSave={() => toggleSaveAlbum(album)}
          />
        ))}
      </div>
    </SectionContainer>
  );
}

interface LibraryAlbumCardProps {
  album: any;
  onPlay: (a: any) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

function LibraryAlbumCard({ album, onPlay, isSaved, onToggleSave }: LibraryAlbumCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -4 }}
      className="group relative flex flex-col p-4 rounded-[18px] bg-[#161A23] border border-[#23293A] hover:border-[#22C55E]/30 transition-all shadow-sm hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] cursor-pointer"
      onClick={() => onPlay(album)}
    >
      {/* Cover Image */}
      <div className="relative w-full aspect-square rounded-[12px] overflow-hidden shadow-md mb-4 bg-[#09090B]">
        <img 
          src={album.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80'} 
          alt={album.title || 'Album'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-between items-start w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-md transition-colors"
            >
              <Heart size={16} className={isSaved ? "fill-[#22C55E] text-[#22C55E]" : ""} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Context menu mock action
              }}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white backdrop-blur-md transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex justify-end w-full">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onPlay(album);
              }}
              className="w-12 h-12 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,197,94,0.5)] translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              <Play size={24} className="fill-current ml-1" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Metadata */}
      <div className="flex flex-col min-w-0">
        <h4 className="font-bold text-[#F8FAFC] text-[16px] truncate group-hover:text-[#22C55E] transition-colors mb-1">
          {album.title || 'Unknown Album'}
        </h4>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] text-[#A1A1AA] truncate">
            {album.artist || 'Unknown Artist'}
          </span>
          <span className="text-[12px] text-[#8C93A7] mt-1">
            {album.year || new Date().getFullYear()} • {album.songCount || Math.floor(Math.random() * 15) + 5} Tracks
          </span>
        </div>
      </div>
    </motion.div>
  );
}
