import { ROUTES } from '@/constants';
import { useServicesData } from '@/hooks';
import type { FrontendCategory } from '@/types';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const { categories } = useServicesData();

    const footLinks = [
        { name: 'Home', path: ROUTES.HOME },
        { name: 'About', path: ROUTES.ABOUT },
        { name: 'Services', path: ROUTES.SERVICES },
        { name: 'Contact', path: ROUTES.CONTACT }
    ];

    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 pt-16 pb-10 transition-colors duration-500 border-t border-transparent dark:border-slate-800/50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-6 group">
                            <div className="bg-white/10 dark:bg-blue-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <span className="text-2xl font-bold font-serif text-white">Nexom</span>
                        </Link>
                        <p className="text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
                            Elevating home care to an art form. We provide premium cleaning services tailored to your lifestyle and needs.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 dark:bg-slate-900 flex items-center justify-center hover:bg-[#d4af37] dark:hover:bg-[#d4af37] hover:text-white transition-all duration-300 border border-transparent dark:border-slate-800"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {footLinks.map((item) => (
                                <li key={item.name}>
                                    <Link to={item.path} className="hover:text-[#d4af37] transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Our Services</h3>
                        <ul className="space-y-4">
                            {categories.map((item: FrontendCategory) => (
                                <li key={item.id}>
                                    <Link
                                        to={ROUTES.SERVICES}
                                        state={{ selectedCategory: item.name }}
                                        className="hover:text-[#d4af37] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-slate-700 dark:bg-blue-800 group-hover:bg-[#d4af37]"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 group">
                                <div className="p-2 bg-white/5 dark:bg-blue-900/20 rounded-lg group-hover:bg-[#d4af37]/10 transition-colors">
                                    <MapPin className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <span className="dark:group-hover:text-slate-200 transition-colors">Nagpur, Maharastra 440001,<br />India</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/5 dark:bg-blue-900/20 rounded-lg group-hover:bg-[#d4af37]/10 transition-colors">
                                    <Phone className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <span className="dark:group-hover:text-slate-200 transition-colors">+91 9503904221</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2 bg-white/5 dark:bg-blue-900/20 rounded-lg group-hover:bg-[#d4af37]/10 transition-colors">
                                    <Mail className="w-5 h-5 text-[#d4af37]" />
                                </div>
                                <span className="dark:group-hover:text-slate-200 transition-colors">script.vizz@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 dark:border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500 dark:text-slate-600">
                        © {new Date().getFullYear()} Nexom. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-slate-500 dark:text-slate-600">
                        <Link to="/privacy" className="hover:text-white dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;