'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { songService } from '@/services/song.service';
import SongCard from '@/components/SongCard';
import { motion } from 'framer-motion';

const GENRE_META: Record<string, { icon: string; color: string; desc: string; related: string[] }> = {
    Electronic: {
        icon: '⚡',
        color: 'from-cyan-900/40 to-retro-black',
        desc: 'Synthesized soundscapes, drum machines, and digital frequencies from the underground.',
        related: ['Ambient', 'Pop', 'Hip-Hop'],
    },
    Rock: {
        icon: '🎸',
        color: 'from-red-900/40 to-retro-black',
        desc: 'Guitar-driven anthems and raw energy — from classic riffs to modern stadium sound.',
        related: ['Indie', 'Metal', 'Classical'],
    },
    Ambient: {
        icon: '🌊',
        color: 'from-blue-900/40 to-retro-black',
        desc: 'Atmospheric textures and slow-moving soundscapes for deep listening.',
        related: ['Electronic', 'Classical', 'Jazz'],
    },
    Jazz: {
        icon: '🎷',
        color: 'from-amber-900/40 to-retro-black',
        desc: 'Improvised harmonics, bebop rhythms, and soul-drenched melodies.',
        related: ['Soul', 'Classical', 'R&B'],
    },
    Pop: {
        icon: '🎵',
        color: 'from-pink-900/40 to-retro-black',
        desc: 'Catchy hooks and polished productions dominating the global frequency.',
        related: ['Electronic', 'R&B', 'Hip-Hop'],
    },
    'Hip-Hop': {
        icon: '🎤',
        color: 'from-purple-900/40 to-retro-black',
        desc: 'Beats, rhymes, and the cultural pulse of streets worldwide.',
        related: ['R&B', 'Soul', 'Electronic'],
    },
    Soul: {
        icon: '❤️',
        color: 'from-rose-900/40 to-retro-black',
        desc: 'Deep emotion, gospel roots, and voices that carry the weight of the world.',
        related: ['R&B', 'Jazz', 'Hip-Hop'],
    },
    Indie: {
        icon: '🎹',
        color: 'from-green-900/40 to-retro-black',
        desc: 'Independent artists charting their own course outside the mainstream.',
        related: ['Rock', 'Pop', 'Electronic'],
    },
    Classical: {
        icon: '🎻',
        color: 'from-yellow-900/40 to-retro-black',
        desc: 'Orchestral compositions spanning centuries of human musical achievement.',
        related: ['Jazz', 'Ambient', 'Soul'],
    },
    'R&B': {
        icon: '🎶',
        color: 'from-indigo-900/40 to-retro-black',
        desc: 'Rhythm and blues — groove-heavy tracks and silky vocal performances.',
        related: ['Soul', 'Hip-Hop', 'Pop'],
    },
};

const DEFAULT_META = {
    icon: '🎵',
    color: 'from-gray-900/40 to-retro-black',
    desc: 'A curated collection of tracks from this genre in the MusicDB archive.',
    related: ['Pop', 'Rock', 'Electronic'],
};

export default function GenrePage() {
    const { genreName } = useParams<{ genreName: string }>();
    const navigate = useNavigate();
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'rating' | 'title'>('rating');

    const meta = genreName ? (GENRE_META[genreName] || DEFAULT_META) : DEFAULT_META;

    useEffect(() => {
        const fetchGenreSongs = async () => {
            if (!genreName) return;
            setLoading(true);
            try {
                const data = await songService.getByGenre(genreName);
                setSongs(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(`Failed to load songs for genre ${genreName}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchGenreSongs();
    }, [genreName]);

    const sortedSongs = [...songs].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0);
    });

    const topArtists = Array.from(
        new Map(songs.map((s) => [s.artist?.id || s.artist, s.artist])).values()
    ).filter(Boolean).slice(0, 5);

    const avgRating = songs.length > 0
        ? (songs.reduce((acc, s) => acc + (Number(s.average_rating) || 0), 0) / songs.length).toFixed(1)
        : '—';

    return (
        <div className="flex-grow flex flex-col text-retro-paper selection:bg-retro-gold selection:text-retro-black">
            {/* Hero Banner */}
            <div className={`relative overflow-hidden bg-gradient-to-b ${meta.color} border-b border-retro-paper/10 px-8 md:px-[48px] py-10`}>
                {/* Back nav */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-[9px] font-sans font-black uppercase tracking-widest text-gray-500 hover:text-retro-gold transition-colors cursor-pointer mb-6"
                >
                    ← Back to Archive
                </button>

                <div className="flex items-end gap-6 flex-wrap">
                    {/* Genre Icon Box */}
                    <div className="w-24 h-24 border border-retro-paper/20 bg-retro-black/60 flex items-center justify-center rounded-none shrink-0">
                        <span className="text-5xl">{meta.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-1.5 h-1.5 bg-retro-gold" />
                            <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">Genre Archive</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-retro-paper uppercase italic tracking-tight leading-none mb-3">
                            {genreName || 'Genre'}
                        </h1>
                        <p className="font-serif italic text-xs text-gray-400 max-w-lg leading-relaxed">
                            {meta.desc}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 shrink-0">
                        <div className="text-center">
                            <div className="text-2xl font-serif font-black text-retro-gold">{songs.length}</div>
                            <div className="text-[9px] font-sans font-black uppercase tracking-widest text-gray-500">Tracks</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-serif font-black text-retro-gold">{avgRating}</div>
                            <div className="text-[9px] font-sans font-black uppercase tracking-widest text-gray-500">Avg Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-serif font-black text-retro-gold">{topArtists.length}</div>
                            <div className="text-[9px] font-sans font-black uppercase tracking-widest text-gray-500">Artists</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 md:px-[48px] py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-48 shrink-0 space-y-6">
                    {/* Sort */}
                    <div>
                        <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest mb-2">Sort By</h3>
                        <div className="flex flex-col gap-1.5">
                            {[
                                { key: 'rating', label: 'Top Rated' },
                                { key: 'title', label: 'A–Z Title' },
                            ].map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => setSortBy(opt.key as any)}
                                    className={`text-left text-[10px] font-sans font-black uppercase tracking-wider px-3 py-2 border transition-all cursor-pointer ${sortBy === opt.key ? 'border-retro-gold text-retro-gold bg-retro-gold/5' : 'border-retro-paper/20 text-gray-400 hover:border-retro-paper/40 hover:text-retro-paper'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Related Genres */}
                    <div>
                        <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest mb-2">Related Genres</h3>
                        <div className="flex flex-col gap-1.5">
                            {meta.related.map((g) => (
                                <Link
                                    key={g}
                                    to={`/genre/${g}`}
                                    className="flex items-center gap-2 text-[10px] font-sans font-bold text-gray-400 hover:text-retro-gold transition-colors group px-3 py-2 border border-retro-paper/10 hover:border-retro-gold/30"
                                >
                                    <span>{GENRE_META[g]?.icon || '🎵'}</span>
                                    <span>{g}</span>
                                    <span className="ml-auto opacity-0 group-hover:opacity-100 text-[9px]">→</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Back to Archive */}
                    <Link
                        to="/"
                        className="block text-center text-[9px] font-sans font-black uppercase tracking-widest text-gray-500 hover:text-retro-gold border border-retro-paper/20 hover:border-retro-gold/30 px-3 py-2 transition-all"
                    >
                        ← All Genres
                    </Link>
                </aside>

                {/* Song Grid */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between border-b border-retro-paper/20 pb-3 mb-6">
                        <h2 className="font-sans font-black text-sm uppercase tracking-tight text-retro-paper">
                            {sortedSongs.length} {sortedSongs.length === 1 ? 'Track' : 'Tracks'} Found
                        </h2>
                        <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                            {genreName?.toUpperCase()} COLLECTION
                        </span>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-retro-paper/5 animate-pulse border border-retro-paper/10" />
                            ))}
                        </div>
                    ) : sortedSongs.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {sortedSongs.map((song) => (
                                <motion.div
                                    key={song.id}
                                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
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
                    ) : (
                        <div className="py-20 text-center border border-dashed border-retro-paper/20 bg-retro-black/40 flex flex-col items-center justify-center">
                            <span className="text-4xl mb-4">{meta.icon}</span>
                            <h3 className="text-sm font-sans font-black text-retro-paper uppercase tracking-tight mb-2">
                                No Tracks Found
                            </h3>
                            <p className="text-gray-500 font-serif italic text-xs max-w-xs mx-auto mb-6">
                                We haven't cataloged any {genreName} tracks yet. Check back soon.
                            </p>
                            <Link
                                to="/"
                                className="border border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold text-retro-paper font-sans font-black text-[9px] uppercase tracking-widest py-2.5 px-5 bg-retro-black transition-all"
                            >
                                Return to Archive
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
