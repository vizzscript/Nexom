import { Router } from 'express';
import bookingController from '../controllers/booking.controller';
import { authenticate, authenticateInternal } from '../middleware/auth.middleware';

const router = Router();

router.patch('/internal/:id/status', authenticateInternal, bookingController.updateBookingStatusInternal);

router.use(authenticate);
router.post('/', bookingController.create);
router.get('/user/:userId', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id', bookingController.updateBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

export default router;
