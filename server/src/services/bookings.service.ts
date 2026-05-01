import { AppDataSource } from '../config/data-source';
import { Booking } from '../entities/Booking';
import { BookingParticipant } from '../entities/BookingParticipant';
import { RoomMember, RoomRole } from '../entities/RoomMember';
import { ApiError } from '../utils/ApiError';

const bookingRepository = AppDataSource.getRepository(Booking);
const participantRepository = AppDataSource.getRepository(BookingParticipant);
const memberRepository = AppDataSource.getRepository(RoomMember);

export class BookingsService {
  private static async checkConflict(roomId: string, startTime: Date, endTime: Date, excludeBookingId?: string) {
    const query = bookingRepository.createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere('booking.startTime < :endTime AND booking.endTime > :startTime', { startTime, endTime });

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const count = await query.getCount();
    if (count > 0) throw ApiError.conflict('Time slot overlaps with an existing booking');
  }

  static async list(roomId: string, userId: string) {
    const isMember = await memberRepository.findOneBy({ roomId, userId });
    if (!isMember) throw ApiError.forbidden('Not a member');

    return bookingRepository.find({
      where: { roomId },
      relations: ['createdBy', 'participants', 'participants.user'],
      order: { startTime: 'ASC' },
    });
  }

  static async create(roomId: string, userId: string, data: { title: string; description: string; startTime: Date; endTime: Date }) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member || member.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can create bookings');
    }

    if (new Date(data.startTime) >= new Date(data.endTime)) {
      throw ApiError.badRequest('End time must be after start time');
    }

    await this.checkConflict(roomId, data.startTime, data.endTime);

    const booking = bookingRepository.create({
      ...data,
      roomId,
      createdById: userId,
    });

    return bookingRepository.save(booking);
  }

  static async update(roomId: string, bookingId: string, userId: string, data: { title?: string; description?: string; startTime?: Date; endTime?: Date }) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member || member.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can update bookings');
    }

    const booking = await bookingRepository.findOneBy({ id: bookingId, roomId });
    if (!booking) throw ApiError.notFound('Booking not found');

    const newStart = data.startTime ? new Date(data.startTime) : booking.startTime;
    const newEnd = data.endTime ? new Date(data.endTime) : booking.endTime;

    if (newStart >= newEnd) {
      throw ApiError.badRequest('End time must be after start time');
    }

    if (data.startTime || data.endTime) {
      await this.checkConflict(roomId, newStart, newEnd, bookingId);
      booking.startTime = newStart;
      booking.endTime = newEnd;
    }

    if (data.title) booking.title = data.title;
    if (data.description !== undefined) booking.description = data.description;

    return bookingRepository.save(booking);
  }

  static async delete(roomId: string, bookingId: string, userId: string) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member || member.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can cancel bookings');
    }

    const result = await bookingRepository.delete({ id: bookingId, roomId });
    if (result.affected === 0) throw ApiError.notFound('Booking not found');
    return { success: true };
  }

  static async join(roomId: string, bookingId: string, userId: string) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member) throw ApiError.forbidden('Not a member of this room');

    const booking = await bookingRepository.findOneBy({ id: bookingId, roomId });
    if (!booking) throw ApiError.notFound('Booking not found');

    const existing = await participantRepository.findOneBy({ bookingId, userId });
    if (existing) throw ApiError.conflict('Already joined');

    const participant = participantRepository.create({ bookingId, userId });
    return participantRepository.save(participant);
  }

  static async leave(roomId: string, bookingId: string, userId: string) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member) throw ApiError.forbidden('Nota memberof this room');

    const result = await participantRepository.delete({ bookingId, userId });
    if (result.affected === 0) throw ApiError.notFound('You тot joined this booking');
    return { success: true };
  }
}
