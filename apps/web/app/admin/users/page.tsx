"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../../lib/api';
import { Trash2, Edit2, Check, X } from 'lucide-react';

const fetchUsers = async () => {
  const token = localStorage.getItem('soundsphere_token');
  const res = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ role: '', isActive: true });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const token = localStorage.getItem('soundsphere_token');
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update');
    },
    onSuccess: () => {
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({ role: user.role, isActive: user.isActive });
  };

  const handleSave = (id: string) => {
    updateMutation.mutate({ id, data: editForm });
  };

  if (isLoading) return <div style={{ color: 'var(--color-text-secondary)' }}>Loading users...</div>;

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-h2)', fontWeight: 'bold', margin: '0 0 var(--spacing-6) 0' }}>Manage Users</h1>
      
      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Username</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Email</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Role</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Active</th>
              <th style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: editingId === user.id ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-primary)' }}>{user.username}</td>
                <td style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  {editingId === user.id ? (
                    <select 
                      value={editForm.role} 
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      style={{ backgroundColor: 'var(--color-bg)', color: '#fff', border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px' }}
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">MODERATOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  ) : (
                    <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: user.role === 'ADMIN' ? 'rgba(255,77,141,0.2)' : 'rgba(255,255,255,0.1)', color: user.role === 'ADMIN' ? 'var(--color-accent-pink)' : '#fff' }}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td style={{ padding: 'var(--spacing-4)' }}>
                  {editingId === user.id ? (
                    <input 
                      type="checkbox" 
                      checked={editForm.isActive} 
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    />
                  ) : (
                    <span style={{ color: user.isActive ? 'var(--color-accent-green)' : '#ff4d4d' }}>{user.isActive ? 'Yes' : 'No'}</span>
                  )}
                </td>
                <td style={{ padding: 'var(--spacing-4)', textAlign: 'right' }}>
                  {editingId === user.id ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleSave(user.id)} style={{ padding: '6px', backgroundColor: 'var(--color-accent-green)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '6px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(user)} style={{ padding: '6px', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(user.id)} style={{ padding: '6px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
