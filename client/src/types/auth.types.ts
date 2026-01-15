/**
 * Authentication Types
 */

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    firebaseUid?: string;
}

export interface LoginCredentials {
    email: string;
    otp: string;
}

export interface OtpRequest {
    email: string;
}
