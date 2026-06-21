'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { songService } from '@/services/song.service';
import { artistService } from '@/services/artist.service';
import { useUIStore } from '@/store/ui.store';
import SongCard from '@/components/SongCard';

const GENRES = ['Electronic', 'Rock', 'Ambient', 'Jazz', 'Pop', 'Hip-Hop', 'Soul', 'Indie', 'Classical', 'R&B'];

const GENRE_ICONS: Record<string, string> = {
    Electronic: '⚡',
    Rock: '🎸',
    Ambient: '🌊',
    Jazz: '🎷',
    Pop: '🎵',
    'Hip-Hop': '🎤',
    Soul: '❤️',
    Indie: '🎹',
    Classical: '🎻',
    'R&B': '🎶',
};

export default function Home() {
    const navigate = useNavigate();
    const [allSongs, setAllSongs] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editorSong, setEditorSong] = useState<any>(null);

    // Filters state
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedEra, setSelectedEra] = useState<string | null>(null);
    const [minScore, setMinScore] = useState<number>(0);
    const [sortBy, setSortBy] = useState<'title' | 'score'>('score');

    const { setSelectedSong } = useUIStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [songsData, artistsData] = await Promise.allSettled([
                    songService.getAll(),
                    artistService.getAll()
                ]);

                const songsList = songsData.status === 'fulfilled' ? songsData.value : [];
                const artistsList = artistsData.status === 'fulfilled' ? artistsData.value : [];

                const songsArray = Array.isArray(songsList) ? songsList : [];
                setAllSongs(songsArray);
                setArtists(Array.isArray(artistsList) ? artistsList.slice(0, 5) : []);

                // Pick Editor's Choice: try to find "Nadan Parindey" / Mohit Chauhan first, else top rated
                if (songsArray.length > 0) {
                    const nadanParindey = songsArray.find((s: any) =>
                        s.title?.toLowerCase().includes('nadan') ||
                        (s.artist?.name || s.artist || '').toLowerCase().includes('mohit')
                    );
                    if (nadanParindey) {
                        setEditorSong(nadanParindey);
                    } else {
                        const sorted = [...songsArray].sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));
                        setEditorSong(sorted[0]);
                    }
                }
            } catch (err) {
                console.error('Failed to load home page data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter & Sort Logic
    const filteredSongs = useMemo(() => {
        return allSongs
            .filter((song) => {
                if (selectedGenres.length > 0) {
                    const songGenre = song.genre || '';
                    const matchesGenre = selectedGenres.some(
                        (g) => songGenre.toLowerCase().includes(g.toLowerCase())
                    );
                    if (!matchesGenre) return false;
                }
                if (selectedEra) {
                    const releaseYear = song.release_date ? new Date(song.release_date).getFullYear() : 0;
                    if (selectedEra === '2020s' && releaseYear < 2020) return false;
                    if (selectedEra === '2010s' && (releaseYear < 2010 || releaseYear >= 2020)) return false;
                    if (selectedEra === '2000s' && (releaseYear < 2000 || releaseYear >= 2010)) return false;
                    if (selectedEra === '1990s' && (releaseYear < 1990 || releaseYear >= 2000)) return false;
                }
                const ratingValue = Number(song.average_rating) || 0;
                const convertedMin = minScore / 20;
                if (ratingValue < convertedMin) return false;
                return true;
            })
            .sort((a, b) => {
                if (sortBy === 'title') return a.title.localeCompare(b.title);
                return (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0);
            });
    }, [allSongs, selectedGenres, selectedEra, minScore, sortBy]);

    // Top Tracks: top 3
    const topTracks = useMemo(() => filteredSongs.slice(0, 3), [filteredSongs]);

    // Song Index: tracks 4 to 10
    const songIndexItems = useMemo(() => filteredSongs.slice(3, 10), [filteredSongs]);

    // Genre showcase or curated picks
    const displayGenreSongs = useMemo(() => {
        if (selectedGenres.length > 0) return filteredSongs;
        const sorted = [...allSongs].sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));
        return sorted.slice(0, 8);
    }, [allSongs, filteredSongs, selectedGenres]);

    const handleGenreChange = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleEraToggle = (era: string) => {
        setSelectedEra((prev) => (prev === era ? null : era));
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center text-retro-gold font-sans tracking-widest uppercase animate-pulse text-xs">
                Loading your music feed...
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col md:flex-row px-6 md:px-[48px] gap-[24px] py-[80px] text-retro-paper selection:bg-retro-gold selection:text-retro-black relative">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-56 flex-shrink-0 flex flex-col gap-6 border-r border-retro-paper/10 pr-6">
                <div className="border-b border-retro-paper/20 pb-2">
                    <h2 className="font-sans font-black uppercase text-retro-gold text-[10px] tracking-widest">Filters</h2>
                </div>

                {/* Genre Filter */}
                <div className="flex flex-col gap-2.5">
                    <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">Genre</h3>
                    <div className="flex flex-col gap-1.5">
                        {GENRES.slice(0, 6).map((genre) => (
                            <div key={genre} className="flex items-center justify-between w-full group">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedGenres.includes(genre)}
                                        onChange={() => handleGenreChange(genre)}
                                        className="appearance-none w-3.5 h-3.5 border border-retro-paper/30 bg-transparent rounded-none checked:bg-retro-gold checked:border-retro-black cursor-pointer focus:ring-0 focus:ring-offset-0"
                                    />
                                    <span className="text-xs font-sans font-bold text-retro-paper hover:text-retro-gold transition-colors">
                                        {genre}
                                    </span>
                                </label>
                                <Link
                                    to={`/genre/${genre}`}
                                    className="text-[9px] text-retro-gold hover:underline font-bold uppercase tracking-wider font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    →
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Era Filter */}
                <div className="flex flex-col gap-2.5">
                    <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">Era</h3>
                    <div className="grid grid-cols-2 gap-1.5">
                        {['2020s', '2010s', '2000s', '1990s'].map((era) => {
                            const isActive = selectedEra === era;
                            return (
                                <button
                                    key={era}
                                    onClick={() => handleEraToggle(era)}
                                    className={`border font-sans font-black text-[9px] py-1.5 transition-colors cursor-pointer tracking-wider ${isActive ? 'border-retro-gold bg-retro-gold/10 text-retro-gold' : 'border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold'}`}
                                >
                                    {era}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Score Filter */}
                <div className="flex flex-col gap-2.5">
                    <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">Min Rating</h3>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full accent-retro-gold h-[2px] bg-retro-paper/10 rounded-none appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-sans font-black text-gray-500">
                        <span>0.0</span>
                        <span>{(minScore / 20).toFixed(1)}+ ★</span>
                    </div>
                </div>

                {/* Quick Genre Links */}
                <div className="border-t border-retro-paper/10 pt-4">
                    <h3 className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest mb-3">Explore Genres</h3>
                    <div className="flex flex-col gap-1.5">
                        {GENRES.slice(0, 8).map((genre) => (
                            <Link
                                key={genre}
                                to={`/genre/${genre}`}
                                className="flex items-center gap-2 text-[10px] font-sans font-bold text-gray-400 hover:text-retro-gold transition-colors group"
                            >
                                <span className="text-xs">{GENRE_ICONS[genre] || '🎵'}</span>
                                <span>{genre}</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-retro-gold text-[9px]">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Page Header */}
                <div className="border-b border-retro-paper/20 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="font-serif text-4xl md:text-5xl font-black text-retro-paper leading-none mb-2 uppercase italic">Music Feed</h1>
                        <p className="font-serif text-xs text-gray-500 italic">
                            "Music has a way of finding you even in the darkest of places."
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSortBy('title')}
                            className={`font-sans font-black text-[9px] uppercase tracking-wider pb-1 cursor-pointer border-b transition-all ${sortBy === 'title' ? 'text-retro-gold border-retro-gold' : 'text-gray-500 border-transparent hover:text-retro-paper'}`}
                        >
                            A–Z
                        </button>
                        <button
                            onClick={() => setSortBy('score')}
                            className={`font-sans font-black text-[9px] uppercase tracking-wider pb-1 cursor-pointer border-b transition-all ${sortBy === 'score' ? 'text-retro-gold border-retro-gold' : 'text-gray-500 border-transparent hover:text-retro-paper'}`}
                        >
                            Top Rated
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Hero Quote + Top Tracks */}
                    <div className="lg:col-span-7 space-y-10">
                        {/* Hero Box */}
                        <div className="border border-retro-paper/20 bg-retro-black/40 p-6 rounded-none flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full border border-retro-paper/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-retro-gold font-sans font-black text-[9px] uppercase tracking-[0.3em]">MUSIC FEED</h3>
                                <p className="font-serif text-xl md:text-2xl italic text-retro-paper leading-relaxed border-l-2 border-retro-gold/30 pl-5">
                                    "Music has a way of finding you even in the darkest of places."
                                </p>
                                <p className="text-[9px] font-sans font-black text-gray-500 tracking-widest uppercase">— RESONANCE FREQUENCY</p>
                            </div>
                            <button
                                onClick={() => document.getElementById('top-tracks')?.scrollIntoView({ behavior: 'smooth' })}
                                className="relative z-10 self-start border border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold text-retro-paper font-sans font-black text-[9px] uppercase tracking-widest py-2.5 px-5 bg-retro-black rounded-none cursor-pointer mt-6 transition-all"
                            >
                                EXPLORE THE ARCHIVE
                            </button>
                        </div>

                        {/* Top Tracks */}
                        <section id="top-tracks" className="space-y-5">
                            <div className="flex justify-between items-baseline border-b border-retro-paper/20 pb-2.5">
                                <h2 className="font-serif text-xl font-black italic text-retro-paper uppercase">Top Tracks</h2>
                                <Link to="/charts" className="font-sans font-black text-[9px] tracking-wider text-retro-gold hover:underline">
                                    Full Chart →
                                </Link>
                            </div>

                            <div className="flex flex-col gap-4">
                                {topTracks.length > 0 ? (
                                    topTracks.map((song, i) => {
                                        const rating = Number(song.average_rating) || 0;
                                        const artistName = song.artist?.name || song.artist || 'Unknown Artist';
                                        const cover = song.album_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop';
                                        return (
                                            <div
                                                key={song.id}
                                                onClick={() => setSelectedSong({ id: song.id, title: song.title, artist: artistName, coverUrl: cover })}
                                                className="group border border-retro-paper/20 bg-retro-black/40 hover:border-retro-gold transition-all duration-300 p-4 rounded-none flex items-center gap-4 cursor-pointer relative overflow-hidden"
                                            >
                                                <span className="text-[11px] font-mono text-gray-600 font-black w-5 shrink-0">#{i + 1}</span>
                                                <div className="w-14 h-14 shrink-0 border border-retro-paper/20 rounded-none overflow-hidden relative bg-retro-black">
                                                    <img src={cover} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={song.title} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-block bg-retro-gold/10 text-retro-gold text-[7px] font-sans font-black tracking-widest px-2 py-0.5 border border-retro-gold/20 mb-1.5 uppercase rounded-none">
                                                        {i === 0 ? 'NOW PLAYING' : i === 1 ? 'TRENDING' : 'RISING'}
                                                    </span>
                                                    <h3 className="font-sans font-black text-sm text-retro-paper uppercase tracking-tight group-hover:text-retro-gold transition-colors truncate">
                                                        {song.title}
                                                    </h3>
                                                    <p className="font-serif italic text-[10px] text-gray-500 mt-0.5 truncate">
                                                        {artistName} · {song.album_name || 'Single'}
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full border border-retro-gold bg-retro-black flex items-center justify-center shrink-0">
                                                    <span className="font-serif font-black text-retro-gold text-xs">
                                                        {rating > 0 ? rating.toFixed(1) : '—'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-10 text-center border border-dashed border-retro-paper/20 font-serif italic text-gray-500 rounded-none bg-retro-black/20 text-xs">
                                        No tracks match your filters.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Editor's Pick + Song Index */}
                    <div className="lg:col-span-5 space-y-10">
                        {/* Editor's Pick - Dynamic from API */}
                        {editorSong && (
                            <div className="border border-retro-paper/20 bg-retro-black/40 p-5 rounded-none space-y-4">
                                <div className="flex items-center gap-2 text-retro-gold font-sans font-black text-[9px] uppercase tracking-widest">
                                    <span>★</span>
                                    <span>Editor's Pick</span>
                                </div>
                                <div
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedSong({
                                        id: editorSong.id,
                                        title: editorSong.title,
                                        artist: editorSong.artist?.name || editorSong.artist || 'Unknown',
                                        coverUrl: editorSong.album_image
                                    })}
                                >
                                    <div className="bg-white p-3 pb-6 rounded-none border border-retro-paper/10 relative shadow-none select-none mb-4">
                                        <div className="w-full aspect-[4/3] bg-zinc-800 overflow-hidden relative">
                                            <img
                                                src={editorSong.album_image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop'}
                                                alt={editorSong.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                            />
                                            <div className="absolute -bottom-5 -right-5 w-14 h-14 rounded-full bg-retro-gold border-2 border-retro-black flex items-center justify-center shadow-lg z-10">
                                                <span className="text-retro-black font-serif font-black text-base">
                                                    {Number(editorSong.average_rating) > 0 ? Number(editorSong.average_rating).toFixed(1) : '★'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-sans font-black text-lg text-retro-paper uppercase leading-tight tracking-tight group-hover:text-retro-gold transition-colors">
                                        {editorSong.title}
                                    </h3>
                                    <p className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest mt-1">
                                        {editorSong.artist?.name || editorSong.artist || 'Unknown Artist'}
                                    </p>
                                    <p className="font-serif italic text-[10px] leading-relaxed text-gray-400 mt-3">
                                        A timeless piece that resonates through generations. Click to listen and rate this track.
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedSong({
                                            id: editorSong.id,
                                            title: editorSong.title,
                                            artist: editorSong.artist?.name || editorSong.artist || 'Unknown',
                                            coverUrl: editorSong.album_image
                                        })}
                                        className="flex-1 text-[9px] font-sans font-black uppercase tracking-wider text-retro-gold border border-retro-gold/30 hover:bg-retro-gold/10 py-2 px-3 transition-colors cursor-pointer"
                                    >
                                        ▶ Play Now
                                    </button>
                                    <Link
                                        to={`/song/${editorSong.id}`}
                                        className="flex-1 text-center text-[9px] font-sans font-black uppercase tracking-wider text-retro-paper border border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold py-2 px-3 transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Song Index */}
                        <section className="border border-retro-paper/20 bg-retro-black/40 p-5 rounded-none space-y-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-serif text-base font-black italic text-retro-gold uppercase">Song Index</h3>
                                    <Link to="/songs" className="text-[9px] font-sans font-black text-gray-500 hover:text-retro-gold tracking-widest uppercase transition-colors">
                                        Browse All →
                                    </Link>
                                </div>
                                <div className="w-full h-[1px] bg-retro-paper/10 mt-2" />
                            </div>

                            <div className="flex flex-col gap-3 font-sans font-black">
                                {songIndexItems.length > 0 ? (
                                    songIndexItems.map((song, idx) => {
                                        const artistName = song.artist?.name || song.artist || 'Unknown';
                                        const countStr = idx + 4 < 10 ? `0${idx + 4}` : `${idx + 4}`;
                                        const durationMinutes = song.duration_ms
                                            ? `${Math.floor(song.duration_ms / 60000)}:${((song.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`
                                            : '—';
                                        const cover = song.album_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop';

                                        return (
                                            <div
                                                key={song.id}
                                                onClick={() => setSelectedSong({ id: song.id, title: song.title, artist: artistName, coverUrl: cover })}
                                                className="flex items-center justify-between text-[10px] tracking-wider uppercase group cursor-pointer hover:text-retro-gold transition-colors duration-200"
                                            >
                                                <div className="flex-1 flex items-baseline mr-3">
                                                    <span className="text-[9px] text-gray-600 font-mono mr-2.5">{countStr}</span>
                                                    <span className="truncate max-w-[120px]">{song.title}</span>
                                                    {song.artist?.id ? (
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/artist/${song.artist.id}`);
                                                            }}
                                                            className="text-gray-600 ml-1.5 font-serif italic not-uppercase text-[9px] hover:text-retro-gold transition-colors z-20 cursor-pointer underline decoration-dotted"
                                                        >
                                                            ({artistName})
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600 font-serif italic font-normal ml-1.5 not-uppercase text-[9px]">
                                                            ({artistName})
                                                        </span>
                                                    )}
                                                    <span className="flex-1 border-b border-dotted border-retro-paper/20 mx-2 group-hover:border-retro-gold/40 transition-colors" />
                                                </div>
                                                <span className="font-mono text-gray-500 group-hover:text-retro-gold text-[9px]">{durationMinutes}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center font-serif italic text-gray-500 py-4 text-[10px]">
                                        No tracks match your filters.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Genre Blocks Section */}
                    <div className="lg:col-span-12 border-t border-retro-paper/20 pt-10 mt-2 space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-serif font-black text-retro-paper tracking-tight uppercase italic">
                                Browse by Genre
                            </h2>
                            <div className="h-[1px] flex-1 bg-retro-paper/10" />
                        </div>

                        {/* Genre Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {GENRES.map((genre) => (
                                <Link
                                    key={genre}
                                    to={`/genre/${genre}`}
                                    className="group border border-retro-paper/20 bg-retro-black/40 hover:border-retro-gold hover:bg-retro-gold/5 transition-all duration-300 p-4 rounded-none flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
                                    onClick={() => setSelectedGenres([genre])}
                                >
                                    <span className="text-2xl">{GENRE_ICONS[genre] || '🎵'}</span>
                                    <span className="font-sans font-black text-[10px] uppercase tracking-widest text-retro-paper group-hover:text-retro-gold transition-colors">
                                        {genre}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Discover Music Section (filtered or top songs as cards) */}
                    <div className="lg:col-span-12 border-t border-retro-paper/20 pt-10 mt-2 space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-base font-serif font-black text-retro-paper tracking-tight uppercase italic">
                                {selectedGenres.length > 0
                                    ? `${selectedGenres.join(', ')} Music`
                                    : 'Discover Music'}
                            </h2>
                            <div className="h-[1px] flex-1 bg-retro-paper/10" />
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] font-sans">
                                {displayGenreSongs.length} tracks
                            </span>
                        </div>

                        {displayGenreSongs.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayGenreSongs.map((song) => (
                                    <SongCard
                                        key={song.id}
                                        id={song.id}
                                        title={song.title}
                                        artist={song.artist}
                                        album_image={song.album_image}
                                        preview_url={song.preview_url}
                                        average_rating={song.average_rating}
                                        rating_count={song.rating_count}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center border border-dashed border-retro-paper/20 text-gray-500 font-serif italic text-xs">
                                No tracks match the selected genre.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
