import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

const styles: Record<string, { bg: string; color: string; border: string; hover: string }> = {
  primary: {
    bg: 'var(--color-brand)',
    color: '#0b0906',
    border: 'transparent',
    hover: 'var(--color-brand-hover)',
  },
  secondary: {
    bg: 'var(--color-surface-2)',
    color: 'var(--color-text)',
    border: 'var(--color-border-light)',
    hover: 'var(--color-surface)',
  },
  danger: {
    bg: 'var(--color-danger-dim)',
    color: 'var(--color-danger)',
    border: 'rgba(224, 92, 92, 0.25)',
    hover: 'rgba(224, 92, 92, 0.2)',
  },
  ghost: {
    bg: 'transparent',
    color: 'var(--color-text-muted)',
    border: 'transparent',
    hover: 'var(--color-surface-2)',
  },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const s = styles[variant];

  return (
    <button
      disabled={isLoading || disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        borderRadius: '8px',
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.color,
        cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
        opacity: isLoading || disabled ? 0.5 : 1,
        transition: 'background 0.15s, opacity 0.15s, transform 0.1s',
        fontSize: size === 'sm' ? '13px' : '14px',
        padding: size === 'sm' ? '6px 12px' : '10px 18px',
        letterSpacing: '-0.01em',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          (e.currentTarget as HTMLButtonElement).style.background = s.hover;
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = s.bg;
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
