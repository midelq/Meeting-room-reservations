import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
  };

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-700',
    danger: 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={[base, sizes[size], variants[variant], className].join(' ')}
      {...props}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
