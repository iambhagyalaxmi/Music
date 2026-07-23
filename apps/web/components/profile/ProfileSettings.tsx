import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../lib/api';

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    country: '',
  });

  const updateProfile = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('soundsphere_token')}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      alert('Profile updated successfully!');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  return (
    <div style={{ margin: '0 auto', maxWidth: '42rem', borderRadius: '16px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>Edit Profile</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Display Name</label>
          <input
            type="text"
            style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', padding: '10px 16px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Bio</label>
          <textarea
            style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', padding: '10px 16px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            placeholder="Tell us about your music taste..."
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Country</label>
          <input
            type="text"
            style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', padding: '10px 16px', color: '#fff', outline: 'none', transition: 'border-color 0.2s' }}
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            placeholder="USA"
          />
        </div>
        
        <div style={{ paddingTop: '16px' }}>
          <button
            type="submit"
            disabled={updateProfile.isPending}
            style={{ width: '100%', borderRadius: '8px', backgroundColor: 'var(--color-primary)', padding: '12px 16px', fontWeight: 'bold', color: 'var(--color-bg)', border: 'none', cursor: updateProfile.isPending ? 'not-allowed' : 'pointer', opacity: updateProfile.isPending ? 0.5 : 1, transition: 'transform 0.2s' }}
            onMouseEnter={e => { if (!updateProfile.isPending) e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { if (!updateProfile.isPending) e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
