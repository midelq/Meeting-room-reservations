interface BadgeProps {
  label: string;
  variant?: 'admin' | 'user' | 'default';
}

const styles = {
  admin: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  user: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
  default: 'bg-slate-700/60 text-slate-300 border-slate-600/40',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}
