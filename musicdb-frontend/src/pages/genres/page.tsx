'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { songService } from '@/services/song.service';
import { motion } from 'framer-motion';

const GENRES = [
    { name: 'Pop', icon: '🎵', color: 'from-pink-900/30' },
    { name: 'Rock', icon: '🎸', color: 'from-red-900/30' },
    { name: 'Hip-Hop', icon: '🎤', color: 'from-purple-900/30' },
    { name: 'Electronic', icon: '⚡', color: 'from-cyan-900/30' },
    { name: 'Jazz', icon: '🎷', color: 'from-amber-900/30' },
    { name: 'Indie', icon: '🎹', color: 'from-green-900/30' },
    { name: 'Soul', icon: '❤️', color: 'from-rose-900/30' },
    { name: 'R&B', icon: '🎶', color: 'from-indigo-900/30' },
    { name: 'Metal', icon: '🔥', color: 'from-gray-900/30' },
    { name: 'Country', icon: '🤠', color: 'from-yellow-900/30' },
    { name: 'Classical', icon: '🎻', color: 'from-yellow-900/30' },
    { name: 'Ambient', icon: '🌊', color: 'from-blue-900/30' },
];

export default function GenresOverviewPage() {
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const results = await Promise.all(
                    GENRES.map(async ({ name }) => {
                        try {
                            const songs = await songService.getByGenre(name);
                            return { name, count: Array.isArray(songs) ? songs.length : 0 };
                        } catch {
                            return { name, count: 0 };
                        }
                    })
                );
                const map: Record<string, number> = {};
                results.forEach(({ name, count }) => { map[name] = count; });
                setCounts(map);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    return (
        <div className="px-6 md:px-[48px] py-10 pb-28 text-retro-paper">
            {/* Header */}
            <header className="mb-10 border-b border-retro-paper/20 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-retro-gold" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">Music Categories</span>
                </div>
                <h1 className="text-2xl font-sans font-black text-retro-paper tracking-tighter leading-none">
                    All <span className="text-retro-gold italic font-serif">Genres</span>
                </h1>
                <p className="text-gray-500 text-[10px] font-serif italic mt-1">
                    Explore the full spectrum of sound. Click a genre to dive in.
                </p>
            </header>

            {/* Genre Grid */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
                {GENRES.map(({ name, icon, color }) => (
                    <motion.div
                        key={name}
                        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                    >
                        <Link
                            to={`/genre/${name}`}
                            className={`group block bg-gradient-to-b ${color} to-retro-black border border-retro-paper/20 hover:border-retro-gold transition-all duration-300 p-5 text-center relative overflow-hidden`}
                        >
                            <span className="text-3xl block mb-3">{icon}</span>
                            <h2 className="font-sans font-black text-[10px] uppercase tracking-widest text-retro-paper group-hover:text-retro-gold transition-colors">
                                {name}
                            </h2>
                            {!loading && (
                                <p className="text-[9px] font-mono text-gray-600 mt-1">
                                    {counts[name] || 0} tracks
                                </p>
                            )}
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-retro-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Also show all songs link */}
            <div className="mt-12 text-center border-t border-retro-paper/10 pt-8">
                <p className="text-gray-500 font-serif italic text-xs mb-4">
                    Want to see everything at once?
                </p>
                <Link
                    to="/songs"
                    className="inline-block border border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold text-retro-paper font-sans font-black text-[9px] uppercase tracking-widest py-2.5 px-6 bg-retro-black transition-all"
                >
                    Browse All Music →
                </Link>
            </div>
        </div>
    );
}
