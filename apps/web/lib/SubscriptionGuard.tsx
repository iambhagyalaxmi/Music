"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const SubscriptionGuard = ({ children, requirePremium = false }: { children: React.ReactNode, requirePremium?: boolean }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (requirePremium) {
      const status = user.subscription?.status;
      if (status === 'EXPIRED' || status === 'CANCELLED') {
        router.push('/subscription-expired');
      }
    }
  }, [user, loading, router, requirePremium]);

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-white bg-black">Loading...</div>;
  }

  if (requirePremium) {
    const status = user.subscription?.status;
    if (status === 'EXPIRED' || status === 'CANCELLED') {
      return null; // Will redirect
    }
  }

  return <>{children}</>;
};
