'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import WelcomeAnimation from '@/components/WelcomeAnimation';

export default function LandingPage() {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {!isRevealed && (
                <WelcomeAnimation onComplete={() => setIsRevealed(true)} />
            )}

            <AnimatePresence>
                {isRevealed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative min-h-screen flex flex-col items-center justify-center"
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(29,185,84,0.15),_transparent_70%)] opacity-50"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(100,255,100,0.1),_transparent_50%)]"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_rgba(0,150,255,0.1),_transparent_50%)]"></div>
                            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
                        </div>

                        {/* Floaties */}
                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 4, 0]
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/20 blur-3xl rounded-full"
                        />
                        <motion.div
                            animate={{
                                y: [0, 30, 0],
                                rotate: [0, -4, 0]
                            }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"
                        />

                        {/* Content Container */}
                        <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="mb-8 flex flex-col items-center"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="w-32 h-32 mb-8 rounded-3xl overflow-hidden shadow-2xl border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000"
                                >
                                    <img src="/logo.jpg" alt="MusicDB Logo" className="w-full h-full object-cover" />
                                </motion.div>
                                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/5 text-retro-gold text-[10px] font-black tracking-[0.4em] uppercase font-serif italic">
                                    A Retro Filmy Experience
                                </div>
                                <h1 className="text-7xl md:text-9xl font-serif italic tracking-tight leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                                    Rhythm <br /> In Every <br /><span className="text-retro-gold">Frame.</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-serif italic">
                                    "The world's most elegant platform for music connoisseurs.
                                    Step into the cinema of sound where reviews become scripts and ratings become Oscars."
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                                className="flex flex-col sm:flex-row gap-5 w-full max-w-lg"
                            >
                                <Link
                                    href="/register"
                                    className="group relative flex-1 bg-retro-gold text-black font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden text-center"
                                >
                                    <span className="relative z-10">Sign the Contract</span>
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Link>
                                <Link
                                    href="/login"
                                    className="flex-1 bg-white/5 border border-white/5 text-white font-black py-5 px-10 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md text-center"
                                >
                                    Returning Star
                                </Link>
                            </motion.div>
                        </main>

                        {/* Feature Teasers */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 2 }}
                            className="absolute bottom-12 flex gap-8 text-retro-gold/40 text-[9px] font-black tracking-[0.3em] uppercase font-serif italic"
                        >
                            <span>Vintage Integration</span>
                            <span className="text-white/10">•</span>
                            <span>Cinematic Analytics</span>
                            <span className="text-white/10">•</span>
                            <span>The Critics' Guild</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .bg-noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
            `}</style>
        </div>
    );
}

