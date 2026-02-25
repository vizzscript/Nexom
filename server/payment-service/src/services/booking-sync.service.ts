import axios from "axios";
import Payment, { IPayment } from "../models/payment.model";

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return fallback;
    }
    return Math.floor(parsed);
};

export const BOOKING_SYNC_CONFIG = {
    maxRetries: parsePositiveInt(process.env.BOOKING_SYNC_MAX_RETRIES, 8),
    baseDelayMs: parsePositiveInt(process.env.BOOKING_SYNC_BASE_DELAY_MS, 30000),
    maxDelayMs: parsePositiveInt(process.env.BOOKING_SYNC_MAX_DELAY_MS, 1800000),
    requestTimeoutMs: parsePositiveInt(process.env.BOOKING_SYNC_REQUEST_TIMEOUT_MS, 5000),
    retryPollIntervalMs: parsePositiveInt(process.env.BOOKING_SYNC_RETRY_INTERVAL_MS, 15000),
    reconcileIntervalMs: parsePositiveInt(process.env.BOOKING_SYNC_RECONCILE_INTERVAL_MS, 900000),
    batchSize: parsePositiveInt(process.env.BOOKING_SYNC_BATCH_SIZE, 50),
};

export const computeNextRetryAt = (nextRetryCount: number): Date => {
    const exponentialDelay = BOOKING_SYNC_CONFIG.baseDelayMs * Math.pow(2, Math.max(0, nextRetryCount - 1));
    const delayMs = Math.min(BOOKING_SYNC_CONFIG.maxDelayMs, exponentialDelay);
    return new Date(Date.now() + delayMs);
};

export const syncBookingStatusToPaid = async (payment: IPayment): Promise<void> => {
    const bookingServiceUrl = process.env.BOOKING_SERVICE_URL;
    const bookingInternalToken = process.env.BOOKING_INTERNAL_TOKEN;

    if (!bookingServiceUrl) {
        throw new Error("BOOKING_SERVICE_URL is not configured");
    }
    if (!bookingInternalToken) {
        throw new Error("BOOKING_INTERNAL_TOKEN is not configured");
    }

    await axios.patch(
        `${bookingServiceUrl}/api/v1/bookings/internal/${payment.bookingId}/status`,
        { status: "Paid" },
        {
            headers: {
                "x-internal-token": bookingInternalToken,
            },
            timeout: BOOKING_SYNC_CONFIG.requestTimeoutMs,
        }
    );
};

export const markBookingSynced = async (paymentId: string) => {
    await Payment.findByIdAndUpdate(paymentId, {
        bookingSyncStatus: "synced",
        bookingSyncRetryCount: 0,
        bookingSyncNextRetryAt: null,
        bookingSyncLastError: null,
        bookingSyncedAt: new Date(),
    });
};

export const markBookingSyncFailure = async (
    paymentId: string,
    currentRetryCount: number,
    errorMessage: string
) => {
    const nextRetryCount = currentRetryCount + 1;
    const exhausted = nextRetryCount >= BOOKING_SYNC_CONFIG.maxRetries;

    await Payment.findByIdAndUpdate(paymentId, {
        bookingSyncStatus: exhausted ? "failed" : "pending",
        bookingSyncRetryCount: nextRetryCount,
        bookingSyncNextRetryAt: exhausted ? null : computeNextRetryAt(nextRetryCount),
        bookingSyncLastError: errorMessage,
    });
};
