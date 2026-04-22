'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const SidebarLinks = [
    { name: 'Overview', href: '/admin', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Artists', href: '/artists', icon: '🎤' },
    { name: 'Songs', href: '/songs', icon: '🎵' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col h-full z-20"
        >
            <div className="p-8">
                <Link href="/">
                    <h2 className="text-2xl font-serif italic text-retro-gold tracking-widest uppercase">
                        Music<span className="text-white">DB</span>
                    </h2>
                </Link>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-serif italic mt-2">The Archive</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {SidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link key={link.name} href={link.href}>
                            <motion.div
                                whileHover={{ x: 5 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                    ? 'bg-retro-gold/10 text-retro-gold border border-retro-gold/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                    {link.icon}
                                </span>
                                <span className="font-serif italic text-sm tracking-wide">{link.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1 h-4 rounded-full bg-retro-gold shadow-[0_0_10px_rgba(197,164,126,0.5)]"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#222]">
                <button
                    onClick={() => {
                        import('@/services/auth.service').then(({ authService }) => {
                            authService.logout();
                        });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group"
                >
                    <span className="text-xl opacity-50 group-hover:opacity-100">🚪</span>
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </motion.aside>
    );
}
