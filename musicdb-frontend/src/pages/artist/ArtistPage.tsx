'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { artistService, Artist } from '@/services/artist.service';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';
import SongCard from '@/components/SongCard';

export default function ArtistPage() {
    const { id } = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const auth = authService.isAuthenticated();
            setIsAuthenticated(auth);

            if (!id) return;

            try {
                const artistData = await artistService.getById(id as string);
                setArtist(artistData);

                if (auth) {
                    const following = await userService.getFollowing();
                    setIsFollowing(following.some((a: any) => a.id === artistData.id));
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [id]);

    const handleFollowToggle = async () => {
        if (!isAuthenticated) return alert('Please login to follow artists');
        if (!artist) return;

        try {
            if (isFollowing) {
                await userService.unfollowArtist(artist.id);
                setIsFollowing(false);
            } else {
                await userService.followArtist(artist.id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Failed to toggle follow', error);
        }
    };

    const filteredSongs = artist?.songs?.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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

    if (!artist) {
        return (
            <div className="flex h-screen bg-retro-black text-retro-paper">
                <Sidebar />
                <main className="flex-1 p-8 flex justify-center items-center font-sans tracking-widest uppercase text-sm">
                    <p className="text-xl text-gray-500 italic font-serif">Artist not found in the archive</p>
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-retro-black text-retro-paper selection:bg-retro-gold font-sans overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Hero Section */}
                <div className="relative h-[450px] bg-retro-black flex items-end border-b border-retro-paper/20">
                    {/* Background Image (no blur, flat grayscale overlay) */}
                    {artist.image_url && (
                        <div
                            className="absolute inset-0 opacity-20 grayscale"
                            style={{ backgroundImage: `url(${artist.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-retro-black via-retro-black/60 to-transparent"></div>

                    <div className="relative z-10 p-12 md:p-16 flex items-end gap-10 w-full max-w-[1600px] mx-auto">
                        <div className="w-64 h-64 rounded-none overflow-hidden border border-retro-paper/25 shrink-0 bg-retro-black flex items-center justify-center">
                            {artist.image_url && artist.image_url.trim() !== '' ? (
                                <img
                                    src={artist.image_url}
                                    alt={artist.name}
                                    className="w-full h-full object-cover rounded-none"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLImageElement).parentElement;
                                        if (parent) {
                                            const fallback = document.createElement('div');
                                            fallback.className = "w-full h-full bg-retro-black flex items-center justify-center text-8xl";
                                            fallback.innerText = '🎤';
                                            parent.appendChild(fallback);
                                        }
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-retro-black flex items-center justify-center text-8xl">🎤</div>
                            )}
                        </div>
                        <div className="mb-4 flex-1">
                            <div className="flex items-center gap-3 mb-4 font-sans">
                                <div className="w-1.5 h-1.5 bg-retro-gold" />
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-retro-gold">Verified Visionary</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-sans font-black tracking-tight leading-none mb-8 uppercase text-retro-paper">{artist.name}</h1>

                            <div className="flex items-center gap-6 text-gray-500 mb-8 font-serif italic">
                                <span>{artist.genres?.join(', ') || 'Genre Underground'}</span>
                                {artist.popularity > 0 && (
                                    <>
                                        <div className="w-1 h-1 bg-retro-paper/20" />
                                        <span className="text-retro-gold font-bold font-sans tracking-wide text-xs uppercase">{artist.popularity}% Archives Resonance</span>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={handleFollowToggle}
                                className={`px-12 py-4 rounded-none font-bold text-[10px] uppercase tracking-[0.3em] transition-all cursor-pointer font-sans ${isFollowing
                                    ? 'bg-transparent border border-retro-paper/20 text-retro-paper hover:border-retro-paper'
                                    : 'bg-retro-gold text-retro-black border border-retro-black hover:bg-retro-gold/80'
                                    }`}
                            >
                                {isFollowing ? 'Following' : 'Follow Artist'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-16 max-w-[1600px] mx-auto">
                    {/* Discography Header with Search */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-retro-paper/20 pb-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-sans font-black text-retro-paper mb-2 uppercase">Discography</h2>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-8 h-[1px] bg-retro-gold/50" />
                                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold font-sans">Curated Records</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="SEARCH WITHIN ARCHIVE..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-retro-black border border-retro-paper/20 rounded-none px-6 py-4 text-[10px] tracking-widest uppercase text-retro-paper placeholder-gray-650 focus:outline-none focus:border-retro-gold transition-colors font-sans"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-650 font-sans text-xs">🔍</span>
                        </div>
                    </div>

                    {/* Songs Grid */}
                    <section className="mb-24">
                        {filteredSongs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-8">
                                {filteredSongs.map((song) => (
                                    <div key={song.id} className="h-full">
                                        <SongCard
                                            {...song}
                                            artist={{ name: artist.name }}
                                            coverUrl={song.album_image}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center border border-dashed border-retro-paper/20 rounded-none bg-retro-black/40">
                                <p className="text-gray-500 italic font-serif text-lg">
                                    {searchQuery ? `No records matching "${searchQuery}" found in this visionary's archive.` : 'No records found for this visionary yet.'}
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                <footer className="py-24 border-t border-retro-paper/20 text-center bg-retro-black">
                    <h3 className="text-8xl md:text-[10rem] font-serif italic opacity-5 select-none pointer-events-none mb-8 text-retro-paper uppercase">MusicDB</h3>
                </footer>
            </main>

            {/* Subtle Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[999] bg-noise" />
        </div>
    );
}

