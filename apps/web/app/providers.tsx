"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../lib/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
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

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <AuthProvider>
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
