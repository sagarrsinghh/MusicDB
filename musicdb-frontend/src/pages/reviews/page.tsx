'use client';

import { useEffect, useState } from 'react';
import { reviewService } from '@/services/rating.service';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Song {
    id: number;
    title: string;
    album_image: string | null;
    artist: { name: string };
    genre?: string;
}

interface Review {
    id: number;
    comment: string;
    rating?: number;
    created_at: string;
    song: Song;
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await reviewService.getMyReviews();
                setReviews(data);
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) return (
        <div className="px-6 md:px-[48px] py-10">
            <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-retro-paper/5 animate-pulse border border-retro-paper/10" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="px-6 md:px-[48px] py-10 pb-28 text-retro-paper max-w-4xl selection:bg-retro-gold selection:text-retro-black">
            {/* Compact Header */}
            <header className="mb-8 border-b border-retro-paper/20 pb-5">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 bg-retro-gold border border-retro-black" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">My Critiques</span>
                </div>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-sans font-black uppercase tracking-tight">My Reviews</h1>
                        <p className="text-gray-500 mt-1 font-serif text-[10px] italic">
                            Your personal music critiques and ratings.
                        </p>
                    </div>
                    {reviews.length > 0 && (
                        <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                    )}
                </div>
            </header>

            {reviews.length > 0 ? (
                <div className="grid gap-4">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.07 }}
                            className="bg-retro-black/40 p-5 border border-retro-paper/20 hover:border-retro-gold transition-colors duration-300 group"
                        >
                            <div className="flex items-start gap-4">
                                {/* Album Art */}
                                <div className="w-14 h-14 bg-retro-black border border-retro-paper/20 overflow-hidden flex-shrink-0">
                                    {review.song?.album_image ? (
                                        <img
                                            src={review.song.album_image}
                                            alt={review.song.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">🎵</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-3 flex-wrap mb-1">
                                        <div>
                                            <Link
                                                to={`/song/${review.song?.id}`}
                                                className="text-sm font-sans font-black uppercase tracking-tight text-retro-paper hover:text-retro-gold transition-colors block leading-tight"
                                            >
                                                {review.song?.title}
                                            </Link>
                                            <p className="text-gray-500 text-[10px] font-serif italic mt-0.5">
                                                {review.song?.artist?.name}
                                                {review.song?.genre && (
                                                    <Link
                                                        to={`/genre/${review.song.genre}`}
                                                        className="ml-2 text-retro-gold hover:underline"
                                                    >
                                                        · {review.song.genre}
                                                    </Link>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            {review.rating && (
                                                <span className="w-8 h-8 rounded-full border border-retro-gold bg-retro-black flex items-center justify-center text-retro-gold font-serif font-black text-xs">
                                                    {review.rating}
                                                </span>
                                            )}
                                            <span className="text-[9px] text-gray-500 font-sans font-bold uppercase tracking-widest">
                                                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <blockquote className="text-gray-300 mt-3 bg-retro-black/60 border-l-2 border-retro-gold/30 px-3 py-2 font-serif italic text-[11px] leading-relaxed">
                                        "{review.comment}"
                                    </blockquote>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-retro-black/40 border border-retro-paper/20 border-dashed">
                    <span className="text-4xl mb-4 block">🎵</span>
                    <h2 className="text-lg font-serif italic text-gray-400 mb-1">No reviews yet</h2>
                    <p className="text-gray-500 text-[10px] font-sans font-bold uppercase tracking-widest mb-6">
                        Start listening and share your thoughts on tracks.
                    </p>
                    <Link
                        to="/songs"
                        className="inline-block bg-retro-gold text-retro-black px-5 py-2.5 border border-retro-black font-sans font-black uppercase tracking-wider text-[10px] hover:bg-retro-paper hover:text-retro-black transition-all cursor-pointer"
                    >
                        Browse Music
                    </Link>
                </div>
            )}
        </div>
    );
}
