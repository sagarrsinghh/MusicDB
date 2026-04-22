'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

    if (loading) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;
    if (!song) return <div className="min-h-screen text-white flex items-center justify-center">Song not found</div>;

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="min-h-screen text-white p-8 pb-24 max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-8 items-end mb-12"
            >
                <div className="w-64 h-64 shadow-2xl rounded-lg overflow-hidden flex-shrink-0 bg-gray-800 relative group">
                    {song.album_image ? (
                        <img src={song.album_image} alt={song.album_name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-6xl">🎵</div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="flex-1">
                    <h5 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Song</h5>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">{song.title}</h1>
                    <div className="flex items-center text-gray-300 text-lg gap-2 flex-wrap">
                        <span className="font-bold text-white hover:underline cursor-pointer">{song.artist?.name || 'Unknown Artist'}</span>
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
                        <div className="text-4xl font-bold text-green-500 flex items-center gap-2">
                            <span>⭐</span>
                            <span>{song.average_rating || '0.0'}</span>
                        </div>
                        <span className="text-gray-400 text-sm">({song.rating_count || 0} ratings)</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Actions */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#181818] p-6 rounded-lg shadow-lg border border-[#333]">
                        <h3 className="text-xl font-bold mb-4">Rate this song</h3>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRate(star)}
                                    className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-gray-500 mt-2 text-sm">Click to rate</p>
                    </div>

                    <div className="bg-[#181818] p-6 rounded-lg shadow-lg border border-[#333]">
                        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                        <form onSubmit={handleReview}>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full bg-[#282828] text-white p-4 rounded-md min-h-[150px] mb-4 focus:ring-2 focus:ring-green-500 outline-none resize-none border border-[#444]"
                                placeholder="Share your thoughts about this track..."
                            />
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-black font-bold py-3 rounded-full hover:bg-green-400 transition transform hover:scale-105"
                            >
                                Post Review
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Reviews */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Community Reviews
                        <span className="text-sm font-normal text-gray-500">({song.reviews?.length || 0})</span>
                    </h2>
                    {song.reviews && song.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {song.reviews.map((rev: any) => (
                                <motion.div
                                    key={rev.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-[#181818] p-6 rounded-lg border border-[#282828] hover:border-[#444] transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
                                                {rev.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{rev.user?.username || 'User'}</h4>
                                                <span className="text-xs text-gray-500">{new Date(rev.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed">{rev.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#181818] p-8 rounded-lg text-center border border-[#282828] border-dashed">
                            <p className="text-gray-400 text-lg mb-2">No reviews yet</p>
                            <p className="text-gray-600">Be the first to share your thoughts on this track!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
