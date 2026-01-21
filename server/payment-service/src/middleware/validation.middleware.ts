import { NextFunction, Request, Response } from 'express';

export const validateCreateOrder = (req: Request, res: Response, next: NextFunction) => {
    const { amount, bookingId } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }

    next();
};
