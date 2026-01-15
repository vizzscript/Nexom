import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { contactService } from '@/features/contact/services/contact.service';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BellDot, Menu, Sparkles, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
        }
    }, [isAuthenticated, location.pathname]);

    const fetchUnreadCount = async () => {
        try {
            const messages = await contactService.getMessages();
            setUnreadCount(messages.filter(m => !m.isRead).length);
        } catch (error) {
            console.error('Failed to fetch unread count');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: ROUTES.HOME },
        { name: 'Services', path: ROUTES.SERVICES },
        { name: 'About', path: ROUTES.ABOUT },
        { name: 'Contact', path: ROUTES.CONTACT },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
                    <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-slate-800 transition-colors">
                        <Sparkles className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <span className={`text-2xl font-bold font-serif tracking-tight ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                        Nexom
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-[#d4af37] ${location.pathname === link.path
                                ? 'text-[#d4af37]'
                                : 'text-slate-600'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to={ROUTES.NOTIFICATIONS}
                                className={`relative flex items-center gap-2 transition-all duration-300 hover:scale-110 ${location.pathname === ROUTES.NOTIFICATIONS ? 'text-[#d4af37]' : 'text-slate-600'}`}
                                title="Notifications"
                            >
                                {unreadCount > 0 ? (
                                    <>
                                        <BellDot className="w-6 h-6 text-[#d4af37] animate-pulse" />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                            {unreadCount}
                                        </span>
                                    </>
                                ) : (
                                    <Bell className="w-6 h-6" />
                                )}
                            </Link>
                            <Link
                                to={ROUTES.DASHBOARD}
                                className="flex items-center gap-2 text-slate-600 hover:text-[#d4af37] transition-colors"
                            >
                                <User className="w-6 h-6" />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to={ROUTES.LOGIN}
                            className="btn btn-primary text-sm px-6 py-2.5 rounded-full"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="container mx-auto py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-slate-600 font-medium hover:text-[#d4af37] py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        to={ROUTES.NOTIFICATIONS}
                                        className="btn bg-slate-100 text-slate-900 border-none w-full justify-center flex items-center gap-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Bell className="w-4 h-4" />
                                        Notifications
                                    </Link>
                                    <Link
                                        to={ROUTES.DASHBOARD}
                                        className="btn btn-primary w-full justify-center flex items-center gap-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="btn btn-primary w-full justify-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
