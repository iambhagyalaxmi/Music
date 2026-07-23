import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }}>SoundSphere</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-8)' }}>
        Listen to music together in synchronized rooms.
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
        <Link href="/login" className="btn btn-primary">
          Log In
        </Link>
        <Link href="/signup" className="btn btn-secondary">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
