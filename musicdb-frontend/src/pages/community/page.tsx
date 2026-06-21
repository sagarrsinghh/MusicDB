'use client';

import { useEffect, useState } from 'react';
import { communityService } from '@/services/community.service';
import { motion } from 'framer-motion';
import { useUIStore } from '@/store/ui.store';

const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function CommunityPage() {
    const [feed, setFeed] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { setSelectedSong } = useUIStore();

    useEffect(() => {
        fetchFeed();
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
        <div className="px-6 md:px-[48px] py-10 pb-28 text-retro-paper max-w-4xl selection:bg-retro-gold selection:text-retro-black">
            {/* Compact Header */}
            <header className="mb-8 border-b border-retro-paper/20 pb-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 bg-retro-gold animate-pulse" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-[0.4em] text-retro-gold">Live Feed</span>
                </div>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-sans font-black tracking-tighter uppercase leading-none">
                            Community <span className="text-retro-gold italic font-serif">Pulse</span>
                        </h1>
                        <p className="text-gray-500 font-serif text-[10px] mt-1 italic">
                            What music lovers around the world are listening to right now.
                        </p>
                    </div>
                    {feed.length > 0 && (
                        <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest">
                            {feed.length} activities
                        </span>
                    )}
                </div>
            </header>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-28 bg-retro-paper/5 border border-retro-paper/10 animate-pulse" />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                    }}
                    className="space-y-4"
                >
                    {feed.map((activity) => (
                        <motion.div
                            key={activity.id}
                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                            className="group bg-retro-black/40 hover:bg-white/[0.02] p-4 border border-retro-paper/20 hover:border-retro-gold/30 transition-all"
                        >
                            <div className="flex gap-3">
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-none bg-retro-gold flex-shrink-0 flex items-center justify-center text-retro-black font-sans font-black text-sm border border-retro-black">
                                    {activity.user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* User Info */}
                                    <div className="flex justify-between items-start gap-3 flex-wrap mb-2">
                                        <div>
                                            <span className="font-sans font-black text-xs text-retro-paper uppercase tracking-tight">
                                                {activity.user?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-[9px] text-gray-500 ml-2">
                                                {formatTime(new Date(activity.timestamp))}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-0.5 border text-[8px] font-sans font-black uppercase tracking-wider ${activity.type === 'review' ? 'bg-retro-gold/10 text-retro-gold border-retro-gold/30' : 'bg-retro-accent/10 text-retro-accent border-retro-accent/30'}`}>
                                            {activity.type === 'review' ? '★ Review' : '♥ Liked'}
                                        </span>
                                    </div>

                                    {/* Song Card */}
                                    <div className="bg-retro-black/60 p-3 border border-retro-paper/10 flex items-center gap-3 mb-2">
                                        {activity.song.album_image && (
                                            <img
                                                src={activity.song.album_image}
                                                className="w-12 h-12 border border-retro-paper/20 object-cover flex-shrink-0"
                                                alt={activity.song.title}
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-retro-paper font-sans font-black truncate text-xs uppercase tracking-tight">
                                                {activity.song.title}
                                            </h4>
                                            <p className="text-gray-400 text-[10px] font-serif italic truncate">
                                                {activity.song.artist?.name || activity.song.artist}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSong({
                                                ...activity.song,
                                                artist: activity.song.artist?.name || activity.song.artist,
                                                coverUrl: activity.song.album_image
                                            })}
                                            className="px-3 py-1.5 bg-retro-gold hover:bg-retro-paper text-retro-black text-[9px] font-sans font-black border border-retro-black uppercase tracking-wider transition-all cursor-pointer shrink-0"
                                        >
                                            ▶ Play
                                        </button>
                                    </div>

                                    {/* Review Text */}
                                    {activity.type === 'review' && activity.content && (
                                        <div className="flex items-start gap-3">
                                            <blockquote className="flex-1 text-gray-400 font-serif italic border-l border-retro-gold/30 pl-3 leading-relaxed text-[10px]">
                                                "{activity.content}"
                                            </blockquote>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const id = activity.id.replace('review-', '');
                                                        await communityService.toggleLike(+id);
                                                        fetchFeed();
                                                    } catch { }
                                                }}
                                                className="flex items-center gap-1 px-2 py-1 border border-retro-paper/20 text-[8px] font-sans font-black uppercase text-gray-500 hover:text-retro-gold hover:border-retro-gold transition-colors cursor-pointer shrink-0"
                                            >
                                                ♥ Helpful
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {feed.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-retro-paper/20">
                            <span className="text-3xl block mb-3">🎵</span>
                            <h3 className="text-sm font-serif text-gray-500 italic">The feed is quiet right now.</h3>
                            <p className="text-[9px] font-sans font-black text-gray-600 uppercase tracking-widest mt-1">Listen to music and leave reviews to start the conversation.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
