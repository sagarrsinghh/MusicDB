'use client';

import { useState } from 'react';

interface RatingStarsProps {
    rating: number | string;
    max?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
    size?: 'sm' | 'md';
    showCount?: boolean;
    count?: number | string;
}

export default function RatingStars({
    rating,
    max = 5,
    interactive = false,
    onRate,
    size = 'md',
    showCount = false,
    count = 0,
}: RatingStarsProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    // TypeORM returns decimal columns as strings, always parse to number
    const numRating = parseFloat(String(rating)) || 0;
    const numCount = parseInt(String(count)) || 0;

    const handleMouseEnter = (index: number) => {
        if (interactive) setHoverRating(index + 1);
    };

    const handleMouseLeave = () => {
        if (interactive) setHoverRating(null);
    };

    const handleClick = (index: number) => {
        if (interactive && onRate) onRate(index + 1);
    };

    if (size === 'sm') {
        // Compact display with fractional gold fill
        const pct = Math.min((numRating / max) * 100, 100);
        return (
            <div className="flex items-center gap-2">
                {/* Star track */}
                <div className="relative inline-flex leading-none">
                    {/* Grey base */}
                    <span className="text-[#3a3a3a] text-base tracking-[2px] select-none leading-none">
                        {'★★★★★'}
                    </span>
                    {/* Gold fill — width proportional to rating */}
                    <span
                        className="absolute inset-0 text-retro-gold text-base tracking-[2px] overflow-hidden select-none leading-none whitespace-nowrap"
                        style={{ width: `${pct}%` }}
                    >
                        {'★★★★★'}
                    </span>
                </div>
                <span className="text-white font-black text-xs tabular-nums">
                    {numRating.toFixed(1)}
                </span>
                {showCount && numCount > 0 && (
                    <span className="text-gray-500 text-[10px] font-medium">
                        ({numCount})
                    </span>
                )}
            </div>
        );
    }

    // Default: large interactive stars
    const displayRating = hoverRating ?? numRating;
    return (
        <div className="flex items-center gap-2" onMouseLeave={handleMouseLeave}>
            <div className="flex text-yellow-500">
                {[...Array(max)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-2xl ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
                        onMouseEnter={() => handleMouseEnter(i)}
                        onClick={() => handleClick(i)}
                    >
                        {i < displayRating ? '★' : '☆'}
                    </span>
                ))}
            </div>
            {showCount && numCount > 0 && (
                <span className="text-sm text-gray-400 font-medium">({numCount} ratings)</span>
            )}
        </div>
    );
}
