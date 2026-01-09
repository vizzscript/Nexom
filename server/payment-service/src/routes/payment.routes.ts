import express, { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validatePaymentIntent } from '../middleware/validation.middleware';

const router = Router();

// Webhook needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Other routes use JSON
router.use(express.json());

router.post('/create-intent', validatePaymentIntent, paymentController.createPaymentIntent);
router.get('/status/:paymentIntentId', paymentController.getPaymentStatus);

export default router;
