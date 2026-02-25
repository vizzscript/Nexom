import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { startBookingSyncReconcileJob } from './jobs/booking-sync-reconcile.job';
import { startBookingSyncRetryJob } from './jobs/booking-sync-retry.job';
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8084;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexom_payments';

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ["http://localhost:5173"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Routes
// Note: Webhook route inside paymentRoutes handles its own body parsing (raw)
app.use('/api/v1/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'Payment Service is running',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Database connection and Server Start
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB (Payments)');
        app.listen(PORT, () => {
            console.log(`Payment Service is running on port ${PORT}`);
            startBookingSyncRetryJob();
            startBookingSyncReconcileJob();
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
