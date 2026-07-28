"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../../lib/api';
import { Trash2 } from 'lucide-react';

const fetchSongs = async () => {
  const token = localStorage.getItem('soundsphere_token');
  const res = await fetch(`${API_URL}/api/admin/songs`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
};

export default function AdminSongsPage() {
  const queryClient = useQueryClient();
  const { data: songs, isLoading } = useQuery({ queryKey: ['admin-songs'], queryFn: fetchSongs });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/admin/songs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-songs'] })
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this cached song? It will be re-fetched from YouTube Music if a user plays it again.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div style={{ color: 'var(--color-text-secondary)' }}>Loading songs...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: '0 0 var(--spacing-6) 0' }}>Manage Cached Songs</h1>
      
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Title</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Artist</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Play Count</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs?.map((song: any) => (
              <tr key={song.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>{song.title}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{song.artist?.name || 'Unknown'}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{song.playCount}</td>
                <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(song.id)} style={{ padding: '6px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {(!songs || songs.length === 0) && (
              <tr>
                <td colSpan={4} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No cached songs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
