"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { LayoutDashboard, Users, ListMusic, Music, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Playlists', href: '/admin/playlists', icon: ListMusic },
    { name: 'Songs', href: '/admin/songs', icon: Music },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: 'var(--spacing-6) 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '0 0 var(--spacing-1) 0', color: 'var(--color-text-primary)' }}>Admin Panel</h2>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-accent-pink)' }}>SoundSphere Control</p>
        </div>

        <nav style={{ flex: 1, padding: '0 var(--spacing-4)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-3)', 
                      padding: 'var(--spacing-3) var(--spacing-4)', 
                      borderRadius: 'var(--radius-md)', 
                      color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      textDecoration: 'none',
                      fontWeight: isActive ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: isActive ? 'var(--color-accent-pink)' : 'inherit' }} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '0 var(--spacing-4)', marginTop: 'auto' }}>
          <Link 
            href="/dashboard"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-3)', 
              padding: 'var(--spacing-3) var(--spacing-4)', 
              borderRadius: 'var(--radius-md)', 
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--spacing-8)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
