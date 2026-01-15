import { Router } from 'express';
import bookingController from '../controllers/booking.controller';

const router = Router();

router.post('/', bookingController.create);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id', bookingController.updateBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
