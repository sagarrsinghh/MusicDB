'use client';

import { useEffect, useState } from 'react';
import { artistService, Artist } from '@/services/artist.service';
import Sidebar from '@/components/Sidebar';
import ArtistCard from '@/components/ArtistCard';
import { motion } from 'framer-motion';

export default function ArtistsPage() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const data = await artistService.getAll();
                setArtists(data);
            } catch (error) {
                console.error('Failed to fetch artists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen bg-retro-black text-retro-paper">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center font-sans tracking-widest uppercase text-sm animate-pulse text-retro-gold">
                    Recalibrating Archive Signals...
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-retro-black text-retro-paper selection:bg-retro-gold font-sans overflow-x-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <header className="px-8 md:px-16 pt-24 pb-12 border-b border-retro-paper/20">
                    <div className="max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-5 h-5 rounded-none bg-retro-gold border border-retro-black" />
                            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-retro-gold font-sans">Archive Curators</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-sans font-black tracking-tight leading-none mb-8 uppercase text-retro-paper">
                            The <span className="text-retro-gold font-serif italic">Artists</span>
                        </h1>
                        <p className="max-w-xl text-lg text-gray-400 font-serif italic border-l border-retro-gold/30 pl-6 leading-relaxed">
                            A curated selection of visionaries whose melodies define the archive's character.
                        </p>
                    </div>
                </header>

                <section className="p-8 md:p-16 max-w-[1600px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {artists.map((artist, index) => (
                            <motion.div
                                key={artist.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ArtistCard {...artist} />
                            </motion.div>
                        ))}
                    </div>

                    {artists.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-gray-500 italic font-serif">The archive is currently seeking its visionaries...</p>
                        </div>
                    )}
                </section>

                <footer className="py-24 border-t border-retro-paper/20 text-center bg-retro-black">
                    <h3 className="text-8xl md:text-[10rem] font-serif italic opacity-5 select-none pointer-events-none mb-8 text-retro-paper uppercase">MusicDB</h3>
                </footer>
            </main>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[999] bg-noise" />
        </div>
    );
}

