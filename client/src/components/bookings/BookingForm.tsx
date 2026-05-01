import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DateTimePicker } from '../ui/DateTimePicker';
import type { Booking } from '../../types';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().default(''),
  startTime: z.date().nullable().refine((v) => v !== null, 'Start time is required'),
  endTime: z.date().nullable().refine((v) => v !== null, 'End time is required'),
}).refine(
  (d) => d.startTime && d.endTime && d.startTime < d.endTime,
  { message: 'End time must be after start time', path: ['endTime'] },
);

type FormValues = {
  title: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
};

interface BookingFormProps {
  defaultValues?: Pick<Booking, 'title' | 'description' | 'startTime' | 'endTime'>;
  onSubmit: (data: { title: string; description: string; startTime: string; endTime: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  resize: 'none',
  borderRadius: '10px',
  border: '1.5px solid var(--color-border-light)',
  background: 'var(--color-surface-2)',
  padding: '11px 14px',
  fontSize: '14px',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export function BookingForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save' }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          startTime: new Date(defaultValues.startTime),
          endTime: new Date(defaultValues.endTime),
        }
      : { title: '', description: '', startTime: null, endTime: null },
  });

  const handleFormSubmit = async (data: FormValues) => {
    if (!data.startTime || !data.endTime) return;
    await onSubmit({
      title: data.title,
      description: data.description,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input label="Title" placeholder="e.g. Q2 Planning" error={errors.title?.message} {...register('title')} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Description
        </label>
        <textarea
          placeholder="Optional..."
          rows={2}
          {...register('description')}
          style={textareaStyle}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-brand)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-light)')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Controller
          control={control}
          name="startTime"
          render={({ field }) => (
            <DateTimePicker
              label="Start time"
              value={field.value}
              onChange={field.onChange}
              error={errors.startTime?.message as string | undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="endTime"
          render={({ field }) => (
            <DateTimePicker
              label="End time"
              value={field.value}
              onChange={field.onChange}
              error={errors.endTime?.message as string | undefined}
            />
          )}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '4px' }}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
