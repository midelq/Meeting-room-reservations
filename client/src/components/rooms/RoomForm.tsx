import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Room } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().default(''),
});

type FormData = z.infer<typeof schema>;

interface RoomFormProps {
  defaultValues?: Pick<Room, 'name' | 'description'>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function RoomForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save' }: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input label="Room name" placeholder="e.g. Board Room" error={errors.name?.message} {...register('name')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
          Description
        </label>
        <textarea
          placeholder="Optional description..."
          rows={3}
          {...register('description')}
          style={{
            width: '100%',
            resize: 'none',
            borderRadius: '8px',
            border: '1px solid var(--color-border-light)',
            background: 'var(--color-surface)',
            padding: '12px 16px',
            fontSize: '14px',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-brand)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-light)')}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
