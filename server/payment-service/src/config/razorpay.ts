import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined');
    // In production we might want to throw, but for dev we might just log
}

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
