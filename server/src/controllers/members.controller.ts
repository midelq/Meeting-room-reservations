import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { MembersService } from '../services/members.service';
import { AuthRequest } from '../middleware/auth';
import { RoomRole } from '../entities/RoomMember';

export const addMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    role: z.nativeEnum(RoomRole).default(RoomRole.USER),
  }),
});

export class MembersController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const members = await MembersService.list(req.params.id as string, req.userId!);
      res.json(members);
    } catch (error) {
      next(error);
    }
  }

  static async add(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      const member = await MembersService.add(req.params.id as string, req.userId!, email, role);
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await MembersService.remove(req.params.id as string, req.userId!, req.params.userId as string);
      res.json({ message: 'Member removed' });
    } catch (error) {
      next(error);
    }
  }
}
