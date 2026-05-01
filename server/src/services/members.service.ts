import { AppDataSource } from '../config/data-source';
import { RoomMember, RoomRole } from '../entities/RoomMember';
import { User } from '../entities/User';
import { ApiError } from '../utils/ApiError';

const memberRepository = AppDataSource.getRepository(RoomMember);
const userRepository = AppDataSource.getRepository(User);

export class MembersService {
  static async list(roomId: string, userId: string) {
    const isMember = await memberRepository.findOneBy({ roomId, userId });
    if (!isMember) throw ApiError.forbidden('Not a member');

    return memberRepository.find({
      where: { roomId },
      relations: ['user'],
      select: { user: { id: true, name: true, email: true } },
    });
  }

  static async add(roomId: string, adminId: string, email: string, role: RoomRole) {
    const admin = await memberRepository.findOneBy({ roomId, userId: adminId });
    if (!admin || admin.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can add members');
    }

    const userToAdd = await userRepository.findOneBy({ email });
    if (!userToAdd) throw ApiError.notFound('User with this email not found');

    const existingMember = await memberRepository.findOneBy({ roomId, userId: userToAdd.id });
    if (existingMember) throw ApiError.conflict('User is already a member');

    const newMember = memberRepository.create({
      roomId,
      userId: userToAdd.id,
      role,
    });

    return memberRepository.save(newMember);
  }

  static async remove(roomId: string, adminId: string, targetUserId: string) {
    const admin = await memberRepository.findOneBy({ roomId, userId: adminId });
    if (!admin || admin.role !== RoomRole.ADMIN) {
      throw ApiError.forbidden('Only admins can remove members');
    }

    if (adminId === targetUserId) {
      throw ApiError.badRequest('Canot remove yourself. Delete the room instead.');
    }

    const result = await memberRepository.delete({ roomId, userId: targetUserId });
    if (result.affected === 0) throw ApiError.notFound('Member not found in this room');
    return { success: true };
  }
}
