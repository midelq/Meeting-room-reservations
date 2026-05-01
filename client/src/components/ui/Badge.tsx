interface BadgeProps {
  label: string;
  variant?: 'admin' | 'user' | 'default';
}

const styles = {
  admin: { bg: 'rgba(240, 168, 74, 0.12)', color: 'var(--color-brand)', border: 'rgba(240, 168, 74, 0.3)' },
  user:  { bg: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: 'var(--color-border)' },
  default: { bg: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: 'var(--color-border)' },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const s = styles[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: '20px',
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  );
}
