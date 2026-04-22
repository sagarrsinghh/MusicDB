'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ArtistCardProps {
    id: number;
    name: string;
    image_url?: string;
    genres?: string[];
    popularity?: number;
}

export default function ArtistCard({ id, name, image_url, genres, popularity }: ArtistCardProps) {
    return (
        <Link href={`/artist/${id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:bg-white/10 group h-full flex flex-col items-center text-center"
            >
                <div className="relative w-full aspect-square mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-retro-gold/50 transition-colors bg-gray-800 flex items-center justify-center">
                        {image_url && image_url.trim() !== '' ? (
                            <img
                                src={image_url}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const parent = (e.target as HTMLImageElement).parentElement;
                                    if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = "w-full h-full bg-gray-800 flex items-center justify-center text-4xl";
                                        fallback.innerText = '🎤';
                                        parent.appendChild(fallback);
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-4xl">
                                🎤
                            </div>
                        )}
                    </div>
                    {popularity && popularity > 70 && (
                        <div className="absolute top-2 right-2 bg-retro-gold text-black text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                            Elite
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-serif italic text-white group-hover:text-retro-gold transition-colors line-clamp-1">
                    {name}
                </h3>

                {genres && genres.length > 0 && (
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 line-clamp-1">
                        {genres.slice(0, 2).join(' • ')}
                    </p>
                )}
            </motion.div>
        </Link>
    );
}
