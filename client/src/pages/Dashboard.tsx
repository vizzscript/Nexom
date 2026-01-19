import Modal from '@/components/Modal';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { bookingService } from '@/features/booking/services/booking.service';
import type { Booking } from '@/features/booking/types';
import { formatCurrency } from '@/utils';
import { AlertTriangle, Calendar, Clock, Loader2, LogOut, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
            return;
        }

        const fetchBookings = async () => {
            if (!user?.uid) return;
            try {
                setLoading(true);
                const data = await bookingService.getUserBookings(user.uid);
                setBookings(data);
            } catch (error) {
                // Handled by global interceptor
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, navigate, user?.uid]);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME);
    };

    const handleCancelClick = (id: string) => {
        setBookingToCancel(id);
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        if (bookingToCancel === null) return;

        try {
            await bookingService.cancelBooking(bookingToCancel);
            setBookings(bookings.map(b =>
                b.id === bookingToCancel ? { ...b, status: 'Cancelled' } : b
            ));
            setBookingToCancel(null);
            setIsCancelModalOpen(false);
        } catch (error) {
            // Handled by global interceptor
        }
    };

    const handleUpdate = (id: string) => {
        navigate(`${ROUTES.BOOK}?editId=${id}`);
    };

    const activeBookings = bookings?.filter(b => b.status !== 'Cancelled') || [];
    const cancelledBookings = bookings?.filter(b => b.status === 'Cancelled') || [];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-slate-900">My Dashboard</h1>
                    <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold mb-6">Your Bookings</h2>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-4" />
                                <p className="text-slate-500">Loading your bookings...</p>
                            </div>
                        ) : activeBookings.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 mb-4">You don't have any active bookings.</p>
                                <button onClick={() => navigate(ROUTES.SERVICES)} className="btn btn-primary px-6 py-2 rounded-full">
                                    Browse Services
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeBookings.map((booking) => (
                                    <div key={booking.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">{booking.service?.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                                                    {booking.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-[#d4af37]" />
                                                    {booking.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                                                    {booking.details.address}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'Paid' || booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="font-bold text-slate-900 text-lg">{formatCurrency(booking.service?.price)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {booking.status === 'Pending Payment' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`${ROUTES.PAYMENT}?bookingId=${booking.id}`)}
                                                            className="text-sm font-bold text-[#d4af37] hover:text-[#b5952f] transition-colors"
                                                        >
                                                            Pay Now
                                                        </button>
                                                        <span className="text-slate-300">|</span>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleUpdate(booking.id)}
                                                    className="text-sm font-medium text-slate-600 hover:text-[#d4af37] transition-colors"
                                                >
                                                    Update
                                                </button>
                                                <span className="text-slate-300">|</span>
                                                <button
                                                    onClick={() => handleCancelClick(booking.id)}
                                                    className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cancelledBookings.length > 0 && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-xl font-bold mb-6 text-slate-400">Cancelled Bookings</h2>
                            <div className="space-y-4 opacity-75">
                                {cancelledBookings.map((booking) => (
                                    <div key={booking.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between grayscale-[0.5]">
                                        <div>
                                            <h3 className="text-lg font-bold font-serif text-slate-500 mb-2">{booking.service?.title}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {booking.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {booking.time}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {booking.details.address}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-400">
                                                    {booking.status}
                                                </span>
                                                <span className="font-bold text-slate-400 text-lg">{formatCurrency(booking.service?.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Modal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={confirmCancel}
                    title="Cancel Booking"
                    confirmLabel="Yes"
                    variant="danger"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">Are you sure?</p>
                        <p className="text-slate-500">
                            Are you sure you want to cancel this booking? This action cannot be undone and your slot will be released.
                        </p>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;
