import Payment from "../models/payment.model";
import {
    BOOKING_SYNC_CONFIG,
    markBookingSynced,
    syncBookingStatusToPaid
} from "../services/booking-sync.service";

let reconcileJobRunning = false;

const runReconciliation = async () => {
    if (reconcileJobRunning) {
        return;
    }
    reconcileJobRunning = true;

    try {
        const unsyncedPayments = await Payment.find({
            status: "succeeded",
            bookingSyncStatus: { $ne: "synced" },
        })
            .sort({ updatedAt: 1 })
            .limit(BOOKING_SYNC_CONFIG.batchSize);

        for (const payment of unsyncedPayments) {
            try {
                await syncBookingStatusToPaid(payment);
                await markBookingSynced(String(payment._id));
                console.log(`[booking-sync-reconcile] recovered bookingId=${payment.bookingId}`);
            } catch (error: any) {
                const errorMessage = error?.message || "Reconciliation sync failed";
                await Payment.findByIdAndUpdate(payment._id, {
                    bookingSyncLastError: errorMessage,
                });
                console.warn(`[booking-sync-reconcile] unresolved bookingId=${payment.bookingId}: ${errorMessage}`);
            }
        }
    } catch (error: any) {
        console.error(`[booking-sync-reconcile] job error: ${error?.message || "Unknown error"}`);
    } finally {
        reconcileJobRunning = false;
    }
};

export const startBookingSyncReconcileJob = () => {
    const interval = setInterval(runReconciliation, BOOKING_SYNC_CONFIG.reconcileIntervalMs);
    interval.unref();
    console.log(
        `[booking-sync-reconcile] started interval=${BOOKING_SYNC_CONFIG.reconcileIntervalMs}ms`
    );
};
