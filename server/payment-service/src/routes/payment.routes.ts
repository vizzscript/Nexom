import express, { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validateCreateOrder } from '../middleware/validation.middleware';

const router = Router();

router.use(express.json());

// Routes
router.post('/create-order', validateCreateOrder, paymentController.createOrder); // Formerly create-intent
router.post('/verify-payment', paymentController.verifyPayment);
router.post('/refund', paymentController.refundPayment);
router.get('/status/:orderId', paymentController.getPaymentStatus);

export default router;
