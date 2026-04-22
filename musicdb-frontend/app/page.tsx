'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { songService } from '@/services/song.service';
import { artistService } from '@/services/artist.service';
import SongCard from '@/components/SongCard';
import ArtistCard from '@/components/ArtistCard';
import RatingStars from '@/components/RatingStars';
import { useUIStore } from '@/store/ui.store';

export default function Home() {
    const [topSongs, setTopSongs] = useState<any[]>([]);
    const [trendingSongs, setTrendingSongs] = useState<any[]>([]);
    const [artists, setArtists] = useState<any[]>([]);
    const [genreSongs, setGenreSongs] = useState<Record<string, any[]>>({});
    const [popularSongs, setPopularSongs] = useState<any[]>([]);
    const { setSelectedSong } = useUIStore();

    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const trendingRef = useRef<HTMLDivElement>(null);
    const genres = useMemo(
        () => ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Indie', 'Soul', 'R&B', 'Metal', 'Country', 'Classical'],
        [],
    );

    // Fetch popularity chart — songs rated on our platform, sorted by avg rating
    const fetchPopularity = async () => {
        try {
            const top = await songService.getTopRated();
            if (Array.isArray(top)) {
                // Only songs actually rated on our platform
                const rated = top.filter((s: any) => s.rating_count > 0);
                setPopularSongs(rated.slice(0, 10));
            }
        } catch {
            // ignore temporary fetch failures
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                // Initial load
                const [top, trend, t50, artistsData] = await Promise.allSettled([
                    songService.getTopRated(),
                    songService.getTrending(),
                    songService.getTop50(),
                    artistService.getAll()
                ]);

                const topList = top.status === 'fulfilled' ? top.value : [];
                const trendList = trend.status === 'fulfilled' ? trend.value : [];
                const t50List = t50.status === 'fulfilled' ? t50.value : [];
                const artistsList = artistsData.status === 'fulfilled' ? artistsData.value : [];

                setArtists(Array.isArray(artistsList) ? artistsList.slice(0, 10) : []);

                // FORCED TRENDING: If all empty, it means DB is fresh. Fetch a genre to populate.
                if ((!trendList || trendList.length === 0) && (!t50List || t50List.length === 0)) {
                    console.log("Archive empty. Seeding from Pop genre...");
                    const popSongs = await songService.getByGenre('Pop');
                    setTrendingSongs(Array.isArray(popSongs) ? popSongs.slice(0, 10) : []);
                } else {
                    const finalTrend = (Array.isArray(trendList) && trendList.length > 2) ? trendList : (Array.isArray(t50List) && t50List.length > 0 ? t50List : topList);
                    setTrendingSongs(Array.isArray(finalTrend) ? finalTrend.slice(0, 10) : []);
                }

                setTopSongs(Array.isArray(topList) ? topList.slice(0, 10) : []);

                // Popularity chart — rated songs only
                if (Array.isArray(topList)) {
                    const rated = topList.filter((s: any) => s.rating_count > 0);
                    setPopularSongs(rated.slice(0, 10));
                }

                // Genres - Strictly 10
                genres.forEach(async (g) => {
                    try {
                        const res = await songService.getByGenre(g);
                        if (Array.isArray(res)) setGenreSongs(prev => ({ ...prev, [g]: res.slice(0, 10) }));
                    } catch {
                    }
                });
            } catch (err) {
                console.error(err);
            }
        };
        init();

        // Live refresh every 30s — keeps popularity chart up to date after new ratings
        const interval = setInterval(fetchPopularity, 30000);
        return () => clearInterval(interval);
    }, [genres]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const heroTimeline = gsap.timeline();
            heroTimeline
                .from('.hero-title', { y: 90, opacity: 0, duration: 1, ease: 'power3.out' })
                .from('.hero-subtitle', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
                .from('.hero-cta button', { y: 20, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }, '-=0.7');

            (gsap.utils.toArray('.fade-in-section') as HTMLElement[]).forEach((section: HTMLElement) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    stagger: 0.15,
                });
            });

            (gsap.utils.toArray('.card-enter') as HTMLElement[]).forEach((card: HTMLElement, index: number) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 95%',
                        toggleActions: 'play none none reverse',
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    delay: index * 0.03,
                });
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const scroll = (d: 'L' | 'R') => {
        if (trendingRef.current) trendingRef.current.scrollBy({ left: d === 'L' ? -350 : 350, behavior: 'smooth' });
    };

    return (
        <div ref={pageRef} className="min-h-screen bg-[#050505] text-white selection:bg-retro-gold font-sans overflow-x-hidden relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),transparent_25%)] opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.12),transparent_30%)] opacity-50" />

            {/* 1. Brand Hero */}
            <header ref={heroRef} className="px-8 md:px-16 pt-24 pb-12 border-b border-white/5 relative overflow-hidden">
                <div className="absolute -left-24 top-24 h-64 w-64 rounded-full border border-retro-gold/20 bg-retro-gold/5 blur-[80px]" />
                <div className="absolute right-0 top-10 h-56 w-56 rounded-full border border-white/10 bg-white/5 blur-[40px]" />
                <div className="max-w-[1600px] mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 rounded-full bg-retro-gold shadow-[0_0_15px_rgba(197,164,126,0.5)]" />
                        <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-retro-gold">EST. 2026 Archive</span>
                    </div>
                    <h1 className="hero-title text-7xl md:text-[8rem] font-serif italic leading-[0.85] tracking-tight mb-8 text-white/95">
                        Music<span className="text-retro-gold">DB</span>
                    </h1>
                    <p className="hero-subtitle max-w-xl text-lg text-gray-400 italic font-light mb-8 border-l border-retro-gold/30 pl-6 leading-relaxed">
                        “MUSIC HAS A WAY TO FIND PEOPLE IN THE DARKNESS”
                    </p>
                    <div className="hero-cta flex flex-wrap gap-4">
                        <button onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl bg-white/5 backdrop-blur-md">
                            Start Listening
                        </button>
                        <Link href="/songs">
                            <button className="px-10 py-4 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl bg-white/5 backdrop-blur-md">
                                Explore All Songs
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* 2. Trending */}
            <section id="trending" className="fade-in-section py-16 border-b border-white/5 bg-white/[0.01]">
                <div className="px-8 md:px-16 max-w-[1600px] mx-auto flex justify-between items-end mb-8">
                    <div>
                        <h2 className="section-header text-4xl md:text-5xl font-serif italic text-white mb-2 underline decoration-retro-gold/20 underline-offset-8">Trending Songs</h2>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-8 h-[1px] bg-retro-gold/50" />
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Global Selection</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => scroll('L')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-sm">←</button>
                        <button onClick={() => scroll('R')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-sm">→</button>
                    </div>
                </div>

                <div ref={trendingRef} className="w-full overflow-x-auto pb-8 scrollbar-hide pl-8 md:pl-16 scroll-smooth">
                    <div className="flex gap-8 w-max pr-16 bg-transparent">
                        {trendingSongs && trendingSongs.length > 0 ? (
                            trendingSongs.map((s) => (
                                <div key={s.id} className="card-enter w-[260px] shrink-0">
                                    <SongCard {...s} />
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 italic py-16 pl-4 border border-white/5 rounded-2xl w-[800px] flex items-center justify-center bg-white/[0.02]">
                                <span className="animate-pulse tracking-widest uppercase text-[10px]">Updating Archive Records...</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ★ POPULARITY CHART — Songs rated on our platform, by average rating */}
            {popularSongs.length > 0 && (
                <section id="popularity" className="fade-in-section py-16 border-b border-white/5">
                    <div className="px-8 md:px-16 max-w-[1600px] mx-auto">
                        <div className="flex items-end gap-6 mb-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-retro-gold text-[9px] font-black uppercase tracking-[0.4em]">Our Community</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif italic text-white underline decoration-retro-gold/20 underline-offset-8">
                                    Popularity Chart
                                </h2>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="w-8 h-[1px] bg-retro-gold/50" />
                                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Ranked by your ratings · Live</p>
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] uppercase tracking-widest text-green-500 font-bold">Auto-refreshes</span>
                                    </span>
                                </div>
                            </div>
                            <Link href="/songs" className="ml-auto text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors underline decoration-retro-gold/30 underline-offset-4">
                                View All Songs
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {popularSongs.map((song, i) => {
                                const artistName = (() => {
                                    const a = song.artist;
                                    if (!a) return 'Unknown Artist';
                                    if (typeof a === 'string') return a;
                                    return a.name || a.artist_name || 'Unknown Artist';
                                })();
                                const cover = song.album_image || song.coverUrl;

                                return (
                                    <motion.div
                                        key={song.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => setSelectedSong({ id: song.id, title: song.title, artist: artistName, coverUrl: cover })}
                                        className="group flex items-center gap-5 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-retro-gold/25 transition-all cursor-pointer"
                                    >
                                        {/* Rank */}
                                        <div className="w-8 shrink-0 text-center">
                                            {i === 0 ? (
                                                <span className="text-retro-gold font-black text-lg font-serif">①</span>
                                            ) : i === 1 ? (
                                                <span className="text-gray-300 font-black text-lg font-serif">②</span>
                                            ) : i === 2 ? (
                                                <span className="text-amber-600 font-black text-lg font-serif">③</span>
                                            ) : (
                                                <span className="text-gray-600 font-black text-sm tabular-nums">{i + 1}</span>
                                            )}
                                        </div>

                                        {/* Cover */}
                                        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 relative">
                                            <Image
                                                src={cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop'}
                                                alt={song.title}
                                                fill
                                                sizes="48px"
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Title + Artist */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-black text-sm truncate group-hover:text-retro-gold transition-colors">{song.title}</p>
                                            <p className="text-gray-500 text-[10px] truncate font-serif italic">{artistName}</p>
                                        </div>

                                        {/* Stars + Score */}
                                        <div className="shrink-0 flex items-center gap-3">
                                            <RatingStars
                                                rating={Number(song.average_rating)}
                                                max={5}
                                                size="sm"
                                                showCount
                                                count={song.rating_count}
                                            />
                                        </div>

                                        {/* Bar indicator */}
                                        <div className="w-24 shrink-0 hidden md:block">
                                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(Number(song.average_rating) / 5) * 100}%` }}
                                                    transition={{ delay: i * 0.05 + 0.3, duration: 0.6, ease: 'easeOut' }}
                                                    className="h-full rounded-full bg-gradient-to-r from-retro-gold/60 to-retro-gold"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* 2.5. Featured Artists */}
            <section className="fade-in-section py-16 border-b border-white/5 bg-white/[0.01]">
                <div className="px-8 md:px-16 max-w-[1600px] mx-auto flex justify-between items-end mb-8">
                    <div>
                        <h2 className="section-header text-4xl md:text-5xl font-serif italic text-white mb-2 underline decoration-retro-gold/20 underline-offset-8">Featured Artists</h2>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-8 h-[1px] bg-retro-gold/50" />
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">The Visionaries</p>
                        </div>
                    </div>
                    <Link href="/artists" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors underline decoration-retro-gold/30 underline-offset-4">
                        View All Artists
                    </Link>
                </div>

                <div className="w-full overflow-x-auto pb-8 scrollbar-hide pl-8 md:pl-16 scroll-smooth">
                    <div className="flex gap-8 w-max pr-16 bg-transparent">
                        {artists && artists.length > 0 ? (
                            artists.map((a) => (
                                <div key={a.id} className="card-enter w-[220px] shrink-0">
                                    <ArtistCard {...a} />
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 italic py-16 pl-4 border border-white/5 rounded-2xl w-[800px] flex items-center justify-center bg-white/[0.02]">
                                <span className="animate-pulse tracking-widest uppercase text-[10px]">Calling Visionaries...</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 3. Genres - Symmetrical */}
            <div className="py-10 space-y-12">
                {genres.map((g, i) => (
                    genreSongs[g] && genreSongs[g].length > 0 && (
                        <section key={g} className="px-8 md:px-16 max-w-[1600px] mx-auto">
                            <div className="flex items-baseline gap-6 mb-6 border-b border-white/5 pb-4">
                                <span className="text-retro-gold font-serif italic text-2xl">0{i + 1}</span>
                                <h3 className="text-3xl font-bold tracking-tight">{g}</h3>
                                <div className="flex-1" />
                                <Link href={`/search?q=genre:${g}`} className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                    Browse All
                                </Link>
                            </div>
                            <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                                <div className="flex gap-6 w-max">
                                    {genreSongs[g].map(s => (
                                        <div key={s.id} className="w-[220px] shrink-0">
                                            <SongCard {...s} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )
                ))}
            </div>

            {/* 4. Masterpieces */}
            <section className="py-24 px-8 md:px-16 max-w-[1600px] mx-auto border-t border-white/5">
                <div className="text-center mb-16">
                    <span className="text-retro-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic">The Elite Picks</span>
                    <h2 className="text-6xl md:text-8xl font-serif italic text-white">Masterpieces</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topSongs.map(s => (
                        <div key={s.id} className="card-enter h-full">
                            <SongCard {...s} />
                        </div>
                    ))}
                </div>
            </section>

            <footer className="py-24 border-t border-white/5 text-center bg-[#050505]">
                <h3 className="text-8xl md:text-[10rem] font-serif italic opacity-5 select-none pointer-events-none mb-8 text-white">MusicDB</h3>
                <div className="flex justify-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">
                    <span>Archive</span>
                    <span>Curators</span>
                    <span>Legal</span>
                </div>
            </footer>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}
