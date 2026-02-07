import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const Products = () => {
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const products = [
        {
            id: 0,
            title: "NANO UREA LIQUID",
            subtitle: "The Future of Nitrogen",
            desc: "A revolutionary nanotechnology-based fertilizer. 500ml bottle equivalent to 45kg of conventional urea. Enhances crop quality and reduces input costs.",
            stats: [
                { label: "Annual Capacity", value: "170M+", unit: "Bottles" },
                { label: "Efficiency", value: "85%", unit: "Nitrogen Use" },
                { label: "Reduction", value: "7.65M", unit: "Tons Urea Replaced" }
            ],
            img: "/unit_kalol.png" // Using the Nano Urea Plant image
        },
        {
            id: 1,
            title: "NANO DAP",
            subtitle: "Phosphorus Perfection",
            desc: "The world's first Nano DAP. A sustainable source of Phosphorus and Nitrogen, promoting root growth and ensuring optimal plant health.",
            stats: [
                { label: "Daily Output", value: "950K", unit: "Bottles (Global)" },
                { label: "Precision", value: "4nm", unit: "Particle Size" },
                { label: "Yield Increase", value: "8-10%", unit: "Estimated" }
            ],
            img: "/unit_paradip.png" // Using Paradip (Phosphate Hub) image
        },
        {
            id: 2,
            title: "NPK & UREA",
            subtitle: "Industrial Foundation",
            desc: "High-grade complex fertilizers providing essential Nitrogen, Phosphorus, and Potassium. The backbone of Indian agriculture for decades.",
            stats: [
                { label: "Urea Capacity", value: "4.24", unit: "MMT / Year" },
                { label: "NPK Capacity", value: "4.30", unit: "MMT / Year" },
                { label: "Reach", value: "100%", unit: "Pan India" }
            ],
            img: "/home_industrial_sleek.png" // Warehouse image
        }
    ];

    return (
        <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-green-500 selection:text-black">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-green-400 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* Navigation Placeholder (Hidden but keeps spacing) */}
            <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center opacity-0 pointer-events-none">
            </nav>

            {/* FIXED BACKGROUND ENGINE */}
            <div className="fixed inset-0 w-full h-full z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${products[activeSection].img})`,
                            filter: 'grayscale(100%) brightness(0.3) contrast(1.2)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mixed-blend-overlay"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* HERO SECTION */}
            <section className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 mb-0 leading-[0.8]">
                        PRODUCT
                    </h1>
                    <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-600 to-black mb-6 leading-[0.8]">
                        MATRIX
                    </h1>
                    <p className="text-green-500 font-mono tracking-[0.5em] uppercase text-sm mt-8">
                        The Science of Sustenance // 2026
                    </p>
                </motion.div>
            </section>

            {/* SCROLLYTELLING PRODUCT CARDS */}
            <div className="relative z-10 pb-40">
                {products.map((product, index) => (
                    <section
                        key={product.id}
                        className="min-h-screen flex items-center justify-center py-20 px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            onViewportEnter={() => setActiveSection(index)}
                            viewport={{ amount: 0.5, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[2rem] max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center hover:border-green-500/30 transition-colors duration-500"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-green-500 font-mono text-xs tracking-widest uppercase border border-green-500/20 px-3 py-1 rounded-full bg-green-900/10">
                                        Series 0{index + 1}
                                    </span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter uppercase leading-none">
                                    {product.title}
                                </h2>
                                <h3 className="text-xl md:text-2xl font-light text-white/60 tracking-wide">
                                    {product.subtitle}
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-mono text-sm border-l-2 border-white/20 pl-6 py-2">
                                    {product.desc}
                                </p>

                                <button className="group mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-widest hover:text-green-400 transition-colors">
                                    Technical Specs <span className="block h-px w-8 bg-white group-hover:bg-green-400 transition-colors"></span>
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-6">
                                {product.stats.map((stat, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-4xl font-bold text-white group-hover:text-green-400 transition-colors">{stat.value}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest text-right">{stat.unit}</span>
                                        </div>
                                        <div className="h-px w-full bg-white/10 mb-2"></div>
                                        <div className="text-xs text-gray-400 font-mono uppercase">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </section>
                ))}
            </div>

            <footer className="relative z-10 bg-black py-12 text-center text-xs text-gray-600 font-mono uppercase tracking-widest">
                IFFCO Digital Inventory // End of Line
            </footer>
        </div>
    );
};

export default Products;
