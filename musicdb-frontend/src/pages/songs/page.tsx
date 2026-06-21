'use client';

import { useEffect, useState } from 'react';
import { songService } from '@/services/song.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Indie', 'Soul', 'R&B', 'Metal', 'Country', 'Classical', 'Ambient'];

const GENRE_ICONS: Record<string, string> = {
    Pop: '🎵', Rock: '🎸', 'Hip-Hop': '🎤', Electronic: '⚡', Jazz: '🎷',
    Indie: '🎹', Soul: '❤️', 'R&B': '🎶', Metal: '🔥', Country: '🤠', Classical: '🎻', Ambient: '🌊',
};

export default function SongsPage() {
    const [genreSongs, setGenreSongs] = useState<Record<string, any[]>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeGenre, setActiveGenre] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllGenres = async () => {
            setIsLoading(true);
            try {
                const results = await Promise.all(
                    GENRES.map(async (genre) => {
                        try {
                            const songs = await songService.getByGenre(genre);
                            return { genre, songs: Array.isArray(songs) ? songs : [] };
                        } catch {
                            return { genre, songs: [] };
                        }
                    })
                );
                const genreMap: Record<string, any[]> = {};
                results.forEach(({ genre, songs }) => {
                    if (songs.length > 0) genreMap[genre] = songs;
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

    const availableGenres = GENRES.filter((g) => genreSongs[g]?.length > 0);
    const displayGenres = activeGenre ? [activeGenre] : availableGenres;

    return (
        <div className="px-6 md:px-[48px] py-10 pb-28 space-y-8">
            {/* Compact Header */}
            <header className="border-b border-retro-paper/20 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-retro-gold" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">Full Library</span>
                </div>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-sans font-black text-retro-paper tracking-tighter leading-none">
                            Browse <span className="text-retro-gold italic font-serif">Music</span>
                        </h1>
                        <p className="text-gray-500 text-[10px] font-serif italic mt-1">
                            Every track in our archive, organized by genre.
                        </p>
                    </div>
                    <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                        {Object.values(genreSongs).reduce((a, b) => a + b.length, 0)} tracks across {availableGenres.length} genres
                    </span>
                </div>
            </header>

            {/* Genre Filter Pills */}
            {!isLoading && availableGenres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveGenre(null)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-sans font-black uppercase tracking-wider border transition-all cursor-pointer ${!activeGenre ? 'border-retro-gold text-retro-gold bg-retro-gold/5' : 'border-retro-paper/20 text-gray-400 hover:border-retro-paper/40 hover:text-retro-paper'}`}
                    >
                        All Genres
                    </button>
                    {availableGenres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-sans font-black uppercase tracking-wider border transition-all cursor-pointer ${activeGenre === genre ? 'border-retro-gold text-retro-gold bg-retro-gold/5' : 'border-retro-paper/20 text-gray-400 hover:border-retro-paper/40 hover:text-retro-paper'}`}
                        >
                            <span className="text-xs">{GENRE_ICONS[genre] || '🎵'}</span>
                            {genre}
                        </button>
                    ))}
                </div>
            )}

            {isLoading ? (
                <div className="space-y-12">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="space-y-4">
                            <div className="h-6 w-32 bg-retro-paper/5 animate-pulse border border-retro-paper/10" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-retro-paper/5 animate-pulse border border-retro-paper/10" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : Object.keys(genreSongs).length > 0 ? (
                <div className="space-y-16">
                    {displayGenres.map((genre) => (
                        genreSongs[genre]?.length > 0 && (
                            <section key={genre} className="space-y-6">
                                {/* Genre Section Header */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{GENRE_ICONS[genre] || '🎵'}</span>
                                    <h2 className="text-base font-serif font-black text-retro-paper tracking-tight uppercase italic">{genre}</h2>
                                    <div className="h-[1px] flex-1 bg-retro-paper/10" />
                                    <Link
                                        to={`/genre/${genre}`}
                                        className="text-[9px] font-black text-retro-gold hover:underline font-sans uppercase tracking-wider shrink-0"
                                    >
                                        View All ({genreSongs[genre].length}) →
                                    </Link>
                                </div>

                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
                                    }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                                >
                                    {genreSongs[genre].slice(0, 5).map((song) => (
                                        <motion.div
                                            key={song.id}
                                            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                                        >
                                            <SongCard
                                                id={song.id}
                                                title={song.title}
                                                artist={song.artist}
                                                album_image={song.album_image}
                                                preview_url={song.preview_url}
                                                average_rating={song.average_rating}
                                                rating_count={song.rating_count}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </section>
                        )
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <span className="text-4xl mb-4">🎵</span>
                    <h3 className="text-base font-sans font-black text-retro-paper/40 mb-2 tracking-tighter uppercase italic">Archive is empty</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-serif italic text-xs">No tracks available yet. Check back soon.</p>
                </div>
            )}
        </div>
    );
}
