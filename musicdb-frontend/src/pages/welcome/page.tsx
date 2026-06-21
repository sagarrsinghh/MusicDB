'use client';

import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import WelcomeAnimation from '@/components/WelcomeAnimation';

export default function LandingPage() {
    const [isRevealed, setIsRevealed] = useState(false);

    // Generate random transition speed for each visualizer bar to make it feel natural
    const visualizerBars = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => ({
            id: i,
            duration: 0.8 + Math.random() * 1.2,
            maxHeight: 30 + Math.random() * 90
        }));
    }, []);

    return (
        <div className="relative min-h-screen bg-retro-black text-retro-paper font-sans overflow-hidden flex flex-col justify-between selection:bg-retro-gold selection:text-retro-black">
            {!isRevealed && (
                <WelcomeAnimation onComplete={() => setIsRevealed(true)} />
            )}

            <AnimatePresence>
                {isRevealed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative min-h-screen flex flex-col justify-between z-10"
                    >
                        {/* Atmospheric background scanlines/noise */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                        </div>

                        {/* Top Navbar Brand */}
                        <header className="px-8 py-6 flex justify-between items-center relative z-20 max-w-[1600px] mx-auto w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-none bg-retro-gold border border-retro-black" />
                                <span className="text-[10px] tracking-[0.4em] font-black uppercase text-retro-gold font-sans">EST. 2026 ARCHIVE</span>
                            </div>
                            <div className="text-right font-serif italic text-xs text-gray-500">
                                The Sound Cinema
                            </div>
                        </header>

                        {/* Main Stage */}
                        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-12">
                            {/* Rotating Vinyl Record Graphic */}
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="mb-10 relative group"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-[#121212] border-4 border-zinc-800 flex items-center justify-center cursor-pointer shadow-none"
                                >
                                    {/* Record Grooves */}
                                    <div className="absolute inset-4 rounded-full border border-zinc-900/60" />
                                    <div className="absolute inset-8 rounded-full border border-zinc-900/40" />
                                    <div className="absolute inset-12 rounded-full border border-zinc-900/20" />
                                    <div className="absolute inset-16 rounded-full border border-zinc-900/10" />

                                    {/* Center Label */}
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-retro-gold border-2 border-zinc-950 flex items-center justify-center relative shadow-none">
                                        <div className="w-3.5 h-3.5 rounded-full bg-retro-black border border-retro-gold/20" />
                                        <div className="absolute text-[5px] font-black uppercase tracking-[0.25em] text-black bottom-1.5 md:bottom-2 font-sans">REEL</div>
                                    </div>
                                </motion.div>

                                {/* Playhead Needle Arm */}
                                <div className="absolute -top-6 -right-6 w-12 h-20 origin-top-left rotate-12 group-hover:rotate-[18deg] transition-transform duration-700 pointer-events-none">
                                    <svg viewBox="0 0 50 100" className="w-full h-full text-zinc-650 fill-current opacity-80 group-hover:text-retro-gold group-hover:opacity-100 transition-colors duration-700">
                                        <path d="M10 0h5v40h-5zM8 40h9v10H8zM12 50l15 35 5-2-12-35zM27 80h10v10H27z" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Tagline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="space-y-6"
                            >
                                <h1 className="font-serif text-retro-gold text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none select-none">
                                    LINER NOTES
                                </h1>
                                <p className="text-retro-paper/90 font-serif italic text-base mt-3 tracking-wide max-w-md mx-auto">
                                    "Music has a way of finding you even in the darkest of places."
                                </p>
                                <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed font-serif italic border-l border-retro-gold/30 pl-6 my-8 text-left md:text-center">
                                    Step into the ultimate archive for music connoisseurs.
                                    Discover curated records, log deep critiques, and follow the resonance frequencies of legendary artists.
                                </p>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="flex flex-col sm:flex-row gap-5 w-full max-w-md mt-8"
                            >
                                <Link
                                    to="/login"
                                    className="group relative flex-1 bg-retro-gold text-retro-black font-sans font-black py-4 px-8 rounded-none border border-retro-black text-xs uppercase tracking-widest transition-all duration-300 hover:bg-retro-paper hover:text-retro-black text-center cursor-pointer"
                                >
                                    AUTHENTICATE →
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex-1 bg-retro-black border border-retro-paper/20 text-retro-paper font-sans font-black py-4 px-8 rounded-none text-xs uppercase tracking-widest hover:bg-retro-paper/5 hover:border-retro-paper/50 transition-all duration-300 text-center cursor-pointer"
                                >
                                    SIGN UP FOR MEMBERSHIP
                                </Link>
                            </motion.div>
                        </main>

                        {/* Interactive Musical Equalizer Footer */}
                        <footer className="w-full relative py-8 overflow-hidden z-20">
                            {/* Animated Visualizer wave */}
                            <div className="flex justify-center items-end gap-1.5 h-16 opacity-30 select-none pointer-events-none max-w-2xl mx-auto">
                                {visualizerBars.map((bar) => (
                                    <motion.div
                                        key={bar.id}
                                        className="w-[3px] rounded-none bg-retro-gold"
                                        animate={{
                                            height: [8, bar.maxHeight, 8]
                                        }}
                                        transition={{
                                            duration: bar.duration,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="text-center mt-6 text-retro-gold/40 text-[9px] font-sans font-black tracking-[0.45em] uppercase italic">
                                Vintage Integration · Cinematic Analytics · Curators Guild
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
