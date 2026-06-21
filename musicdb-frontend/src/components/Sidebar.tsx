'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SidebarLinks = [
    { name: 'Overview', href: '/admin', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Artists', href: '/artists', icon: '🎤' },
    { name: 'Songs', href: '/songs', icon: '🎵' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-retro-black border-r border-retro-paper/20 flex flex-col h-full z-20"
        >
            <div className="p-8">
                <Link to="/">
                    <h2 className="text-2xl font-serif italic text-retro-gold tracking-widest uppercase">
                        Music<span className="text-retro-paper">DB</span>
                    </h2>
                </Link>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-serif italic mt-2">The Archive</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {SidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.name} to={link.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-300 group ${isActive
                                    ? 'bg-retro-gold/10 text-retro-gold border border-retro-gold'
                                    : 'text-gray-400 hover:text-retro-paper hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                    {link.icon}
                                </span>
                                <span className="font-serif italic text-sm tracking-wide">{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-4 bg-retro-gold"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-retro-paper/20">
                <button
                    onClick={() => {
                        import('@/services/auth.service').then(({ authService }) => {
                            authService.logout();
                        });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-none text-gray-400 hover:text-retro-accent hover:bg-white/5 border border-transparent hover:border-retro-accent/20 transition-all duration-300 group"
                >
                    <span className="text-xl opacity-50 group-hover:opacity-100">🚪</span>
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </motion.aside>
    );
}
