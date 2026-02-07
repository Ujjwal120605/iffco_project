import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Hero Section */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10" />
                    <img
                        src="/about_hero_custom.jpg"
                        alt="IFFCO Tower"
                        className="w-full h-full object-cover filter grayscale"
                    />
                </motion.div>

                <div className="relative z-20 text-center max-w-4xl px-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-7xl md:text-9xl font-black tracking-tighter mb-6 swiss-heading"
                    >
                        ABOUT IFFCO
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-2xl font-light text-gray-300 tracking-wide"
                    >
                        Redefining agriculture through innovation, sustainability, and digital empowerment.
                    </motion.p>
                </div>
            </div>

            {/* Content Section - Minimalist & Futuristic */}
            <div className="relative z-20 bg-black py-24 px-6 md:px-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Our Vision</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            IFFCO is not just a fertilizer cooperative; it is a movement. We are pioneering the digital agriculture revolution, ensuring that every farmer has access to world-class technology and sustainable solutions.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            From Nano Urea to drone technology, we are bridging the gap between tradition and the future. Our goal is simple: to empower the Indian farmer and secure global food security.
                        </p>
                    </div>
                    <div className="relative h-[600px] border border-white/10 rounded-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        {/* Placeholder for network image (using existing one temporarily due to rate limit) */}
                        <img
                            src="/home_industrial_sleek.png"
                            alt="Innovation"
                            className="w-full h-full object-cover filter grayscale group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-8 left-8 z-20">
                            <h3 className="text-2xl font-bold mb-2">Global Network</h3>
                            <p className="text-sm text-gray-400">Connecting 5.5 Crore Farmers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - High Tech Look */}
            <div className="bg-[#111] py-32 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {[
                        { label: "Farmers Empowered", value: "5.5 Cr+" },
                        { label: "Cooperative Societies", value: "35,000+" },
                        { label: "Global Presence", value: "100+ Countries" }
                    ].map((stat, index) => (
                        <div key={index} className="group cursor-default">
                            <h3 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-4 group-hover:to-green-500 transition-all duration-500">
                                {stat.value}
                            </h3>
                            <p className="text-sm uppercase tracking-widest text-gray-500 group-hover:text-green-400 transition-colors">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
