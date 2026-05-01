import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            id={inputId}
            {...props}
            style={{
              width: '100%',
              background: 'var(--color-surface-2)',
              border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border-light)'}`,
              borderRadius: '10px',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              padding: '11px 14px',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={(e) => {
              if (!error) {
                (e.target as HTMLInputElement).style.borderColor = 'var(--color-brand)';
                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px var(--color-brand-dim)';
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border-light)';
              (e.target as HTMLInputElement).style.boxShadow = 'none';
              props.onBlur?.(e);
            }}
          />
        </div>
        {error && (
          <p style={{ fontSize: '12px', color: 'var(--color-danger)', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
