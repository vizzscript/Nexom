import cors from 'cors';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import bookingRoutes from './routes/booking.routes';

const app: Express = express();

// Middleware
const allowedOrigins = config.allowedOrigins;
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/bookings', bookingRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Start Server
const startServer = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(config.mongoose.url, config.mongoose.options);
        console.log('Database connected successfully!');

        app.listen(config.port, () => {
            console.log(`Booking Service is running on PORT ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
