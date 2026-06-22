import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
    env: process.env.NODE_ENV || 'development',
    port: process.env.BOOKING_PORT || 8085,
    mongoose: {
        url: process.env.MONGO_URI || 'mongodb://localhost:27017/nexom_booking',
        options: {},
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
    },
    allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim().replace(/\/$/, ''))
    : ['http://localhost:5173'],
};
