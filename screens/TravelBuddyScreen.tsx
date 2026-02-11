import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, Plus, Calendar, MapPin, Users, Filter, ArrowRight } from 'lucide-react';
import { apiService } from '../client';
import { TravelBuddyPost, AppScreen } from '../types';

interface TravelBuddyScreenProps {
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

const TravelBuddyScreen: React.FC<TravelBuddyScreenProps> = ({ onNavigate, onBack }) => {
    const [posts, setPosts] = useState<TravelBuddyPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const data = await apiService.getBuddyPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load buddy posts", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.destination?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <header className="bg-white px-5 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Teman Jalan</h1>
                        <p className="text-xs font-bold text-padang-green uppercase tracking-widest">Cari Teman Baru</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari tujuan atau rencana jalan..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Categories / Filters */}
            <div className="px-5 mt-6 flex gap-3 overflow-x-auto no-scrollbar">
                <button className="px-6 py-2.5 bg-padang-green text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-padang-green/30">
                    Semua Rencana
                </button>
                <button className="px-6 py-2.5 bg-white text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-100">
                    Destinasi Populer
                </button>
                <button className="px-6 py-2.5 bg-white text-gray-500 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-100">
                    Budget Hemat
                </button>
            </div>

            {/* Post List */}
            <main className="px-5 mt-8 space-y-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[32px] h-64 animate-pulse border border-gray-100" />
                    ))
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => onNavigate(AppScreen.BUDDY_POST_DETAIL, post.id)}
                            className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 active:scale-[0.98] transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name}`}
                                        className="h-12 w-12 rounded-2xl object-cover border-2 border-padang-green/10"
                                        alt=""
                                    />
                                    <div>
                                        <h3 className="text-sm font-black text-gray-800">{post.user?.name}</h3>
                                        <p className="text-[10px] font-bold text-padang-green uppercase tracking-widest">Level {post.user?.level || 1} Explorer</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-3 py-1.5 rounded-xl">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {post.status}
                                    </span>
                                </div>
                            </div>

                            <h2 className="text-lg font-black text-gray-800 leading-tight mb-2 group-hover:text-padang-green transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4">
                                {post.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-padang-green" />
                                    <span className="text-[10px] font-bold text-gray-600">
                                        {new Date(post.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-padang-green" />
                                    <span className="text-[10px] font-bold text-gray-600 truncate">
                                        {post.destination?.name || "Tujuan Fleksibel"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {post._count?.applications || 0}/{post.maxBuddies} Teman Bergabung
                                    </span>
                                </div>
                                <button className="h-10 w-10 bg-padang-green text-white rounded-xl flex items-center justify-center shadow-lg shadow-padang-green/20">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="h-20 w-20 bg-gray-100 rounded-[40px] flex items-center justify-center text-gray-400 mx-auto mb-4">
                            <Users size={32} />
                        </div>
                        <h3 className="text-lg font-black text-gray-800">Belum ada rencana janjian</h3>
                        <p className="text-sm text-gray-400 font-bold">Ayo buat rencana pertamamu!</p>
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => onNavigate(AppScreen.CREATE_BUDDY_POST)}
                className="fixed bottom-32 right-6 h-16 w-16 bg-padang-green text-white rounded-[24px] shadow-2xl shadow-padang-green/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
            >
                <Plus size={32} />
            </button>
        </div>
    );
};

export default TravelBuddyScreen;
