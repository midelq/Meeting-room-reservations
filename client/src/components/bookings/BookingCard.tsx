import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Users, Pencil, Trash2, LogIn, LogOut } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { bookingsApi } from '../../api/bookings.api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { BookingForm } from './BookingForm';
import { useAuth } from '../../context/AuthContext';
import type { Booking, RoomRole } from '../../types';

interface BookingCardProps {
  booking: Booking;
  roomId: string;
  userRole: RoomRole;
}

export function BookingCard({ booking, roomId, userRole }: BookingCardProps) {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const isParticipant = booking.participants.some((p) => p.userId === user?.id);
  const isAdmin = userRole === 'admin';
  const isPast = new Date(booking.endTime) < new Date();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bookings', roomId] });

  const deleteMutation = useMutation({
    mutationFn: () => bookingsApi.delete(roomId, booking.id),
    onSuccess: () => { invalidate(); toast.success('Booking canceled'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => bookingsApi.update(roomId, booking.id, data),
    onSuccess: () => { invalidate(); setEditOpen(false); toast.success('Booking updated'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed'),
  });

  const joinMutation = useMutation({
    mutationFn: () => bookingsApi.join(roomId, booking.id),
    onSuccess: () => { invalidate(); toast.success('Joined!'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed'),
  });

  const leaveMutation = useMutation({
    mutationFn: () => bookingsApi.leave(roomId, booking.id),
    onSuccess: () => { invalidate(); toast.success('Left booking'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed'),
  });

  return (
    <>
      <div
        style={{
          background: isPast ? 'transparent' : 'var(--color-surface)',
          border: `1px solid ${isPast ? 'var(--color-border)' : 'var(--color-border-light)'}`,
          borderRadius: '12px',
          padding: '16px',
          opacity: isPast ? 0.5 : 1,
          transition: 'border-color 0.2s',
        }}
      >
        {/* Left accent bar for upcoming */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {!isPast && (
            <div style={{ width: '3px', borderRadius: '2px', background: 'var(--color-brand)', flexShrink: 0, alignSelf: 'stretch' }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
                  {booking.title}
                </h4>
                {booking.description && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginTop: '2px' }}>{booking.description}</p>
                )}
              </div>
              {isAdmin && !isPast && (
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  <button
                    onClick={() => setEditOpen(true)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', borderRadius: '4px', display: 'flex', transition: 'color 0.1s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '4px', borderRadius: '4px', display: 'flex', transition: 'color 0.1s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                {format(new Date(booking.startTime), 'MMM d, HH:mm')} – {format(new Date(booking.endTime), 'HH:mm')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={11} />
                {booking.participants.length}
              </span>
              <span style={{ color: 'var(--color-text-faint)' }}>by {booking.createdBy.name}</span>
            </div>

            {!isPast && (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                {isParticipant ? (
                  <Button size="sm" variant="ghost" onClick={() => leaveMutation.mutate()} isLoading={leaveMutation.isPending}>
                    <LogOut size={12} /> Leave
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => joinMutation.mutate()} isLoading={joinMutation.isPending}>
                    <LogIn size={12} /> Join
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit booking">
        <BookingForm defaultValues={booking} onSubmit={updateMutation.mutateAsync} onCancel={() => setEditOpen(false)} submitLabel="Save changes" />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { deleteMutation.mutate(); setConfirmOpen(false); }}
        title="Cancel booking?"
        message={`"${booking.title}" will be permanently removed.`}
        confirmLabel="Cancel booking"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
