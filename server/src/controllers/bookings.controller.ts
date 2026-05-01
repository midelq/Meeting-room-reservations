import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookingsService } from '../services/bookings.service';
import { AuthRequest } from '../middleware/auth';

export const createBookingSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional().default(''),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
  }),
});

export class BookingsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await BookingsService.list(req.params.id as string, req.userId!);
      res.json(bookings);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingsService.create(req.params.id as string, req.userId!, {
        title: req.body.title,
        description: req.body.description,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data: any = { title: req.body.title, description: req.body.description };
      if (req.body.startTime) data.startTime = new Date(req.body.startTime);
      if (req.body.endTime) data.endTime = new Date(req.body.endTime);

      const booking = await BookingsService.update(req.params.id as string, req.params.bookingId as string, req.userId!, data);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await BookingsService.delete(req.params.id as string, req.params.bookingId as string, req.userId!);
      res.json({ message: 'Booking canceled' });
    } catch (error) {
      next(error);
    }
  }

  static async join(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await BookingsService.join(req.params.id as string, req.params.bookingId as string, req.userId!);
      res.json({ message: 'Joined booking' });
    } catch (error) {
      next(error);
    }
  }

  static async leave(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await BookingsService.leave(req.params.id as string, req.params.bookingId as string, req.userId!);
      res.json({ message: 'Left booking' });
    } catch (error) {
      next(error);
    }
  }
}
