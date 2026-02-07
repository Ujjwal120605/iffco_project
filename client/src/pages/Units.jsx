import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

const Units = () => {
    const [activeSection, setActiveSection] = useState(0);
    const [isParallaxMode, setIsParallaxMode] = useState(true);
    const containerRef = useRef(null);

    // Progress bar logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const units = [
        {
            id: 0,
            title: "AONLA UNIT",
            location: "Bareilly, Uttar Pradesh",
            desc: "A powerhouse of production. This unit serves as a global benchmark for energy efficiency and sustainable fertilizer manufacturing.",
            stats: "High Capacity Utilization",
            img: "/unit_aonla.png" // Ensure these paths match your public folder
        },
        {
            id: 1,
            title: "PHULPUR UNIT",
            location: "Prayagraj, Uttar Pradesh",
            desc: "Strategically located to feed the Gangetic plain, Phulpur is the backbone of Urea production in Northern India.",
            stats: "Strategic Production Hub",
            img: "/unit_phulpur.png"
        },
        {
            id: 2,
            title: "KANDLA UNIT",
            location: "Kutch, Gujarat",
            desc: "Handling massive international imports, Kandla converts global raw materials into high-grade NPK fertilizers.",
            stats: "Global Import Hub",
            img: "/unit_kandla.png"
        },
        {
            id: 3,
            title: "KALOL UNIT",
            location: "Gandhinagar, Gujarat",
            desc: "Where history meets the future. Home to the world’s first Nano Urea plant, revolutionizing modern agriculture.",
            stats: "Nano Urea Pioneer",
            img: "/unit_kalol.png"
        },
        {
            id: 4,
            title: "PARADIP UNIT",
            location: "Paradip, Odisha",
            desc: "A massive industrial marvel. Paradip houses the world's largest phosphoric acid plant, securing the East's supply.",
            stats: "World's Largest PA Plant",
            img: "/unit_paradip.png"
        }
    ];

    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-green-400 selection:text-black overflow-x-hidden">

            {/* Professional Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* Navigation / Mode Toggle */}
            <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center opacity-0 pointer-events-none">
            </nav>

            {/* THE FIXED BACKGROUND ENGINE */}
            {isParallaxMode && (
                <div className="fixed inset-0 w-full h-full z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 bg-cover bg-center grayscale-[40%] contrast-[1.1]"
                            style={{
                                backgroundImage: `url(${units[activeSection].img})`,
                                backgroundAttachment: 'fixed' // The "Static" effect you wanted
                            }}
                        >
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {/* CONTENT SCROLL LAYER */}
            <main className="relative z-10">
                {/* Hero */}
                <section className="h-screen flex flex-col justify-center items-center text-center px-6">
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-green-500 font-mono tracking-[0.5em] mb-4 text-sm"
                    >
                        ESTABLISHED 1967
                    </motion.span>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none"
                    >
                        Our<br />Townships
                    </motion.h1>
                </section>

                {/* Unit Sections */}
                {units.map((unit, index) => (
                    <section
                        key={unit.id}
                        className="min-h-screen flex items-center justify-center py-20 px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            onViewportEnter={() => setActiveSection(index)}
                            viewport={{ amount: 0.5 }}
                            className="max-w-3xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-12 md:p-20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <span className="text-5xl font-mono font-bold text-white/10">0{index + 1}</span>
                                <div className="h-[1px] flex-grow bg-white/10"></div>
                                <span className="text-green-400 font-mono text-xs tracking-widest uppercase">{unit.stats}</span>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{unit.title}</h2>
                            <h3 className="text-sm font-mono text-white/40 uppercase tracking-[0.2em] mb-10 border-l-2 border-green-500 pl-4">
                                {unit.location}
                            </h3>

                            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-8">
                                {unit.desc}
                            </p>

                            <div className="pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/30 uppercase">
                                <span>IFFCO Industrial Div.</span>
                                <span>Verified Unit</span>
                            </div>
                        </motion.div>
                    </section>
                ))}
            </main>

            {/* Professional Signature Footer */}
            <footer className="relative z-20 bg-black py-20 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold tracking-tighter mb-2">IFFCO × UJJWAL BAJPAI</div>
                        <p className="text-white/40 text-sm font-light">Transforming agriculture through digital excellence.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-2">Internship Project 2026</span>
                        <div className="text-sm font-medium">
                            Developed by <span className="text-green-500">Ujjwal Bajpai</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Units;
