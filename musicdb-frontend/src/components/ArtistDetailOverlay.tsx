'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';
import { useEffect, useState } from 'react';
import { artistService } from '@/services/artist.service';
import SongCard from './SongCard';

export default function ArtistDetailOverlay() {
    const { selectedArtist, setSelectedArtist, setSelectedSong } = useUIStore();
    const [fullArtist, setFullArtist] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedArtist) {
            fetchArtistDetails();
        } else {
            setFullArtist(null);
        }
    }, [selectedArtist]);

    const fetchArtistDetails = async () => {
        if (!selectedArtist) return;
        setIsLoading(true);
        try {
            // We use the ID if it's a local number, or spotify_id if it's a string
            const id = selectedArtist.id || selectedArtist.spotify_id;
            const data = await artistService.getById(id.toString());
            setFullArtist(data);
        } catch (error) {
            console.error('Failed to fetch artist details', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!selectedArtist) return null;

    return (
        <AnimatePresence>
            {selectedArtist && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 lg:p-12"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedArtist(null)}
                        className="absolute inset-0 bg-retro-black/95"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        className="relative w-full max-w-7xl h-full md:h-[90vh] bg-retro-black border-2 border-retro-paper rounded-none overflow-hidden flex flex-col z-10"
                    >
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedArtist(null)}
                            className="absolute top-8 right-8 z-50 p-2.5 text-gray-500 hover:text-retro-gold bg-retro-black rounded-none border border-retro-paper/20 hover:border-retro-gold transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </motion.button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Hero Header */}
                            <div className="relative h-[400px] w-full flex items-end p-8 md:p-16 border-b border-retro-paper/20">
                                <img
                                    src={fullArtist?.image_url || selectedArtist.image_url}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 rounded-none"
                                    alt={selectedArtist.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-retro-black via-retro-black/40 to-transparent" />

                                <div className="relative z-10 w-full">
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-retro-gold/10 border border-retro-gold/30 text-retro-gold text-[10px] font-black uppercase tracking-widest mb-4 font-sans"
                                    >
                                        <span className="w-1.5 h-1.5 bg-retro-gold" />
                                        Verified Database Registry
                                    </motion.span>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-5xl md:text-7xl lg:text-8xl font-sans font-black text-retro-paper tracking-tight leading-none mb-4 uppercase"
                                    >
                                        {selectedArtist.name}
                                    </motion.h1>
                                    <div className="flex flex-wrap gap-2">
                                        {fullArtist?.genres?.map((genre: string, i: number) => (
                                            <span key={i} className="text-xs font-bold text-retro-paper/70 border border-retro-paper/20 px-4 py-1 bg-retro-black/40 rounded-none font-sans uppercase tracking-wider">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                                {/* Left: Local Discography */}
                                <div className="lg:col-span-2 space-y-12">
                                    <section>
                                        <h2 className="text-xl font-black text-retro-paper mb-8 flex items-center gap-3 font-sans uppercase">
                                            <span className="text-retro-gold font-mono">💿</span>
                                            Local Collection
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {fullArtist?.songs?.map((song: any) => (
                                                <SongCard key={song.id} {...song} artist={selectedArtist.name} />
                                            ))}
                                            {(!fullArtist?.songs || fullArtist.songs.length === 0) && (
                                                <div className="col-span-full py-12 text-center bg-retro-black/40 rounded-none border border-dashed border-retro-paper/20">
                                                    <p className="text-gray-500 font-serif italic">No songs logged under this profile yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-black text-retro-paper mb-8 flex items-center gap-3 font-sans uppercase">
                                            <span className="text-retro-gold font-mono">📁</span>
                                            Spotify Releases
                                        </h2>
                                        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth custom-scrollbar">
                                            {fullArtist?.albums?.map((album: any) => (
                                                <div key={album.id} className="min-w-[200px] group cursor-default">
                                                    <div className="aspect-square rounded-none overflow-hidden mb-4 border border-retro-paper/25 relative shadow-none">
                                                        <img src={album.images[0]?.url} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 rounded-none" alt={album.name} />
                                                        <div className="absolute inset-0 bg-retro-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="p-3 bg-retro-gold text-retro-black border border-retro-black font-sans text-xs uppercase font-black hover:bg-retro-gold/80 transition-colors">
                                                                Listen
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-retro-paper font-sans uppercase font-black truncate group-hover:text-retro-gold transition-colors">{album.name}</h3>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest font-sans">{album.release_date.split('-')[0]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Related Artists & Stats */}
                                <div className="space-y-12">
                                    <section className="bg-retro-black/40 p-6 border border-retro-paper/20 rounded-none">
                                        <h3 className="text-lg font-black text-retro-paper mb-8 flex items-center gap-3 font-sans uppercase">
                                            <span className="text-retro-gold font-mono">📈</span>
                                            Artist Velocity
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 font-sans">
                                                    <span className="text-gray-500">Global Popularity</span>
                                                    <span className="text-retro-gold">{fullArtist?.popularity || 0}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-retro-paper/10 border border-retro-paper/20 rounded-none overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${fullArtist?.popularity || 0}%` }}
                                                        className="h-full bg-retro-gold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-retro-black/30 p-4 border border-retro-paper/10 rounded-none">
                                                    <span className="text-[8px] text-gray-500 block uppercase font-black tracking-widest mb-1 font-sans">Database Records</span>
                                                    <span className="text-retro-paper font-sans uppercase font-black text-sm">{fullArtist?.songs?.length || 0}</span>
                                                </div>
                                                <div className="bg-retro-black/30 p-4 border border-retro-paper/10 rounded-none">
                                                    <span className="text-[8px] text-gray-500 block uppercase font-black tracking-widest mb-1 font-sans">Influence Index</span>
                                                    <span className="text-retro-paper font-sans uppercase font-black text-sm">{fullArtist?.popularity > 80 ? 'Legend' : 'Catalyst'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-black text-retro-paper mb-6 flex items-center gap-3 font-sans uppercase">
                                            <span className="text-retro-gold font-mono">🤝</span>
                                            Related Profiles
                                        </h3>
                                        <div className="space-y-4">
                                            {fullArtist?.relatedArtists?.slice(0, 5).map((related: any) => (
                                                <motion.div
                                                    key={related.id}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => setSelectedArtist(related)}
                                                    className="flex items-center gap-4 bg-retro-black/40 p-4 border border-retro-paper/20 hover:border-retro-gold rounded-none cursor-pointer transition-all duration-300 group"
                                                >
                                                    <img src={related.images[0]?.url} className="w-12 h-12 rounded-none object-cover border border-retro-paper/20 grayscale group-hover:grayscale-0 transition-all duration-300" alt={related.name} />
                                                    <div>
                                                        <h4 className="text-retro-paper font-sans uppercase font-black group-hover:text-retro-gold transition-colors">{related.name}</h4>
                                                        <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest font-sans">{related.genres[0] || 'Musician'}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

