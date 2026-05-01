import api from './client';
import type { Room } from '../types';

export const roomsApi = {
  list: () => api.get<Room[]>('/rooms').then((r) => r.data),

  getById: (id: string) => api.get<Room>(`/rooms/${id}`).then((r) => r.data),

  create: (data: { name: string; description: string }) =>
    api.post<Room>('/rooms', data).then((r) => r.data),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.put<Room>(`/rooms/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/rooms/${id}`).then((r) => r.data),
};
