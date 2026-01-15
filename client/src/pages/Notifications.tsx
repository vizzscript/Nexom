import Modal from '@/components/Modal';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import type { ContactMessage } from '@/features/contact/services/contact.service';
import { contactService } from '@/features/contact/services/contact.service';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    ExternalLink,
    Inbox,
    ShieldCheck,
    Trash2,
    User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '' });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await contactService.getMessages();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await contactService.markAsRead(id);
            setMessages(prev =>
                prev.map(msg => msg._id === id ? { ...msg, isRead: true } : msg)
            );
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        try {
            await contactService.deleteMessage(id);
            setMessages(prev => prev.filter(msg => msg._id !== id));
            toast.success('Notification deleted');
            setDeleteModal({ isOpen: false, id: '' });
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="bg-[#d4af37] p-2 rounded-xl shadow-lg shadow-[#d4af37]/20">
                                <Bell className="text-white" size={24} />
                            </div>
                            Activity Center
                        </h1>
                        <p className="mt-2 text-slate-500 font-medium">
                            Track your service inquiries and official responses.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="px-4 py-2 bg-slate-50 rounded-xl">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Unread</span>
                            <span className="text-xl font-bold text-slate-900">{messages?.filter(m => !m.isRead).length || 0}</span>
                        </div>
                        <div className="px-4 py-2">
                            <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold">Total</span>
                            <span className="text-xl font-bold text-slate-400">{messages.length}</span>
                        </div>
                    </div>
                </div>

                {messages.length === 0 ? (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No activity yet</h3>
                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">Your service requests and notifications will appear here once you reach out to us.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {messages.map((message) => (
                                <motion.div
                                    key={message._id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`group relative bg-white rounded-[2rem] shadow-sm border ${message.isRead ? 'border-slate-100' : 'border-[#d4af37]/30 ring-1 ring-[#d4af37]/10'} overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/50`}
                                >
                                    <div className="p-8">
                                        <div className="flex flex-col gap-6">
                                            {/* Header Hook */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.isRead ? 'bg-slate-100 text-slate-400' : 'bg-[#d4af37]/10 text-[#d4af37]'}`}>
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                                            {message.notificationTitle}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md">
                                                                REF: {message._id.slice(-8).toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                                                <Clock size={12} /> {formatDate(message.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(message.status)}`}>
                                                    {message.status}
                                                </div>
                                            </div>

                                            {/* Content Body - Only Notification Details */}
                                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                                                <p className="text-slate-600 leading-relaxed">
                                                    {message.notificationBody}
                                                </p>
                                                <hr className="my-4 border-slate-100" />
                                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={14} className="text-[#d4af37]" />
                                                        Service agent assigned to: <span className="text-slate-600">Nexom Support Team</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Actions */}
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => toast.success('Tracking coming soon!')}
                                                        className="flex items-center gap-2 text-xs font-bold text-[#d4af37] hover:underline"
                                                    >
                                                        Details <ExternalLink size={12} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!message.isRead && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(message._id); }}
                                                            className="p-2 text-slate-400 hover:text-[#d4af37] hover:bg-[#d4af37]/5 rounded-lg transition-all"
                                                            title="Mark as Read"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(message._id); }}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Notification"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Unread indicator dot */}
                                    {!message.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: '' })}
                title="Delete Notification"
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="danger"
            >
                <div className="flex items-center gap-4 text-slate-600">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <p>
                        Are you sure you want to delete this notification? This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default Notifications;
