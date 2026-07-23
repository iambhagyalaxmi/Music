"use client";

import React from 'react';
import { Flame, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TrendingSongs() {
  const router = useRouter();
  
  const songs = [
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', plays: '2.5M', trackId: '4NRXx6U8ABQ' },
    { id: 2, title: 'Starboy', artist: 'The Weeknd', plays: '1.8M', trackId: '34Na4j8HLjc' },
    { id: 3, title: 'Midnight City', artist: 'M83', plays: '950K', trackId: 'dX3k_LSgb3M' },
    { id: 4, title: 'Levitating', artist: 'Dua Lipa', plays: '820K', trackId: 'TUVcZfQe-Kw' },
    { id: 5, title: 'Watermelon Sugar', artist: 'Harry Styles', plays: '750K', trackId: 'E07s5ZYygMg' },
  ];

  const handlePlay = (song: any) => {
    const params = new URLSearchParams({
      initialTrack: song.trackId,
      title: song.title,
      artist: song.artist,
      duration: '0',
      thumbnail: ''
    });
    router.push(`/rooms/${Math.random().toString(36).substring(7)}?${params.toString()}`);
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <Flame className="w-5 h-5 text-[#FF4D8D]" />
        <h3 className="widget-title">Trending Songs</h3>
      </div>
      <div className="widget-list">
        {songs.map((song, i) => (
          <div key={song.id} className="song-item">
            <div className="song-info-left">
              <span className="song-rank">{i + 1}</span>
              <div>
                <h4 className="song-title">{song.title}</h4>
                <p className="song-artist">{song.artist}</p>
              </div>
            </div>
            <div className="song-info-right">
              <span className="song-plays">{song.plays}</span>
              <button className="song-play-btn" onClick={() => handlePlay(song)}>
                <Play className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
