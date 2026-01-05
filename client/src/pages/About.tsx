import { motion } from 'framer-motion';
import { Award, Heart, Target, Users } from 'lucide-react';
import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
    // This hook detects when the section enters the viewport
    const { ref, inView } = useInView({
        threshold: 0.2, // Trigger when 30% of the section is visible
        triggerOnce: true, // Only animate once
    });

    const stats = [
        { icon: Users, label: "Happy Clients", value: 5000, suffix: "+" },
        { icon: Award, label: "Awards Won", value: 12, suffix: "" },
        { icon: Target, label: "Cities Covered", value: 8, suffix: "" },
        { icon: Heart, label: "Team Members", value: 150, suffix: "+" },
    ];

    return (
        <div className="pt-20 min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/50 transform skew-x-12 translate-x-20" />
                <div className="container mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold font-serif mb-6 text-white"
                    >
                        Our Story
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Founded with a simple mission: to elevate home cleaning from a chore to an art form.
                        We believe your home is your sanctuary, and it deserves nothing but the best.
                    </motion.p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl" />
                            <img
                                src="https://plus.unsplash.com/premium_vector-1682297792196-a4d0bd18dfa8?q=80&w=1329&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Team meeting"
                                className="rounded-2xl shadow-xl relative z-10"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg z-20 max-w-xs border border-slate-100">
                                <p className="text-slate-900 font-serif italic text-lg">
                                    "Excellence is not an act, but a habit."
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold font-serif mb-6 text-slate-900">Redefining Cleanliness</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                At Nexom, we understand that a clean home is the foundation of a happy life.
                                Our journey began when we realized that the cleaning industry lacked a truly premium,
                                customer-centric service that could cater to modern lifestyles.
                            </p>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                We've built a team of dedicated professionals who share our passion for perfection.
                                Every member of our staff is rigorously trained, background-checked, and insured,
                                ensuring that your home is in the safest hands.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <Target className="w-6 h-6 text-[#d4af37] mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-900">Our Mission</h4>
                                        <p className="text-sm text-slate-600">To provide unmatched quality and peace of mind.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Heart className="w-6 h-6 text-[#d4af37] mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-900">Our Values</h4>
                                        <p className="text-sm text-slate-600">Integrity, Excellence, and Care.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section ref={ref} className="py-16 bg-slate-50">
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                                    {inView ? (
                                        <CountUp
                                            end={stat.value}
                                            duration={2.5}
                                            separator=","
                                            suffix={stat.suffix}
                                        />
                                    ) : (
                                        "0"
                                    )}
                                </h3>
                                <p className="text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
