import api from './client';
import type { RoomMember, RoomRole } from '../types';

export const membersApi = {
  list: (roomId: string) =>
    api.get<RoomMember[]>(`/rooms/${roomId}/members`).then((r) => r.data),

  add: (roomId: string, data: { email: string; role: RoomRole }) =>
    api.post<RoomMember>(`/rooms/${roomId}/members`, data).then((r) => r.data),

  remove: (roomId: string, userId: string) =>
    api.delete(`/rooms/${roomId}/members/${userId}`).then((r) => r.data),
};
