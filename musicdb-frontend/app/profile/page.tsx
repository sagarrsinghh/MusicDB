'use client';

import { useEffect, useState } from 'react';
import { userService, UserProfile } from '@/services/user.service';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', bio: '', profile_image: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setEditData({
                name: data.name || '',
                bio: data.bio || '',
                profile_image: data.profile_image || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await userService.updateProfile(editData);
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-32">
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="relative w-full max-w-lg bg-[#0c0c0c] rounded-[3rem] border border-white/10 p-10 shadow-[0_50px_100px_rgba(0,0,0,0.9)]"
                        >
                            <h2 className="text-4xl font-black text-white tracking-tighter mb-8">MODIFY VESSEL</h2>
                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">The Identifier</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 transition-all text-lg font-bold tracking-tight"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">The Echo (Bio)</label>
                                    <textarea
                                        value={editData.bio}
                                        onChange={e => setEditData({ ...editData, bio: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]/50 transition-all h-32 resize-none text-sm leading-relaxed"
                                        placeholder="Speak your truth..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 block">Visual Resonance</label>
                                    <div className="flex bg-white/5 border border-white/10 rounded-3xl p-6 items-center gap-6 group/upload cursor-pointer hover:border-[#1DB954]/50 transition-all relative overflow-hidden">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setEditData({ ...editData, profile_image: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-black/40 overflow-hidden group-hover:border-[#1DB954]/50 transition-all">
                                            {editData.profile_image ? (
                                                <img src={editData.profile_image} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-black text-sm mb-1">Upload New Signal</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">A visual anchor for your resonance.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#1DB954] text-black font-black py-4 rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-[0_10px_20px_rgba(29,185,84,0.2)]"
                                    >
                                        SAVE FREQUENCY
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 bg-white/5 text-white font-black py-4 rounded-2xl hover:bg-white/10 transition-colors uppercase text-xs tracking-widest"
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header / Hero */}
            <header className="relative py-20 overflow-hidden rounded-[3rem] border border-white/5 bg-black/20 px-8">
                {/* Ambient Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1DB954]/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="w-56 h-56 rounded-[3.5rem] bg-gradient-to-br from-[#1DB954] to-emerald-600 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_80px_rgba(29,185,84,0.3)] transition-all duration-700 overflow-hidden">
                            <div className="w-full h-full rounded-[3.2rem] bg-[#0c0c0c] flex items-center justify-center overflow-hidden relative">
                                {profile?.profile_image ? (
                                    <img src={profile.profile_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={profile.name} />
                                ) : (
                                    <span className="text-8xl font-black text-[#1DB954] opacity-20">{profile?.name?.charAt(0).toUpperCase()}</span>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Modify Vessel</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_10px_#1DB954]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Digital Witness</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-10"
                        >
                            {profile?.name?.split(' ')[0]} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-emerald-500 italic uppercase">
                                {profile?.name?.split(' ').slice(1).join(' ') || 'IDENTITY'}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-400 text-lg font-light leading-relaxed tracking-wide max-w-xl mb-12"
                        >
                            {profile?.bio || "A silent observer in the symphony. Begin your critique to amplify your signal across the platform."}
                        </motion.p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 block">Resonance Connections</span>
                                <span className="text-white text-3xl font-black tracking-tighter">{profile?.followed_artists?.length || 0} <span className="text-xs uppercase tracking-widest text-[#1DB954]/50 ml-2">Artists</span></span>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10 hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 block">Contribution Impact</span>
                                <span className="text-white text-3xl font-black tracking-tighter">2.4k <span className="text-xs uppercase tracking-widest text-blue-500/50 ml-2">Pulse</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Badges Section */}
            <section className="px-4">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        <span className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(234,179,8,0.1)]">★</span>
                        REPUTATION MARKS
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {profile?.badges && profile.badges.length > 0 ? (
                        profile.badges.map((badge, i) => (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 p-8 rounded-[3rem] border border-white/10 relative group overflow-hidden hover:bg-white/[0.07] transition-all duration-500"
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity blur-3xl"
                                    style={{ background: badge.color }}
                                />
                                <div className="relative z-10 text-center">
                                    <div
                                        className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-4xl mb-6 mx-auto shadow-2xl relative"
                                        style={{ background: `${badge.color}15`, border: `1px solid ${badge.color}30` }}
                                    >
                                        <div className="absolute inset-0 bg-white/5 rounded-[2rem] animate-pulse" />
                                        <span className="relative z-10">{badge.icon}</span>
                                    </div>
                                    <h3 className="text-white font-black text-2xl mb-2 tracking-tight">{badge.name}</h3>
                                    <p className="text-gray-500 text-[11px] font-bold leading-relaxed uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{badge.description}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.1, scale: 1 }}
                                className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center mx-auto mb-8"
                            >
                                <span className="text-4xl">★</span>
                            </motion.div>
                            <h3 className="text-3xl font-black text-white/30 mb-4 tracking-tighter uppercase italic">Yet to be marked</h3>
                            <p className="text-gray-600 text-sm max-w-xs mx-auto font-medium italic">
                                Rate, review, and witness. Your impact on the frequency is waiting to be recorded.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Following Artists */}
            <section className="px-4">
                <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 mb-12">
                    <span className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">🎷</span>
                    GUIDING ARTISTS
                </h2>
                <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
                    {profile?.followed_artists && profile.followed_artists.length > 0 ? (
                        profile.followed_artists.map((artist) => (
                            <Link key={artist.id} href={`/search?q=${encodeURIComponent(artist.name)}`}>
                                <motion.div
                                    whileHover={{ y: -15, scale: 1.02 }}
                                    className="min-w-[180px] bg-white/5 p-8 rounded-[3.5rem] border border-white/5 text-center group cursor-pointer hover:border-[#1DB954]/30 hover:bg-white/[0.08] transition-all duration-500"
                                >
                                    <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden border-4 border-white/5 group-hover:border-[#1DB954]/50 transition-all duration-700 shadow-2xl">
                                        <img src={artist.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={artist.name} />
                                    </div>
                                    <h4 className="text-white font-black truncate text-lg tracking-tight group-hover:text-[#1DB954] transition-colors">{artist.name}</h4>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1 block group-hover:text-gray-400 transition-colors">Musical Signal</span>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div className="bg-white/5 p-12 rounded-[3.5rem] border border-dashed border-white/10 w-full text-center">
                            <p className="text-gray-600 font-bold uppercase tracking-[0.3em] italic">No artistic signals detected.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
