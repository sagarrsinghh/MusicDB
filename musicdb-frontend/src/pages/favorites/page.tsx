'use client';

import { useEffect, useState } from 'react';
import { favoriteService } from '@/services/favorite.service';
import { authService } from '@/services/auth.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';

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
        <div className="space-y-16 pb-32 text-retro-paper selection:bg-retro-gold selection:text-retro-black">
            <header className="relative py-20 border border-retro-paper/20 bg-retro-black/40 px-8 rounded-none">
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-retro-paper/5 border border-retro-paper/25 mb-8"
                        >
                            <span className="w-1.5 h-1.5 bg-retro-gold" />
                            <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-gray-500">The Private Archive</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-sans font-black text-retro-paper tracking-tighter leading-[0.8] mb-10 uppercase"
                        >
                            MY <br />
                            <span className="text-retro-gold italic font-serif">SANCTUARY</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-450 text-lg font-serif italic leading-relaxed tracking-wide"
                        >
                            A collection of sound and light that defined your journey.
                            These are the resonance points you've chosen to keep close.
                        </motion.p>
                    </div>

                    {/* Collection Controls */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-none bg-retro-black/40 border border-retro-paper/20 flex items-center gap-8 self-start md:self-auto"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Archive State</span>
                            <span className={`text-sm font-sans font-black tracking-wide ${isPublic ? 'text-retro-gold' : 'text-retro-accent'}`}>
                                {isPublic ? 'PUBLIC FREQUENCY' : 'PRIVATE ECHO'}
                            </span>
                        </div>
                        <button
                            onClick={handleToggleVisibility}
                            className={`px-4 py-2 border rounded-none text-xs font-sans font-black uppercase tracking-widest transition-all cursor-pointer ${isPublic ? 'bg-retro-gold text-retro-black border-retro-black hover:bg-retro-paper hover:text-retro-black' : 'bg-retro-paper/5 text-retro-paper border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold'}`}
                        >
                            {isPublic ? 'Make Private' : 'Make Public'}
                        </button>
                    </motion.div>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-retro-paper/5 rounded-none border border-retro-paper/10 animate-pulse" />
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
                <div className="flex flex-col items-center justify-center py-40 text-center border border-dashed border-retro-paper/20 rounded-none bg-retro-black/20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        className="w-24 h-24 rounded-none border border-dashed border-retro-paper/30 flex items-center justify-center mb-12 text-retro-paper"
                    >
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    </motion.div>
                    <h3 className="text-3xl font-sans font-black text-retro-paper/40 mb-4 tracking-tighter uppercase italic">Your sanctuary is silent</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-sans font-medium leading-relaxed italic pr-4">Explore the frequency and tap the heart to save your resonance here.</p>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className="mt-12 px-8 py-3 bg-retro-gold text-retro-black font-sans font-black rounded-none hover:bg-retro-paper hover:text-retro-black transition-all border border-retro-black uppercase text-xs tracking-wider cursor-pointer"
                    >
                        START DISCOVERY
                    </button>
                </div>
            )}
        </div>
    );
}
