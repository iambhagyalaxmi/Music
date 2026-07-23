import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Share2, Edit2, UserPlus, MessageCircle, Mic, Music, Disc, BadgeCheck, MapPin, Calendar, Globe, Music2, Mic2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  profile: any;
  isOwnProfile: boolean;
  stats: any;
  followersCount: number;
  followingCount: number;
  onEditClick?: () => void;
}

export function ProfileHeader({ profile, isOwnProfile, stats, followersCount, followingCount, onEditClick }: ProfileHeaderProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div style={{ position: 'relative', marginBottom: 'var(--spacing-12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Cover Banner */}
      <div style={{ position: 'relative', height: '320px', width: '100%', overflow: 'hidden', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', backgroundColor: '#11111A' }}>
        
        {/* Parallax Background */}
        <motion.div style={{ y, position: 'absolute', inset: -50, zIndex: 0 }}>
          {/* Blurred Background Image */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${profile?.bannerUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2000&auto=format&fit=crop'})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(20px) saturate(1.5)', opacity: 0.6 }} />
          
          {/* Animated Gradient Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(45deg, rgba(29, 185, 84, 0.4), rgba(255, 77, 141, 0.4), rgba(139, 92, 246, 0.4))', backgroundSize: '400% 400%', animation: 'gradientMove 15s ease infinite' }} />
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes spinVinyl {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}} />
        </motion.div>

        {/* Decorative Elements */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10%', opacity: 0.8, pointerEvents: 'none' }}>
          
          {/* Animated Waveform */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ['20%', '100%', '40%', '80%', '30%', '90%', '20%'] }}
                transition={{ duration: 1.5 + (i * 0.1), repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                style={{ width: '8px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '4px', boxShadow: '0 0 12px rgba(255,255,255,0.4)' }}
              />
            ))}
          </div>

          {/* Spinning Vinyl Record */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '180px', height: '180px', borderRadius: '50%', backgroundColor: '#09090B', border: '4px solid #2A2A3C', boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.1)', animation: 'spinVinyl 4s linear infinite' }}>
            <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', inset: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', inset: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', inset: '48px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
            
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#09090B', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)' }} />
            </div>
            
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Bottom Fade out */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', backgroundImage: 'linear-gradient(to top, var(--color-bg), transparent)', zIndex: 2 }} />
      </div>

      {/* Profile Details Container */}
      <div style={{ position: 'relative', marginTop: '-100px', zIndex: 3, display: 'flex', width: '100%', maxWidth: '1024px', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-6)', padding: '0 var(--spacing-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-6)', width: '100%' }}>
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ position: 'relative', height: '128px', width: '128px', flexShrink: 0, borderRadius: '50%', border: '4px solid var(--color-bg)', backgroundColor: 'var(--color-surface)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
          >
            <img
              src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${profile?.displayName || 'User'}&background=1DB954&color=fff`}
              alt="Avatar"
              style={{ height: '100%', width: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', height: '20px', width: '20px', borderRadius: '50%', border: '2px solid var(--color-bg)', backgroundColor: 'var(--color-primary)' }} title="Online" />
          </motion.div>

          {/* Info */}
          <div style={{ textAlign: 'center', paddingBottom: 'var(--spacing-4)', width: '100%' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '900', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {profile?.displayName}
              {profile?.isVerified && <BadgeCheck style={{ color: 'var(--color-primary)' }} size={24} />}
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
              @{profile?.username || profile?.displayName?.toLowerCase().replace(/\s+/g, '_')}
            </p>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              <span style={{ backgroundColor: 'rgba(29, 185, 84, 0.1)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: '9999px', fontWeight: 'bold' }}>Premium Member</span>
              <span><strong style={{ color: '#fff' }}>{followersCount}</strong> Followers</span>
              <span><strong style={{ color: '#fff' }}>{followingCount}</strong> Following</span>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {profile?.favoriteGenres && profile.favoriteGenres.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Music2 size={16} /> {profile.favoriteGenres.join(' | ')}
                </span>
              )}
              {profile?.country && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> {profile.country}
                </span>
              )}
              {profile?.joinedDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} /> Joined {profile.joinedDate}
                </span>
              )}
            </div>

            {profile?.bio && <p style={{ marginTop: '16px', maxWidth: '36rem', fontSize: '0.95rem', color: '#fff', lineHeight: 1.6, margin: '16px auto 0' }}>{profile.bio}</p>}

            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center', gap: '16px' }}>
              {profile?.favoriteArtist && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Favorite Artist</span>
                  <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Mic2 size={14} style={{ color: 'var(--color-accent-pink)' }} /> {profile.favoriteArtist}</span>
                </div>
              )}
              {profile?.topGenre && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Top Genre</span>
                  <span style={{ fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Disc size={14} style={{ color: 'var(--color-primary)' }} /> {profile.topGenre}</span>
                </div>
              )}
              {profile?.website && (
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <a href={profile.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                    <Globe size={16} /> {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px', paddingBottom: '16px' }}>
          {isOwnProfile ? (
            <>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: profile?.displayName, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Profile link copied to clipboard!');
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} 
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} 
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              >
                <Share2 size={16} /> Share
              </button>
              <button 
                onClick={onEditClick}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', backgroundColor: 'var(--color-primary)', padding: '8px 24px', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-bg)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} 
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} 
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            </>
          ) : (
            <>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', backgroundColor: 'var(--color-primary)', padding: '8px 24px', fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--color-bg)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <UserPlus size={16} /> Follow
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', fontSize: 'var(--text-sm)', fontWeight: '600', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                <MessageCircle size={16} /> Message
              </button>
              <button style={{ display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} title="Invite to Room" onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                <Music size={16} />
              </button>
              <button style={{ display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }} title="Start Voice Chat" onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                <Mic size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
