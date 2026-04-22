'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';
import { useEffect, useState } from 'react';
import { reviewService, ratingService } from '@/services/rating.service';
import { songService } from '@/services/song.service';
import { favoriteService } from '@/services/favorite.service';
import RatingStars from './RatingStars';

export default function SongDetailOverlay() {
    const { selectedSong, setSelectedSong } = useUIStore();
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [fullSong, setFullSong] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (selectedSong) {
            fetchSongDetails();
        } else {
            setFullSong(null);
            setReviews([]);
            setUserRating(0);
            setComment('');
            setIsLiked(false);
        }
    }, [selectedSong]);

    const fetchSongDetails = async () => {
        if (!selectedSong) return;
        setIsLoading(true);
        try {
            const [reviewsData, ratingsData, songData, likedData] = await Promise.all([
                reviewService.findBySong(selectedSong.id.toString()),
                ratingService.findBySong(selectedSong.id.toString()),
                songService.getSongById(selectedSong.id.toString()),
                favoriteService.checkIsLiked(selectedSong.id)
            ]);
            setReviews(reviewsData);
            setFullSong(songData);
            setIsLiked(likedData.liked);
        } catch (error) {
            console.error('Failed to fetch song details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRate = async (value: number) => {
        if (!selectedSong) return;
        try {
            await ratingService.create(Number(selectedSong.id), value);
            setUserRating(value);
        } catch (error) {
            console.error('Failed to rate', error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!selectedSong) return;
        try {
            const result = await favoriteService.toggle(selectedSong.id);
            setIsLiked(result.liked);
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSong || !comment.trim()) return;
        try {
            await reviewService.create(Number(selectedSong.id), comment);
            setComment('');
            fetchSongDetails(); // Refresh reviews
        } catch (error) {
            console.error('Failed to post review', error);
        }
    };

    if (!selectedSong) return null;

    return (
        <AnimatePresence mode="wait">
            {selectedSong && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden"
                >
                    {/* Background Blur Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSong(null)}
                        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
                    />

                    {/* Content Container */}
                    <motion.div
                        layoutId={`card-${selectedSong.id}`}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-7xl h-full md:h-[85vh] bg-[#0c0c0c] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/5 flex flex-col md:flex-row"
                    >
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/3 lg:w-2/5 h-64 md:h-auto overflow-hidden bg-black flex items-center justify-center group/img">
                            <motion.img
                                layoutId={`image-${selectedSong.id}`}
                                src={selectedSong.coverUrl || selectedSong.album_image}
                                alt={selectedSong.title}
                                className="w-full h-full object-cover opacity-60 group-hover/img:opacity-80 transition-opacity duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>

                        {/* Right Content Section: Controls & Reviews */}
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Close Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedSong(null)}
                                className="absolute top-8 right-8 z-50 p-2 text-gray-500 hover:text-white bg-white/5 rounded-full backdrop-blur-md border border-white/10 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </motion.button>

                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 lg:p-16">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <motion.h2
                                        layoutId={`title-${selectedSong.id}`}
                                        className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-white tracking-tighter mb-2 leading-tight"
                                    >
                                        {selectedSong.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl md:text-3xl text-retro-gold font-serif italic mb-6"
                                    >
                                        {selectedSong.artist}
                                    </motion.p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-4 mb-12">
                                        {/* Listen on Spotify Button */}
                                        {(selectedSong.spotify_url || fullSong?.spotify_url) && (
                                            <motion.a
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                href={selectedSong.spotify_url || fullSong?.spotify_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-black/40 text-white font-black px-8 py-4 rounded-full flex items-center gap-3 border border-white/10 hover:bg-[#1DB954]/10 hover:border-[#1DB954]/50 transition-all group/spotify"
                                            >
                                                <svg className="w-6 h-6 fill-[#1DB954]" viewBox="0 0 24 24">
                                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.496 17.306c-.22.363-.695.474-1.058.254-2.88-1.758-6.505-2.157-10.774-1.18-.414.095-.826-.164-.92-.578-.096-.414.162-.827.577-.921 4.673-1.07 8.667-.611 11.86 1.34.364.221.475.696.255 1.059zm1.465-3.263c-.276.45-.86.594-1.31.32-3.298-2.028-8.324-2.617-12.217-1.436-.508.152-1.04-.142-1.194-.65-.152-.51.144-1.04.651-1.193 4.455-1.352 10.004-.694 13.75 1.606.452.277.595.86.32 1.31zm.128-3.414c-3.957-2.35-10.474-2.565-14.26-1.416-.606.185-1.246-.166-1.431-.772-.185-.607.166-1.247.772-1.432 4.348-1.32 11.536-1.066 16.082 1.631.545.324.726 1.033.402 1.579-.324.545-1.033.726-1.579.402z" />
                                                </svg>
                                                LISTEN ON SPOTIFY
                                            </motion.a>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleToggleFavorite}
                                            className={`p-4 rounded-full border transition-all ${isLiked ? 'bg-retro-gold/10 border-retro-gold text-retro-gold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
                                        >
                                            <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Left Sub-Column: Rating & Info */}
                                    <div className="space-y-12">
                                        <section>
                                            <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center text-sm">♪</span>
                                                Official Player
                                            </h3>
                                            <div className="bg-black/40 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                                                <iframe
                                                    src={`https://open.spotify.com/embed/track/${selectedSong.spotify_id || fullSong?.spotify_id}?utm_source=generator&theme=0`}
                                                    width="100%"
                                                    height="152"
                                                    frameBorder="0"
                                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                    loading="lazy"
                                                    className="rounded-3xl"
                                                ></iframe>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-4 px-2 font-bold uppercase tracking-widest">
                                                Experience the full master recording via Spotify.
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-sm">★</span>
                                                Rate this song
                                            </h3>
                                            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
                                                <RatingStars rating={userRating} max={5} interactive onRate={handleRate} />
                                                <p className="text-gray-500 text-sm mt-4 font-medium italic">
                                                    Your rating helps other explorers find their next favorite song.
                                                </p>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-sm">ℹ</span>
                                                Song Intelligence
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Popularity', value: fullSong ? `${fullSong.popularity}% Hype` : 'Measuring...' },
                                                    { label: 'Release', value: fullSong ? new Date(fullSong.release_date).getFullYear() : 'Ancient' },
                                                    { label: 'Duration', value: fullSong ? `${Math.floor(fullSong.duration_ms / 60000)}:${((fullSong.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}` : 'Timeless' },
                                                    { label: 'Vibe', value: 'Engraved' }
                                                ].map((item, i) => (
                                                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">{item.label}</span>
                                                        <span className="text-white font-bold">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm">👤</span>
                                                Artist Spotlight
                                            </h3>
                                            <div
                                                onClick={() => {
                                                    const { setSelectedArtist } = useUIStore.getState();
                                                    setSelectedArtist(fullSong?.artist || { name: selectedSong.artist, spotify_id: fullSong?.artist?.spotify_id });
                                                }}
                                                className="bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    {fullSong?.artist?.image_url && (
                                                        <img src={fullSong.artist.image_url} className="w-12 h-12 rounded-full object-cover border-2 border-[#1DB954]/30 group-hover:scale-110 transition-transform" alt={fullSong.artist.name} />
                                                    )}
                                                    <div>
                                                        <h4 className="text-white font-bold group-hover:text-[#1DB954] transition-colors">{fullSong?.artist?.name || selectedSong.artist}</h4>
                                                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                                                            {fullSong?.artist?.popularity ? `${fullSong.artist.popularity}% Global Influence` : 'Discovery Tier'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {fullSong?.artist?.genres?.length > 0 ? (
                                                        fullSong.artist.genres.map((genre: string, i: number) => (
                                                            <span key={i} className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full text-[#1DB954] uppercase tracking-wider border border-white/5">
                                                                {genre}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[9px] font-black px-3 py-1 bg-white/5 rounded-full text-gray-500 uppercase tracking-wider border border-white/5">
                                                            Transcendent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Sub-Column: Community Reviews */}
                                    <div className="flex flex-col h-full min-h-[400px]">
                                        <h3 className="text-white text-xl font-black mb-6 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center text-sm">💬</span>
                                            Community Reviews
                                        </h3>

                                        {/* New Review Form */}
                                        <form onSubmit={handleSubmitReview} className="mb-8 flex gap-3">
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write a beautifully engraved review..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 transition-all"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-white text-black font-black px-6 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm"
                                            >
                                                Post
                                            </button>
                                        </form>

                                        {/* Reviews List */}
                                        <div className="flex-1 space-y-4">
                                            {isLoading ? (
                                                <div className="flex flex-col gap-4 animate-pulse">
                                                    <div className="h-24 bg-white/5 rounded-2xl" />
                                                    <div className="h-24 bg-white/5 rounded-2xl" />
                                                </div>
                                            ) : reviews.length > 0 ? (
                                                reviews.map((rev, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={rev.id || i}
                                                        className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
                                                    >
                                                        <div className="flex justify-between items-center mb-3">
                                                            <span className="text-[10px] font-black text-[#1DB954] uppercase tracking-widest">
                                                                {rev.user?.name || 'Explorer'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 font-bold">
                                                                {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                                            {rev.comment}
                                                        </p>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="bg-white/5 rounded-3xl p-12 text-center border border-dashed border-white/10">
                                                    <p className="text-gray-500 font-bold italic">No reviews yet. Be the first to engrave your thoughts!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
