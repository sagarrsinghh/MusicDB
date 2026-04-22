'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { communityService } from '@/services/community.service';
import { userService } from '@/services/user.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TopBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const [user, setUser] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await communityService.getFeed();
            setNotifications(data.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        // First set from auth service for speed
        const initialUser = authService.getCurrentUser();
        setUser(initialUser);

        // Then fetch latest profile for accuracy (e.g. updated profile image)
        const fetchLatestProfile = async () => {
            try {
                const profile = await userService.getProfile();
                setUser(profile);
            } catch (error) {
                console.error('TopBar: Failed to sync latest profile', error);
            }
        };

        if (initialUser) {
            fetchLatestProfile();
        }
    }, [pathname]); // Refresh on navigation to ensure sync

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Hide TopBar on auth pages
    if (pathname === '/welcome' || pathname === '/login' || pathname === '/register') {
        return null;
    }

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-20 flex items-center justify-between px-8 bg-[#0b0b0b]/80 backdrop-blur-2xl border-b border-white/5 z-50 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
        >
            {/* Inner Glow Border */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-retro-gold/20 to-transparent" />

            {/* Left Section: Navigation Controls */}
            <div className="flex items-center gap-4">
                <div className="flex gap-2.5 mr-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button
                        onClick={() => router.forward()}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>

                <Link href="/">
                    <motion.div
                        whileHover={{ scale: 1.05, filter: "sepia(0.5) brightness(1.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all shadow-lg overflow-hidden ${pathname === '/' ? 'bg-retro-gold/10 border border-retro-gold/30' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                    >
                        <img
                            src="/logo.jpg"
                            alt="MusicDB Logo"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </motion.div>
                </Link>
            </div>

            {/* Center Section: Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-12 relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1DB954] transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search music, artists, or reviews..."
                    className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/5 rounded-full py-3.5 px-14 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#1DB954]/30 transition-all outline-none backdrop-blur-md"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-600 tracking-tighter bg-white/5 px-2 py-0.5 rounded border border-white/5">⌘ K</span>
                    <button
                        type="submit"
                        className="text-gray-500 hover:text-white cursor-pointer transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1.5-.866L15.5 5.134zM16 19.33V4.67L19.232 12 16 19.33z" /></svg>
                    </button>
                </div>
            </form>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4 px-4 border-r border-white/10">
                    <Link href="/songs">
                        <motion.button
                            whileHover={{ y: -2 }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-serif italic ${pathname === '/songs' ? 'text-retro-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Browse
                            {pathname === '/songs' && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-retro-gold/5 rounded-xl -z-10 shadow-[0_0_15px_rgba(197,164,126,0.1)]" />}
                        </motion.button>
                    </Link>
                    <Link href="/reviews">
                        <motion.button
                            whileHover={{ y: -2 }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-serif italic ${pathname === '/reviews' ? 'text-retro-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Reviews
                            {pathname === '/reviews' && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-retro-gold/5 rounded-xl -z-10 shadow-[0_0_15px_rgba(197,164,126,0.1)]" />}
                        </motion.button>
                    </Link>
                    <Link href="/charts">
                        <motion.button
                            whileHover={{ y: -2 }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-serif italic ${pathname === '/charts' ? 'text-retro-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Charts
                            {pathname === '/charts' && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-retro-gold/5 rounded-xl -z-10 shadow-[0_0_15px_rgba(197,164,126,0.1)]" />}
                        </motion.button>
                    </Link>
                    <Link href="/community">
                        <motion.button
                            whileHover={{ y: -2 }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-serif italic ${pathname === '/community' ? 'text-retro-gold' : 'text-gray-400 hover:text-white'}`}
                        >
                            Pulse
                            {pathname === '/community' && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-retro-gold/5 rounded-xl -z-10 shadow-[0_0_15px_rgba(197,164,126,0.1)]" />}
                        </motion.button>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link href="/admin">
                            <button className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${pathname === '/admin' ? 'text-red-400 bg-red-500/10' : 'text-red-500/60 hover:text-red-400 hover:bg-red-500/5'}`}>
                                Core
                            </button>
                        </Link>
                    )}
                </div>

                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) fetchNotifications();
                        }}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 transition-all relative ${showNotifications ? 'text-[#1DB954] border-[#1DB954]/50 bg-[#1DB954]/5' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        {notifications.length > 0 && (
                            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#1DB954] rounded-full border-2 border-black shadow-[0_0_15px_rgba(29,185,84,0.6)]" />
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-96 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl z-[100]"
                                >
                                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deep Space Signals</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                                            <span className="text-[9px] text-[#1DB954] font-black uppercase tracking-widest">Live Feed</span>
                                        </div>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map((n: any, i) => (
                                                <div
                                                    key={i}
                                                    className="p-5 hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 group cursor-default"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1DB954] to-emerald-800 flex-shrink-0 flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-lg">
                                                            {n.user?.name?.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-gray-300 leading-snug">
                                                                <span className="font-black text-white hover:text-[#1DB954] transition-colors cursor-pointer">{n.user?.name}</span>
                                                                {n.type === 'review' ? ' published a review on ' : ' resonated with '}
                                                                <span className="font-black text-[#1DB954] italic">{n.song?.title}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-16 text-center opacity-40">
                                                <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                </div>
                                                <p className="text-xs font-black uppercase tracking-widest">No active resonance.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
                                        <button className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">View All Transmission</button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pl-4 group relative cursor-pointer border-l border-white/10 h-10">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mb-1 text-right italic opacity-60 max-w-[150px] truncate">
                            "Music has a way to find people in the darkness."
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_8px_#1DB954]" />
                            <span className="text-xs font-black text-white group-hover:text-[#1DB954] transition-colors tracking-tight">
                                {user?.name || 'Explorer'}
                            </span>
                        </div>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#1DB954] shadow-[0_0_25px_rgba(29,185,84,0.3)] flex items-center justify-center text-white font-black text-xl border-2 border-white/10 group-hover:scale-105 group-hover:border-[#1DB954]/50 transition-all overflow-hidden relative group-hover:rotate-3">
                        {user?.profile_image ? (
                            <img
                                key={user.profile_image}
                                src={user.profile_image}
                                className="w-full h-full object-cover"
                                alt={user.name}
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || 'E'
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Logout Dropdown */}
                    <AnimatePresence>
                        <div className="absolute right-0 top-[calc(100%+0.5rem)] hidden group-hover:block pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 min-w-[200px] backdrop-blur-3xl"
                            >
                                <Link href="/profile">
                                    <button className="w-full text-left px-4 py-3.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group/item">
                                        Identity
                                        <svg className="w-4 h-4 opacity-0 group-hover/item:translate-x-1 group-hover/item:opacity-100 transition-all text-[#1DB954]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                    </button>
                                </Link>
                                <button
                                    onClick={() => authService.logout()}
                                    className="w-full text-left px-4 py-3.5 text-xs font-black uppercase tracking-widest text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-between group/item"
                                >
                                    Sever Link
                                    <svg className="w-4 h-4 text-red-500/40 group-hover/item:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
}
