'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await authService.register({ name, email, password });
            setMessage('Account created successfully. Redirecting to login...');
            setTimeout(() => router.push('/login'), 1400);
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
        <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.14),_transparent_35%)]" />
            <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
                <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.section
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-xl text-retro-gold shadow-inner">
                                ♬
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.35em] text-retro-gold font-black">MusicDB</p>
                                <h1 className="mt-4 text-5xl font-serif italic tracking-tight text-white">Create Your Identity</h1>
                            </div>
                        </div>

                        <p className="mb-8 max-w-md text-sm leading-7 text-gray-300">
                            Join the critics&apos; lounge and bring your taste to the archive. Your account unlocks personalized playlists, rating power, and exclusive music stories.
                        </p>

                        <div className="grid gap-4 rounded-[32px] bg-[#0a0a0a]/80 p-6 border border-white/5">
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-retro-gold/10 text-retro-gold">1</span>
                                <span>Enter your stage name and credentials.</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white">2</span>
                                <span>Secure access with encrypted login.</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-300">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white">3</span>
                                <span>Return to login and step into the archive.</span>
                            </div>
                        </div>
                    </motion.section>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        className="rounded-[40px] border border-white/10 bg-[#0d0d0d]/90 p-10 shadow-2xl backdrop-blur-2xl"
                    >
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-3xl text-retro-gold shadow-inner">
                                ♫
                            </div>
                            <h2 className="text-3xl font-serif italic tracking-tight">Register Your Pass</h2>
                            <p className="mt-2 text-sm text-gray-400">Create a musical identity and start shaping the archive.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.35em] text-gray-500">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Studio Commander"
                                    required
                                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-retro-gold focus:bg-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.35em] text-gray-500">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@musicdb.com"
                                    required
                                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-retro-gold focus:bg-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.35em] text-gray-500">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    required
                                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition focus:border-retro-gold focus:bg-white/10"
                                />
                            </div>

                            {error ? (
                                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
                            ) : null}
                            {message ? (
                                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-3xl bg-retro-gold py-4 text-sm font-black uppercase tracking-[0.35em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isLoading ? 'Building your pass...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
                            <p>Already signed up? <Link href="/login" className="text-retro-gold hover:text-white">Log in</Link></p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

