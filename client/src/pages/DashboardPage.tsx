import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { roomsApi } from '../api/rooms.api';
import { Layout } from '../components/layout/Layout';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomForm } from '../components/rooms/RoomForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: roomsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) => roomsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setCreateOpen(false);
      toast.success('Room created');
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to create room'),
  });

  return (
    <Layout>
      {/* Page heading */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
          Meeting Rooms
        </h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={15} /> New room
        </Button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '32px' }} />

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div
            className="animate-spin"
            style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--color-border-light)', borderTopColor: 'var(--color-brand)' }}
          />
        </div>
      ) : rooms.length === 0 ? (
        <div
          className="animate-fade-up"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '16px' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>
            No rooms yet
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Click «New room» above to get started
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {rooms.map((room, i) => (
            <div
              key={room.id}
              className={`animate-fade-up animate-fade-up-delay-${Math.min(i + 1, 3)}`}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="New room">
        <RoomForm onSubmit={async (d) => { await createMutation.mutateAsync(d); }} onCancel={() => setCreateOpen(false)} submitLabel="Create room" />
      </Modal>
    </Layout>
  );
}
