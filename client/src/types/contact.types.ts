/**
 * Contact Types
 */

export interface ContactFormData {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
}
