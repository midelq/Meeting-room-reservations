import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Booking } from './Booking';
import { User } from './User';

@Entity('booking_participants')
@Unique(['bookingId', 'userId'])
export class BookingParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Booking, (b) => b.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ManyToOne(() => User, (u) => u.bookingParticipations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
