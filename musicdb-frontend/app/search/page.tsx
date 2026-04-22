'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { songService } from '@/services/song.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';

function SearchResults() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
            performSearch(q);
        }
    }, [searchParams]);

    const performSearch = async (searchTerm: string) => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            const data = await songService.search(searchTerm);
            setResults(data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        performSearch(query);
    };

    return (
        <div className="space-y-12 pb-32">
            <header className="relative pt-10 pb-6 border-b border-white/5">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Global Search Core</span>
                        </motion.div>

                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                                Results for <span className="text-retro-gold font-serif">"{query}"</span>
                            </h1>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                                Scanning archive signals for matching frequencies
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-retro-gold transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search again..."
                            className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-retro-gold/30 focus:bg-white/10 transition-all"
                        />
                    </form>
                </div>
            </header>

            {loading ? (
                <div className="space-y-10">
                    <div className="flex items-center gap-4 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-retro-gold/30 border-t-retro-gold rounded-full animate-spin" />
                        </div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest italic">Synchronizing with global satellites...</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 opacity-50">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white/5 rounded-[2rem] border border-white/5" />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-12">
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                            {results.map((song) => (
                                <SongCard
                                    key={song.id}
                                    id={song.id}
                                    title={song.title}
                                    artist={song.artist}
                                    album_image={song.album_image}
                                    preview_url={song.preview_url}
                                />
                            ))}
                        </div>
                    ) : query && (
                        <div className="py-40 text-center flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-10 text-gray-700">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 9.172L5.636 5.636m3.536 9.172l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <h3 className="text-3xl font-black text-white/30 mb-4 tracking-tighter uppercase italic">Signal Lost in Deep Space</h3>
                            <p className="text-gray-600 max-w-sm mx-auto font-medium leading-relaxed italic border-t border-white/5 pt-4">
                                No musical frequencies detected for "{query}". <br />
                                Try adjusting your coordinates.
                            </p>
                        </div>
                    )}

                    {!query && (
                        <div className="py-40 text-center opacity-40">
                            <div className="inline-block p-4 rounded-full border border-dashed border-white/20 mb-6">
                                <div className="w-2 h-2 rounded-full bg-retro-gold" />
                            </div>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] italic text-xs">Awaiting Transmission Coordinates...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}
