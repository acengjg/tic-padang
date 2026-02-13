import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, MapPin, Users, Send, ShieldCheck, Heart, MessageSquare, Tag, Info, UserCheck } from 'lucide-react';
import { apiService } from '../client';
import { TravelBuddyPost, AppScreen } from '../types';

interface BuddyPostDetailScreenProps {
    postId: string;
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
}

const BuddyPostDetailScreen: React.FC<BuddyPostDetailScreenProps> = ({ postId, onBack, onNavigate }) => {
    const [post, setPost] = useState<TravelBuddyPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [applyMessage, setApplyMessage] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [showApplyForm, setShowApplyForm] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user_data') || '{}');
    const isOwner = post?.userId === currentUser.id;

    useEffect(() => {
        loadDetail();
    }, [postId]);

    const loadDetail = async () => {
        try {
            const data = await apiService.getBuddyPostDetail(postId);
            setPost(data);
        } catch (error) {
            console.error("Failed to load post detail", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!applyMessage.trim()) return;
        setIsApplying(true);
        try {
            await apiService.applyForBuddy(postId, applyMessage);
            alert("Permintaan bergabung berhasil terkirim!");
            setShowApplyForm(false);
            loadDetail();
        } catch (error) {
            console.error("Apply failed", error);
            alert("Gagal mengirim permintaan.");
        } finally {
            setIsApplying(false);
        }
    };

    const handleUpdateApplication = async (appId: string, status: string) => {
        try {
            await apiService.updateBuddyApplication(appId, status);
            loadDetail();
        } catch (error) {
            console.error("Update application failed", error);
        }
    };

    if (loading) return null;
    if (!post) return <div className="p-10 text-center">Post not found</div>;

    const acceptedCount = post.applications?.filter(a => a.status === 'ACCEPTED').length || 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-40 animate-in fade-in duration-500">
            {/* Header */}
            <header className="bg-white px-5 pt-12 pb-6 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
                <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-black text-gray-800">Detail Rencana</h1>
            </header>

            <main className="p-5 space-y-6">
                {/* User Profile Card */}
                <section
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => {
                        if (post.user?.id) {
                            onNavigate(AppScreen.PUBLIC_PROFILE, post.user.id);
                        }
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.name}`}
                                className="h-14 w-14 rounded-2xl object-cover border-2 border-padang-green/10"
                                alt=""
                            />
                            <div className="absolute -bottom-1 -right-1 bg-padang-green text-white p-0.5 rounded-lg border-2 border-white shadow-sm">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-800">{post.user?.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Postingan dibuat {new Date(post.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>
                    <button className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-padang-green">
                        <MessageSquare size={20} />
                    </button>
                </section>

                {/* Content Section */}
                <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <div className="flex gap-2 mb-3">
                            <span className="bg-padang-green/10 text-padang-green px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {post.status}
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Tag size={10} /> {post.budgetRange}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-800 leading-tight mb-4">{post.title}</h2>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                            {post.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-padang-green shadow-sm">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waktu Perjalanan</p>
                                <p className="text-xs font-bold text-gray-700">
                                    {new Date(post.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - {new Date(post.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-padang-green shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destinasi Utama</p>
                                <p className="text-xs font-bold text-gray-700">{post.destination?.name || "Tujuan Fleksibel"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-padang-green shadow-sm">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kebutuhan Teman</p>
                                <p className="text-xs font-bold text-gray-700">{post.maxBuddies} Orang ({acceptedCount} Bergabung)</p>
                            </div>
                        </div>
                    </div>

                    {post.requirements && (
                        <div className="bg-amber-50 p-6 rounded-[24px] border border-amber-100">
                            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-2 mb-2">
                                <Info size={14} /> Kriteria & Persyaratan
                            </h4>
                            <p className="text-xs font-bold text-amber-700 leading-relaxed italic">
                                "{post.requirements}"
                            </p>
                        </div>
                    )}
                </section>

                {/* Applications / Applicants */}
                <section className="space-y-4">
                    <h3 className="text-lg font-black text-gray-800 px-2">Calon Teman Jalan ({post.applications?.length || 0})</h3>
                    <div className="space-y-3">
                        {post.applications?.map(app => (
                            <div key={app.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => {
                                            if (app.user?.id) {
                                                onNavigate(AppScreen.PUBLIC_PROFILE, app.user.id);
                                            }
                                        }}
                                    >
                                        <img
                                            src={app.user?.avatar || `https://ui-avatars.com/api/?name=${app.user?.name}`}
                                            className="h-10 w-10 rounded-xl object-cover"
                                            alt=""
                                        />
                                        <div>
                                            <h4 className="text-sm font-black text-gray-800">{app.user?.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${app.status === 'ACCEPTED' ? 'bg-green-50 text-green-600' :
                                        app.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                                {app.message && (
                                    <p className="text-xs font-medium text-gray-600 bg-gray-50 p-4 rounded-2xl mb-4 italic">
                                        "{app.message}"
                                    </p>
                                )}

                                {isOwner && app.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateApplication(app.id, 'ACCEPTED')}
                                            className="flex-1 bg-padang-green text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <UserCheck size={14} /> Terima
                                        </button>
                                        <button
                                            onClick={() => handleUpdateApplication(app.id, 'REJECTED')}
                                            className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer Actions */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-5 pb-10 z-30 max-w-md mx-auto">
                {!isOwner && post.status === 'OPEN' && !showApplyForm && (
                    <button
                        onClick={() => setShowApplyForm(true)}
                        className="w-full bg-padang-green text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-padang-green/30 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                    >
                        Ajukan Bergabung <Heart size={18} />
                    </button>
                )}

                {showApplyForm && (
                    <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                        <textarea
                            placeholder="Berikan pesan singkat kenapa kamu ingin bergabung..."
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none h-24 resize-none"
                            value={applyMessage}
                            onChange={(e) => setApplyMessage(e.target.value)}
                        ></textarea>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApplyForm(false)}
                                className="px-6 py-4 bg-gray-100 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleApply}
                                disabled={isApplying || !applyMessage.trim()}
                                className="flex-1 bg-padang-green text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:bg-gray-200"
                            >
                                {isApplying ? 'Mengirim...' : 'Kirim Permintaan'} <Send size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {isOwner && (
                    <div className="text-center">
                        <p className="text-xs font-bold text-gray-400 mb-2 italic">Ini adalah rencana perjalanan Anda</p>
                        <button className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest">
                            Kelola Rencana
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
};

export default BuddyPostDetailScreen;
