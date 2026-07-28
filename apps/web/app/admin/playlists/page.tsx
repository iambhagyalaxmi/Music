"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../../lib/api';
import { Trash2, Edit2, Check, X } from 'lucide-react';

const fetchPlaylists = async () => {
  const token = localStorage.getItem('soundsphere_token');
  const res = await fetch(`${API_URL}/api/admin/playlists`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch playlists');
  return res.json();
};

export default function AdminPlaylistsPage() {
  const queryClient = useQueryClient();
  const { data: playlists, isLoading } = useQuery({ queryKey: ['admin-playlists'], queryFn: fetchPlaylists });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', isPublic: true });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/admin/playlists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-playlists'] })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/admin/playlists/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
    },
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (playlist: any) => {
    setEditingId(playlist.id);
    setEditForm({ title: playlist.title, isPublic: playlist.isPublic });
  };

  const handleSave = (id: string) => {
    updateMutation.mutate({ id, data: editForm });
  };

  if (isLoading) return <div style={{ color: 'var(--color-text-secondary)' }}>Loading playlists...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: '0 0 var(--spacing-6) 0' }}>Manage Playlists</h1>
      
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Title</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Creator</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Visibility</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {playlists?.map((playlist: any) => (
              <tr key={playlist.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: editingId === playlist.id ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>
                  {editingId === playlist.id ? (
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      style={{ backgroundColor: 'var(--color-bg)', color: '#fff', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px', width: '100%' }}
                    />
                  ) : (
                    playlist.title
                  )}
                </td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{playlist.user?.username || 'Unknown'}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  {editingId === playlist.id ? (
                    <select 
                      value={editForm.isPublic ? 'true' : 'false'} 
                      onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.value === 'true' })}
                      style={{ backgroundColor: 'var(--color-bg)', color: '#fff', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      <option value="true">Public</option>
                      <option value="false">Private</option>
                    </select>
                  ) : (
                    <span style={{ color: playlist.isPublic ? 'var(--color-accent-green)' : 'var(--color-text-secondary)' }}>
                      {playlist.isPublic ? 'Public' : 'Private'}
                    </span>
                  )}
                </td>
                <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                  {editingId === playlist.id ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleSave(playlist.id)} style={{ padding: '6px', backgroundColor: 'var(--color-accent-green)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '6px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(playlist)} style={{ padding: '6px', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(playlist.id)} style={{ padding: '6px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!playlists || playlists.length === 0) && (
              <tr>
                <td colSpan={4} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No playlists found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
