"use client";

import { useEffect, useState, use, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { SubscriptionGuard } from '../../../lib/SubscriptionGuard';
import { useGlobalRoom, QueueItem } from '../../../lib/GlobalRoomContext';
import { API_URL } from '../../../lib/api';
import { Maximize2, Minimize2 } from 'lucide-react';
import '../rooms.css';

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = use(params);
  const roomIdFromUrl = resolvedParams.roomId;
  
  const { 
    roomId, isConnected, playbackState, queue, chatMessages, floatingEmojis,
    isPlayerReady, joinRoom, play, pause, seek, loadTrack, addSelectedToQueue,
    sendChatMessage, editChatMessage, deleteChatMessage, handleChatReact, handleSongReact,
    setPlayerRect, globalPlayerWrapperRef, isVideoZoomed, setIsVideoZoomed
  } = useGlobalRoom();
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Join room on mount
  useEffect(() => {
    if (roomIdFromUrl) {
      joinRoom(roomIdFromUrl);
    }
  }, [roomIdFromUrl, joinRoom]);

  // Auto-add song from dashboard search
  const hasAddedInitialTrack = useRef(false);
  
  useEffect(() => {
    if (!isConnected || roomId !== roomIdFromUrl) return;
    const initialTrack = searchParams.get('initialTrack');
    
    if (!initialTrack) {
      // Reset the flag when the URL is cleared, so we can add more songs later!
      hasAddedInitialTrack.current = false;
      return;
    }
    
    if (!hasAddedInitialTrack.current) {
      hasAddedInitialTrack.current = true;
      addSelectedToQueue({
        trackId: initialTrack,
        title: searchParams.get('title') || 'Unknown Title',
        artist: searchParams.get('artist') || 'Unknown Artist',
        duration: parseInt(searchParams.get('duration') || '0'),
        thumbnail: searchParams.get('thumbnail') || ''
      });
      // Clear URL params so we don't re-add on refresh
      router.replace(`/rooms/${roomIdFromUrl}`);
    }
  }, [isConnected, searchParams, roomIdFromUrl, router, addSelectedToQueue, roomId]);

  // Sync zoom state with native browser fullscreen (so Esc key works)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isVideoZoomed) {
        setIsVideoZoomed(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isVideoZoomed, setIsVideoZoomed]);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'queue'|'chat'>('queue');

  // Search State
  const [inputTrack, setInputTrack] = useState('');
  const [searchResults, setSearchResults] = useState<QueueItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Local Progress for the progress bar
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [localProgress, setLocalProgress] = useState(0);

  // Chat UI State
  const [chatInput, setChatInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const username = user?.profile?.displayName || user?.username || `User${Math.floor(Math.random() * 1000)}`;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle Search Filtering (YTMusic Backend)
  useEffect(() => {
    const fetchSearch = async () => {
      if (!inputTrack.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/ytmusic/search?q=${encodeURIComponent(inputTrack)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.items || []);
        } else {
          setSearchResults([]);
        }
      } catch (e: any) {
         setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [inputTrack]);

  // Reconcile local progress for the slider
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

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleAddSelected = (song: QueueItem) => {
    addSelectedToQueue(song);
    setInputTrack('');
    setShowSearch(false);
  };

  const handlePlayPause = () => {
    if (playbackState.isPlaying) {
      pause(localProgress);
    } else {
      play(localProgress);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !isConnected) return;
    
    if (editingMessageId) {
      editChatMessage(editingMessageId, chatInput);
      setEditingMessageId(null);
    } else {
      sendChatMessage(chatInput, username);
    }
    setChatInput('');
    setShowEmojiPicker(false);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  const currentTrackDetails = queue.find(s => s.trackId === playbackState.trackId) || { title: playbackState.trackId, artist: 'YouTube Music Track', duration: 180000, thumbnail: '' };

  // Send player rect to global context for YouTube video positioning
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let rafId: number;
    
    // We use a requestAnimationFrame loop to directly mutate the DOM 
    // of the global player wrapper. This bypasses React's render cycle 
    // and scroll event batching, perfectly eliminating scroll lag and jitter!
    const updateRect = () => {
      if (placeholderRef.current && globalPlayerWrapperRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        const el = globalPlayerWrapperRef.current;
        el.style.left = `${rect.left}px`;
        el.style.top = `${rect.top}px`;
        el.style.width = `${rect.width}px`;
        el.style.height = `${rect.height}px`;
      }
      rafId = requestAnimationFrame(updateRect);
    };
    
    // Tell the global context that we are visible so it applies the opacity
    setPlayerRect({ x: 0, y: 0, width: 0, height: 0, isVisible: true });
    
    rafId = requestAnimationFrame(updateRect);
    
    return () => {
      cancelAnimationFrame(rafId);
      setPlayerRect({ x: 0, y: 0, width: 0, height: 0, isVisible: false });
    };
  }, [setPlayerRect, playbackState.trackId, globalPlayerWrapperRef]);

  if (roomId !== roomIdFromUrl) {
    return (
      <main style={{ padding: 'var(--spacing-8)', textAlign: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--color-text-secondary)' }}>Joining room...</h2>
      </main>
    );
  }

  return (
    <SubscriptionGuard requirePremium={true}>
    {/* Absolutely enforce no page scrolling on the Room page */}
    <style>{`body { overflow: hidden; }`}</style>
    <main className="flex flex-col lg:flex-row gap-6 max-w-[1200px] mx-auto p-4 lg:p-6 pb-24 lg:pb-6 min-h-screen lg:h-screen lg:overflow-hidden w-full overflow-y-auto">
      
      {/* LEFT COLUMN: Player */}
      <section className="flex-[2] flex flex-col gap-4 min-h-[40vh] lg:min-h-0 relative">
        <header>
          <h1 style={{ fontSize: 'var(--text-h2)' }}>Room: {roomId}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-live)', display: 'inline-block' }}></span>
            <span style={{ color: 'var(--color-live)', fontSize: 'var(--text-label)', fontWeight: 'bold' }}>LIVE</span>
          </div>
        </header>

        <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
          <div style={{ flex: 1, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', minHeight: 0 }}>
             
             {/* Floating Song Reactions */}
             {floatingEmojis.map(emoji => (
               <div key={emoji.id} className="floating-emoji" style={{ left: `calc(50% + ${emoji.xOffset}px)` }}>
                 {emoji.emoji}
               </div>
             ))}

             {playbackState.trackId ? (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2)', width: '100%', padding: 'var(--spacing-4)' }}>
                 {/* Video Placeholder Box - The global iframe will overlay exactly on top of this! */}
                 <div style={{ width: '100%', maxWidth: '350px', maxHeight: '100%', aspectRatio: '1 / 1', flex: '0 1 auto', display: 'flex' }}>
                   <div 
                     ref={placeholderRef} 
                     onClick={handlePlayPause}
                     style={{ 
                       cursor: 'pointer', 
                       position: isVideoZoomed ? 'fixed' : 'relative',
                       top: isVideoZoomed ? 0 : 'auto',
                       left: isVideoZoomed ? 0 : 'auto',
                       width: isVideoZoomed ? '100%' : '100%', 
                       height: isVideoZoomed ? '100vh' : '100%',
                       zIndex: isVideoZoomed ? 9999 : 1,
                       borderRadius: isVideoZoomed ? 0 : 'var(--radius-lg)', 
                       overflow: 'hidden', 
                       boxShadow: isVideoZoomed ? 'none' : '0 12px 36px rgba(0,0,0,0.4)',
                       transition: 'all 0.3s ease',
                       backgroundColor: '#000'
                     }}
                   >
                     {/* Fallback while video loads/syncs, or if it's completely hidden */}
                     {currentTrackDetails.thumbnail ? (
                       <img src={currentTrackDetails.thumbnail} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                     ) : (
                       <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-h1)' }}>🎵</div>
                     )}
                   </div>
                 </div>
                 <div style={{ fontSize: 'var(--text-h2)', marginTop: 'var(--spacing-4)', fontWeight: 'bold', position: 'relative', zIndex: 3 }}>{currentTrackDetails.title}</div>
                 <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-h3)', position: 'relative', zIndex: 3 }}>{currentTrackDetails.artist}</div>
               </div>
             ) : (
               <div style={{ color: 'var(--color-text-muted)' }}>
                  {!isPlayerReady ? 'Initializing Player...' : 'No track playing'}
               </div>
             )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
             <span>{formatTime(localProgress)}</span>
             <input 
               type="range" 
               className="range-slider"
               min={0}
               max={currentTrackDetails.duration || 300000}
               value={localProgress}
               onChange={(e) => {
                 const newPos = Number(e.target.value);
                 setLocalProgress(newPos);
                 seek(newPos);
               }}
               style={{ 
                 flex: 1, 
                 background: `linear-gradient(to right, var(--color-accent-pink) ${(localProgress / (currentTrackDetails.duration || 300000)) * 100}%, var(--color-surface-2) ${(localProgress / (currentTrackDetails.duration || 300000)) * 100}%)`
               }} 
             />
             <span>{formatTime(currentTrackDetails.duration || 300000)}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)' }}>
             <button className="btn btn-primary" onClick={handlePlayPause} disabled={!playbackState.trackId || !isPlayerReady}>
               {playbackState.isPlaying ? 'Pause' : 'Play'}
             </button>
          </div>

          {/* Song Reaction Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-6)' }}>
             {['❤️', '🔥', '🎉', '💯'].map(emoji => (
                <button 
                   key={emoji}
                   onClick={() => handleSongReact(emoji, username)}
                   style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface)', borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, background 0.2s' }}
                   onMouseOver={(e) => { (e.target as any).style.transform = 'scale(1.1)'; (e.target as any).style.background = 'var(--color-surface)'; }}
                   onMouseOut={(e) => { (e.target as any).style.transform = 'scale(1)'; (e.target as any).style.background = 'var(--color-surface-2)'; }}
                >
                   {emoji}
                </button>
             ))}
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Sidebar (Tabs) */}
      <section className="flex-1 flex flex-col bg-[var(--color-surface)] rounded-xl overflow-hidden min-h-[40vh] lg:min-h-0">
        
        {/* Tabs Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
          <button 
            onClick={() => setActiveTab('queue')}
            style={{ flex: 1, padding: 'var(--spacing-4)', background: 'none', border: 'none', color: activeTab === 'queue' ? 'var(--color-accent-pink)' : 'var(--color-text-primary)', fontWeight: activeTab === 'queue' ? 'bold' : 'normal', cursor: 'pointer', borderBottom: activeTab === 'queue' ? '2px solid var(--color-accent-pink)' : 'none' }}
          >
            Queue
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            style={{ flex: 1, padding: 'var(--spacing-4)', background: 'none', border: 'none', color: activeTab === 'chat' ? 'var(--color-accent-pink)' : 'var(--color-text-primary)', fontWeight: activeTab === 'chat' ? 'bold' : 'normal', cursor: 'pointer', borderBottom: activeTab === 'chat' ? '2px solid var(--color-accent-pink)' : 'none' }}
          >
            Chat
          </button>
        </div>

        {/* Tab Content: Queue */}
        {activeTab === 'queue' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--spacing-4)', overflowY: 'auto' }}>
            <div style={{ position: 'relative', marginBottom: 'var(--spacing-6)' }}>
              <input 
                type="text" 
                value={inputTrack}
                onFocus={() => setShowSearch(true)}
                onChange={(e) => { setInputTrack(e.target.value); setShowSearch(true); }}
                placeholder="Search YouTube Music..." 
                style={{ width: '100%', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }} 
              />
              {showSearch && inputTrack.trim() !== '' && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--spacing-1)', padding: 'var(--spacing-2)', listStyle: 'none', border: '1px solid var(--color-border)', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {isSearching ? (
                    <li style={{ padding: 'var(--spacing-2)', color: 'var(--color-text-muted)' }}>Searching...</li>
                  ) : searchResults.length > 0 ? searchResults.map(song => (
                    <li 
                      key={song.id} 
                      onClick={() => handleAddSelected(song)}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)', cursor: 'pointer', borderBottom: '1px solid var(--color-border)' }}
                    >
                      {song.thumbnail && (
                        <img src={song.thumbnail} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
                      </div>
                    </li>
                  )) : (
                    <li style={{ padding: 'var(--spacing-2)', color: 'var(--color-text-muted)' }}>No results found.</li>
                  )}
                </ul>
              )}
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {queue.length === 0 ? (
                <li style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)' }}>Queue is empty</li>
              ) : (
                queue.map(item => (
                  <li 
                    key={item.id} 
                    onClick={() => loadTrack(item.trackId)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                  >
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--color-surface)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎵</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.artist}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Tab Content: Chat */}
        {activeTab === 'chat' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: 'var(--spacing-4)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {chatMessages.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--spacing-8)' }}>
                  No messages yet. Say hi! 👋
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMine = msg.sender === username;
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: '2px' }}>{msg.sender}</span>
                      <div style={{ maxWidth: '80%', position: 'relative' }} className="chat-bubble-container" onMouseLeave={() => setActiveReactionMessageId(null)}>
                        <div className="chat-bubble" style={{ 
                          backgroundColor: isMine ? 'var(--color-accent-pink)' : 'var(--color-surface-2)',
                          color: 'white',
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          borderRadius: 'var(--radius-lg)',
                          position: 'relative'
                        }}>
                          <span>{msg.text}</span>
                          {msg.edited && <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '8px' }}>(edited)</span>}
                        </div>
                        
                        <div className="chat-actions" style={{ display: 'flex', gap: '8px', marginTop: '4px', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                          <button onClick={() => setActiveReactionMessageId(msg.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '2px', padding: '0' }} title="Add Reaction">
                            😀<span style={{ fontSize: '10px' }}>+</span>
                          </button>
                          {isMine && (
                            <>
                              <button onClick={() => { setEditingMessageId(msg.id); setChatInput(msg.text); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '12px', padding: '0' }}>Edit</button>
                              <button onClick={() => deleteChatMessage(msg.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '12px', padding: '0' }}>Delete</button>
                            </>
                          )}
                        </div>

                        {/* Reaction Picker Popup */}
                        {activeReactionMessageId === msg.id && (
                          <div style={{ position: 'absolute', bottom: '100%', [isMine ? 'right' : 'left']: '0', marginBottom: '8px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-2)', display: 'flex', gap: 'var(--spacing-2)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', zIndex: 10 }}>
                            {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                              <button key={emoji} onClick={() => { handleChatReact(msg.id, emoji, username); setActiveReactionMessageId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', transition: 'transform 0.1s' }} onMouseOver={(e) => (e.target as any).style.transform = 'scale(1.2)'} onMouseOut={(e) => (e.target as any).style.transform = 'scale(1)'}>
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Display Reactions */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                            {Object.entries(msg.reactions).map(([emoji, users]) => (
                              <button 
                                key={emoji} 
                                onClick={() => handleChatReact(msg.id, emoji, username)}
                                title={users.join(', ')}
                                style={{ 
                                  backgroundColor: users.includes(username) ? 'var(--color-accent-pink)' : 'var(--color-surface)', 
                                  border: `1px solid ${users.includes(username) ? 'var(--color-accent-pink)' : 'var(--color-border)'}`, 
                                  borderRadius: '12px', padding: '2px 6px', fontSize: '0.8rem', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' 
                                }}
                              >
                                <span>{emoji}</span>
                                <span>{users.length}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Chat Input */}
            <div style={{ position: 'relative', padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
              
              {/* Input Emoji Picker Popover */}
              {showEmojiPicker && (
                <div style={{ 
                  position: 'absolute', bottom: '100%', right: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)', 
                  backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-3)', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 20, width: '220px',
                  display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--spacing-2)'
                }}>
                  {['😀','😂','😊','😍','🥰','😎','🤔','😭','😡','👍','👎','❤️','🔥','🎉','✨'].map(emoji => (
                    <button 
                      key={emoji} 
                      onClick={() => setChatInput(prev => prev + emoji)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.1s', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
                      onMouseOver={(e) => (e.target as any).style.transform = 'scale(1.2)'} 
                      onMouseOut={(e) => (e.target as any).style.transform = 'scale(1)'}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
                  style={{ flex: 1, padding: 'var(--spacing-2) var(--spacing-3)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }} 
                />
                
                <button 
                  type="button" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{ background: showEmojiPicker ? 'var(--color-surface)' : 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: 'var(--spacing-2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                  title="Add Emoji"
                >
                  ✨
                </button>

                <button type="submit" className="btn btn-primary" style={{ padding: 'var(--spacing-2) var(--spacing-4)', borderRadius: 'var(--radius-full)' }}>
                  {editingMessageId ? 'Save' : 'Send'}
                </button>
                
                {editingMessageId && (
                  <button type="button" onClick={() => { setEditingMessageId(null); setChatInput(''); setShowEmojiPicker(false); }} className="btn btn-secondary" style={{ padding: 'var(--spacing-2) var(--spacing-4)', borderRadius: 'var(--radius-full)' }}>
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

      </section>
    </main>
    </SubscriptionGuard>
  );
}
