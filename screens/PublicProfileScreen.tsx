import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, User, Calendar, Star, MessageCircle, ArrowRight, Package, Clock, Users } from 'lucide-react';
import { apiService } from '../client';
import { AppScreen } from '../types';

interface PublicProfileScreenProps {
    userId: string | null;
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
}

const PublicProfileScreen: React.FC<PublicProfileScreenProps> = ({ userId, onBack, onNavigate }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            loadProfile();
        }
    }, [userId]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            if (!userId) {
                console.error("No userId provided to PublicProfileScreen");
                return;
            }
            const data = await apiService.getPublicProfile(userId);
            setUser(data);
        } catch (error) {
            console.error("Failed to load public profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-padang-green border-t-transparent"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <User className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-black text-gray-800">Pengguna Tidak Ditemukan</h2>
            <button onClick={onBack} className="mt-4 text-padang-green font-bold text-sm uppercase tracking-widest">Kembali</button>
        </div>
    );

    const isGuide = user?.guide?.status === 'APPROVED';

    const handleChat = async () => {
        if (!user.guide?.id) return;
        try {
            // Start conversation (or get existing) with "General Inquiry" subject
            const conversation = await apiService.startConversation(
                user.guide.id,
                `Pertanyaan untuk ${user.name}`,
                undefined
            );
            onNavigate(AppScreen.CHAT, conversation.id);
        } catch (error) {
            console.error("Failed to start chat", error);
            alert("Gagal memulai percakapan"); // Simple alert for now
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-in slide-in-from-right duration-300">
            {/* Header / Cover */}
            <div className="bg-white pb-6 rounded-b-[40px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-padang-green to-emerald-600"></div>

                <div className="px-5 pt-12 relative z-10">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all mb-4"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex flex-col items-center text-center -mt-8">
                        <div className="h-28 w-28 rounded-full p-1 bg-white shadow-xl mb-4 relative">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                className="h-full w-full rounded-full object-cover border-2 border-gray-50"
                                alt={user.name}
                            />
                            {isGuide && (
                                <div className="absolute bottom-0 right-0 bg-padang-green text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                                    <Star size={14} className="fill-white" />
                                </div>
                            )}
                        </div>

                        <h1 className="text-xl font-black text-gray-800 mb-1">{user.name}</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            Level {user.level} Explorer • Total {user.points} Poin
                        </p>

                        <div className="flex gap-3 mt-6">
                            {isGuide && (
                                <button
                                    onClick={handleChat}
                                    className="px-6 py-2.5 bg-padang-green text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-padang-green/30 flex items-center gap-2"
                                >
                                    <MessageCircle size={16} /> Chat Guide
                                </button>
                            )}
                            {/* Can add "Add Friend" later */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Info */}
            {isGuide && (
                <div className="px-5 mt-6 space-y-6">
                    <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="text-amber-400 fill-amber-400" size={20} />
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Profil Pemandu</h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {user.guide.bio}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Pengalaman</p>
                                    <p className="text-sm font-black text-gray-800">{user.guide.yearsExperience} Tahun</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-black text-gray-800">{user.guide.averageRating.toFixed(1)}</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} size={10} className={`${i <= Math.round(user.guide.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Bahasa</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.guide.languages.map((lang: string, idx: number) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Guide Packages */}
                    {user.guide.packages && user.guide.packages.length > 0 && (
                        <section>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Paket Wisata ({user.guide.packages.length})</h2>
                            </div>
                            <div className="space-y-4">
                                {user.guide.packages.map((pkg: any) => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => onNavigate(AppScreen.TOUR_PACKAGE_DETAIL, pkg.id)}
                                        className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-50 flex gap-4 active:scale-95 transition-transform"
                                    >
                                        <img src={pkg.photos[0]} className="h-20 w-20 rounded-xl object-cover bg-gray-100" alt="" />
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[9px] font-black text-padang-green uppercase tracking-widest bg-padang-green/10 px-2 py-0.5 rounded-md">{pkg.category}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-[10px] font-bold text-gray-600">{pkg.averageRating}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xs font-black text-gray-800 line-clamp-2 mb-2">{pkg.title}</h3>
                                            <p className="text-xs font-bold text-padang-green">Rp {pkg.basePrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* Buddy Posts */}
            {user.buddyPosts && user.buddyPosts.length > 0 && (
                <div className="px-5 mt-6 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Users className="text-padang-green" size={20} />
                        <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Rencana Jalan ({user.buddyPosts.length})</h2>
                    </div>

                    <div className="space-y-3">
                        {user.buddyPosts.map((post: any) => (
                            <div
                                key={post.id}
                                onClick={() => onNavigate(AppScreen.BUDDY_POST_DETAIL, post.id)}
                                className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-50 active:scale-95 transition-transform"
                            >
                                <h3 className="text-sm font-black text-gray-800 mb-1">{post.title}</h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-1 mb-3">Ke {post.destination?.name || 'Tujuan Fleksibel'}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {post.status}
                                    </span>
                                    <ArrowRight size={16} className="text-gray-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="px-5 mt-8 text-center">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    Bergabung sejak {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default PublicProfileScreen;
