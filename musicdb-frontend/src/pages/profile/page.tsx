'use client';

import { useEffect, useState } from 'react';
import { userService, UserProfile } from '@/services/user.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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
            <div className="flex items-center justify-center h-[60vh] text-retro-gold font-sans tracking-widest uppercase">
                Recalibrating User Identity Signal...
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-32 text-retro-paper selection:bg-retro-gold selection:text-retro-black">
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="absolute inset-0 bg-retro-black/95"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-lg bg-retro-black rounded-none border border-retro-paper/20 p-10 z-10"
                        >
                            <h2 className="text-4xl font-sans font-black text-retro-paper tracking-tighter mb-8 uppercase">MODIFY VESSEL</h2>
                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">The Identifier</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-retro-black border border-retro-paper/20 rounded-none px-6 py-4 text-retro-paper focus:outline-none focus:border-retro-gold transition-all text-lg font-sans font-black tracking-tight"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">The Echo (Bio)</label>
                                    <textarea
                                        value={editData.bio}
                                        onChange={e => setEditData({ ...editData, bio: e.target.value })}
                                        className="w-full bg-retro-black border border-retro-paper/20 rounded-none px-6 py-4 text-retro-paper focus:outline-none focus:border-retro-gold transition-all h-32 resize-none text-sm leading-relaxed"
                                        placeholder="Speak your truth..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-gray-500 mb-4 block">Visual Resonance</label>
                                    <div className="flex bg-retro-black/40 border border-retro-paper/20 rounded-none p-6 items-center gap-6 group/upload cursor-pointer hover:border-retro-gold transition-all relative overflow-hidden">
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
                                        <div className="w-20 h-20 rounded-none border border-retro-paper/20 flex items-center justify-center bg-retro-black overflow-hidden group-hover:border-retro-gold transition-all">
                                            {editData.profile_image ? (
                                                <img src={editData.profile_image} className="w-full h-full object-cover" alt="Preview" />
                                            ) : (
                                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-retro-paper font-sans font-black text-sm mb-1">Upload New Signal</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">A visual anchor for your resonance.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-retro-gold text-retro-black font-sans font-black py-4 rounded-none border border-retro-black hover:bg-retro-paper hover:text-retro-black transition-all cursor-pointer"
                                    >
                                        SAVE FREQUENCY
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 bg-retro-paper/5 text-retro-paper font-sans font-black py-4 rounded-none border border-retro-paper/20 hover:border-retro-gold hover:text-retro-gold transition-all uppercase text-xs tracking-widest cursor-pointer"
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
            <header className="relative py-20 border border-retro-paper/20 bg-retro-black/40 px-8 rounded-none">
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-12">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <div className="w-56 h-56 rounded-none border-2 border-retro-paper/20 p-1 bg-retro-black group-hover:border-retro-gold transition-all duration-700 overflow-hidden">
                            <div className="w-full h-full rounded-none bg-retro-black flex items-center justify-center overflow-hidden relative">
                                {profile?.profile_image ? (
                                    <img src={profile.profile_image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-1000" alt={profile.name} />
                                ) : (
                                    <span className="text-8xl font-sans font-black text-retro-gold opacity-20">{profile?.name?.charAt(0).toUpperCase()}</span>
                                )}
                                <div className="absolute inset-0 bg-retro-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-retro-paper text-[10px] font-sans font-black uppercase tracking-[0.3em]">Modify Vessel</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-none bg-retro-paper/5 border border-retro-paper/20 mb-8"
                        >
                            <span className="w-2 h-2 rounded-none bg-retro-gold" />
                            <span className="text-[11px] font-sans font-black uppercase tracking-[0.4em] text-gray-500">Digital Witness</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-sans font-black text-retro-paper tracking-tighter leading-[0.8] mb-10"
                        >
                            {profile?.name?.split(' ')[0]} <br />
                            <span className="text-retro-gold font-serif italic uppercase">
                                {profile?.name?.split(' ').slice(1).join(' ') || 'IDENTITY'}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-400 text-lg font-serif italic leading-relaxed tracking-wide max-w-xl mb-12"
                        >
                            {profile?.bio || "A silent observer in the symphony. Begin your critique to amplify your signal across the platform."}
                        </motion.p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-sans font-black tracking-[0.3em] mb-2 block">Resonance Connections</span>
                                <span className="text-retro-paper text-3xl font-sans font-black tracking-tighter">{profile?.followed_artists?.length || 0} <span className="text-xs uppercase tracking-widest text-retro-gold/60 ml-2">Artists</span></span>
                            </div>
                            <div className="w-[1px] h-12 bg-retro-paper/20 hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 uppercase font-sans font-black tracking-[0.3em] mb-2 block">Contribution Impact</span>
                                <span className="text-retro-paper text-3xl font-sans font-black tracking-tighter">2.4k <span className="text-xs uppercase tracking-widest text-retro-accent/60 ml-2">Pulse</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Badges Section */}
            <section className="px-4">
                <div className="flex items-center justify-between mb-12 border-b border-retro-paper/20 pb-4">
                    <h2 className="text-4xl font-sans font-black text-retro-paper tracking-tighter flex items-center gap-4 uppercase">
                        <span className="w-12 h-12 rounded-none bg-retro-gold/10 text-retro-gold border border-retro-gold/30 flex items-center justify-center text-xl">★</span>
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
                                className="bg-retro-black/40 p-8 rounded-none border border-retro-paper/20 relative group overflow-hidden hover:border-retro-gold transition-all duration-500"
                            >
                                <div className="relative z-10 text-center">
                                    <div
                                        className="w-20 h-20 rounded-none flex items-center justify-center text-4xl mb-6 mx-auto relative bg-retro-paper/5 border border-retro-paper/20"
                                    >
                                        <span className="relative z-10">{badge.icon}</span>
                                    </div>
                                    <h3 className="text-retro-paper font-sans font-black text-2xl mb-2 tracking-tight uppercase">{badge.name}</h3>
                                    <p className="text-gray-550 text-[11px] font-sans font-bold leading-relaxed uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">{badge.description}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-retro-black/40 rounded-none border border-dashed border-retro-paper/20">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.1, scale: 1 }}
                                className="w-24 h-24 rounded-none border border-retro-paper/25 flex items-center justify-center mx-auto mb-8 text-retro-paper"
                            >
                                <span className="text-4xl">★</span>
                            </motion.div>
                            <h3 className="text-3xl font-sans font-black text-retro-paper/40 mb-4 tracking-tighter uppercase italic">Yet to be marked</h3>
                            <p className="text-gray-550 text-sm max-w-xs mx-auto font-serif italic">
                                Rate, review, and witness. Your impact on the frequency is waiting to be recorded.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Following Artists */}
            <section className="px-4">
                <h2 className="text-4xl font-sans font-black text-retro-paper tracking-tighter flex items-center gap-4 mb-12 border-b border-retro-paper/20 pb-4 uppercase">
                    <span className="w-12 h-12 rounded-none bg-retro-gold/10 text-retro-gold border border-retro-gold/30 flex items-center justify-center text-xl">🎷</span>
                    GUIDING ARTISTS
                </h2>
                <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar">
                    {profile?.followed_artists && profile.followed_artists.length > 0 ? (
                        profile.followed_artists.map((artist) => (
                            <Link key={artist.id} to={`/search?q=${encodeURIComponent(artist.name)}`}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    className="min-w-[180px] bg-retro-black/40 p-8 rounded-none border border-retro-paper/20 text-center group cursor-pointer hover:border-retro-gold transition-all duration-500"
                                >
                                    <div className="w-28 h-28 rounded-none mx-auto mb-6 overflow-hidden border border-retro-paper/20 group-hover:border-retro-gold transition-all duration-700 shadow-2xl">
                                        <img src={artist.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={artist.name} />
                                    </div>
                                    <h4 className="text-retro-paper font-sans font-black truncate text-lg tracking-tight group-hover:text-retro-gold transition-colors uppercase">{artist.name}</h4>
                                    <span className="text-[9px] font-sans font-black text-gray-500 uppercase tracking-widest mt-1 block group-hover:text-gray-400 transition-colors">Musical Signal</span>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div className="bg-retro-black/40 p-12 rounded-none border border-dashed border-retro-paper/20 w-full text-center">
                            <p className="text-gray-500 font-sans font-black uppercase tracking-[0.3em] italic">No artistic signals detected.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
