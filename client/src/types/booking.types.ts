/**
 * Booking Types
 */

export interface BookingDetails {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
}

export interface BookingData {
    serviceId: string | null;
    date: string | null;
    time: string | null;
    details: BookingDetails;
}

export interface Booking {
    id: string;
    serviceId: string;
    userId?: string;
    date: string;
    time: string;
    details: BookingDetails;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
}

export const BookingStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];
