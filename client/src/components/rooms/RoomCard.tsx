import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2, ArrowRight } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { roomsApi } from '../../api/rooms.api';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { RoomForm } from './RoomForm';
import type { Room } from '../../types';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => roomsApi.delete(room.id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); toast.success('Room deleted'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to delete'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => roomsApi.update(room.id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['rooms'] }); setEditOpen(false); toast.success('Room updated'); },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to update'),
  });

  return (
    <>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border-light)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <Link to={`/rooms/${room.id}`} style={{ textDecoration: 'none', flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              {room.name}
            </h3>
          </Link>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '2px', borderRadius: '4px', display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  style={{ position: 'absolute', right: 0, top: '24px', zIndex: 20, background: 'var(--color-surface-2)', border: '1px solid var(--color-border-light)', borderRadius: '10px', padding: '4px', width: '140px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'background 0.1s, color 0.1s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmOpen(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'var(--color-danger)', fontSize: '13px', fontFamily: 'var(--font-body)', transition: 'background 0.1s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'var(--color-danger-dim)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = 'transparent')}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {room.description || 'No description'}
        </p>

        <Link
          to={`/rooms/${room.id}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, color: 'var(--color-brand)', textDecoration: 'none', letterSpacing: '0.01em', marginTop: '4px', transition: 'gap 0.15s' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.gap = '8px')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.gap = '4px')}
        >
          Open room <ArrowRight size={13} />
        </Link>
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit room">
        <RoomForm defaultValues={{ name: room.name, description: room.description }} onSubmit={updateMutation.mutateAsync} onCancel={() => setEditOpen(false)} submitLabel="Save changes" />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { deleteMutation.mutate(); setConfirmOpen(false); }}
        title="Delete room?"
        message={`"${room.name}" and all its bookings will be permanently deleted.`}
        confirmLabel="Delete room"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
