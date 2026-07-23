"use client";

import React from 'react';
import { Tv, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TrendingVideos() {
  const router = useRouter();

  const videos = [
    { id: 1, title: 'Live at Wembley', artist: 'Queen', views: '1.2M', trackId: 'sUJkCXE4sAA' },
    { id: 2, title: 'Studio Session', artist: 'Daft Punk', views: '800K', trackId: 'FGBhQbmPwH8' },
  ];

  const handlePlay = (video: any) => {
    const params = new URLSearchParams({
      initialTrack: video.trackId,
      title: video.title,
      artist: video.artist,
      duration: '0',
      thumbnail: ''
    });
    router.push(`/rooms/${Math.random().toString(36).substring(7)}?${params.toString()}`);
  };

  return (
    <div className="widget-card">
      <div className="widget-header">
        <Tv className="w-5 h-5 text-[#1DB954]" />
        <h3 className="widget-title">Trending Videos</h3>
      </div>
      <div className="widget-list">
        {videos.map((video) => (
          <div key={video.id} className="video-item" onClick={() => handlePlay(video)} style={{ cursor: 'pointer' }}>
            <div className="video-thumbnail-container">
              <div className="video-thumbnail-overlay">
                 <Play className="video-play-icon" fill="currentColor" />
              </div>
            </div>
            <h4 className="video-title">{video.title}</h4>
            <div className="video-meta">
              <p className="video-artist">{video.artist}</p>
              <span className="video-views">{video.views} views</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
