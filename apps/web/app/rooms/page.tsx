"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { useAuth } from '../../lib/AuthContext';
import './rooms.css';
import { API_URL } from '../../lib/api';

export default function RoomsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  const [publicRooms, setPublicRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create room state
  const [createRoomName, setCreateRoomName] = useState('');
  const [enableVoiceChat, setEnableVoiceChat] = useState(false);
  const [enableSharedQueue, setEnableSharedQueue] = useState(true);
  
  // Join room state
  const [joinRoomCode, setJoinRoomCode] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/rooms`);
        if (res.ok) {
          const data = await res.json();
          setPublicRooms(data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
    
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createRoomName.trim()) return;
    
    try {
      const res = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}`
        },
        body: JSON.stringify({
          name: createRoomName,
          ownerId: user?.id,
          isPublic: true,
          voiceChat: enableVoiceChat,
          sharedQueue: enableSharedQueue
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsCreateModalOpen(false);
        router.push(`/rooms/${data.id}`);
      } else {
        console.error('Failed to create room');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinRoomCode.trim()) return;
    setIsJoinModalOpen(false);
    router.push(`/rooms/${joinRoomCode.trim()}`);
  };

  const filteredRooms = publicRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SubscriptionGuard>
      <div className="rooms-container flex-col lg:flex-row pb-20 lg:pb-0">
        
        {/* Left Sidebar */}
        <aside className="sidebar hidden lg:flex">
          <div className="sidebar-logo-container">
            <h1 className="sidebar-logo">SoundSphere</h1>
          </div>
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              <li>
                <Link href="/dashboard" className="sidebar-link">
                  Music
                </Link>
              </li>
              <li>
                <Link href="/community" className="sidebar-link">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/friends" className="sidebar-link">
                  Friends
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="sidebar-link active">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/profile" className="sidebar-link">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="sidebar-link">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-area">
          
          {/* Main CTA Section */}
          <div className="hero-section">
            <div className="hero-glow-1"></div>
            <div className="hero-glow-2"></div>
            
            {/* Floating Music Notes */}
            <div className="music-note note-1">♪</div>
            <div className="music-note note-2">♫</div>
            <div className="music-note note-3">♩</div>
            <div className="music-note note-4">♬</div>
            
            {/* Animated Equalizer */}
            <div className="eq-container">
              <div className="eq-bar eq-1"></div>
              <div className="eq-bar eq-2"></div>
              <div className="eq-bar eq-3"></div>
              <div className="eq-bar eq-4"></div>
              <div className="eq-bar eq-5"></div>
            </div>
            
            <h2 className="hero-title">
              <span>🎧</span> Music Rooms
            </h2>
            <p className="hero-subtitle">
              Listen to music together with your friends in real time.
            </p>
            
            <div className="hero-buttons">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Create Room
              </button>
              
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="btn-secondary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Join with Code
              </button>
              
              <button 
                onClick={() => {
                  const searchEl = document.getElementById('search-rooms');
                  if (searchEl) searchEl.focus();
                }}
                className="btn-secondary blue-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Browse Public Rooms
              </button>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h3 className="search-title">
              <span>🔍</span> Search Public Rooms
            </h3>
            <div className="search-input-container">
              <div className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A0A0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                id="search-rooms"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by room name..." 
                className="search-input"
              />
            </div>
            
            {/* Public Rooms List */}
            {isLoading ? (
              <div className="empty-state">
                Loading active rooms...
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="rooms-grid">
                {filteredRooms.map(room => (
                  <div key={room.id} className="room-card">
                    <div>
                      <div className="room-header">
                        <h4 className="room-title">🎵 {room.name}</h4>
                        <span className="room-members">
                          👥 {room.members || 1}
                        </span>
                      </div>
                      
                      <div className="now-playing">
                        {room.nowPlaying ? (
                          <>
                            <p className="now-playing-label">
                              <span style={{ color: '#1DB954' }}>🎶</span> Now Playing:
                            </p>
                            <p className="now-playing-title">
                              {room.nowPlaying}
                            </p>
                          </>
                        ) : (
                          <p className="waiting-music">
                            Waiting for music...
                          </p>
                        )}
                      </div>
                      
                      <div className="room-host">
                        <span className="host-name">Host:</span> {room.host}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      className="btn-join-room"
                    >
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                {searchQuery ? 'No rooms match your search.' : 'No public rooms active right now. Start one!'}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Room Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content create">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="modal-close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="modal-title">Create New Room</h2>
            
            <form onSubmit={handleCreateRoom} className="form-group">
              <div className="input-field">
                <label className="input-label">Room Name</label>
                <input 
                  type="text" 
                  value={createRoomName}
                  onChange={e => setCreateRoomName(e.target.value)}
                  placeholder="e.g. Late Night Lo-Fi" 
                  required
                  className="input-control" 
                />
              </div>
              
              <div className="input-field">
                <label className="input-label">Description (Optional)</label>
                <textarea rows={2} placeholder="What kind of music are we listening to?" className="input-control" style={{ resize: 'none' }}></textarea>
              </div>

              <div className="grid-2">
                <div className="input-field">
                  <label className="input-label">Privacy</label>
                  <select className="input-control" style={{ appearance: 'none' }}>
                    <option value="public">Public</option>
                    <option value="private">Private (Invite Only)</option>
                  </select>
                </div>
                <div className="input-field">
                  <label className="input-label">Max Members</label>
                  <input type="number" min="2" max="100" defaultValue="10" className="input-control" />
                </div>
              </div>

              <div className="toggle-group">
                <label className="toggle-label" onClick={() => setEnableVoiceChat(!enableVoiceChat)}>
                  <div className="toggle-text">
                    <span className="toggle-title">Enable Voice Chat</span>
                    <span className="toggle-desc">Allow members to talk in the room</span>
                  </div>
                  <div className="toggle-switch">
                    <span className={`toggle-knob ${enableVoiceChat ? 'on' : ''}`}></span>
                  </div>
                </label>

                <label className="toggle-label" onClick={() => setEnableSharedQueue(!enableSharedQueue)}>
                  <div className="toggle-text">
                    <span className="toggle-title">Enable Shared Queue</span>
                    <span className="toggle-desc">Allow members to add songs to the queue</span>
                  </div>
                  <div className="toggle-switch">
                    <span className={`toggle-knob ${enableSharedQueue ? 'on' : ''}`}></span>
                  </div>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-submit"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {isJoinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content join">
            <button 
              onClick={() => setIsJoinModalOpen(false)}
              className="modal-close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="modal-title center">Join Room</h2>
            <p className="modal-subtitle">Enter the code provided by the room host.</p>
            
            <form onSubmit={handleJoinRoom} className="form-group">
              <div className="input-field">
                <input 
                  type="text" 
                  value={joinRoomCode}
                  onChange={e => setJoinRoomCode(e.target.value)}
                  placeholder="Enter Room Code (e.g. X9Y2-M4P)" 
                  required
                  className="input-control join-code" 
                />
              </div>

              <button 
                type="submit"
                className="btn-submit join-btn"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      )}
    </SubscriptionGuard>
  );
}
