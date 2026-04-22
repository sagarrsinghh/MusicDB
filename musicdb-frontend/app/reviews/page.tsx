'use client';

import { useEffect, useState } from 'react';
import { reviewService } from '@/services/rating.service';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Song {
    id: number;
    title: string;
    album_image: string | null;
    artist: { name: string };
}

interface Review {
    id: number;
    comment: string;
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

    if (loading) return <div className="p-8 text-white">Loading reviews...</div>;

    return (
        <div className="p-8 pb-24 text-white max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">My Reviews</h1>
                <p className="text-gray-400 mt-2">Manage and view all your past reviews.</p>
            </header>

            {reviews.length > 0 ? (
                <div className="grid gap-6">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#181818] p-6 rounded-lg border border-[#333] hover:border-gray-500 transition-colors group"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
                                    {review.song?.album_image ? (
                                        <img src={review.song.album_image} alt={review.song.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">🎵</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/song/${review.song?.id}`} className="text-xl font-bold hover:underline">
                                                {review.song?.title}
                                            </Link>
                                            <p className="text-gray-400 text-sm mb-2">{review.song?.artist?.name}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300 mt-2 bg-[#222] p-4 rounded-lg italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#181818] rounded-xl border border-[#333] border-dashed">
                    <h2 className="text-2xl font-bold mb-4 text-gray-400">No reviews yet</h2>
                    <p className="text-gray-500 mb-8">You haven't reviewed any songs yet. Go explore!</p>
                    <Link href="/search" className="bg-green-500 text-black px-6 py-3 rounded-full font-bold hover:bg-green-400 transition">
                        Find Songs to Review
                    </Link>
                </div>
            )}
        </div>
    );
}
