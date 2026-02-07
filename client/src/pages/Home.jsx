import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaArrowRight, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', unit: '', grade: '' });
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    // Check for existing session
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard');
    }, [navigate]);
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? `${API_BASE_URL}/api/auth/login` : `${API_BASE_URL}/api/auth/signup`;
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : {
                    username: formData.name,
                    email: formData.email,
                    password: formData.password,
                    unit: formData.unit,
                    grade: formData.grade
                };

            const res = await axios.post(endpoint, payload);

            // On success, save token and user data
            localStorage.setItem('token', res.data.token);
            // If user object is returned, save it, otherwise decode or fetch
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            } else {
                // Fallback if backend doesn't return full user object immediately (though it should)
                localStorage.setItem('user', JSON.stringify({ name: formData.name || 'User', email: formData.email }));
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            // Enhanced error message for better debugging
            const backendMsg = err.response?.data?.msg;
            const status = err.response?.status;
            let displayMsg = 'Authentication failed. Please check credentials.';

            if (backendMsg) displayMsg = backendMsg;
            else if (status === 404) displayMsg = 'Server endpoint not found (404). Check API URL.';
            else if (!err.response) displayMsg = 'Server unreachable. Check if backend is running on port 5001.';

            setError(displayMsg);
            setIsLoading(false);
        }
    };

    const sections = [
        {
            id: 0,
            title: "Technological Revolution",
            desc: "We are bridging the gap between traditional farming and modern technology. From Nano Urea to agricultural drones, IFFCO is equipping 5.5 Crore farmers with the tools of tomorrow.",
            img: "/home_aesthetic_field.png"
        },
        {
            id: 1,
            title: "Visionary Leadership",
            desc: "Under the guidance of Mr. K.J. Patel and our expert leadership team, IFFCO continues to set global benchmarks in the fertilizer industry, driving innovation and cooperative values.",
            img: "/home_kj_patel.png"
        },
        {
            id: 2,
            title: "Golden Harvests",
            desc: "The joy of a bountiful harvest reflects our commitment to sustainable agriculture. Every grain represents the hard work and resilience of Indian farmers.",
            img: "/home_farmer_woman.png"
        },
        {
            id: 3,
            title: "The Soul of India",
            desc: "Farmers are the backbone of our nation. IFFCO stands with them, shoulder to shoulder, ensuring prosperity, dignity, and a better quality of life for rural families.",
            img: "/home_farmer_soul.png"
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black overflow-x-hidden">

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-green-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* HERO & LOGIN SECTION */}
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Static Hero Background */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center grayscale-[50%]"
                    style={{
                        backgroundImage: "url('/iffco_sadan_tower.png')",
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/80"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center pt-24 lg:pt-0">
                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-block px-4 py-1 border border-green-500/50 rounded-full text-green-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md bg-black/30">
                            IT Intern Portal // Ujjwal Bajpai
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                            IFFCO<br /><span className="text-green-500">DIGITAL</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-lg font-light leading-relaxed">
                            Pioneering the future of agriculture through sustainable innovation and robust architectures.
                        </p>
                    </motion.div>

                    {/* Glassmorphic Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-black/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-[0_0_60px_rgba(0,255,100,0.05)] max-w-md w-full ml-auto relative overflow-hidden group"
                    >
                        {/* Auth Mode Tabs */}
                        <div className="flex bg-black/40 p-1 rounded-xl mb-8 relative z-10 border border-white/5">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-gray-500 hover:text-white'}`}
                            >
                                Terminal Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                New Registration
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <FaLock className={isLogin ? "text-green-500 text-xl" : "text-white text-xl"} />
                            <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-white">
                                {isLogin ? 'Access Point' : 'Initialize'}
                            </h3>
                        </div>
                        <p className="text-gray-400 text-xs mb-8 font-mono uppercase tracking-[0.2em] pl-8 border-l border-green-500/30">
                            {isLogin ? 'Enter Credentials to Proceed' : 'Create New Officer Profile'}
                        </p>

                        {error && <div className="p-3 mb-4 text-xs font-mono text-red-300 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> {error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <AnimatePresence mode="popLayout">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5"
                                    >
                                        <FloatingLabelInput
                                            type="text"
                                            name="name"
                                            label="Full Officer Name"
                                            value={formData.name || ''}
                                            onChange={handleInputChange}
                                        />

                                        {/* Unit Selection */}
                                        <div className="relative group">
                                            <select
                                                name="unit"
                                                value={formData.unit || ''}
                                                onChange={handleInputChange}
                                                required
                                                className="block w-full px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all font-mono uppercase"
                                            >
                                                <option value="" disabled className="bg-black text-gray-500">Select Unit</option>
                                                {["Aonla", "Phulpur", "Paradip", "Kandla", "Kalol"].map(u => (
                                                    <option key={u} value={u} className="bg-black text-white">{u}</option>
                                                ))}
                                            </select>
                                            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>

                                        {/* Grade Selection */}
                                        <div className="relative group">
                                            <select
                                                name="grade"
                                                value={formData.grade || ''}
                                                onChange={handleInputChange}
                                                required
                                                className="block w-full px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all font-mono uppercase"
                                            >
                                                <option value="" disabled className="bg-black text-gray-500">Select Grade</option>
                                                {["Worker", "Assistant Manager", "Deputy Manager", "Manager", "Senior Manager", "Chief Manager", "DGM", "JGM", "GM", "Unit Head"].map(g => (
                                                    <option key={g} value={g} className="bg-black text-white">{g}</option>
                                                ))}
                                            </select>
                                            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                        </div>

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <FloatingLabelInput
                                type="email"
                                name="email"
                                label="Official Email ID"
                                value={formData.email}
                                onChange={handleInputChange}
                            />

                            <div className="relative">
                                <FloatingLabelInput
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    label="Access Key (Password)"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors z-20"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>

                            <button
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 group mt-2 shadow-lg ${isLogin ? 'bg-green-500 text-black hover:bg-green-400 hover:shadow-green-500/30' : 'bg-white text-black hover:bg-gray-200 hover:shadow-white/20'}`}
                            >
                                {isLoading ? <FaSpinner className="animate-spin" /> : <>{isLogin ? 'Grant Access' : 'Register Profile'} <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* SCROLLYTELLING SECTION */}
            <div className="relative">
                {/* Fixed Background Engine */}
                {sections.map((section, index) => (
                    <div key={`bg-${index}`} className="absolute inset-0 w-full h-full pointer-events-none">
                        <div
                            className={`fixed inset-0 w-full h-full bg-cover bg-top transition-opacity duration-1000 ease-in-out ${activeSection === index ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                                backgroundImage: `url(${section.img})`,
                                filter: 'grayscale(100%) brightness(0.4)',
                                zIndex: 0
                            }}
                        />
                    </div>
                ))}

                {/* Content Layer */}
                <div className="relative z-10">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className="min-h-screen flex items-center justify-center lg:justify-end px-6 lg:px-32 py-20"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                onViewportEnter={() => setActiveSection(index)}
                                viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
                                className="max-w-xl bg-black/40 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-l-4 border-l-green-500"
                            >
                                <div className="text-green-500 font-mono text-xs tracking-widest mb-4 uppercase">0{index + 1} // THE VISION</div>
                                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter leading-none">{section.title}</h2>
                                <p className="text-xl text-gray-300 font-light leading-relaxed">{section.desc}</p>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className="relative z-20 bg-black py-12 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono">
                        © 2026 IFFCO. Confidential.
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-white/50">
                            Developed by <span className="text-white">Ujjwal Bajpai</span>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Floating Label Input Component
const FloatingLabelInput = ({ type, name, label, value, onChange, autoComplete }) => (
    <div className="relative group">
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required
            autoComplete={autoComplete}
            className="block w-full px-5 py-4 text-white bg-white/5 border border-white/10 rounded-xl appearance-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 peer transition-all placeholder-transparent"
            placeholder=" "
        />
        <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-4 z-10 origin-[0] bg-transparent px-2 peer-focus:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-4 peer-focus:scale-75 peer-focus:-translate-y-6 left-4 pointer-events-none">
            {label}
        </label>
    </div>
);

export default Home;
