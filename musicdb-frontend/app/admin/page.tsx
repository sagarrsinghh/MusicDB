'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { authService } from '@/services/auth.service';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdminAndFetch = async () => {
            const user = authService.getCurrentUser();
            if (!user || user.role !== 'admin') {
                // Ideally this should be handled by a route guard or redirection
                // For MVP, we'll just redirect if not admin on client side.
                // NOTE: Real security happens on backend.
                alert('Access Denied. Admins only.');
                router.push('/');
                return;
            }

            try {
                const response = await api.get('/users/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndFetch();
    }, []);

    if (loading) return <div className="flex h-screen bg-black text-white items-center justify-center">Loading Admin Dashboard...</div>;

    return (
        <div className="flex h-screen bg-black text-white">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Admin Dashboard</h1>
                    <p className="text-gray-400 mt-2">System Overview & Statistics</p>
                </header>

                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Users Card */}
                        <div className="bg-[#181818] p-8 rounded-xl border border-[#333] shadow-lg relative overflow-hidden group hover:border-blue-500 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-9xl font-bold">👤</span>
                            </div>
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Total Users</h3>
                            <p className="text-5xl font-bold text-white">{stats.totalUsers}</p>
                        </div>

                        {/* Artists Card */}
                        <div className="bg-[#181818] p-8 rounded-xl border border-[#333] shadow-lg relative overflow-hidden group hover:border-green-500 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-9xl font-bold">🎤</span>
                            </div>
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Total Artists</h3>
                            <p className="text-5xl font-bold text-white">{stats.totalArtists}</p>
                        </div>

                        {/* Songs Card */}
                        <div className="bg-[#181818] p-8 rounded-xl border border-[#333] shadow-lg relative overflow-hidden group hover:border-purple-500 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-9xl font-bold">🎵</span>
                            </div>
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Total Songs</h3>
                            <p className="text-5xl font-bold text-white">{stats.totalSongs}</p>
                        </div>
                    </div>
                )}

                <div className="bg-[#181818] p-8 rounded-xl border border-[#333]">
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 px-6 py-3 rounded-md font-bold hover:bg-blue-500 transition">Manage Users (Coming Soon)</button>
                        <button className="bg-gray-700 px-6 py-3 rounded-md font-bold hover:bg-gray-600 transition">System Settings</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
