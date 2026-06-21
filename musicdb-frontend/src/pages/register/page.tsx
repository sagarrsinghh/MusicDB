'use client';

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await authService.register({ name, email, password });
            setMessage('Account created successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 1400);
        } catch (error: unknown) {
            const response = error as { response?: { data?: { message?: string } } };
            const message =
                response?.response?.data?.message ||
                (error instanceof Error ? error.message : 'Registration failed. Please try again.');
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-retro-black text-retro-paper flex flex-col items-center justify-center px-6 py-12 selection:bg-retro-gold selection:text-retro-black">
            {/* Atmospheric scanlines/noise */}
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
                {/* 1. Zine Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-8 w-full"
                >
                    <h1 className="font-serif text-retro-gold text-6xl md:text-7xl font-black uppercase tracking-tighter italic leading-none select-none">
                        MusicDB
                    </h1>
                    <p className="text-retro-paper/90 font-serif italic text-sm mt-3 tracking-wide max-w-xs mx-auto">
                        "Music has a way of finding you even in the darkest of places."
                    </p>
                </motion.div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-retro-paper/20 mb-8" />

                {/* 2. Membership Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="w-full bg-retro-black rounded-none border border-retro-paper/20 p-8 md:p-10 relative"
                >
                    <div className="mb-8 border-b border-retro-paper/10 pb-4">
                        <h2 className="font-serif text-retro-gold text-2xl font-black tracking-tight uppercase leading-none mb-1">MEMBERSHIP</h2>
                        <p className="text-[10px] text-gray-500 font-sans font-black uppercase tracking-widest mt-1">CREATE STAGE IDENTITY</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-black block">STAGE IDENTIFIER (NAME)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Studio Commander"
                                required
                                className="w-full rounded-none border border-retro-paper/30 bg-white text-retro-black px-4 py-3 text-base font-sans font-bold placeholder-gray-450 focus:outline-none outline-none focus:border-retro-gold focus:ring-1 focus:ring-retro-gold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-black block">ELECTRONIC MAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@musicdb.com"
                                required
                                className="w-full rounded-none border border-retro-paper/30 bg-white text-retro-black px-4 py-3 text-base font-sans font-bold placeholder-gray-450 focus:outline-none outline-none focus:border-retro-gold focus:ring-1 focus:ring-retro-gold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans font-black block">SECRET CIPHER (PASSWORD)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-none border border-retro-paper/30 bg-white text-retro-black px-4 py-3 text-base font-sans focus:outline-none outline-none focus:border-retro-gold focus:ring-1 focus:ring-retro-gold"
                            />
                        </div>

                        {error ? (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-none border border-red-500/30 bg-red-950/20 p-4 text-xs text-red-200 font-sans"
                            >
                                {error}
                            </motion.div>
                        ) : null}

                        {message ? (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-none border border-retro-gold/30 bg-retro-gold/5 p-4 text-xs text-retro-gold font-sans"
                            >
                                {message}
                            </motion.div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-none bg-retro-gold hover:bg-retro-paper hover:text-retro-black text-retro-black border border-retro-black font-sans font-black py-4 text-xs uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed mt-6 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            {isLoading ? 'REGISTERING...' : 'REGISTER →'}
                        </button>
                    </form>

                    <div className="mt-8 border-t border-retro-paper/10 pt-6 text-center text-xs text-gray-450 font-sans uppercase tracking-widest font-black flex flex-col gap-3">
                        <p className="text-[10px] text-gray-500 font-sans font-bold">ALREADY SIGNED UP?</p>
                        <Link to="/login" className="text-retro-gold hover:text-retro-paper transition-colors">
                            LOG IN TO MEMBERSHIP
                        </Link>
                        <Link to="/welcome" className="text-gray-500 hover:text-retro-paper transition-colors text-[9px]">
                            GO BACK
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
