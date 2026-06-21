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
        <div className="px-6 md:px-[48px] py-10 pb-28 space-y-8">
            {/* Compact Header */}
            <header className="border-b border-retro-paper/20 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-retro-gold" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">Global Frequency</span>
                </div>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-sans font-black text-retro-paper tracking-tighter leading-none">
                            Top 50 <span className="text-retro-gold italic font-serif">Charts</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-serif italic mt-1">
                            Community-ranked tracks updated in real time.
                        </p>
                    </div>
                    <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                        {songs.length} tracks
                    </span>
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-retro-paper/5 animate-pulse border border-retro-paper/10" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {songs.map((song, index) => (
                        <motion.div
                            key={song.id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.025 }}
                            className="relative group"
                        >
                            {/* Rank Badge */}
                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-retro-black border border-retro-paper/20 flex items-center justify-center z-20 group-hover:border-retro-gold transition-colors duration-300">
                                <span className="text-[10px] font-black tracking-tight text-retro-paper group-hover:text-retro-gold transition-colors font-mono">
                                    {index + 1}
                                </span>
                            </div>
                            <SongCard
                                {...song}
                                artist={song.artist?.name || song.artist}
                                coverUrl={song.album_image}
                            />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
