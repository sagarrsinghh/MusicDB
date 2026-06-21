'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { songService } from '@/services/song.service';
import { ratingService, reviewService } from '@/services/rating.service';
import { authService } from '@/services/auth.service';
import { motion } from 'framer-motion';

interface User {
    id: number;
    username: string;
}

interface Review {
    id: number;
    comment: string;
    created_at: string;
    user: User;
}

interface Song {
    id: number;
    title: string;
    artist: { name: string };
    album_name: string;
    album_image: string | null;
    duration_ms: number;
    release_date: string;
    average_rating: number;
    rating_count: number;
    reviews: Review[];
}

export default function SongPage() {
    const { id } = useParams();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
        fetchSong();
    }, [id]);

    const fetchSong = async () => {
        try {
            const data = await songService.getById(id as string);
            setSong(data);
        } catch (error) {
            console.error('Failed to fetch song', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (value: number) => {
        if (!isAuthenticated) return alert('Please login to rate');
        try {
            await ratingService.create(Number(id), value);
            await fetchSong(); // Refresh to see updated average
            setRating(value);
        } catch (error) {
            console.error('Failed to rate', error);
        }
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return alert('Please login to review');
        try {
            await reviewService.create(Number(id), review);
            setReview('');
            await fetchSong(); // Refresh to see new review
        } catch (error) {
            console.error('Failed to post review', error);
        }
    };

    // Helper to extract rating from array if needed, but we start with 0 
    // Realistically you'd check if user already rated.

    if (loading) return <div className="min-h-screen text-retro-paper flex items-center justify-center font-sans tracking-widest uppercase">Loading...</div>;
    if (!song) return <div className="min-h-screen text-retro-paper flex items-center justify-center font-sans tracking-widest uppercase">Song not found</div>;

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="min-h-screen text-retro-paper p-8 pb-24 max-w-6xl mx-auto selection:bg-retro-gold selection:text-retro-black">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-8 items-end mb-12 border-b border-retro-paper/20 pb-12"
            >
                <div className="w-64 h-64 border-2 border-retro-paper/25 rounded-none overflow-hidden flex-shrink-0 bg-retro-black relative group">
                    {song.album_image ? (
                        <img src={song.album_image} alt={song.album_name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">🎵</div>
                    )}
                    <div className="absolute inset-0 bg-retro-black/40 group-hover:bg-transparent transition-all duration-700" />
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3.5 h-3.5 rounded-none bg-retro-gold border border-retro-black" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-retro-gold font-sans">Song Frequency</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-sans font-black mb-4 tracking-tighter uppercase leading-none">{song.title}</h1>
                    <div className="flex items-center text-gray-400 text-base gap-2 flex-wrap font-serif italic">
                        <span className="font-sans font-black uppercase tracking-wider text-retro-paper hover:underline cursor-pointer not-italic">{song.artist?.name || 'Unknown Artist'}</span>
                        <span>•</span>
                        <span>{song.album_name || 'Single'}</span>
                        {song.release_date && (
                            <>
                                <span>•</span>
                                <span>{new Date(song.release_date).getFullYear()}</span>
                            </>
                        )}
                        <span>•</span>
                        <span>{formatDuration(song.duration_ms)}</span>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="text-4xl font-sans font-black text-retro-gold flex items-center gap-2">
                            <span className="font-serif">★</span>
                            <span>{(song.average_rating ? Number(song.average_rating) : 0).toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400 text-xs font-sans uppercase tracking-widest font-bold">({song.rating_count || 0} ratings)</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Actions */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-retro-black/40 p-6 rounded-none border border-retro-paper/20">
                        <h3 className="text-lg font-sans font-black uppercase tracking-wider mb-4 border-b border-retro-paper/10 pb-2">Rate this song</h3>
                        <div className="flex gap-2 justify-center py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    className={`text-4xl transition-transform hover:scale-110 focus:outline-none cursor-pointer ${star <= rating ? 'text-retro-gold' : 'text-retro-paper/20'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-gray-500 mt-2 text-[10px] uppercase font-bold tracking-widest">Click to rate</p>
                    </div>

                    <div className="bg-retro-black/40 p-6 rounded-none border border-retro-paper/20">
                        <h3 className="text-lg font-sans font-black uppercase tracking-wider mb-4 border-b border-retro-paper/10 pb-2">Write a Review</h3>
                        <form onSubmit={handleReview}>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full bg-retro-black text-retro-paper p-4 rounded-none min-h-[150px] mb-4 focus:border-retro-gold outline-none resize-none border border-retro-paper/20 font-sans text-sm"
                                placeholder="Share your thoughts about this track..."
                            />
                            <button
                                type="submit"
                                className="w-full bg-retro-gold text-retro-black font-sans font-black tracking-wider uppercase py-3 border border-retro-black hover:bg-retro-paper hover:text-retro-black transition-all rounded-none cursor-pointer"
                            >
                                Post Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Reviews */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-sans font-black mb-6 flex items-center gap-2 uppercase tracking-wide">
                        Community Reviews
                        <span className="text-xs font-normal text-gray-500 font-sans font-bold">({song.reviews?.length || 0})</span>
                    </h2>
                    {song.reviews && song.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {song.reviews.map((rev: any) => (
                                <motion.div
                                    key={rev.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-retro-black/40 p-6 rounded-none border border-retro-paper/20 hover:border-retro-gold transition-colors duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-none bg-retro-paper/10 border border-retro-paper/20 flex items-center justify-center font-bold text-retro-gold">
                                                {rev.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-sans font-black text-retro-paper uppercase tracking-wider">{rev.user?.username || 'User'}</h4>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(rev.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed font-serif italic border-l border-retro-gold/20 pl-4">"{rev.comment}"</p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-retro-black/40 p-8 rounded-none text-center border border-retro-paper/20 border-dashed">
                            <p className="text-gray-400 text-lg font-serif italic mb-2">No reviews yet</p>
                            <p className="text-gray-500 text-xs font-sans font-bold uppercase tracking-widest">Be the first to share your thoughts on this track!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
