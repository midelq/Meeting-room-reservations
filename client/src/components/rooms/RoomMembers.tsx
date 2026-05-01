import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { UserPlus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { membersApi } from '../../api/members.api';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { RoomRole } from '../../types';

const schema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user']),
});

type FormData = z.infer<typeof schema>;

interface RoomMembersProps {
  roomId: string;
  isAdmin: boolean;
}

export function RoomMembers({ roomId, isAdmin }: RoomMembersProps) {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ['members', roomId],
    queryFn: () => membersApi.list(roomId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'user' },
  });

  const addMutation = useMutation({
    mutationFn: (data: { email: string; role: RoomRole }) => membersApi.add(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      reset();
      setShowForm(false);
      toast.success('Member added');
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to add member'),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => membersApi.remove(roomId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      toast.success('Member removed');
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed'),
  });

  const onSubmit = (data: FormData) =>
    addMutation.mutateAsync({ email: data.email, role: data.role as RoomRole });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
          Members ({members.length})
        </span>
        {isAdmin && (
          <Button size="sm" variant="secondary" onClick={() => setShowForm((v) => !v)}>
            <UserPlus size={13} /> Add
          </Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginBottom: '14px', borderRadius: '10px', border: '1px solid var(--color-border-light)', background: 'var(--color-surface-2)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <Input label="Email" type="email" placeholder="colleague@company.com" error={errors.email?.message} {...register('email')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
              Role
            </label>
            <select
              {...register('role')}
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid var(--color-border-light)',
                background: 'var(--color-surface)',
                padding: '10px 14px',
                fontSize: '13px',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="user">User — view & join bookings</option>
              <option value="admin">Admin — manage bookings</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>Add member</Button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {member.user.name}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {member.user.email}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', flexShrink: 0 }}>
              <Badge label={member.role} variant={member.role} />
              {isAdmin && (
                <button
                  onClick={() => removeMutation.mutate(member.userId)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-faint)', padding: '2px', display: 'flex', borderRadius: '4px', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-faint)')}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
