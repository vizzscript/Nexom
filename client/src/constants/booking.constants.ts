/**
 * Booking Constants
 */

export const TIME_SLOTS = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
] as const;

export const BOOKING_STEPS = {
    SERVICE_SELECTION: 0,
    DATE_TIME: 1,
    DETAILS: 2,
    CONFIRMATION: 3,
} as const;

export type TimeSlot = typeof TIME_SLOTS[number];
