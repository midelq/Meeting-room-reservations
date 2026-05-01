import { Router } from 'express';
import { RoomsController, createRoomSchema, updateRoomSchema } from '../controllers/rooms.controller';
import { MembersController, addMemberSchema } from '../controllers/members.controller';
import { BookingsController, createBookingSchema, updateBookingSchema } from '../controllers/bookings.controller';
import { validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Всі роути для кімнат вимагть авторизації
router.use(authMiddleware);

router.get('/', RoomsController.list);
router.post('/', validate(createRoomSchema), RoomsController.create);
router.get('/:id', RoomsController.getById);
router.put('/:id', validate(updateRoomSchema), RoomsController.update);
router.delete('/:id', RoomsController.delete);

router.get('/:id/members', MembersController.list);
router.post('/:id/members', validate(addMemberSchema), MembersController.add);
router.delete('/:id/members/:userId', MembersController.remove);

router.get('/:id/bookings', BookingsController.list);
router.post('/:id/bookings', validate(createBookingSchema), BookingsController.create);
router.put('/:id/bookings/:bookingId', validate(updateBookingSchema), BookingsController.update);
router.delete('/:id/bookings/:bookingId', BookingsController.delete);

router.post('/:id/bookings/:bookingId/join', BookingsController.join);
router.delete('/:id/bookings/:bookingId/leave', BookingsController.leave);

export default router;

