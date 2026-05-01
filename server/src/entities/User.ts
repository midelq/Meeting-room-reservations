import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RoomMember } from './RoomMember';
import { Booking } from './Booking';
import { BookingParticipant } from './BookingParticipant';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomMember, (rm) => rm.user)
  roomMemberships: RoomMember[];

  @OneToMany(() => Booking, (b) => b.createdBy)
  createdBookings: Booking[];

  @OneToMany(() => BookingParticipant, (bp) => bp.user)
  bookingParticipations: BookingParticipant[];
}
