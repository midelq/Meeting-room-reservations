import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';
import { Room } from '../entities/Room';
import { RoomMember } from '../entities/RoomMember';
import { Booking } from '../entities/Booking';
import { BookingParticipant } from '../entities/BookingParticipant';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'meeting_rooms',
  synchronize: true,
  logging: false,
  entities: [User, Room, RoomMember, Booking, BookingParticipant],
});
