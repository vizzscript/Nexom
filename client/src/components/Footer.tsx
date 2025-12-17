import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useServicesData, type FrontendCategory } from '../services/useServicesData';

const Footer: React.FC = () => {
    // We only need categories to list the links
    const { categories } = useServicesData();

    const footLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Pricing', path: '/' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-white/10 p-2 rounded-lg">
                                <Sparkles className="w-6 h-6 text-[#d4af37]" />
                            </div>
                            <span className="text-2xl font-bold font-serif text-white">Nexom</span>
                        </Link>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Elevating home care to an art form. We provide premium cleaning services tailored to your lifestyle and needs.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                                <a key={index} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#d4af37] hover:text-white transition-all duration-300">
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
                                    <Link to={item.path} className="hover:text-[#d4af37] transition-colors flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Updated Services Links with State */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-6">Our Services</h3>
                        <ul className="space-y-4">
                            {categories.map((item: FrontendCategory) => (
                                <li key={item.id}>
                                    <Link
                                        to="/services"
                                        // This passes the category name to the Services page
                                        state={{ selectedCategory: item.name }}
                                        className="hover:text-[#d4af37] transition-colors"
                                    >
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
                            <li className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-[#d4af37] mt-1" />
                                <span>123 Premium Boulevard,<br />Beverly Hills, CA 90210</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-[#d4af37]" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-[#d4af37]" />
                                <span>concierge@nexom.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Nexom. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-slate-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;