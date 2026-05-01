import api from './client';
import type { Booking } from '../types';

export const bookingsApi = {
  list: (roomId: string) =>
    api.get<Booking[]>(`/rooms/${roomId}/bookings`).then((r) => r.data),

  create: (roomId: string, data: { title: string; description: string; startTime: string; endTime: string }) =>
    api.post<Booking>(`/rooms/${roomId}/bookings`, data).then((r) => r.data),

  update: (roomId: string, bookingId: string, data: Partial<{ title: string; description: string; startTime: string; endTime: string }>) =>
    api.put<Booking>(`/rooms/${roomId}/bookings/${bookingId}`, data).then((r) => r.data),

  delete: (roomId: string, bookingId: string) =>
    api.delete(`/rooms/${roomId}/bookings/${bookingId}`).then((r) => r.data),

  join: (roomId: string, bookingId: string) =>
    api.post(`/rooms/${roomId}/bookings/${bookingId}/join`).then((r) => r.data),

  leave: (roomId: string, bookingId: string) =>
    api.delete(`/rooms/${roomId}/bookings/${bookingId}/leave`).then((r) => r.data),
};
