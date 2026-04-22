'use client';

import { useEffect, useState } from 'react';
import { favoriteService } from '@/services/favorite.service';
import { authService } from '@/services/auth.service';
import SongCard from '@/components/SongCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsPublic(currentUser?.favorites_is_public || false);
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const data = await favoriteService.getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error('Failed to fetch favorites', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleVisibility = async () => {
        try {
            const newStatus = !isPublic;
            await favoriteService.updateVisibility(newStatus);
            setIsPublic(newStatus);
            // Update local user object in storage if necessary
            if (user) {
                const updatedUser = { ...user, favorites_is_public: newStatus };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Failed to update visibility', error);
        }
    };

    return (
        <div className="space-y-16 pb-32">
            <header className="relative py-20 overflow-hidden rounded-[3rem] border border-white/5 bg-black/20 px-8">
                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1DB954]/5 blur-[130px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_10px_#1DB954]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">The Private Archive</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-10"
                        >
                            MY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#1DB954] to-[#1DB954] italic">SANCTUARY</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-400 text-lg font-light leading-relaxed tracking-wide"
                        >
                            A collection of sound and light that defined your journey.
                            These are the resonance points you've chosen to keep close.
                        </motion.p>
                    </div>

                    {/* Collection Controls */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/10 flex items-center gap-8 shadow-2xl self-start md:self-auto"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Archive State</span>
                            <span className={`text-sm font-black tracking-wide ${isPublic ? 'text-[#1DB954]' : 'text-purple-400'}`}>
                                {isPublic ? 'PUBLIC FREQUENCY' : 'PRIVATE ECHO'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggleVisibility}
                            className={`relative w-16 h-9 rounded-full transition-all duration-700 p-1 ${isPublic ? 'bg-[#1DB954]' : 'bg-white/10'}`}
                        >
                            <div className={`w-7 h-7 bg-white rounded-full shadow-lg transition-transform duration-500 flex items-center justify-center ${isPublic ? 'translate-x-7' : 'translate-x-0'}`}>
                                {isPublic ? (
                                    <svg className="w-3 h-3 text-[#1DB954] fill-current" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                                ) : (
                                    <svg className="w-3 h-3 text-purple-600 fill-current" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" /></svg>
                                )}
                            </div>
                        </button>
                    </motion.div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : favorites.length > 0 ? (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.05 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
                >
                    {favorites.map((fav) => (
                        <SongCard
                            key={fav.id}
                            id={fav.song.id}
                            title={fav.song.title}
                            artist={fav.song.artist}
                            album_image={fav.song.album_image}
                            preview_url={fav.song.preview_url}
                        />
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        className="w-32 h-32 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-12"
                    >
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </motion.div>
                    <h3 className="text-3xl font-black text-white/40 mb-4 tracking-tighter uppercase italic">Your sanctuary is silent</h3>
                    <p className="text-gray-600 max-w-sm mx-auto font-medium leading-relaxed italic pr-4">Explore the frequency and tap the heart to save your resonance here.</p>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className="mt-12 px-12 py-4 bg-white text-black font-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-2xl"
                    >
                        START DISCOVERY
                    </button>
                </div>
            )}
        </div>
    );
}
