import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <div className="animate-fade-up">
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '96px',
            fontWeight: 800,
            letterSpacing: '-0.06em',
            color: 'var(--color-surface-2)',
            lineHeight: 1,
            marginBottom: '24px',
            WebkitTextStroke: `1px var(--color-border-light)`,
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text)',
            marginBottom: '10px',
          }}
        >
          Page not found
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'var(--color-brand)',
            color: '#0b0906',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-brand-hover)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-brand)')}
        >
          <ArrowLeft size={15} /> Back to rooms
        </Link>
      </div>
    </div>
  );
}
