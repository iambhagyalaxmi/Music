"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Users, Activity, UserPlus, Headphones, UserCheck, Search, Mail, MessageCircle, PlayCircle, User, Check, X, Star, Heart, ListMusic, Play, Share, Trophy, Clock, Flame, Target, UserX, Send } from 'lucide-react';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';

export default function FriendsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasFriends, setHasFriends] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Jessica', text: 'Hey! Have you heard the new album?' },
    { id: 2, sender: 'Me', text: "Yes! It's so good. We should listen together later." },
    { id: 3, sender: 'Jessica', text: "Definitely! Send me an invite when you're free." }
  ]);
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: 'Jessica Wong', subtitle: '2 mutual friends', avatar: 'https://i.pravatar.cc/150?u=jessica' },
    { id: 2, name: 'Mike Peterson', subtitle: 'New to SoundSphere', avatar: 'https://i.pravatar.cc/150?u=mike' }
  ]);
  const [outgoingRequests, setOutgoingRequests] = useState([
    { id: 101, name: 'Ryan Cooper', status: 'Request Sent', avatar: 'https://i.pravatar.cc/150?u=ryan' }
  ]);
  const [recommendedFriends, setRecommendedFriends] = useState([
    { id: 201, name: 'Sophia Lee', subtitle: '12 Mutual Friends', iconType: 'users', avatar: 'https://i.pravatar.cc/150?u=sophia' },
    { id: 202, name: 'Chris Evans', subtitle: 'Similar Music Taste', iconType: 'headphones', avatar: 'https://i.pravatar.cc/150?u=chris' },
    { id: 203, name: 'Olivia Martin', subtitle: 'Same Favorite Artist', iconType: 'star', avatar: 'https://i.pravatar.cc/150?u=olivia' },
    { id: 204, name: 'Liam Wilson', subtitle: 'Same Playlist Interests', iconType: 'listMusic', avatar: 'https://i.pravatar.cc/150?u=liam' }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [playingSharedSongId, setPlayingSharedSongId] = useState<string | null>(null);
  const [reactedSharedSongIds, setReactedSharedSongIds] = useState<string[]>([]);
  const [openedPlaylistId, setOpenedPlaylistId] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (playingSharedSongId === 'midnight_city' || playingSharedSongId === 'Midnight City') {
      audioRef.current = new window.Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    } else if (playingSharedSongId === 'cruel_summer' || playingSharedSongId === 'Cruel Summer') {
      audioRef.current = new window.Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    } else if (playingSharedSongId) {
      audioRef.current = new window.Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3');
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [playingSharedSongId]);

  const toggleReactSharedSong = (songId: string) => {
    if (reactedSharedSongIds.includes(songId)) {
      setReactedSharedSongIds(reactedSharedSongIds.filter(id => id !== songId));
      showToast('Removed reaction.');
    } else {
      setReactedSharedSongIds([...reactedSharedSongIds, songId]);
      showToast('Reacted with ❤️!');
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: 'Me', text: chatInput }]);
    setChatInput('');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SubscriptionGuard>
      <div className="dashboard-layout flex-col lg:flex-row pb-20 lg:pb-6">
        
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar-left hidden lg:flex w-64">

          <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4) var(--spacing-6)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', background: 'linear-gradient(45deg, var(--color-accent-pink), #ff8a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SoundSphere</h1>
          </div>
          <nav style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flex: 1 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <li>
                <Link href="/dashboard" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Music
                </Link>
              </li>
              <li>
                <Link href="/community" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Community
                </Link>
              </li>
              <li>
                <Link href="/friends" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 'bold', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  Friends
                </Link>
              </li>
              <li>
                <Link href="/rooms" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/profile" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* Gradient Header */}
          <div style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,77,141,0.4) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 style={{ fontSize: 'var(--text-h1)', fontWeight: '900', margin: '0 0 var(--spacing-2) 0' }}>Friends</h1>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: 'var(--text-base)' }}>Connect with friends, share music, and discover new tunes together.</p>
            </div>
            <button 
              onClick={() => setHasFriends(!hasFriends)} 
              style={{ position: 'relative', zIndex: 1, padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              Toggle Empty State (Dev)
            </button>
          </div>

          {isLoading ? (
            /* Skeleton Loading State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={{ height: '80px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                ))}
              </div>
              <div style={{ height: '150px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.2s' }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ height: '120px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite ease-in-out', animationDelay: '0.4s' }}></div>
                ))}
              </div>
            </div>
          ) : !hasFriends ? (
            /* Empty State */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-8)', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-6)' }}>
                <UserX className="w-16 h-16" />
              </div>
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', marginBottom: 'var(--spacing-3)' }}>It's quiet in here...</h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: 'var(--spacing-6)', lineHeight: 1.5 }}>
                You don't have any friends added yet. Connect with people to share music, create collaborative playlists, and listen together in real-time.
              </p>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'var(--color-accent-pink)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 'var(--text-base)', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 12px rgba(255, 77, 141, 0.3)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 77, 141, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 77, 141, 0.3)'; }}>
                <Search className="w-5 h-5" /> Find Friends
              </button>
            </div>
          ) : (
            <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Total Friends</h3>
                <Users className="w-5 h-5" />
              </div>
              <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: 0 }}>48</p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Online Friends</h3>
                <Activity className="w-5 h-5" style={{ color: 'var(--color-accent-green)' }} />
              </div>
              <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: 0 }}>12</p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Friend Requests</h3>
                <UserPlus className="w-5 h-5" style={{ color: 'var(--color-accent-pink)' }} />
              </div>
              <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: 0 }}>3</p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Listening Together</h3>
                <Headphones className="w-5 h-5" style={{ color: 'var(--color-accent-purple, #9D4EDD)' }} />
              </div>
              <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: 0 }}>4</p>
            </div>
            
            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', margin: 0 }}>Pending Invites</h3>
                <UserCheck className="w-5 h-5" />
              </div>
              <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: 0 }}>1</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', margin: 0 }}>Search Friends</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <button 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--color-accent-pink)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 77, 141, 0.3)', transition: 'transform 0.1s' }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => { searchInputRef.current?.focus(); }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Friend
                  </button>
                  <button 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} 
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => showToast('Invite link copied to clipboard!')}
                  >
                    <Mail className="w-4 h-4" />
                    Invite Friend
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', paddingLeft: '16px', pointerEvents: 'none', color: 'var(--color-text-secondary)' }}>
                  <Search className="w-5 h-5" />
                </div>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search friends by Name, Username, or Email..." 
                  style={{ width: '100%', padding: '16px 16px 16px 48px', backgroundColor: '#09090B', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Add Friend */}
              <button 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-5)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-pink)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0) scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
                onClick={() => { searchInputRef.current?.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus className="w-6 h-6" />
                </div>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Add Friend</span>
              </button>

              {/* Create Listening Room */}
              <button 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-5)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-purple, #9D4EDD)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0) scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
                onClick={() => showToast('New Listening Room created!')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(157, 78, 221, 0.1)', color: 'var(--color-accent-purple, #9D4EDD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones className="w-6 h-6" />
                </div>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Create Room</span>
              </button>

              {/* Start Chat */}
              <button 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-5)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-green)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
                onClick={() => setIsChatOpen(true)}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Start Chat</span>
              </button>

              {/* Invite to Room */}
              <button 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-5)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(0) scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(-2px) scale(1)'}
                onClick={() => showToast('Room invite link generated!')}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share className="w-6 h-6" />
                </div>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Invite to Room</span>
              </button>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Friend Requests</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Incoming Requests */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>Incoming ({friendRequests.length})</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {friendRequests.length === 0 ? (
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, textAlign: 'center', padding: 'var(--spacing-4) 0' }}>No incoming requests</p>
                  ) : (
                    friendRequests.map((req) => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <img src={req.avatar} alt={req.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                          <div>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>{req.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{req.subtitle}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setFriendRequests(friendRequests.filter(r => r.id !== req.id));
                              showToast(`Accepted ${req.name}'s request!`);
                            }}
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-accent-pink)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px rgba(255, 77, 141, 0.3)' }} title="Accept"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setFriendRequests(friendRequests.filter(r => r.id !== req.id));
                              showToast(`Rejected ${req.name}'s request.`);
                            }}
                            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: '50%', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }} title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Outgoing Requests */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>Outgoing ({outgoingRequests.length})</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {outgoingRequests.length === 0 ? (
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', margin: 0, textAlign: 'center', padding: 'var(--spacing-4) 0' }}>No outgoing requests</p>
                  ) : (
                    outgoingRequests.map((req) => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <img src={req.avatar} alt={req.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', opacity: 0.7 }} />
                          <div>
                            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>{req.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-purple, #9D4EDD)' }}>{req.status}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setOutgoingRequests(outgoingRequests.filter(r => r.id !== req.id));
                            showToast(`Canceled request to ${req.name}`);
                          }}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4d4d'; e.currentTarget.style.borderColor = '#ff4d4d'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        >
                          Cancel
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus className="w-5 h-5" style={{ color: 'var(--color-accent-purple, #9D4EDD)' }} /> Recommended Friends
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {recommendedFriends.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: 'var(--spacing-5)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  No more recommendations right now.
                </div>
              ) : (
                recommendedFriends.map((friend) => {
                  const Icon = friend.iconType === 'users' ? Users : friend.iconType === 'headphones' ? Headphones : friend.iconType === 'star' ? Star : ListMusic;
                  
                  return (
                    <div key={friend.id} style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <img src={friend.avatar} alt={friend.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>{friend.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: friend.iconType === 'users' ? 'var(--color-text-secondary)' : friend.iconType === 'headphones' ? 'var(--color-accent-purple, #9D4EDD)' : friend.iconType === 'star' ? 'var(--color-accent-green)' : 'var(--color-text-primary)', opacity: friend.iconType === 'listMusic' ? 0.8 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon className="w-3 h-3" /> {friend.subtitle}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button 
                          onClick={() => {
                            setRecommendedFriends(recommendedFriends.filter(f => f.id !== friend.id));
                            setOutgoingRequests([...outgoingRequests, { id: friend.id, name: friend.name, status: 'Request Sent', avatar: friend.avatar }]);
                            showToast(`Friend request sent to ${friend.name}!`);
                          }}
                          style={{ flex: 1, padding: '8px', backgroundColor: 'var(--color-accent-pink)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: 'var(--text-sm)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <UserPlus className="w-4 h-4" /> Add Friend
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }} title="View Profile">
                          <User className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Music Compatibility</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Compatibility Card 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255, 77, 141, 0.15) 0%, rgba(255, 77, 141, 0) 70%)', transform: 'translate(30%, -30%)' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <img src="https://i.pravatar.cc/150?u=emma" alt="Emma" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>Emma Roberts</h4>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Music Match</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-accent-pink)', lineHeight: 1 }}>95%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Match</span>
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px', opacity: 0.9 }}>Common Artists</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Taylor Swift</span>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Ed Sheeran</span>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Imagine Dragons</span>
                  </div>
                </div>
              </div>

              {/* Compatibility Card 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(157, 78, 221, 0.15) 0%, rgba(157, 78, 221, 0) 70%)', transform: 'translate(30%, -30%)' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <img src="https://i.pravatar.cc/150?u=lucas" alt="Lucas" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>Lucas Miller</h4>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Music Match</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-accent-purple, #9D4EDD)', lineHeight: 1 }}>88%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Match</span>
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px', opacity: 0.9 }}>Common Artists</h5>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Drake</span>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>The Weeknd</span>
                    <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Post Malone</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star className="w-5 h-5" style={{ color: 'var(--color-accent-pink)' }} /> Favorite Friends
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Favorite Friend 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--color-accent-pink)' }}>
                  <Star className="w-4 h-4" fill="currentColor" />
                </div>
                <div style={{ position: 'relative' }}>
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Miller" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent-pink)' }} />
                  <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', backgroundColor: 'var(--color-accent-green)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Sarah Miller</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-pink)', fontWeight: 'bold' }}>🔥 In Live Room</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="Chat">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-accent-purple, #9D4EDD)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(157, 78, 221, 0.3)' }} title="Join">
                    <PlayCircle className="w-4 h-4" />
                  </button>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="Invite">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Favorite Friend 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--color-accent-pink)' }}>
                  <Star className="w-4 h-4" fill="currentColor" />
                </div>
                <div style={{ position: 'relative' }}>
                  <img src="https://i.pravatar.cc/150?u=david" alt="David Chen" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border)' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>David Chen</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>💤 Away</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="Chat">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', opacity: 0.5 }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="Join (Offline)" disabled>
                    <PlayCircle className="w-4 h-4" />
                  </button>
                  <button style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="Invite">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Online Friends</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Friend Card 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="https://i.pravatar.cc/150?u=alex" alt="Alex Johnson" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-accent-green)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Alex Johnson</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🎵</span>
                      Listening
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', backgroundColor: 'var(--color-accent-purple, #9D4EDD)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(157, 78, 221, 0.3)' }}>
                    <PlayCircle className="w-4 h-4" /> Join
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="View Profile">
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Friend Card 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah Miller" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-accent-green)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Sarah Miller</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1rem' }}>🎙</span>
                      In Voice Chat
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', backgroundColor: 'var(--color-accent-purple, #9D4EDD)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(157, 78, 221, 0.3)' }}>
                    <PlayCircle className="w-4 h-4" /> Join
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} title="View Profile">
                    <User className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Currently Listening</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Currently Listening Card 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--color-accent-purple, #9D4EDD)' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <img src="https://i.pravatar.cc/150?u=alex" alt="Alex" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Alex</h4>
                  <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(157, 78, 221, 0.1)', color: 'var(--color-accent-purple, #9D4EDD)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity className="w-3 h-3" /> Live
                  </span>
                </div>
                
                <div style={{ backgroundColor: '#09090B', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🎵</span>
                    <h5 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: '#fff' }}>Blinding Lights</h5>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, marginLeft: '32px' }}>The Weeknd</p>
                </div>

                <button 
                  onClick={() => {
                    if (activeSessionId === 'alex') {
                      setActiveSessionId(null);
                      showToast('Left session.');
                    } else {
                      setActiveSessionId('alex');
                      showToast('Joined session!');
                    }
                  }} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: activeSessionId === 'alex' ? 'rgba(157, 78, 221, 0.2)' : 'var(--color-accent-purple, #9D4EDD)', color: activeSessionId === 'alex' ? 'var(--color-accent-purple, #9D4EDD)' : '#fff', border: activeSessionId === 'alex' ? '1px solid var(--color-accent-purple, #9D4EDD)' : 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: activeSessionId === 'alex' ? 'none' : '0 4px 10px rgba(157, 78, 221, 0.3)', transition: 'all 0.2s' }} 
                  onMouseEnter={(e) => { if (activeSessionId !== 'alex') e.currentTarget.style.transform = 'scale(1.02)' }} 
                  onMouseLeave={(e) => { if (activeSessionId !== 'alex') e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {activeSessionId === 'alex' ? (
                    <><Check className="w-5 h-5" /> Listening with Alex</>
                  ) : (
                    <><PlayCircle className="w-5 h-5" /> Join Session</>
                  )}
                </button>
              </div>

              {/* Currently Listening Card 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--color-accent-purple, #9D4EDD)' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Sarah</h4>
                  <span style={{ marginLeft: 'auto', backgroundColor: 'rgba(157, 78, 221, 0.1)', color: 'var(--color-accent-purple, #9D4EDD)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity className="w-3 h-3" /> Live
                  </span>
                </div>
                
                <div style={{ backgroundColor: '#09090B', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🎵</span>
                    <h5 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: '#fff' }}>Levitating</h5>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, marginLeft: '32px' }}>Dua Lipa</p>
                </div>

                <button 
                  onClick={() => {
                    if (activeSessionId === 'sarah') {
                      setActiveSessionId(null);
                      showToast('Left session.');
                    } else {
                      setActiveSessionId('sarah');
                      showToast('Joined session!');
                    }
                  }} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: activeSessionId === 'sarah' ? 'rgba(157, 78, 221, 0.2)' : 'var(--color-accent-purple, #9D4EDD)', color: activeSessionId === 'sarah' ? 'var(--color-accent-purple, #9D4EDD)' : '#fff', border: activeSessionId === 'sarah' ? '1px solid var(--color-accent-purple, #9D4EDD)' : 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: activeSessionId === 'sarah' ? 'none' : '0 4px 10px rgba(157, 78, 221, 0.3)', transition: 'all 0.2s' }} 
                  onMouseEnter={(e) => { if (activeSessionId !== 'sarah') e.currentTarget.style.transform = 'scale(1.02)' }} 
                  onMouseLeave={(e) => { if (activeSessionId !== 'sarah') e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {activeSessionId === 'sarah' ? (
                    <><Check className="w-5 h-5" /> Listening with Sarah</>
                  ) : (
                    <><PlayCircle className="w-5 h-5" /> Join Session</>
                  )}
                </button>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', margin: 0 }}>Shared Listening Sessions</h2>
              <button style={{ backgroundColor: 'transparent', color: 'var(--color-accent-pink)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Session Card 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', backgroundImage: 'linear-gradient(to bottom right, rgba(255, 77, 141, 0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: 'var(--text-h4)', fontWeight: 'bold', margin: 0 }}>Friday Chill</h4>
                  <span style={{ backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-accent-pink)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Live</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />
                    <img src="https://i.pravatar.cc/150?u=marcus" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', marginLeft: '-10px' }} />
                    <img src="https://i.pravatar.cc/150?u=alex" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', marginLeft: '-10px' }} />
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>4 Friends Listening</span>
                </div>

                <button 
                  onClick={() => {
                    if (activeSessionId === 'friday_chill') {
                      setActiveSessionId(null);
                      showToast('Left Friday Chill session.');
                    } else {
                      setActiveSessionId('friday_chill');
                      showToast('Joined Friday Chill session!');
                    }
                  }} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: activeSessionId === 'friday_chill' ? 'rgba(255, 77, 141, 0.2)' : 'var(--color-accent-pink)', color: activeSessionId === 'friday_chill' ? 'var(--color-accent-pink)' : '#fff', border: activeSessionId === 'friday_chill' ? '1px solid var(--color-accent-pink)' : 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: activeSessionId === 'friday_chill' ? 'none' : '0 4px 10px rgba(255, 77, 141, 0.3)', transition: 'all 0.2s' }} 
                  onMouseEnter={(e) => { if (activeSessionId !== 'friday_chill') e.currentTarget.style.transform = 'scale(1.02)' }} 
                  onMouseLeave={(e) => { if (activeSessionId !== 'friday_chill') e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {activeSessionId === 'friday_chill' ? (
                    <><Check className="w-5 h-5" /> Listening</>
                  ) : (
                    <><Headphones className="w-5 h-5" /> Join</>
                  )}
                </button>
              </div>

              {/* Session Card 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', backgroundImage: 'linear-gradient(to bottom right, rgba(29, 185, 84, 0.05), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: 'var(--text-h4)', fontWeight: 'bold', margin: 0 }}>Workout Mix</h4>
                  <span style={{ backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'var(--color-accent-green)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Live</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://i.pravatar.cc/150?u=emily" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)' }} />
                    <img src="https://i.pravatar.cc/150?u=david" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', marginLeft: '-10px' }} />
                  </div>
                  <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>2 Friends Listening</span>
                </div>

                <button 
                  onClick={() => {
                    if (activeSessionId === 'workout_mix') {
                      setActiveSessionId(null);
                      showToast('Left Workout Mix session.');
                    } else {
                      setActiveSessionId('workout_mix');
                      showToast('Joined Workout Mix session!');
                    }
                  }} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: activeSessionId === 'workout_mix' ? 'rgba(29, 185, 84, 0.2)' : 'var(--color-accent-green)', color: activeSessionId === 'workout_mix' ? 'var(--color-accent-green)' : '#000', border: activeSessionId === 'workout_mix' ? '1px solid var(--color-accent-green)' : 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: activeSessionId === 'workout_mix' ? 'none' : '0 4px 10px rgba(29, 185, 84, 0.3)', transition: 'all 0.2s' }} 
                  onMouseEnter={(e) => { if (activeSessionId !== 'workout_mix') e.currentTarget.style.transform = 'scale(1.02)' }} 
                  onMouseLeave={(e) => { if (activeSessionId !== 'workout_mix') e.currentTarget.style.transform = 'scale(1)' }}
                >
                  {activeSessionId === 'workout_mix' ? (
                    <><Check className="w-5 h-5" /> Listening</>
                  ) : (
                    <><Headphones className="w-5 h-5" /> Join</>
                  )}
                </button>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Recent Conversations</h2>
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              
              {/* Conversation 1 */}
              <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-4) var(--spacing-5)', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ position: 'relative', marginRight: 'var(--spacing-4)' }}>
                  <img src="https://i.pravatar.cc/150?u=marcus" alt="Marcus Johnson" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-accent-green)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>Marcus Johnson</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-pink)', fontWeight: 'bold' }}>2m ago</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold' }}>
                      Are you joining the listening party tonight?
                    </p>
                    <div style={{ backgroundColor: 'var(--color-accent-pink)', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'var(--spacing-2)', flexShrink: 0 }}>
                      2
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation 2 */}
              <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-4) var(--spacing-5)', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ position: 'relative', marginRight: 'var(--spacing-4)' }}>
                  <img src="https://i.pravatar.cc/150?u=emily" alt="Emily Rose" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>Emily Rose</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>1h ago</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      I added those new tracks to the shared playlist!
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversation 3 */}
              <div style={{ display: 'flex', alignItems: 'center', padding: 'var(--spacing-4) var(--spacing-5)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ position: 'relative', marginRight: 'var(--spacing-4)' }}>
                  <img src="https://i.pravatar.cc/150?u=david" alt="David Chen" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)' }}>David Chen</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Yesterday</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Thanks for the recommendation, that album is fire 🔥
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Recently Shared Songs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Shared Song 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}>
                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4b2?q=80&w=150&auto=format&fit=crop" alt="Album Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Midnight City</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '2px 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="https://i.pravatar.cc/150?u=emily" alt="Emily" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                    Shared by Emily
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPlayingSharedSongId(playingSharedSongId === 'midnight_city' ? null : 'midnight_city'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: playingSharedSongId === 'midnight_city' ? 'transparent' : 'var(--color-accent-pink)', color: playingSharedSongId === 'midnight_city' ? 'var(--color-accent-pink)' : '#fff', border: playingSharedSongId === 'midnight_city' ? '1px solid var(--color-accent-pink)' : '1px solid transparent', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {playingSharedSongId === 'midnight_city' ? <Activity className="w-3 h-3" /> : <Play className="w-3 h-3" fill="currentColor" />}
                      {playingSharedSongId === 'midnight_city' ? 'Playing' : 'Play'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleReactSharedSong('midnight_city'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: reactedSharedSongIds.includes('midnight_city') ? 'rgba(255, 77, 141, 0.1)' : 'rgba(255,255,255,0.05)', color: reactedSharedSongIds.includes('midnight_city') ? 'var(--color-accent-pink)' : 'var(--color-text-primary)', border: reactedSharedSongIds.includes('midnight_city') ? '1px solid var(--color-accent-pink)' : '1px solid transparent', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }} 
                      onMouseEnter={(e) => { if (!reactedSharedSongIds.includes('midnight_city')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }} 
                      onMouseLeave={(e) => { if (!reactedSharedSongIds.includes('midnight_city')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                    >
                      <Heart className="w-3 h-3" fill={reactedSharedSongIds.includes('midnight_city') ? "currentColor" : "none"} /> React
                    </button>
                  </div>
                </div>
              </div>

              {/* Shared Song 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}>
                <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=150&auto=format&fit=crop" alt="Album Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cruel Summer</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '2px 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="https://i.pravatar.cc/150?u=david" alt="David" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                    Shared by David
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPlayingSharedSongId(playingSharedSongId === 'cruel_summer' ? null : 'cruel_summer'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: playingSharedSongId === 'cruel_summer' ? 'transparent' : 'var(--color-accent-pink)', color: playingSharedSongId === 'cruel_summer' ? 'var(--color-accent-pink)' : '#fff', border: playingSharedSongId === 'cruel_summer' ? '1px solid var(--color-accent-pink)' : '1px solid transparent', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {playingSharedSongId === 'cruel_summer' ? <Activity className="w-3 h-3" /> : <Play className="w-3 h-3" fill="currentColor" />}
                      {playingSharedSongId === 'cruel_summer' ? 'Playing' : 'Play'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleReactSharedSong('cruel_summer'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', backgroundColor: reactedSharedSongIds.includes('cruel_summer') ? 'rgba(255, 77, 141, 0.1)' : 'rgba(255,255,255,0.05)', color: reactedSharedSongIds.includes('cruel_summer') ? 'var(--color-accent-pink)' : 'var(--color-text-primary)', border: reactedSharedSongIds.includes('cruel_summer') ? '1px solid var(--color-accent-pink)' : '1px solid transparent', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }} 
                      onMouseEnter={(e) => { if (!reactedSharedSongIds.includes('cruel_summer')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }} 
                      onMouseLeave={(e) => { if (!reactedSharedSongIds.includes('cruel_summer')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)' }}
                    >
                      <Heart className="w-3 h-3" fill={reactedSharedSongIds.includes('cruel_summer') ? "currentColor" : "none"} /> React
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListMusic className="w-5 h-5" style={{ color: 'var(--color-accent-green)' }} /> Shared Playlists
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Shared Playlist 1 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    <img src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=150&auto=format&fit=crop" alt="Playlist Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '0 0 4px 0' }}>Workout Mix</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src="https://i.pravatar.cc/150?u=alex" alt="Alex" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                      Created by Alex
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-accent-pink)', fontWeight: 'bold' }}>
                      <Users className="w-3 h-3" /> 8 Contributors
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex' }}>
                    {/* Avatars overlap */}
                    <img src="https://i.pravatar.cc/150?u=alex" alt="User 1" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 3 }} />
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="User 2" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 2, marginLeft: '-8px' }} />
                    <img src="https://i.pravatar.cc/150?u=david" alt="User 3" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 1, marginLeft: '-8px' }} />
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 0, marginLeft: '-8px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>+5</div>
                  </div>
                  <button onClick={() => setOpenedPlaylistId('workout_mix')} style={{ padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '20px', fontSize: 'var(--text-sm)', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                    Open Playlist
                  </button>
                </div>
              </div>

              {/* Shared Playlist 2 */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=150&auto=format&fit=crop" alt="Playlist Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '0 0 4px 0' }}>Party Anthems</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img src="https://i.pravatar.cc/150?u=emma" alt="Emma" style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                      Created by Emma
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-accent-purple, #9D4EDD)', fontWeight: 'bold' }}>
                      <Users className="w-3 h-3" /> 14 Contributors
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex' }}>
                    {/* Avatars overlap */}
                    <img src="https://i.pravatar.cc/150?u=emma" alt="User 1" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 3 }} />
                    <img src="https://i.pravatar.cc/150?u=lucas" alt="User 2" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 2, marginLeft: '-8px' }} />
                    <img src="https://i.pravatar.cc/150?u=olivia" alt="User 3" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 1, marginLeft: '-8px' }} />
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--color-surface)', zIndex: 0, marginLeft: '-8px', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>+11</div>
                  </div>
                  <button onClick={() => setOpenedPlaylistId('party_anthems')} style={{ padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--color-text-primary)', border: 'none', borderRadius: '20px', fontSize: 'var(--text-sm)', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                    Open Playlist
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy className="w-5 h-5" style={{ color: '#FFD700' }} /> Weekly Leaderboard
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
              
              {/* Leaderboard Item 1: Songs Played */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ListMusic className="w-6 h-6" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Songs Played</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1 }}>248</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-pink)', fontWeight: 'bold', marginBottom: '2px' }}>#1 Alex</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard Item 2: Listening Hours */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(157, 78, 221, 0.1)', color: 'var(--color-accent-purple, #9D4EDD)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock className="w-6 h-6" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Listening Hours</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1 }}>42h</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-purple, #9D4EDD)', fontWeight: 'bold', marginBottom: '2px' }}>#1 You</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard Item 3: Streak */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255, 165, 0, 0.1)', color: '#FFA500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Flame className="w-6 h-6" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Streak</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1 }}>14d</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: '#FFA500', fontWeight: 'bold', marginBottom: '2px' }}>#1 Sarah</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard Item 4: Challenges Completed */}
              <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target className="w-6 h-6" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Challenges Completed</span>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1 }}>8</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-green)', fontWeight: 'bold', marginBottom: '2px' }}>#1 David</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-4)' }}>
            <h2 style={{ fontSize: 'var(--text-h3)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Friends Activity Feed</h2>
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 'var(--spacing-5)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                
                {/* Activity 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 77, 141, 0.1)', color: 'var(--color-accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Heart className="w-5 h-5" fill="currentColor" />
                  </div>
                  <div style={{ flex: 1, paddingBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--color-text-primary)' }}>
                        <span style={{ fontWeight: 'bold' }}>Rahul</span> liked <span style={{ fontWeight: 'bold', color: '#fff' }}>"Shape of You"</span>
                      </h4>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-pink)', fontWeight: 'bold' }}>5 min ago</span>
                    </div>
                    <div style={{ alignItems: 'center', gap: '8px', marginTop: '8px', backgroundColor: '#09090B', padding: '8px 12px', borderRadius: '8px', display: 'inline-flex' }}>
                      <span style={{ fontSize: '1rem' }}>🎵</span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Ed Sheeran</span>
                    </div>
                  </div>
                </div>

                {/* Activity 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ListMusic className="w-5 h-5" />
                  </div>
                  <div style={{ flex: 1, paddingBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--color-text-primary)' }}>
                        <span style={{ fontWeight: 'bold' }}>Anita</span> created a playlist
                      </h4>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>20 min ago</span>
                    </div>
                    <div style={{ alignItems: 'center', gap: '8px', marginTop: '8px', backgroundColor: '#09090B', padding: '8px 12px', borderRadius: '8px', display: 'inline-flex', borderLeft: '2px solid var(--color-accent-green)' }}>
                      <span style={{ fontSize: '1rem' }}>💿</span>
                      <span style={{ fontSize: 'var(--text-sm)', color: '#fff', fontWeight: 'bold' }}>Weekend Vibes</span>
                    </div>
                  </div>
                </div>

                {/* Activity 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(157, 78, 221, 0.1)', color: 'var(--color-accent-purple, #9D4EDD)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', margin: 0, color: 'var(--color-text-primary)' }}>
                        <span style={{ fontWeight: 'bold' }}>John</span> started listening
                      </h4>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>1 hour ago</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (activeSessionId === 'john_activity') {
                          setActiveSessionId(null);
                          showToast("Left John's session.");
                        } else {
                          setActiveSessionId('john_activity');
                          showToast("Joined John's session!");
                        }
                      }}
                      style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: activeSessionId === 'john_activity' ? 'rgba(157, 78, 221, 0.2)' : 'var(--color-accent-purple, #9D4EDD)', color: activeSessionId === 'john_activity' ? 'var(--color-accent-purple, #9D4EDD)' : '#fff', border: activeSessionId === 'john_activity' ? '1px solid var(--color-accent-purple, #9D4EDD)' : '1px solid transparent', borderRadius: '6px', fontSize: 'var(--text-sm)', fontWeight: 'bold', cursor: 'pointer', boxShadow: activeSessionId === 'john_activity' ? 'none' : '0 2px 8px rgba(157, 78, 221, 0.3)' }}
                    >
                      {activeSessionId === 'john_activity' ? <Check className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      {activeSessionId === 'john_activity' ? 'Listening' : 'Join Session'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          </>
          )}

          {/* Chat Window */}
          {isChatOpen && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '350px',
              height: '500px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 999,
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Chat Header */}
              <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="https://i.pravatar.cc/150?u=jessica" alt="Friend" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-accent-green)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>Jessica Wong</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent-green)' }}>Online</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', overflowY: 'auto' }}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'flex-end', alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start', flexDirection: msg.sender === 'Me' ? 'row-reverse' : 'row' }}>
                    {msg.sender !== 'Me' && (
                      <img src="https://i.pravatar.cc/150?u=jessica" alt="Friend" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <div style={{ backgroundColor: msg.sender === 'Me' ? 'var(--color-accent-pink)' : 'rgba(255, 255, 255, 0.05)', padding: '10px 14px', borderRadius: '16px', borderBottomRightRadius: msg.sender === 'Me' ? '4px' : '16px', borderBottomLeftRadius: msg.sender === 'Me' ? '16px' : '4px', maxWidth: '80%' }}>
                      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: msg.sender === 'Me' ? '#fff' : 'inherit' }}>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-2)' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..." 
                  style={{ flex: 1, padding: '10px 16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border)', borderRadius: '20px', color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
                <button onClick={handleSendMessage} style={{ backgroundColor: 'var(--color-accent-pink)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', transition: 'transform 0.2s', flexShrink: 0 }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {toastMessage && (
            <div style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '12px 24px',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 1000,
              animation: 'slideUp 0.3s ease-out'
            }}>
              <Check className="w-4 h-4" style={{ color: 'var(--color-accent-green)' }} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{toastMessage}</span>
            </div>
          )}

        </main>
      </div>
      {openedPlaylistId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setOpenedPlaylistId(null)}>
          <div style={{ backgroundColor: 'var(--color-surface)', width: '90%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: 'var(--spacing-5)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: openedPlaylistId === 'workout_mix' ? 'rgba(157, 78, 221, 0.2)' : 'rgba(255, 77, 141, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ListMusic className="w-6 h-6" style={{ color: openedPlaylistId === 'workout_mix' ? 'var(--color-accent-purple)' : 'var(--color-accent-pink)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-h3)', margin: 0, fontWeight: 'bold' }}>
                    {openedPlaylistId === 'workout_mix' ? 'Workout Mix' : 'Party Anthems'}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {openedPlaylistId === 'workout_mix' ? '12 tracks • 45 mins' : '24 tracks • 1 hr 15 mins'}
                  </p>
                </div>
              </div>
              <button onClick={() => setOpenedPlaylistId(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '8px' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', maxHeight: '60vh', overflowY: 'auto' }}>
              {[
                { title: 'Blinding Lights', artist: 'The Weeknd' },
                { title: 'Levitating', artist: 'Dua Lipa' },
                { title: 'Cruel Summer', artist: 'Taylor Swift' },
                { title: 'Midnight City', artist: 'M83' }
              ].map((song, i) => (
                <div key={i} onClick={() => setPlayingSharedSongId(playingSharedSongId === song.title ? null : song.title)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: playingSharedSongId === song.title ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = playingSharedSongId === song.title ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)'}>
                  <span style={{ color: playingSharedSongId === song.title ? 'var(--color-accent-pink)' : 'var(--color-text-secondary)', width: '20px', textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{i + 1}</span>
                  <div style={{ width: '40px', height: '40px', backgroundColor: playingSharedSongId === song.title ? 'var(--color-accent-pink)' : 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {playingSharedSongId === song.title ? <Activity className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: 'var(--text-base)', fontWeight: 'bold', color: playingSharedSongId === song.title ? 'var(--color-accent-pink)' : 'inherit' }}>{song.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{song.artist}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleReactSharedSong(song.title); }} style={{ background: 'none', border: 'none', color: reactedSharedSongIds.includes(song.title) ? 'var(--color-accent-pink)' : 'var(--color-text-secondary)', cursor: 'pointer' }}>
                    <Heart className="w-4 h-4" fill={reactedSharedSongIds.includes(song.title) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </SubscriptionGuard>
  );
}
