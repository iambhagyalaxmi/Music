"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { SubscriptionGuard } from '../../lib/SubscriptionGuard';
import { API_URL } from '../../lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout, token } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      // Let's mix mock rooms + actual YouTube Music results
      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/ytmusic/search?q=${encodeURIComponent(searchQuery)}`);
        const ytData = res.ok ? await res.json() : { items: [] };
        
        // Mock matching rooms
        const matchingRooms = continueListening.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())).map(r => ({ ...r, type: 'room' }));
        
        // Format YT Music songs
        const matchingSongs = (ytData.items || []).map((s: any) => ({ ...s, type: 'song' }));

        setSearchResults([...matchingRooms, ...matchingSongs]);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCreateRoom = () => {
    const roomId = Math.random().toString(36).substring(7);
    router.push(`/rooms/${roomId}`);
  };

  const handleSearchResultClick = (item: any) => {
    if (item.type === 'room') {
      router.push(`/rooms/room-${item.id}`);
    } else if (item.type === 'song') {
      const params = new URLSearchParams({
        initialTrack: item.trackId,
        title: item.title,
        artist: item.artist,
        duration: item.duration?.toString() || '0',
        thumbnail: item.thumbnail || ''
      });
      router.push(`/rooms/${Math.random().toString(36).substring(7)}?${params.toString()}`);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <main style={{ padding: 'var(--spacing-8)', textAlign: 'center', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: 'var(--color-text-secondary)' }}>Loading your soundsphere...</h2>
      </main>
    );
  }

  const [continueListening, setContinueListening] = useState<any[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [friendsActivity, setFriendsActivity] = useState<any[]>([]);
  
  // Trending can remain static/mock since it's global recommendations
  const trending = [
    { id: 1, title: 'Global Top 50', type: 'Playlist', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80' },
    { id: 2, title: 'Viral Hits', type: 'Playlist', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80' },
  ];

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Fetch Active Rooms (Continue Listening)
        const roomsRes = await fetch(`${API_URL}/rooms`, { headers });
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setContinueListening(roomsData.map((r: any) => ({
            id: r.id,
            title: r.name,
            users: r.members || 1,
            image: `https://images.unsplash.com/photo-${1511671782779 + Math.floor(Math.random() * 1000)}?w=400&q=80` // random cover
          })));
        }

        // 2. Fetch Recently Played (History)
        const historyRes = await fetch(`${API_URL}/api/ytmusic/history`, { headers });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          // Map UserActivity metadata (videoId) to UI format
          setRecentlyPlayed((historyData.items || []).map((item: any, i: number) => ({
            id: item.id || i,
            title: `Track ${item.metadata?.videoId?.substring(0, 5) || 'Unknown'}`,
            artist: 'YouTube Music',
            time: new Date(item.createdAt).toLocaleDateString(),
            cover: `https://img.youtube.com/vi/${item.metadata?.videoId}/default.jpg`
          })));
        }

        // 3. Fetch Friends Activity
        const friendsRes = await fetch(`${API_URL}/api/community-social/friends-activity`, { headers });
        if (friendsRes.ok) {
          const friendsData = await friendsRes.json();
          setFriendsActivity(friendsData.map((f: any) => ({
            id: f.user.id,
            name: f.user.displayName || f.user.username,
            listeningTo: f.currentlyPlaying ? `${f.currentlyPlaying.title}` : (f.isOnline ? 'Online' : 'Offline'),
            status: f.isOnline ? (f.currentlyPlaying ? 'Listening solo' : 'In a room') : 'Offline',
            avatar: f.user.avatarUrl || `https://ui-avatars.com/api/?name=${f.user.displayName || f.user.username}&background=random`
          })));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };

    fetchDashboardData();
  }, [token]);

  return (
    <SubscriptionGuard>
      <div className="dashboard-layout flex-col lg:flex-row pb-20 lg:pb-6">
        
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar-left hidden lg:flex w-64">
          {/* Logo */}
          <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4) var(--spacing-6)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', background: 'linear-gradient(45deg, var(--color-accent-pink), #ff8a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SoundSphere</h1>
          </div>
          
          {/* Navigation */}
          <nav style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flex: 1 }}>
            <ul className="dashboard-nav-list">
              <li>
                <Link href="/dashboard" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', textDecoration: 'none', fontWeight: 'bold', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/community" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
                  Community
                </Link>
              </li>
              <li>
                <Link href="/friends" style={{ display: 'block', padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', textDecoration: 'none', fontWeight: 'bold', transition: 'background-color 0.2s, color 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
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
        <main className="w-full flex-1 flex flex-col gap-[var(--spacing-6)] min-w-0">
        
          {/* Top Navbar */}
          <header className="flex flex-col sm:flex-row justify-between items-center bg-[var(--color-surface)] p-[var(--spacing-4)] lg:px-[var(--spacing-6)] rounded-[var(--radius-lg)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] gap-4">
            
            {/* Search Bar */}
            <div className="flex-1 flex justify-start relative w-full sm:w-auto">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                placeholder="Search for songs, rooms, or friends..." 
                style={{ 
                  width: '100%', 
                  maxWidth: '500px', 
                  padding: 'var(--spacing-3) var(--spacing-4)', 
                  borderRadius: '24px', 
                  border: '1px solid var(--color-border)', 
                  backgroundColor: 'var(--color-surface-2)', 
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                }} 
              />
              {showSearch && searchQuery.trim() !== '' && (
                <div style={{ position: 'absolute', top: '100%', left: '0', width: '100%', maxWidth: '500px', zIndex: 100, backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', marginTop: 'var(--spacing-2)', padding: 'var(--spacing-2)', border: '1px solid var(--color-border)', maxHeight: '300px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {isSearching ? (
                    <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-muted)', textAlign: 'center' }}>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <ul style={{ listStyle: 'none' }}>
                      {searchResults.map((item, idx) => (
                        <li 
                          key={item.id || idx}
                          onClick={() => handleSearchResultClick(item)}
                          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
                          className="hover-list-item"
                        >
                          {item.type === 'room' && (
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏠</div>
                          )}
                          {item.type === 'song' && item.thumbnail && (
                            <img src={item.thumbnail} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.type === 'room' ? 'Room' : item.artist}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-muted)', textAlign: 'center' }}>No results found</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 sm:gap-4 items-center justify-between sm:justify-end w-full sm:w-auto overflow-hidden">
              <div className="flex items-center gap-2 min-w-0">
                <img src={`https://ui-avatars.com/api/?name=${user?.profile?.displayName || user?.username}&background=random`} alt="Avatar" className="w-9 h-9 rounded-full shrink-0" />
                <span className="font-bold truncate max-w-[140px] sm:max-w-[200px]">
                  {user?.profile?.displayName || user?.username}
                </span>
              </div>
              <button className="btn btn-secondary shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm" onClick={logout}>Log Out</button>
            </div>
          </header>

          <div className="dashboard-content-grid">
        
        {/* Main Content Area */}
        <div className="flex flex-col gap-8 min-w-0">
          
          {/* Hero Section */}
          <section className="hero-section" style={{ 
            position: 'relative', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden',
            padding: 'var(--spacing-8)',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.5)' }}></div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)' }}></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left mb-6">
              
              {/* User Profile Picture */}
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.profile?.displayName || user?.username}&background=random&size=120`} 
                alt="Profile" 
                className="w-20 h-20 sm:w-[120px] sm:h-[120px] rounded-full border-4 border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.5)] shrink-0" 
              />
              
              <div className="flex flex-col gap-1 sm:gap-2">
                {/* Welcome Message + Name */}
                <h1 className="text-3xl sm:text-[3rem] font-bold m-0 leading-tight">
                  {getGreeting()}, <br className="sm:hidden" />
                  {(user?.profile?.displayName || user?.username || 'Guest').split(' ')[0]}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                  {/* Premium Status */}
                  <span className="bg-[var(--color-accent-pink)] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {(user as any)?.isPremium ? 'Premium' : 'Free'}
                  </span>
                  <span className="text-[var(--color-text-secondary)] text-[var(--text-body)]">Ready to jump into the music?</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn btn-primary w-full sm:w-auto py-3 px-6 text-[var(--text-h3)]" onClick={handleCreateRoom}>
                  Start a Room
                </button>
                <button className="btn btn-secondary w-full sm:w-auto py-3 px-6 text-[var(--text-h3)] bg-white/10 backdrop-blur-md">
                  Browse Rooms
                </button>
              </div>
            </div>
          </section>

          {/* Continue Listening */}
          <section>
            <h2 style={{ fontSize: 'var(--text-h2)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>Continue Listening</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {continueListening.map(room => (
                <div key={room.id} className="hover-card shrink-0 min-w-[220px] bg-[var(--color-surface)] rounded-[var(--radius-md)] overflow-hidden cursor-pointer transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] snap-start"
                onClick={handleCreateRoom} // Mocking join
                >
                  <img src={room.image} alt={room.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <div style={{ padding: 'var(--spacing-3)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'var(--text-body)' }}>{room.title}</div>
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', marginTop: '4px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-live)', marginRight: '6px' }}></span>
                      {room.users} listening
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-recently-played-grid">
            {/* Recently Played */}
            <section style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>Recently Played</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {recentlyPlayed.map(track => (
                  <div key={track.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }} className="hover-list-item">
                    <img src={track.cover} alt={track.title} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold' }}>{track.title}</div>
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)' }}>{track.artist}</div>
                    </div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)' }}>{track.time}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>Trending Recommendations</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {trending.map(item => (
                  <div key={item.id} style={{ position: 'relative', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer' }} className="hover-card">
                    <img src={item.cover} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: 'var(--text-h3)' }}>{item.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-body-sm)' }}>{item.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* Sidebar: Friends Activity */}
        <aside className="dashboard-sidebar-right hidden xl:flex bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 flex-col">
          <h2 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--spacing-6)', fontWeight: 'bold' }}>Friend Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {friendsActivity.map(friend => (
              <div key={friend.id} style={{ display: 'flex', gap: 'var(--spacing-3)', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img src={friend.avatar} alt={friend.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  {friend.status !== 'Offline' && (
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: 'var(--color-live)', borderRadius: '50%', border: '2px solid var(--color-surface)' }}></div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{friend.name}</div>
                  <div style={{ color: friend.status === 'Offline' ? 'var(--color-text-muted)' : 'var(--color-text-secondary)', fontSize: 'var(--text-body-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {friend.listeningTo}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border)' }}>
            <Link href="/friends" style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Find Friends</button>
            </Link>
          </div>
        </aside>

      </div>
        </main>
      </div>
    </SubscriptionGuard>
  );
}
