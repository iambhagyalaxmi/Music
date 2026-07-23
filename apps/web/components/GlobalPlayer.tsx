"use client";

import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { usePathname, useRouter } from 'next/navigation';
import { useGlobalRoom } from '../lib/GlobalRoomContext';
import { Play, Pause, Maximize2, Minimize2, X } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// A memoized container that never re-renders, preventing React from destroying the iframe
// when parent styles change during zoom toggles!
const YouTubeContainer = React.memo(
  () => (
    <iframe 
      id="youtube-player" 
      suppressHydrationWarning
      src={`https://www.youtube.com/embed/M7lc1UVf-VE?enablejsapi=1&autoplay=0&controls=0&disablekb=1&modestbranding=1&rel=0&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, border: 'none' }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  ),
  () => true
);

export function GlobalPlayer() {
  const { roomId, playerRef, globalPlayerWrapperRef, isPlayerReady, setIsPlayerReady, playbackState, queue, play, pause, leaveRoom, playerRect, isVideoZoomed, setIsVideoZoomed, playbackError, setPlaybackError, loadTrack } = useGlobalRoom();
  const pathname = usePathname();
  const router = useRouter();
  
  const isOnRoomPage = pathname?.startsWith('/rooms/') && pathname.length > 7;
  
  const [localProgress, setLocalProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        events: {
          onReady: () => setIsPlayerReady(true),
          onStateChange: (event: any) => { if (event.data === 0) pause(0); },
          onError: (event: any) => {
            if ([100, 101, 150].includes(event.data)) {
              setPlaybackError("This video is restricted by the creator from playing outside of YouTube.");
            } else {
              setPlaybackError("An error occurred playing this video.");
            }
          }
        }
      });
    };
    if (window.YT && window.YT.Player && !playerRef.current) {
      window.onYouTubeIframeAPIReady();
    }
  }, [playerRef, setIsPlayerReady, pause]);

  // Sync mini player progress
  useEffect(() => {
    if (playbackState.isPlaying) {
      const elapsedSinceUpdate = Date.now() - playbackState.updatedAt;
      setLocalProgress(playbackState.positionMs + elapsedSinceUpdate);
      
      if (progressInterval.current) clearInterval(progressInterval.current);
      
      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - playbackState.updatedAt;
        setLocalProgress(playbackState.positionMs + elapsed);
      }, 100);
    } else {
      setLocalProgress(playbackState.positionMs);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [playbackState]);

  // Sync YouTube player with global playback state
  const currentLoadedTrack = useRef<string | null>(null);
  
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady || !playbackState.trackId) return;
    
    try {
      const player = playerRef.current;
      
      // If the track changed, load the new track
      if (currentLoadedTrack.current !== playbackState.trackId) {
        player.loadVideoById(playbackState.trackId, playbackState.positionMs / 1000);
        currentLoadedTrack.current = playbackState.trackId;
        if (!playbackState.isPlaying) {
           setTimeout(() => player.pauseVideo(), 100);
        }
      }
    } catch (err) {
      console.error("YouTube Player Load Error:", err);
    }
    
    // Constantly enforce the global playback state on the YouTube player
    // This self-heals if the browser forcefully pauses the video during fullscreen transitions!
    const enforceInterval = setInterval(() => {
      try {
        const player = playerRef.current;
        if (!player || typeof player.getPlayerState !== 'function') return;
        
        const currentState = player.getPlayerState();
        
        // If we are supposed to be playing, but we are paused (2), unstarted (-1), or cued (5)
        if (playbackState.isPlaying && (currentState === 2 || currentState === -1 || currentState === 5)) {
          player.playVideo();
        } 
        else if (!playbackState.isPlaying && currentState === 1) {
          player.pauseVideo();
        }
        
        if (playbackState.isPlaying) {
          const currentTime = player.getCurrentTime() * 1000;
          const expectedTime = playbackState.positionMs + (Date.now() - playbackState.updatedAt);
          // Allow 2.5 seconds of drift before forcing a seek
          if (Math.abs(currentTime - expectedTime) > 2500) {
            player.seekTo(expectedTime / 1000, true);
          }
        }
      } catch (err) {
        // Ignore silent errors
      }
    }, 500);
    
    return () => clearInterval(enforceInterval);
  }, [playbackState, isPlayerReady, playerRef]);

  const currentTrackDetails = queue.find(s => s.trackId === playbackState.trackId) || { 
    title: playbackState.trackId || 'No Track', 
    artist: 'Unknown Artist', 
    duration: 180000, 
    thumbnail: '' 
  };

  const handlePlayPause = () => {
    if (playbackState.isPlaying) pause(localProgress);
    else play(localProgress);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
      
      {/* YouTube Iframe - Dynamically positioned over the room placeholder via requestAnimationFrame! */}
      <div 
        ref={globalPlayerWrapperRef}
        style={{ 
        position: 'fixed', 
        zIndex: 10000,
        pointerEvents: playbackError ? 'auto' : 'none',
        ...(playerRect.isVisible && isOnRoomPage ? {} : { left: -9999, top: -9999, width: 1, height: 1 }),
        opacity: playerRect.isVisible && isOnRoomPage ? (playbackState.trackId ? 1 : 0) : 0,
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        transition: 'opacity 0.3s'
      }}>
         {/* Inner wrapper to create a cinematic cover effect when zoomed, and 1:1 crop when unzoomed */}
         <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            width: isVideoZoomed ? 'max(100vw, 177.77vh)' : '177.77%', 
            height: isVideoZoomed ? 'max(100vh, 56.25vw)' : '100%', 
            transition: 'all 0.3s ease'
         }}>
            <YouTubeContainer />
         </div>

         {/* Beautiful Error Overlay */}
         {playbackError && isOnRoomPage && (
           <div style={{
             position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
             zIndex: 30, backgroundColor: 'rgba(0,0,0,0.85)', pointerEvents: 'auto',
             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
             padding: '24px', textAlign: 'center', color: '#fff'
           }}>
             <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '12px' }}>Video Restricted</div>
             <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '24px' }}>{playbackError}</div>
             <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
               <button
                 onClick={(e) => {
                   e.stopPropagation();
                   const idx = queue.findIndex(q => q.trackId === playbackState.trackId);
                   if (idx !== -1 && idx < queue.length - 1) {
                     loadTrack(queue[idx + 1].trackId);
                   } else {
                     pause(0);
                   }
                 }}
                 style={{
                   padding: '10px 24px', backgroundColor: '#fff', color: '#000',
                   borderRadius: '24px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                 }}
               >
                 Skip to Next Song
               </button>
               
               <a 
                 href={`https://youtube.com/watch?v=${playbackState.trackId}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 style={{
                   padding: '10px 24px', backgroundColor: 'transparent', color: '#fff',
                   borderRadius: '24px', border: '1px solid rgba(255,255,255,0.5)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'none'
                 }}
               >
                 Watch on YouTube
               </a>
             </div>
           </div>
         )}

         {/* Zoom Toggle Button - Positioned in bottom right like YouTube! */}
         {playbackState.trackId && isOnRoomPage && (
           <button
             onClick={async (e) => {
               e.stopPropagation();
               if (!isVideoZoomed) {
                 if (document.documentElement.requestFullscreen) {
                   await document.documentElement.requestFullscreen().catch(err => console.error(err));
                 }
                 setIsVideoZoomed(true);
               } else {
                 if (document.exitFullscreen) {
                   await document.exitFullscreen().catch(err => console.error(err));
                 }
                 setIsVideoZoomed(false);
               }
             }}
             style={{
               position: 'absolute',
               bottom: isVideoZoomed ? '24px' : '12px',
               right: isVideoZoomed ? '24px' : '12px',
               zIndex: 20,
               pointerEvents: 'auto',
               background: 'rgba(0,0,0,0.6)',
               border: 'none',
               borderRadius: '8px',
               color: '#fff',
               padding: '8px',
               cursor: 'pointer',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               backdropFilter: 'blur(4px)',
               transition: 'all 0.2s'
             }}
             onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.8)')}
             onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
             title={isVideoZoomed ? "Exit Fullscreen" : "Fullscreen"}
           >
             {isVideoZoomed ? <Minimize2 size={24} /> : <Maximize2 size={20} />}
           </button>
         )}
      </div>
      
      {/* Mini Player when outside the room */}
      {roomId && !isOnRoomPage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '320px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Progress Bar (Top edge) */}
          <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-surface-2)' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: 'var(--color-accent-pink)', 
              width: `${(localProgress / (currentTrackDetails.duration || 180000)) * 100}%`,
              transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Thumbnail */}
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-surface-2)', flexShrink: 0 }}>
              {currentTrackDetails.thumbnail ? (
                <img src={currentTrackDetails.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎵</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', color: 'var(--color-live)', fontWeight: 'bold', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }} />
                Room: {roomId}
              </div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {playbackState.trackId ? currentTrackDetails.title : 'Waiting for music...'}
              </div>
              <div style={{ color: '#A0A0B8', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {playbackState.trackId ? currentTrackDetails.artist : 'Select a track in the room'}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={handlePlayPause}
                disabled={!playbackState.trackId}
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', 
                  border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: playbackState.trackId ? 'pointer' : 'not-allowed',
                  opacity: playbackState.trackId ? 1 : 0.5
                }}
              >
                {playbackState.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />}
              </button>
              <button 
                onClick={() => router.push(`/rooms/${roomId}`)}
                style={{ background: 'none', border: 'none', color: '#A0A0B8', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Return to Room"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={leaveRoom}
                style={{ background: 'none', border: 'none', color: '#A0A0B8', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title="Leave Room"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
