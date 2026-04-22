'use client';

import { useEffect, useState } from 'react';
import { songService } from '@/services/song.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';

export default function ChartsPage() {
    const [songs, setSongs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCharts();
    }, []);

    const fetchCharts = async () => {
        try {
            const data = await songService.getTop50();
            setSongs(data);
        } catch (error) {
            console.error('Failed to fetch charts', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-16 pb-32">
            <header className="relative py-20 overflow-hidden rounded-[3rem] border border-white/5 bg-black/20 px-8">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DB954]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_10px_#1DB954]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">The Global Frequency</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-10"
                    >
                        COMMUNIT<span className="text-transparent bg-clip-text bg-gradient-to-t from-white/20 to-white/5">Y</span> <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-emerald-500 italic">TOP 50</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-400 max-w-2xl text-lg font-light leading-relaxed tracking-wide"
                    >
                        The definitive list of resonance. Witness the tracks currently guiding the MusicDB collective
                        through the darkness, updated in real-time as the frequency shifts.
                    </motion.p>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {songs.map((song, index) => (
                        <motion.div
                            key={song.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="relative group"
                        >
                            {/* Rank Badge with Glow */}
                            <div className="absolute -top-6 -left-6 w-16 h-16 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex items-center justify-center z-20 shadow-2xl group-hover:border-[#1DB954]/50 group-hover:shadow-[0_0_20px_rgba(29,185,84,0.2)] transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1DB954]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="text-2xl font-black tracking-tighter text-white/90 group-hover:text-[#1DB954] transition-colors relative z-10">
                                    {index + 1}
                                </span>
                            </div>

                            <SongCard
                                {...song}
                                artist={song.artist?.name}
                                coverUrl={song.album_image}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
