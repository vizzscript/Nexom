import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY === 'sk_test_your_secret_key_here' || STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    console.error('ERROR: STRIPE_SECRET_KEY is missing or using a placeholder in .env file.');
    console.error('Please get your real test keys from: https://dashboard.stripe.com/test/apikeys');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY || 'invalid_key', {
    apiVersion: '2025-01-27.acacia' as any,
});
