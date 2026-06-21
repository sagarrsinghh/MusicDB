'use client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { communityService } from '@/services/community.service';
import { userService } from '@/services/user.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TopBar() {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();
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
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
            className="h-20 flex items-center justify-between px-8 bg-retro-black border-b border-retro-paper/20 z-50 sticky top-0"
        >
            {/* Left Section: Navigation Controls */}
            <div className="flex items-center gap-4">
                <div className="flex gap-2 mr-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-none bg-retro-black border border-retro-paper/20 text-gray-400 hover:text-retro-paper hover:bg-white/5 transition-all active:scale-95 duration-350"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button
                        onClick={() => navigate(1)}
                        className="w-10 h-10 flex items-center justify-center rounded-none bg-retro-black border border-retro-paper/20 text-gray-400 hover:text-retro-paper hover:bg-white/5 transition-all active:scale-95 duration-350"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>

                <Link to="/">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-14 h-14 flex items-center justify-center rounded-none transition-all overflow-hidden duration-350 ${pathname === '/' ? 'bg-retro-gold/10 border border-retro-gold' : 'bg-retro-black border border-retro-paper/20 hover:border-retro-paper/50'}`}
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
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-retro-gold transition-colors pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search music, artists, or reviews..."
                    className="w-full bg-retro-black border border-retro-paper/20 rounded-none py-3.5 px-14 text-sm text-retro-paper placeholder-gray-600 focus:border-retro-gold focus:ring-1 focus:ring-retro-gold/30 transition-all outline-none"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-500 tracking-tighter bg-retro-paper/5 px-2 py-0.5 rounded-none border border-retro-paper/15 font-mono">⌘ K</span>
                    <button
                        type="submit"
                        className="text-gray-500 hover:text-retro-paper cursor-pointer transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1.5-.866L15.5 5.134zM16 19.33V4.67L19.232 12 16 19.33z" /></svg>
                    </button>
                </div>
            </form>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4 px-4 border-r border-retro-paper/20">
                    <Link to="/songs">
                        <motion.button
                            whileHover={{ y: -1 }}
                            className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-sans ${pathname === '/songs' ? 'text-retro-gold border border-retro-gold bg-retro-gold/5' : 'text-gray-400 hover:text-retro-paper border border-transparent'}`}
                        >
                            Browse
                        </motion.button>
                    </Link>
                    <Link to="/genres">
                        <motion.button
                            whileHover={{ y: -1 }}
                            className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-sans ${(pathname === '/genres' || pathname.startsWith('/genre/')) ? 'text-retro-gold border border-retro-gold bg-retro-gold/5' : 'text-gray-400 hover:text-retro-paper border border-transparent'}`}
                        >
                            Genres
                        </motion.button>
                    </Link>
                    <Link to="/reviews">
                        <motion.button
                            whileHover={{ y: -1 }}
                            className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-sans ${pathname === '/reviews' ? 'text-retro-gold border border-retro-gold bg-retro-gold/5' : 'text-gray-400 hover:text-retro-paper border border-transparent'}`}
                        >
                            Reviews
                        </motion.button>
                    </Link>
                    <Link to="/charts">
                        <motion.button
                            whileHover={{ y: -1 }}
                            className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-sans ${pathname === '/charts' ? 'text-retro-gold border border-retro-gold bg-retro-gold/5' : 'text-gray-400 hover:text-retro-paper border border-transparent'}`}
                        >
                            Charts
                        </motion.button>
                    </Link>
                    <Link to="/community">
                        <motion.button
                            whileHover={{ y: -1 }}
                            className={`px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group font-sans ${pathname === '/community' ? 'text-retro-gold border border-retro-gold bg-retro-gold/5' : 'text-gray-400 hover:text-retro-paper border border-transparent'}`}
                        >
                            Pulse
                        </motion.button>
                    </Link>

                    {user?.role === 'admin' && (
                        <Link to="/admin">
                            <button className={`px-4 py-2 rounded-none text-xs font-black uppercase tracking-widest transition-all ${pathname === '/admin' ? 'text-red-400 border border-red-400 bg-red-400/5' : 'text-red-500/60 hover:text-red-400 border border-transparent hover:border-red-500/20'}`}>
                                Core
                            </button>
                        </Link>
                    )}
                </div>

                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) fetchNotifications();
                        }}
                        className={`w-12 h-12 flex items-center justify-center rounded-none bg-retro-black border transition-all relative ${showNotifications ? 'text-retro-gold border-retro-gold bg-retro-gold/5' : 'text-gray-400 border-retro-paper/20 hover:text-retro-paper hover:border-retro-paper/50'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        {notifications.length > 0 && (
                            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-retro-gold border border-retro-black" />
                        )}
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-96 bg-retro-black border border-retro-paper/30 rounded-none shadow-none overflow-hidden z-[100]"
                                >
                                    <div className="p-4 border-b border-retro-paper/10 flex items-center justify-between bg-retro-paper/[0.02]">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-retro-paper/60 font-sans">Transmission Signal</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-retro-gold animate-pulse" />
                                            <span className="text-[9px] text-retro-gold font-black uppercase tracking-widest">Live Feed</span>
                                        </div>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map((n: any, i) => (
                                                <div
                                                    key={i}
                                                    className="p-4 hover:bg-retro-paper/[0.03] transition-colors border-b border-retro-paper/10 last:border-0 group cursor-default"
                                                >
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 rounded-none bg-retro-gold flex-shrink-0 flex items-center justify-center text-retro-black font-serif italic font-black text-sm border border-retro-black">
                                                            {n.user?.name?.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-retro-paper/85 leading-snug">
                                                                <span className="font-black text-retro-paper hover:text-retro-gold transition-colors cursor-pointer font-sans">{n.user?.name}</span>
                                                                {n.type === 'review' ? ' published a review on ' : ' resonated with '}
                                                                <span className="font-black text-retro-gold italic font-serif">{n.song?.title}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-12 text-center opacity-40">
                                                <div className="w-10 h-10 rounded-none border border-retro-paper/20 flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-5 h-5 text-retro-paper/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                </div>
                                                <p className="text-xs font-black uppercase tracking-widest text-retro-paper/60 font-sans">No resonance found.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-retro-paper/[0.02] border-t border-retro-paper/10 text-center">
                                        <button className="text-[9px] font-black text-retro-paper/50 uppercase tracking-widest hover:text-retro-gold transition-colors font-sans">View All Transmissions</button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pl-4 group relative cursor-pointer border-l border-retro-paper/20 h-10">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mb-1 text-right italic opacity-70 max-w-[150px] truncate font-serif">
                            "Music is a moral law."
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-retro-gold" />
                            <span className="text-xs font-black text-retro-paper group-hover:text-retro-gold transition-colors tracking-tight font-sans">
                                {user?.name || 'Explorer'}
                            </span>
                        </div>
                    </div>

                    <div className="w-12 h-12 rounded-none bg-retro-gold flex items-center justify-center text-retro-black font-black text-xl border border-retro-paper/20 group-hover:border-retro-gold transition-all overflow-hidden relative duration-350">
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
                    </div>

                    {/* Logout Dropdown */}
                    <AnimatePresence>
                        <div className="absolute right-0 top-[calc(100%+0.5rem)] hidden group-hover:block pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-retro-black border border-retro-paper/30 rounded-none p-1.5 min-w-[200px] z-[100]"
                            >
                                <Link to="/profile">
                                    <button className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-retro-paper/70 hover:text-retro-gold hover:bg-retro-paper/5 rounded-none transition-all flex items-center justify-between group/item font-sans">
                                        Identity
                                        <svg className="w-4 h-4 opacity-0 group-hover/item:translate-x-1 group-hover/item:opacity-100 transition-all text-retro-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                                    </button>
                                </Link>
                                <button
                                    onClick={() => authService.logout()}
                                    className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-retro-accent/70 hover:text-retro-accent hover:bg-retro-accent/10 rounded-none transition-all flex items-center justify-between group/item font-sans"
                                >
                                    Sever Link
                                    <svg className="w-4 h-4 text-retro-accent/40 group-hover/item:text-retro-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </button>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
}
