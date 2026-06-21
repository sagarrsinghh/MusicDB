'use client';

import React from 'react';
import { Link } from 'react-router-dom';
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
        <Link to={`/artist/${id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-retro-black/40 border border-retro-paper/20 rounded-none p-5 transition-all hover:bg-white/[0.03] hover:border-retro-gold group h-full flex flex-col items-center text-center duration-350"
            >
                <div className="relative w-full aspect-square mb-4">
                    <div className="w-full h-full rounded-none overflow-hidden border border-retro-paper/10 group-hover:border-retro-gold/50 transition-colors bg-retro-black flex items-center justify-center">
                        {image_url && image_url.trim() !== '' ? (
                            <img
                                src={image_url}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    const parent = (e.target as HTMLImageElement).parentElement;
                                    if (parent) {
                                        const fallback = document.createElement('div');
                                        fallback.className = "w-full h-full bg-retro-black flex items-center justify-center text-4xl";
                                        fallback.innerText = '🎤';
                                        parent.appendChild(fallback);
                                    }
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-retro-black flex items-center justify-center text-4xl">
                                🎤
                            </div>
                        )}
                    </div>
                    {popularity && popularity > 70 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-retro-gold text-retro-black text-[8px] font-black px-2 py-0.5 rounded-none border border-retro-black uppercase tracking-widest z-10">
                            Elite
                        </div>
                    )}
                </div>

                <h3 className="text-base font-black tracking-tight text-retro-paper group-hover:text-retro-gold transition-colors line-clamp-1 font-sans uppercase">
                    {name}
                </h3>

                {genres && genres.length > 0 && (
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 line-clamp-1 font-sans">
                        {genres.slice(0, 2).join(' • ')}
                    </p>
                )}
            </motion.div>
        </Link>
    );
}

