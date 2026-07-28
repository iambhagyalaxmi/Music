import React, { useState, useEffect } from 'react';
import { PlayCircle, ListMusic, Lock, Globe, Plus, X, Loader2, Trash2 } from 'lucide-react';
import { getMyPlaylists, createPlaylist, getPlaylistById, addSongToPlaylist, removeSongFromPlaylist, PlaylistData } from '../../lib/playlists';
import { useGlobalRoom } from '../../lib/GlobalRoomContext';
import { API_URL } from '../../lib/api';

export function ProfilePlaylists() {
  const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  // Playlist Details & Search State
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { addSelectedToQueue } = useGlobalRoom();

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`${API_URL}/api/ytmusic/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.items || []);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(fetchSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchPlaylists = async () => {
    try {
      const data = await getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const newPlaylist = await createPlaylist({
        title: newTitle.trim(),
        description: newDescription.trim(),
        isPublic
      });
      // The API response for create doesn't include _count, so we add a default
      setPlaylists([{...newPlaylist, _count: { songs: 0, followers: 0 }}, ...playlists]);
      setIsCreating(false);
      setNewTitle('');
      setNewDescription('');
      showToast('Playlist created successfully!', 'success');
    } catch (err) {
      console.error('Failed to create playlist', err);
      showToast('Failed to create playlist. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAndSelectPlaylist = async (id: string) => {
    try {
      const data = await getPlaylistById(id);
      setSelectedPlaylist(data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      showToast('Failed to load playlist details', 'error');
    }
  };

  const handleAddSong = async (track: any) => {
    if (!selectedPlaylist) return;
    try {
      await addSongToPlaylist(selectedPlaylist.id, {
        songId: track.trackId,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        thumbnail: track.thumbnail
      });
      showToast('Song added to playlist!', 'success');
      fetchAndSelectPlaylist(selectedPlaylist.id);
      fetchPlaylists(); // update list counts
    } catch (err: any) {
      showToast(err.message || 'Failed to add song', 'error');
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!selectedPlaylist) return;
    try {
      await removeSongFromPlaylist(selectedPlaylist.id, songId);
      showToast('Song removed!', 'success');
      fetchAndSelectPlaylist(selectedPlaylist.id);
      fetchPlaylists();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove song', 'error');
    }
  };

  const handlePlayPlaylist = async (playlistId: string) => {
    try {
      // We need to fetch the full playlist to get the songs
      const fullPlaylist = await getPlaylistById(playlistId);
      if (fullPlaylist.songs && fullPlaylist.songs.length > 0) {
        fullPlaylist.songs.forEach(item => {
          if (item.song) {
            addSelectedToQueue({
              trackId: item.song.youtubeId || item.song.spotifyId || item.song.id,
              title: item.song.title,
              artist: item.song.artist?.name || 'Unknown',
              duration: item.song.durationMs,
              thumbnail: item.song.coverUrl
            });
          }
        });
        showToast(`Added ${fullPlaylist.songs.length} songs to queue!`, 'success');
      } else {
        showToast('This playlist is empty. Add some songs first!', 'error');
      }
    } catch (err) {
      console.error('Failed to play playlist', err);
      showToast('Failed to load playlist.', 'error');
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: 0 }}>Playlists ({playlists.length})</h3>
        <button 
          onClick={() => setIsCreating(true)}
          style={{ backgroundColor: 'transparent', color: 'var(--color-primary)', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ListMusic size={16} /> Create Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <p>You don't have any playlists yet.</p>
          <button 
            onClick={() => setIsCreating(true)}
            style={{ marginTop: '16px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Create Your First Playlist
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--spacing-4)' }}>
          {playlists.map((playlist) => (
            <div key={playlist.id} style={{ 
              backgroundColor: 'var(--color-surface)', 
              padding: 'var(--spacing-4)', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--color-border)', 
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s', 
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-3)'
            }}
            onClick={() => fetchAndSelectPlaylist(playlist.id)}
            onMouseEnter={(e) => { 
              e.currentTarget.style.transform = 'translateY(-4px)'; 
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; 
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.transform = 'translateY(0)'; 
              e.currentTarget.style.boxShadow = 'none'; 
              e.currentTarget.style.borderColor = 'var(--color-border)'; 
            }}
            >
              {/* Playlist Cover */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                borderRadius: 'var(--radius-md)', 
                background: playlist.coverUrl ? `url(${playlist.coverUrl}) center/cover` : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {!playlist.coverUrl && <ListMusic size={48} style={{ color: '#93c5fd', opacity: 0.5 }} />}
                
                {/* Play Button */}
                <div 
                   onClick={(e) => { e.stopPropagation(); handlePlayPlaylist(playlist.id); }}
                   style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', padding: '8px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9, transition: 'transform 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                   onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <PlayCircle size={24} />
                </div>
              </div>

              {/* Playlist Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {playlist.title}
                  </h4>
                  {playlist.isPublic ? (
                    <span title="Public"><Globe size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} /></span>
                  ) : (
                    <span title="Private"><Lock size={14} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} /></span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {playlist._count?.songs || 0} songs
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setIsCreating(false)}>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '24px', width: '100%', maxWidth: '400px', border: '1px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Create Playlist</h2>
              <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  placeholder="My Awesome Playlist"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff', boxSizing: 'border-box' }}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Description (Optional)</label>
                <textarea 
                  value={newDescription} 
                  onChange={e => setNewDescription(e.target.value)} 
                  placeholder="What's this playlist about?"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', color: '#fff', minHeight: '80px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="public-check" 
                  checked={isPublic} 
                  onChange={e => setIsPublic(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="public-check" style={{ cursor: 'pointer', fontSize: '0.875rem' }}>Make this playlist public</label>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || !newTitle.trim()}
                style={{ marginTop: '8px', padding: '12px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isSubmitting || !newTitle.trim() ? 'not-allowed' : 'pointer', opacity: isSubmitting || !newTitle.trim() ? 0.5 : 1, display: 'flex', justifyContent: 'center' }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Playlist'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Playlist Details Modal */}
      {selectedPlaylist && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedPlaylist(null)}>
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '800px', height: '80vh', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '20px', alignItems: 'flex-start', backgroundColor: 'var(--color-surface-2)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius-md)', background: selectedPlaylist.coverUrl ? `url(${selectedPlaylist.coverUrl}) center/cover` : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {!selectedPlaylist.coverUrl && <ListMusic size={48} style={{ color: '#93c5fd', opacity: 0.5 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>{selectedPlaylist.title}</h2>
                  <button onClick={() => setSelectedPlaylist(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)' }}>{selectedPlaylist.description || 'No description provided.'}</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button onClick={() => { handlePlayPlaylist(selectedPlaylist.id); setSelectedPlaylist(null); }} style={{ backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlayCircle size={20} /> Play All
                  </button>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                    {selectedPlaylist.songs?.length || 0} songs • {selectedPlaylist.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Current Songs */}
              <div style={{ flex: 1, borderRight: '1px solid var(--color-border)', overflowY: 'auto', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Tracks</h3>
                {(!selectedPlaylist.songs || selectedPlaylist.songs.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No songs yet. Search and add some!
                  </div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedPlaylist.songs.map((item: any, idx: number) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: item.song.coverUrl ? `url(${item.song.coverUrl}) center/cover` : '#333' }}></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.song.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.song.artist?.name || 'Unknown Artist'}</div>
                        </div>
                        <button onClick={() => handleRemoveSong(item.song.id)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '8px' }} title="Remove">
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right Column: Add Songs */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--color-bg)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Add Songs</h3>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search YouTube Music..." 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', marginBottom: '16px' }} 
                />
                
                {searchQuery.trim() !== '' && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {isSearching ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Searching...</div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((track) => (
                        <li key={track.trackId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                          <img src={track.thumbnail} alt="" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.artist}</div>
                          </div>
                          <button onClick={() => handleAddSong(track)} style={{ backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Add
                          </button>
                        </li>
                      ))
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No results found.</div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'error' ? 'rgba(220, 38, 38, 0.9)' : 'rgba(22, 163, 74, 0.9)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 'bold',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideUp 0.3s ease-out forwards'
        }}>
          {toast.message}
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
