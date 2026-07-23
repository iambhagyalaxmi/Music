"use client";

import Link from 'next/link';

export default function SubscriptionExpired() {
  return (
    <main style={{ 
      maxWidth: '600px', 
      margin: '100px auto', 
      padding: 'var(--spacing-8)', 
      backgroundColor: 'var(--color-surface)', 
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      borderTop: '4px solid var(--color-accent-pink)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-4)' }}>⏱️</div>
      <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>Your Trial Has Expired</h1>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)', fontSize: 'var(--text-h3)' }}>
        We hope you enjoyed your 30-day free trial of SoundSphere Premium! To continue joining rooms and listening without limits, please upgrade your subscription.
      </p>

      <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>Premium Includes:</h3>
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 auto', maxWidth: '300px' }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>✓ Unlimited Room Creation</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>✓ Real-time Sync & Voice Chat</li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>✓ Ad-free Listening</li>
          <li style={{ padding: '8px 0' }}>✓ AI Powered Recommendations</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
        <button className="btn btn-primary" style={{ padding: 'var(--spacing-3) var(--spacing-8)', fontSize: 'var(--text-h3)' }}>
          Upgrade Now ($9.99/mo)
        </button>
        <Link href="/dashboard">
          <button className="btn btn-secondary" style={{ padding: 'var(--spacing-3) var(--spacing-6)', fontSize: 'var(--text-h3)' }}>
            Back to Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
