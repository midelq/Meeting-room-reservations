import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[
            'w-full rounded-lg border bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500',
            'outline-none transition focus:ring-2',
            error
              ? 'border-red-500/60 focus:ring-red-500/40'
              : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30',
          ].join(' ')}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
