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
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        className="relative w-full max-w-7xl h-full md:h-[90vh] bg-[#0c0c0c] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/5 flex flex-col"
                    >
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedArtist(null)}
                            className="absolute top-8 right-8 z-50 p-3 text-gray-500 hover:text-white bg-white/5 rounded-full backdrop-blur-md border border-white/10 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </motion.button>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Hero Header */}
                            <div className="relative h-[400px] w-full flex items-end p-8 md:p-16">
                                <img
                                    src={fullArtist?.image_url || selectedArtist.image_url}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                    alt={selectedArtist.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent" />

                                <div className="relative z-10 w-full">
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-retro-gold/10 border border-retro-gold/30 text-retro-gold text-[10px] font-black uppercase tracking-widest mb-4 font-serif italic"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-retro-gold animate-pulse" />
                                        Verified Cinematic Record
                                    </motion.span>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white tracking-tighter leading-none mb-4"
                                    >
                                        {selectedArtist.name}
                                    </motion.h1>
                                    <div className="flex flex-wrap gap-3">
                                        {fullArtist?.genres?.map((genre: string, i: number) => (
                                            <span key={i} className="text-xs font-bold text-gray-400 border border-white/10 px-4 py-1 rounded-full bg-white/5">
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
                                        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                            <span className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center text-lg">💿</span>
                                            Local Collection
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {fullArtist?.songs?.map((song: any) => (
                                                <SongCard key={song.id} {...song} artist={selectedArtist.name} />
                                            ))}
                                            {(!fullArtist?.songs || fullArtist.songs.length === 0) && (
                                                <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                    <p className="text-gray-500 font-bold italic">Discovery in progress. Check back soon for engraved tracks.</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                            <span className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center text-lg">📁</span>
                                            Spotify Albums
                                        </h2>
                                        <div className="flex gap-6 overflow-x-auto pb-6 scroll-smooth custom-scrollbar">
                                            {fullArtist?.albums?.map((album: any) => (
                                                <div key={album.id} className="min-w-[200px] group cursor-pointer">
                                                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative shadow-xl">
                                                        <img src={album.images[0]?.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={album.name} />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#1DB954] rounded-full text-black">
                                                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306c-.22.363-.695.474-1.058.254-2.88-1.758-6.505-2.157-10.774-1.18-.414.095-.826-.164-.92-.578-.096-.414.162-.827.577-.921 4.673-1.07 8.667-.611 11.86 1.34.364.221.475.696.255 1.059zm1.465-3.263c-.276.45-.86.594-1.31.32-3.298-2.028-8.324-2.617-12.217-1.436-.508.152-1.04-.142-1.194-.65-.152-.51.144-1.04.651-1.193 4.455-1.352 10.004-.694 13.75 1.606.452.277.595.86.32 1.31zm.128-3.414c-3.957-2.35-10.474-2.565-14.26-1.416-.606.185-1.246-.166-1.431-.772-.185-.607.166-1.247.772-1.432 4.348-1.32 11.536-1.066 16.082 1.631.545.324.726 1.033.402 1.579-.324.545-1.033.726-1.579.402z" /></svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-white font-bold truncate group-hover:text-[#1DB954] transition-colors">{album.name}</h3>
                                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{album.release_date.split('-')[0]}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Related Artists & Stats */}
                                <div className="space-y-12">
                                    <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                                        <h3 className="text-white text-xl font-black mb-8 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-sm">📈</span>
                                            Artist Velocity
                                        </h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                    <span className="text-gray-500">Global Popularity</span>
                                                    <span className="text-[#1DB954]">{fullArtist?.popularity || 0}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${fullArtist?.popularity || 0}%` }}
                                                        className="h-full bg-gradient-to-r from-[#1DB954] to-emerald-400"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                    <span className="text-[8px] text-gray-500 block uppercase font-black mb-1">Engraved Hits</span>
                                                    <span className="text-white font-black">{fullArtist?.songs?.length || 0}</span>
                                                </div>
                                                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                    <span className="text-[8px] text-gray-500 block uppercase font-black mb-1">Influence</span>
                                                    <span className="text-white font-black">{fullArtist?.popularity > 80 ? 'Legend' : 'Rising'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm">🤝</span>
                                            Related Profiles
                                        </h3>
                                        <div className="space-y-4">
                                            {fullArtist?.relatedArtists?.slice(0, 5).map((related: any) => (
                                                <motion.div
                                                    key={related.id}
                                                    whileHover={{ x: 10 }}
                                                    onClick={() => setSelectedArtist(related)}
                                                    className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all group"
                                                >
                                                    <img src={related.images[0]?.url} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={related.name} />
                                                    <div>
                                                        <h4 className="text-white font-bold group-hover:text-[#1DB954] transition-colors">{related.name}</h4>
                                                        <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{related.genres[0] || 'Musician'}</span>
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
