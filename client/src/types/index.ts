export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export type RoomRole = 'admin' | 'user';

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: RoomRole;
  createdAt: string;
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface Booking {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  roomId: string;
  createdById: string;
  createdBy: Pick<User, 'id' | 'name' | 'email'>;
  participants: BookingParticipant[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingParticipant {
  id: string;
  bookingId: string;
  userId: string;
  createdAt: string;
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export interface AuthResponse {
  user: User;
  token: string;
}
