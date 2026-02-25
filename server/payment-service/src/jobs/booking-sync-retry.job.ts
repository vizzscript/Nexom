import Payment from "../models/payment.model";
import {
    BOOKING_SYNC_CONFIG,
    markBookingSyncFailure,
    markBookingSynced,
    syncBookingStatusToPaid
} from "../services/booking-sync.service";

let retryJobRunning = false;

const processRetryBatch = async () => {
    if (retryJobRunning) {
        return;
    }
    retryJobRunning = true;

    try {
        const now = new Date();
        const duePayments = await Payment.find({
            status: "succeeded",
            bookingSyncStatus: "pending",
            $or: [
                { bookingSyncNextRetryAt: null },
                { bookingSyncNextRetryAt: { $lte: now } },
            ],
        })
            .sort({ updatedAt: 1 })
            .limit(BOOKING_SYNC_CONFIG.batchSize);

        for (const payment of duePayments) {
            try {
                await syncBookingStatusToPaid(payment);
                await markBookingSynced(String(payment._id));
                console.log(`[booking-sync-retry] synced bookingId=${payment.bookingId}`);
            } catch (error: any) {
                const errorMessage = error?.message || "Retry sync failed";
                await markBookingSyncFailure(
                    String(payment._id),
                    payment.bookingSyncRetryCount || 0,
                    errorMessage
                );
                console.warn(`[booking-sync-retry] failed bookingId=${payment.bookingId}: ${errorMessage}`);
            }
        }
    } catch (error: any) {
        console.error(`[booking-sync-retry] job error: ${error?.message || "Unknown error"}`);
    } finally {
        retryJobRunning = false;
    }
};

export const startBookingSyncRetryJob = () => {
    const interval = setInterval(processRetryBatch, BOOKING_SYNC_CONFIG.retryPollIntervalMs);
    interval.unref();
    console.log(
        `[booking-sync-retry] started interval=${BOOKING_SYNC_CONFIG.retryPollIntervalMs}ms maxRetries=${BOOKING_SYNC_CONFIG.maxRetries}`
    );
};
