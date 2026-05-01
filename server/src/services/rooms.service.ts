import { AppDataSource } from '../config/data-source';
import { Room } from '../entities/Room';
import { RoomMember, RoomRole } from '../entities/RoomMember';
import { ApiError } from '../utils/ApiError';

const roomRepository = AppDataSource.getRepository(Room);
const memberRepository = AppDataSource.getRepository(RoomMember);

export class RoomsService {
  static async create(name: string, description: string, userId: string) {
    return AppDataSource.transaction(async (manager) => {
      const room = manager.create(Room, { name, description, createdById: userId });
      await manager.save(room);

      const member = manager.create(RoomMember, {
        roomId: room.id,
        userId,
        role: RoomRole.ADMIN,
      });
      await manager.save(member);

      return room;
    });
  }

  static async list(userId: string) {
    return roomRepository
      .createQueryBuilder('room')
      .innerJoin('room.members', 'member', 'member.userId = :userId', { userId })
      .getMany();
  }

  static async getById(roomId: string, userId: string) {
    const isMember = await memberRepository.findOneBy({ roomId, userId });
    if (!isMember) {
      throw ApiError.forbidden('You are not a member of this room');
    }

    const room = await roomRepository.findOneBy({ id: roomId });
    if (!room) throw ApiError.notFound('Room not found');

    return room;
  }

  static async update(roomId: string, userId: string, data: { name?: string; description?: string }) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member || member.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can update the room');
    }

    const room = await roomRepository.findOneBy({ id: roomId });
    if (!room) throw ApiError.notFound('Room not found');

    if (data.name) room.name = data.name;
    if (data.description !== undefined) room.description = data.description;

    return roomRepository.save(room);
  }

  static async delete(roomId: string, userId: string) {
    const member = await memberRepository.findOneBy({ roomId, userId });
    if (!member || member.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can delete the room');
    }

    const result = await roomRepository.delete({ id: roomId });
    if (result.affected === 0) throw ApiError.notFound('Room not found');
    return { success: true };
  }
}
