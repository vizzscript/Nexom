import { Calendar, Clock, LogOut, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        setBookings(storedBookings.reverse()); // Show newest first
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-slate-900">My Dashboard</h1>
                    <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-xl font-bold mb-6">Your Bookings</h2>
                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">You haven't booked any services yet.</p>
                            <button onClick={() => navigate('/services')} className="btn btn-primary px-6 py-2 rounded-full">
                                Browse Services
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
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
                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                                            {booking.status}
                                        </span>
                                        <span className="font-bold text-slate-900 text-lg">${booking.service?.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
