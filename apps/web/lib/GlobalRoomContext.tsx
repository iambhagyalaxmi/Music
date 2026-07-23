"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getPusherClient, subscribeToRoom, unsubscribeFromRoom } from './socket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface PlaybackState {
  trackId: string | null;
  isPlaying: boolean;
  positionMs: number;
  updatedAt: number;
}

export interface QueueItem {
  id: string;
  trackId: string;
  title: string;
  artist: string;
  duration?: number;
  thumbnail?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  edited: boolean;
  reactions?: Record<string, string[]>;
}

export interface FloatingEmoji {
  id: string;
  emoji: string;
  xOffset: number;
}

interface GlobalRoomContextValue {
  roomId: string | null;
  isConnected: boolean;
  playbackState: PlaybackState;
  queue: QueueItem[];
  chatMessages: ChatMessage[];
  floatingEmojis: FloatingEmoji[];
  isPlayerReady: boolean;
  setIsPlayerReady: (ready: boolean) => void;
  playerRef: React.MutableRefObject<any>;
  globalPlayerWrapperRef: React.MutableRefObject<any>;
  playerRect: { x: number, y: number, width: number, height: number, isVisible: boolean };
  setPlayerRect: (rect: { x: number, y: number, width: number, height: number, isVisible: boolean }) => void;
  isVideoZoomed: boolean;
  setIsVideoZoomed: (z: boolean) => void;
  joinRoom: (id: string) => void;
  leaveRoom: () => void;
  play: (positionMs: number) => void;
  pause: (positionMs: number) => void;
  seek: (positionMs: number) => void;
  loadTrack: (trackId: string) => void;
  addSelectedToQueue: (song: Partial<QueueItem>) => void;
  sendChatMessage: (text: string, sender: string) => void;
  editChatMessage: (id: string, text: string) => void;
  deleteChatMessage: (id: string) => void;
  handleChatReact: (messageId: string, emoji: string, sender: string) => void;
  handleSongReact: (emoji: string, sender: string) => void;
  playbackError: string | null;
  setPlaybackError: (error: string | null) => void;
}

const GlobalRoomContext = createContext<GlobalRoomContextValue | null>(null);

export const useGlobalRoom = () => {
  const context = useContext(GlobalRoomContext);
  if (!context) {
    throw new Error('useGlobalRoom must be used within a GlobalRoomProvider');
  }
  return context;
};

export const GlobalRoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const channelRef = useRef<any>(null);
  
  const playerRef = useRef<any>(null);
  const globalPlayerWrapperRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [playerRect, setPlayerRect] = useState({ x: 0, y: 0, width: 0, height: 0, isVisible: false });
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    trackId: null,
    isPlaying: false,
    positionMs: 0,
    updatedAt: Date.now()
  });
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  const joinRoom = async (id: string) => {
    if (roomId === id) return;
    if (roomId) leaveRoom();
    setRoomId(id);
    
    try {
      const channel = subscribeToRoom(id);
      channelRef.current = channel;
      setIsConnected(true);

      const res = await fetch(`${API_URL}/api/realtime/room/${id}/state`);
      if (res.ok) {
        const data = await res.json();
        if (data.playbackState) setPlaybackState(data.playbackState);
        if (data.queue) setQueue(data.queue);
        if (data.chatHistory) setChatMessages(data.chatHistory);
      }
    } catch (e) {
      console.error('Failed to join room', e);
    }
  };

  const leaveRoom = () => {
    if (roomId) {
      unsubscribeFromRoom(roomId);
    }
    channelRef.current = null;
    setIsConnected(false);
    setRoomId(null);
    setQueue([]);
    setChatMessages([]);
    setPlaybackState({ trackId: null, isPlaying: false, positionMs: 0, updatedAt: Date.now() });
    if (playerRef.current && isPlayerReady) {
      try { playerRef.current.pauseVideo(); } catch(e) {}
    }
  };

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;
    
    channel.bind('playback-sync', (state: PlaybackState) => setPlaybackState(state));
    channel.bind('queue-added', (item: QueueItem) => setQueue(prev => [...prev, item]));
    channel.bind('chat-history', (history: ChatMessage[]) => setChatMessages(history));
    channel.bind('chat-message', (msg: ChatMessage) => setChatMessages(prev => [...prev, msg]));
    channel.bind('chat-updated', (updatedMsg: ChatMessage) => {
      setChatMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
    });
    channel.bind('chat-deleted', (deletedId: string) => {
      setChatMessages(prev => prev.filter(m => m.id !== deletedId));
    });
    channel.bind('song-reaction-received', (data: { id: string; emoji: string; sender: string }) => {
      const newEmoji = { id: data.id, emoji: data.emoji, xOffset: Math.random() * 100 - 50 };
      setFloatingEmojis(prev => [...prev, newEmoji]);
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(e => e.id !== data.id));
      }, 2500);
    });
    
    return () => {
      channel.unbind('playback-sync');
      channel.unbind('queue-added');
      channel.unbind('chat-history');
      channel.unbind('chat-message');
      channel.unbind('chat-updated');
      channel.unbind('chat-deleted');
      channel.unbind('song-reaction-received');
    };
  }, [isConnected]);

  useEffect(() => {
    if (!isPlayerReady || !playerRef.current) return;
    try {
      const player = playerRef.current;
      if (playbackState.trackId) {
        let currentVideoData;
        try { currentVideoData = player.getVideoData(); } catch(e) {}
        if (!currentVideoData || currentVideoData.video_id !== playbackState.trackId) {
          setPlaybackError(null);
          player.loadVideoById(playbackState.trackId, playbackState.positionMs / 1000);
          
          const token = localStorage.getItem('soundsphere_token');
          if (token) {
            fetch(`${API_URL}/api/ytmusic/watch`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ videoId: playbackState.trackId })
            }).catch(e => console.error('Failed to record video watch', e));
          }
        }
        if (playbackState.isPlaying) {
          player.playVideo();
          const currentPos = player.getCurrentTime() * 1000;
          const targetPos = playbackState.positionMs + (Date.now() - playbackState.updatedAt);
          if (Math.abs(currentPos - targetPos) > 1500) {
            player.seekTo(targetPos / 1000, true);
          }
        } else {
          player.pauseVideo();
          player.seekTo(playbackState.positionMs / 1000, true);
        }
      }
    } catch (e) {
      console.error("YouTube playback error:", e);
    }
  }, [playbackState, isPlayerReady]);

  const postAction = async (endpoint: string, body: any) => {
    if (!roomId) return;
    try {
      await fetch(`${API_URL}/api/realtime/room/${roomId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {
      console.error(`Error posting to ${endpoint}`, e);
    }
  };

  const play = (positionMs: number) => {
    if (playerRef.current && isPlayerReady) {
      try { playerRef.current.playVideo(); } catch (e) {}
    }
    postAction('playback/play', { positionMs });
  };
  const pause = (positionMs: number) => {
    if (playerRef.current && isPlayerReady) {
      try { playerRef.current.pauseVideo(); } catch (e) {}
    }
    postAction('playback/pause', { positionMs });
  };
  const seek = (positionMs: number) => {
    if (playerRef.current && isPlayerReady) {
      try { playerRef.current.seekTo(positionMs / 1000, true); } catch (e) {}
    }
    postAction('playback/seek', { positionMs });
  };
  const loadTrack = (trackId: string) => {
    if (playerRef.current && isPlayerReady) {
      try { playerRef.current.loadVideoById(trackId, 0); } catch (e) {}
    }
    postAction('playback/load', { trackId });
  };

  const addSelectedToQueue = (song: Partial<QueueItem>) => {
    postAction('queue/add', {
      trackId: song.trackId,
      title: song.title || 'Unknown Title',
      artist: song.artist || 'Unknown Artist',
      duration: song.duration || 0,
      thumbnail: song.thumbnail || ''
    });
  };

  const sendChatMessage = (text: string, sender: string) => postAction('chat/send', { sender, text });
  const editChatMessage = (id: string, text: string) => postAction('chat/edit', { id, text });
  const deleteChatMessage = (id: string) => postAction('chat/delete', { id });
  const handleChatReact = (messageId: string, emoji: string, sender: string) => postAction('chat/react', { messageId, emoji, sender });
  const handleSongReact = (emoji: string, sender: string) => postAction('song/react', { emoji, sender });

  return (
    <GlobalRoomContext.Provider value={{
      roomId, isConnected, playbackState, queue, chatMessages, floatingEmojis,
      isPlayerReady, setIsPlayerReady, playerRef, globalPlayerWrapperRef, playerRect, setPlayerRect,
      isVideoZoomed, setIsVideoZoomed, playbackError, setPlaybackError,
      joinRoom, leaveRoom, play, pause, seek, loadTrack, addSelectedToQueue,
      sendChatMessage, editChatMessage, deleteChatMessage, handleChatReact, handleSongReact
    }}>
      {children}
    </GlobalRoomContext.Provider>
  );
};
