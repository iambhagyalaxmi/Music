"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../lib/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlobalRoomProvider } from '../lib/GlobalRoomContext';
import { GlobalPlayer } from '../components/GlobalPlayer';
import { MobileNav } from '../components/MobileNav';

declare global {
  interface Window {
    __fetchPatched?: boolean;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Next.js requires NEXT_PUBLIC_ prefix for browser env vars. Fall back to the actual ID so Vercel deployments work seamlessly.
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1088837356107-4lf25tua3k4b5np8cpo5bccsc41r0b62.apps.googleusercontent.com';
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });

    if (typeof window !== 'undefined' && !window.__fetchPatched) {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const res = await originalFetch.apply(this, args);
        
        const options = args[1] as RequestInit | undefined;
        const method = options?.method?.toUpperCase();
        const isMutation = method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
        
        if (isMutation && res.ok) {
          client.invalidateQueries({ queryKey: ['profile'] }).catch(() => {});
        }
        return res;
      };
      window.__fetchPatched = true;
    }

    return client;
  });

function GlobalThemeLoader() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const token = localStorage.getItem('soundsphere_token');
      if (!token) return null;
      // Use absolute URL since this runs on client and server depending on context, wait, API_URL needs to be imported or hardcoded if not. 
      // But we can just use relative URL or process.env.NEXT_PUBLIC_API_URL
      const { API_URL } = await import('../lib/api');
      const res = await fetch(`${API_URL}/api/settings`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      return res.json();
    }
  });

  useEffect(() => {
    if (settings?.theme?.themeMode) {
      const mode = settings.theme.themeMode;
      if (mode === 'LIGHT') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (mode === 'DARK') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    }
  }, [settings]);

  return null;
}

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
          <GlobalThemeLoader />
          <GlobalRoomProvider>
            <GlobalPlayer />
            {children}
            <MobileNav />
          </GlobalRoomProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
