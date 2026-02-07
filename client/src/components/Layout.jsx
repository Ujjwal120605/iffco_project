import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Layout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen font-sans text-black bg-white selection:bg-black selection:text-white">
            {!isDashboard && (
                <nav className={`fixed top-0 w-full z-[200] py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group z-[201]">
                        <span className="text-2xl font-bold tracking-tighter swiss-heading text-white">IFFCO</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full opacity-100 group-hover:scale-125 transition-transform"></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-white items-center">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/about">About Us</NavLink>
                        <NavLink to="/units">Units</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        <a href="https://www.iffco.in/en/contact-us" target="_blank" rel="noopener noreferrer" className="px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all">Contact</a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white text-2xl z-[201] focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Mobile Navigation Overlay */}
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center space-y-8 text-2xl font-bold uppercase tracking-widest text-white">
                            <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileLink>
                            <MobileLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</MobileLink>
                            <MobileLink to="/units" onClick={() => setIsMobileMenuOpen(false)}>Units</MobileLink>
                            <MobileLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</MobileLink>
                            <a href="https://www.iffco.in/en/contact-us" target="_blank" rel="noopener noreferrer" className="text-green-500">Contact</a>
                        </div>
                    )}
                </nav>
            )}

            <main className="relative">
                {children}
            </main>

            {!isDashboard && (
                <footer className="bg-black text-white py-20 px-6 md:px-12 border-t border-gray-900 relative z-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <h2 className="text-4xl font-bold swiss-heading mb-6 tracking-tighter">IFFCO.</h2>
                            <p className="text-gray-400 max-w-sm">
                                The world's largest fertilizer cooperative. Empowering farmers through innovation and sustainability since 1967.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Explore</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
                                <li><Link to="/products" className="hover:text-green-400 transition-colors">Products</Link></li>
                                <li><a href="https://www.iffco.in/en/contact-us" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-6">Connect</h4>
                            <ul className="space-y-4 text-sm">
                                <li><a href="#" className="hover:text-gray-400 transition-colors">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-gray-400 transition-colors">Twitter</a></li>
                                <li><a href="#" className="hover:text-gray-400 transition-colors">Instagram</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-end text-xs text-gray-500 uppercase tracking-wider">
                        <div>&copy; {new Date().getFullYear()} IFFCO Limited.</div>
                        <div className="mt-4 md:mt-0">
                            Design by <span className="text-white">Ujjwal Bajpai</span>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} className="relative group text-white/80 hover:text-white transition-colors">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-green-500 transition-all group-hover:w-full"></span>
    </Link>
);

const MobileLink = ({ to, onClick, children }) => (
    <Link to={to} onClick={onClick} className="hover:text-green-500 transition-colors">
        {children}
    </Link>
);

export default Layout;
