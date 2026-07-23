"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../lib/AuthContext';
import { API_URL } from '../../../lib/api';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <main style={{ maxWidth: '400px', margin: '40px auto', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Welcome Back</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-6)' }}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
              });
              const data = await res.json();
              if (data.token) {
                login(data.token, data.user);
              }
            } catch (err) {
              console.error('Google Login Error:', err);
            }
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>

      <p style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Don't have an account? <Link href="/signup" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none' }}>Sign up</Link>
      </p>
    </main>
  );
}
