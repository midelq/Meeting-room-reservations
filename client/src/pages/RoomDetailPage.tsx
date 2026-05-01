import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { roomsApi } from '../api/rooms.api';
import { bookingsApi } from '../api/bookings.api';
import { membersApi } from '../api/members.api';
import { Layout } from '../components/layout/Layout';
import { BookingCard } from '../components/bookings/BookingCard';
import { BookingForm } from '../components/bookings/BookingForm';
import { RoomMembers } from '../components/rooms/RoomMembers';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getById(id!),
    enabled: !!id,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.list(id!),
    enabled: !!id,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members', id],
    queryFn: () => membersApi.list(id!),
    enabled: !!id,
  });

  const userMember = members.find((m) => m.userId === user?.id);
  const isAdmin = userMember?.role === 'admin';

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => bookingsApi.create(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', id] });
      setCreateBookingOpen(false);
      toast.success('Booking created!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? 'Failed to create booking'),
  });

  const spinner = (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div className="animate-spin" style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--color-border-light)', borderTopColor: 'var(--color-brand)' }} />
    </div>
  );

  if (roomLoading) return <Layout>{spinner}</Layout>;

  if (!room) {
    return (
      <Layout>
        <div style={{ padding: '80px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Room not found
        </div>
      </Layout>
    );
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.endTime) >= new Date());
  const pastBookings = bookings.filter((b) => new Date(b.endTime) < new Date());

  return (
    <Layout>
      {/* Page header */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px',
            borderRadius: '8px',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            transition: 'color 0.15s, border-color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border-light)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)'; }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {room.name}
          </h1>
          {room.description && (
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {room.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => setMembersOpen(true)}>
            <Users size={14} /> Members ({members.length})
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => setCreateBookingOpen(true)}>
              <Plus size={14} /> Book
            </Button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border)', marginBottom: '32px' }} />

      {/* Content grid */}
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 280px' }}>
        {/* Bookings list */}
        <div>
          {bookingsLoading ? spinner : (
            <>
              {upcomingBookings.length > 0 && (
                <section style={{ marginBottom: '32px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                    Upcoming
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {upcomingBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} roomId={id!} userRole={userMember?.role ?? 'user'} />
                    ))}
                  </div>
                </section>
              )}

              {pastBookings.length > 0 && (
                <section>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
                    Past
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pastBookings.map((b) => (
                      <BookingCard key={b.id} booking={b} roomId={id!} userRole={userMember?.role ?? 'user'} />
                    ))}
                  </div>
                </section>
              )}

              {bookings.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', textAlign: 'center', border: '1px dashed var(--color-border)', borderRadius: '16px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' }}>
                    No bookings yet
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                    {isAdmin ? 'Create the first booking for this room' : 'Admins can create bookings here'}
                  </p>
                  {isAdmin && (
                    <Button size="sm" onClick={() => setCreateBookingOpen(true)}>
                      <Plus size={14} /> Create booking
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Members sidebar */}
        <aside style={{ borderRadius: '14px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '18px', alignSelf: 'start' }}>
          <RoomMembers roomId={id!} isAdmin={isAdmin} />
        </aside>
      </div>

      <Modal isOpen={createBookingOpen} onClose={() => setCreateBookingOpen(false)} title="New booking">
        <BookingForm onSubmit={createBookingMutation.mutateAsync} onCancel={() => setCreateBookingOpen(false)} submitLabel="Create booking" />
      </Modal>

      <Modal isOpen={membersOpen} onClose={() => setMembersOpen(false)} title="Room members">
        <RoomMembers roomId={id!} isAdmin={isAdmin} />
      </Modal>
    </Layout>
  );
}
