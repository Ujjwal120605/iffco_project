import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen font-sans text-black bg-white selection:bg-black selection:text-white">
            {!isDashboard && (
                <nav className="fixed top-0 w-full z-50 text-white py-6 px-6 md:px-12 flex justify-between items-center transition-all bg-transparent">
                    {/* Logo - Minimalist */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-bold tracking-tighter swiss-heading text-[#0a4d2e]">IFFCO</span>
                        <span className="w-2 h-2 bg-[#0a4d2e] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </Link>

                    {/* Navigation - Swiss Style */}
                    <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide uppercase text-white">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/about">About Us</NavLink>
                        <NavLink to="/units">Units</NavLink>
                        <NavLink to="/products">Products</NavLink>
                        <a href="https://www.iffco.in/en/contact-us" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Contact</a>
                    </div>
                </nav>
            )}

            <main className="relative">
                {children}
            </main>

            {!isDashboard && (
                <footer className="bg-black text-white py-20 px-6 md:px-12 border-t border-gray-900">
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
                                <li><Link to="/" className="hover:text-gray-400 transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-gray-400 transition-colors">About Us</Link></li>
                                <li><Link to="/products" className="hover:text-gray-400 transition-colors">Products</Link></li>
                                <li><Link to="/contact" className="hover:text-gray-400 transition-colors">Global Presence</Link></li>
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
    <Link to={to} className="relative group">
        {children}
        <span className="absolute -bottom-2 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
    </Link>
);

export default Layout;
