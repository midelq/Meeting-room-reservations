import { ReactNode } from 'react';
import { Header } from './Header';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header />
      <main style={{ maxWidth: '1152px', margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </main>
    </div>
  );
}
