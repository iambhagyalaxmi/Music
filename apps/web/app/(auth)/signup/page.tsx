"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../../../lib/api';

export default function Signup() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: '400px', margin: '40px auto', padding: 'var(--spacing-6)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
      <h1 style={{ marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Join SoundSphere</h1>
      
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
                localStorage.setItem('soundsphere_token', data.token);
                router.push('/dashboard');
              }
            } catch (err) {
              console.error('Google Signup Error:', err);
            }
          }}
          onError={() => console.log('Signup Failed')}
        />
      </div>

      <p style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--color-accent-blue)', textDecoration: 'none' }}>Log in</Link>
      </p>
    </main>
  );
}
