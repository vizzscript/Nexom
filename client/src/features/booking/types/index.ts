export interface BookingDetails {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
}

export interface BookingServiceInfo {
    title: string;
    price: number;
    imageUrl?: string;
}

export interface Booking {
    id: string;
    userId: string;
    serviceId: string;
    service: BookingServiceInfo;
    date: string;
    time: string;
    status: 'Pending Payment' | 'Paid' | 'Confirmed' | 'Cancelled';
    details: BookingDetails;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingRequest {
    userId: string;
    serviceId: string;
    service: BookingServiceInfo;
    date: string;
    time: string;
    details: BookingDetails;
}
