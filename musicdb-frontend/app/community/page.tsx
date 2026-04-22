'use client';

import { useEffect, useState } from 'react';
import { communityService } from '@/services/community.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';

// Native alternative to date-fns to avoid bundle overhead
const formatDistanceToNowNative = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
};

export default function CommunityPage() {
    const [feed, setFeed] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSelectedSong } = useUIStore();

    useEffect(() => {
        fetchFeed();
        // Poll every 30 seconds for a "live" feel
        const interval = setInterval(fetchFeed, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchFeed = async () => {
        try {
            const data = await communityService.getFeed();
            setFeed(data);
        } catch (error) {
            console.error('Failed to fetch community feed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <header className="mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                    </div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px]">Global Pulse</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-black tracking-tighter"
                >
                    Community
                </motion.h1>
                <p className="text-gray-500 font-bold mt-2 italic">Connect with music explorers from around the globe.</p>
            </header>

            {isLoading ? (
                <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="space-y-6"
                >
                    {feed.map((activity) => (
                        <motion.div
                            key={activity.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="group bg-white/5 hover:bg-white/[0.08] p-6 rounded-[2rem] border border-white/5 transition-all flex gap-6"
                        >
                            {/* User Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-lg">
                                    {activity.user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-black text-lg group-hover:text-blue-400 transition-colors">
                                            {activity.user?.name || 'Anonymous User'}
                                        </h3>
                                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
                                            {formatDistanceToNowNative(new Date(activity.timestamp))} ago
                                            <span className="w-1 h-1 rounded-full bg-gray-700" />
                                            via Global App
                                        </span>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${activity.type === 'review' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {activity.type === 'review' ? 'Review Published' : 'Heart Liked'}
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-2xl p-4 mt-4 border border-white/5 flex items-center gap-4">
                                    {activity.song.album_image && (
                                        <img src={activity.song.album_image} className="w-16 h-16 rounded-xl object-cover shadow-2xl" alt={activity.song.title} />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold truncate">{activity.song.title}</h4>
                                        <p className="text-gray-500 text-sm font-medium truncate">
                                            {activity.song.artist?.name || activity.song.artist}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedSong({
                                                ...activity.song,
                                                artist: activity.song.artist?.name || activity.song.artist,
                                                coverUrl: activity.song.album_image
                                            });
                                        }}
                                        className="px-4 py-2 bg-white/5 hover:bg-[#1DB954] hover:text-black text-xs font-black rounded-lg transition-all border border-white/5 uppercase tracking-widest"
                                    >
                                        Listen
                                    </button>
                                </div>

                                {activity.type === 'review' && (
                                    <div className="mt-4 flex flex-col gap-4">
                                        <p className="text-gray-300 font-medium leading-relaxed italic border-l-2 border-blue-500/30 pl-4">
                                            "{activity.content}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={async () => {
                                                    try {
                                                        const id = activity.id.replace('review-', '');
                                                        await communityService.toggleLike(+id);
                                                        // Optimistic or re-fetch
                                                        fetchFeed();
                                                    } catch (error) {
                                                        console.error('Failed to like review', error);
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors group/like"
                                            >
                                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                                Helpful
                                            </motion.button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {feed.length === 0 && (
                        <div className="py-20 text-center">
                            <h3 className="text-2xl font-black text-gray-600 italic">The world is quiet... for now.</h3>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
