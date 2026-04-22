'use client';

import { useEffect, useState } from 'react';
import { songService } from '@/services/song.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';

export default function SongsPage() {
    const [genreSongs, setGenreSongs] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Indie', 'Soul', 'R&B', 'Metal', 'Country', 'Classical'];

    useEffect(() => {
        const fetchAllGenres = async () => {
            setIsLoading(true);
            try {
                const results = await Promise.all(
                    genres.map(async (genre) => {
                        try {
                            const songs = await songService.getByGenre(genre);
                            return { genre, songs: Array.isArray(songs) ? songs : [] };
                        } catch (e) {
                            return { genre, songs: [] };
                        }
                    })
                );

                const genreMap: Record<string, any[]> = {};
                results.forEach(({ genre, songs }) => {
                    if (songs.length > 0) {
                        genreMap[genre] = songs;
                    }
                });
                setGenreSongs(genreMap);
            } catch (error) {
                console.error('Failed to fetch songs by genre', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllGenres();
    }, []);

    return (
        <div className="space-y-16 pb-32">
            <header className="relative py-20 overflow-hidden rounded-[3rem] border border-white/5 bg-black/20 px-8">
                {/* Ambient Glows */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 translate-x-1/4" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_10px_#1DB954]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">The Infinite Stream</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-10 text-center md:text-left"
                    >
                        SONG <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#1DB954] to-blue-500 italic uppercase">EXPANSION</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 text-lg font-light leading-relaxed tracking-wide max-w-2xl"
                    >
                        Behold the full spectrum of our musical universe. Every frequency,
                        every signal, and every echo captured within the MusicDB archive—waiting
                        for your witness.
                    </motion.p>
                </div>
            </header>

            {isLoading ? (
                <div className="space-y-20">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="space-y-8">
                            <div className="h-10 w-48 bg-white/5 animate-pulse rounded-lg" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : Object.keys(genreSongs).length > 0 ? (
                <div className="space-y-24">
                    {genres.map((genre) => (
                        genreSongs[genre] && genreSongs[genre].length > 0 && (
                            <section key={genre} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">{genre}</h2>
                                    <div className="h-[2px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-[0.4em]">{genreSongs[genre].length} Signals</span>
                                </div>
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
                                    {genreSongs[genre].map((song) => (
                                        <SongCard
                                            key={song.id}
                                            id={song.id}
                                            title={song.title}
                                            artist={song.artist}
                                            album_image={song.album_image}
                                            preview_url={song.preview_url}
                                        />
                                    ))}
                                </motion.div>
                            </section>
                        )
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.1, scale: 1 }}
                        className="w-32 h-32 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-12"
                    >
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    </motion.div>
                    <h3 className="text-3xl font-black text-white/40 mb-4 tracking-tighter uppercase italic">The archive is silent</h3>
                    <p className="text-gray-600 max-w-sm mx-auto font-medium leading-relaxed italic pr-4">We are currently recalibrating our frequencies. Check back later for new signals.</p>
                </div>
            )}
        </div>
    );
}
