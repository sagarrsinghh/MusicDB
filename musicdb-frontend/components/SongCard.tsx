import { useUIStore } from '@/store/ui.store';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import RatingStars from './RatingStars';

interface SongCardProps {
    id: string | number;
    title: string;
    artist: any;
    coverUrl?: string;
    album_image?: string;
    preview_url?: string;
    // TypeORM returns decimal columns as strings — accept both
    average_rating?: number | string;
    rating_count?: number | string;
}

export default function SongCard({ id, title, artist, coverUrl, album_image, preview_url, average_rating, rating_count }: SongCardProps) {
    const displayCover = coverUrl || album_image;
    const { setSelectedSong } = useUIStore();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-50, 50], [2, -2]), { stiffness: 100, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-2, 2]), { stiffness: 100, damping: 20 });

    const artistName = (() => {
        if (typeof artist === 'string') return artist;
        if (!artist || typeof artist !== 'object') return 'Unknown Artist';
        return artist.name || artist.artist_name || artist.display_name || 'Unknown Artist';
    })();

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        mouseX.set(x - centerX);
        mouseY.set(y - centerY);
    };

    // TypeORM returns decimal columns as strings — parse both to numbers
    const numAvgRating = Number(average_rating) || 0;
    const numRatingCount = Number(rating_count) || 0;
    const hasRating = numRatingCount > 0;

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); mouseX.set(0); mouseY.set(0); }}
            onClick={() => setSelectedSong({ id, title, artist: artistName, coverUrl: displayCover })}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative cursor-pointer will-change-transform z-10 h-full"
        >
            <div className="block p-4 border border-white/10 rounded-2xl bg-[#0d0d0d] transition-all hover:bg-[#151515] hover:border-retro-gold/40 hover:shadow-[0_0_30px_rgba(197,164,126,0.15)] h-full overflow-hidden duration-500 relative">
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-retro-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl overflow-hidden relative mb-5 shadow-inner">
                    <img
                        src={displayCover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop'}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Rating badge on cover — only for rated songs */}
                    {hasRating && (
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm border border-retro-gold/30 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-lg">
                            <span className="text-retro-gold text-sm leading-none">★</span>
                            <span className="text-retro-gold font-black text-[11px] tabular-nums leading-none">
                                {numAvgRating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="space-y-1.5 relative z-10">
                    <h3 className="text-white text-base font-black truncate tracking-tight group-hover:text-retro-gold transition-colors">{title}</h3>
                    <p className="text-gray-400 text-[10px] truncate font-serif italic tracking-wide">{artistName}</p>

                    {/* Live community rating row — only for songs rated on our platform */}
                    {hasRating ? (
                        <div className="pt-2">
                            <RatingStars
                                rating={numAvgRating}
                                max={5}
                                size="sm"
                                showCount
                                count={numRatingCount}
                            />
                        </div>
                    ) : (
                        <div className="pt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-retro-gold animate-pulse" />
                                <span className="text-[8px] uppercase tracking-[0.2em] text-retro-gold/70 font-black font-sans">Archive Record</span>
                            </div>
                            <span className="text-[8px] text-white/20 font-mono">0{Number(id) % 9 + 1}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
