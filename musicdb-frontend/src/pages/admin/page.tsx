'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { authService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            const user = authService.getCurrentUser();
            if (!user || user.role !== 'admin') {
                // Ideally this should be handled by a route guard or redirection
                // For MVP, we'll just redirect if not admin on client side.
                // NOTE: Real security happens on backend.
                alert('Access Denied. Admins only.');
                navigate('/');
                return;
            }

            try {
                const response = await api.get('/users/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndFetch();
    }, []);

    if (loading) return <div className="flex h-screen bg-retro-black text-retro-paper items-center justify-center font-sans uppercase tracking-widest text-xs animate-pulse">Loading Admin Database...</div>;

    return (
        <div className="flex h-screen bg-retro-black text-retro-paper font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-sans font-black tracking-tight text-retro-paper uppercase">Admin Registry</h1>
                    <p className="text-gray-500 mt-2 font-sans font-black uppercase tracking-wider text-[10px]">System Overview & Catalog Statistics</p>
                </header>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Users Card */}
                        <div className="bg-retro-black/40 p-8 rounded-none border border-retro-paper/20 relative overflow-hidden group hover:border-retro-gold transition-colors duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-9xl font-bold">👥</span>
                            </div>
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Total Users</h3>
                            <p className="text-5xl font-sans font-black text-retro-paper">{stats.totalUsers}</p>
                        </div>

                        {/* Artists Card */}
                        <div className="bg-retro-black/40 p-8 rounded-none border border-retro-paper/20 relative overflow-hidden group hover:border-retro-gold transition-colors duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-9xl font-bold">🎤</span>
                            </div>
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Total Artists</h3>
                            <p className="text-5xl font-sans font-black text-retro-paper">{stats.totalArtists}</p>
                        </div>

                        {/* Songs Card */}
                        <div className="bg-retro-black/40 p-8 rounded-none border border-retro-paper/20 relative overflow-hidden group hover:border-retro-gold transition-colors duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-9xl font-bold">🎵</span>
                            </div>
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Total Songs</h3>
                            <p className="text-5xl font-sans font-black text-retro-paper">{stats.totalSongs}</p>
                        </div>
                    </div>
                )}

                <div className="bg-retro-black/40 p-8 rounded-none border border-retro-paper/20">
                    <h2 className="text-xl font-sans font-black mb-4 uppercase tracking-tight">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button className="bg-retro-gold text-retro-black border border-retro-black px-6 py-3 rounded-none font-bold font-sans uppercase text-[10px] tracking-wider hover:bg-retro-gold/80 transition cursor-pointer">Manage Users (Coming Soon)</button>
                        <button className="bg-retro-black border border-retro-paper/20 text-retro-paper px-6 py-3 rounded-none font-bold font-sans uppercase text-[10px] tracking-wider hover:bg-retro-paper/5 transition cursor-pointer">System Settings</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

