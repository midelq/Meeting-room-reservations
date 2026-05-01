import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { RoomsService } from '../services/rooms.service';
import { AuthRequest } from '../middleware/auth';

export const createRoomSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional().default(''),
  }),
});

export const updateRoomSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
  }),
});

export class RoomsController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;
      const room = await RoomsService.create(name, description, req.userId!);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const rooms = await RoomsService.list(req.userId!);
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const room = await RoomsService.getById(req.params.id as string, req.userId!);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const room = await RoomsService.update(req.params.id as string, req.userId!, req.body);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await RoomsService.delete(req.params.id as string, req.userId!);
      res.json({ message: 'Room deleted' });
    } catch (error) {
      next(error);
    }
  }
}
