import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Package, Settings, Star, TrendingUp, Users, Calendar, Clock, MapPin, Tag, List, Layout, Edit3, Trash2, XCircle, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../client';
import { AppScreen } from '../types';

interface GuideDashboardScreenProps {
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
}

const GuideDashboardScreen: React.FC<GuideDashboardScreenProps> = ({ onBack, onNavigate }) => {
    const [guideInfo, setGuideInfo] = useState<any>(null);
    const [packages, setPackages] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showRegForm, setShowRegForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'packages' | 'bookings' | 'stats' | 'settings'>('bookings');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [regData, setRegData] = useState({
        bio: '',
        languages: 'Bahasa Indonesia, English',
        specializations: 'Budaya, Kuliner',
        yearsExperience: '1'
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        try {
            const info = await apiService.checkGuideStatus();
            setGuideInfo(info);
            if (info) {
                setRegData({
                    bio: info.bio || '',
                    languages: Array.isArray(info.languages) ? info.languages.join(', ') : info.languages || '',
                    specializations: Array.isArray(info.specializations) ? info.specializations.join(', ') : info.specializations || '',
                    yearsExperience: String(info.yearsExperience || '1')
                });
                const pkgs = await apiService.getMyPackages();
                setPackages(pkgs);
                const bks = await apiService.getGuideBookings();
                setBookings(bks);
                const st = await apiService.getGuideStats();
                setStats(st);
            }
        } catch (error) {
            console.error("Failed to load guide dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        try {
            setMessage(null);
            const data = {
                ...regData,
                languages: regData.languages.split(',').map(l => l.trim()),
                specializations: regData.specializations.split(',').map(s => s.trim())
            };
            await apiService.registerAsGuide(data);

            setMessage({ type: 'success', text: 'Berhasil! Mengalihkan ke Beranda...' });

            // Navigate to home after delay
            setTimeout(() => {
                onNavigate(AppScreen.HOME);
            }, 1000);

        } catch (error) {
            setMessage({ type: 'error', text: "Pendaftaran/Update gagal. Coba lagi." });
        }
    };

    const handleDeletePackage = async (id: string) => {
        if (!confirm("Hapus paket ini?")) return;
        try {
            await apiService.deletePackage(id);
            loadDashboard();
        } catch (error) {
            alert("Gagal menghapus paket");
        }
    };
    const handleUpdateBookingStatus = async (id: string, status: string) => {
        let reason = "";
        if (status === 'CANCELLED') {
            const inputReason = window.prompt("Berikan alasan penolakan pesanan ini:");
            if (inputReason === null) return;
            if (!inputReason.trim()) {
                alert("Alasan penolakan harus diisi.");
                return;
            }
            reason = inputReason;
        }

        try {
            await apiService.updateBookingStatus(id, status, reason);
            loadDashboard();
        } catch (error) {
            alert("Gagal memperbarui status pesanan");
        }
    };
    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-padang-green border-t-transparent"></div>
        </div>
    );

    // Registration View
    if (!guideInfo || guideInfo.status === 'PENDING') {
        return (
            <div className="min-h-screen bg-white animate-in slide-in-from-right duration-500">
                <header className="px-5 pt-12 pb-6 flex items-center gap-4 border-b border-gray-50">
                    <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black text-gray-800">Local Guide Hub</h1>
                </header>

                <main className="p-8 text-center max-w-sm mx-auto space-y-8">
                    <div className="h-24 w-24 bg-padang-green/10 rounded-[32px] flex items-center justify-center mx-auto text-padang-green">
                        <Star size={48} className="fill-padang-green" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">Jadilah Pemandu Lokal</h2>
                        <p className="text-sm text-gray-500 font-medium">Bantu wisatawan menjelajahi keindahan Padang dan dapatkan penghasilan tambahan.</p>
                    </div>

                    {!showRegForm ? (
                        <div className="space-y-4">
                            {guideInfo?.status === 'PENDING' ? (
                                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex flex-col items-center gap-3">
                                    <Clock className="text-amber-500" size={32} />
                                    <p className="text-sm font-black text-amber-800 uppercase tracking-widest">Pendaftaran Diproses</p>
                                    <p className="text-[10px] font-bold text-amber-600">Silahkan datang ke Kantor Dinas Pariwisata Kota Padang.</p>
                                    <p className="text-[10px] font-bold text-amber-600">Tim Verifikasi akan mewawancarai Anda</p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowRegForm(true)}
                                    className="w-full bg-padang-green text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-padang-green/30"
                                >
                                    Daftar Sekarang
                                </button>
                            )}
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Proses verifikasi memakan waktu 1-3 hari kerja</p>
                        </div>
                    ) : (
                        <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom duration-300">
                            {message && (
                                <div className={`p-4 rounded-2xl mb-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-padang-green border border-green-100' : 'bg-red-50 text-chili-red border border-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                    <p className="text-xs font-bold">{message.text}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bio Singkat</label>
                                <textarea
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium outline-none h-24"
                                    value={regData.bio}
                                    onChange={(e) => setRegData({ ...regData, bio: e.target.value })}
                                    placeholder="Ceritakan pengalamanmu sebagai pemandu..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bahasa</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none"
                                        value={regData.languages}
                                        onChange={(e) => setRegData({ ...regData, languages: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengalaman (Thn)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none"
                                        value={regData.yearsExperience}
                                        onChange={(e) => setRegData({ ...regData, yearsExperience: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleRegister}
                                className="w-full bg-padang-green text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl"
                            >
                                Kirim Pendaftaran
                            </button>
                            <button
                                onClick={() => setShowRegForm(false)}
                                className="w-full text-gray-400 text-xs font-black uppercase tracking-widest py-2"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // Dashboard View (Approved Guides)
    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in fade-in duration-500">
            {/* Header */}
            <header className="bg-white px-5 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-800 tracking-tight">Guide Console</h1>
                            <p className="text-[10px] font-bold text-padang-green uppercase tracking-widest flex items-center gap-1">
                                <Star size={10} className="fill-padang-green" /> Professional Guide
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onNavigate(AppScreen.CONVERSATIONS)}
                            className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-padang-green/10 hover:text-padang-green transition-all"
                        >
                            <MessageCircle size={20} />
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${activeTab === 'settings' ? 'bg-padang-green text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Earning', value: `Rp ${(stats?.summary?.totalEarnings || 0).toLocaleString()}`, icon: TrendingUp },
                        { label: 'Bookings', value: stats?.summary?.confirmedBookings || 0, icon: Package },
                        { label: 'Rating', value: stats?.summary?.averageRating || '0.0', icon: Star },
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-2xl">
                            <stat.icon size={16} className="text-padang-green mb-1" />
                            <p className="text-[14px] font-black text-gray-800">{stat.value}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </header>

            {/* Tabs */}
            <nav className="px-5 mt-8 flex gap-3 overflow-x-auto no-scrollbar">
                {[
                    { id: 'packages', label: 'Paket Tour', icon: List },
                    { id: 'bookings', label: 'Pesanan', icon: Package },
                    { id: 'stats', label: 'Analytics', icon: TrendingUp },
                    { id: 'settings', label: 'Profil Pemandu', icon: Settings },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-padang-green text-white shadow-lg shadow-padang-green/30' : 'bg-white text-gray-400 border border-gray-100'
                            }`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </nav>

            <main className="px-5 mt-8 space-y-4">
                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest px-2">Pesanan Masuk ({bookings.length})</h3>
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <div key={booking.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gray-100">
                                                <img src={booking.user?.avatar || `https://ui-avatars.com/api/?name=${booking.user?.name}&background=random`} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-800">{booking.user?.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400">{booking.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                                            booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {booking.bookingStatus}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-padang-green" />
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tanggal Tour</p>
                                                <p className="text-[11px] font-black text-gray-800">{new Date(booking.tourDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Package className="h-4 w-4 text-padang-green" />
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Paket</p>
                                                <p className="text-[11px] font-black text-gray-800">{booking.package?.title}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 text-padang-green" />
                                            <div>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Peserta</p>
                                                <p className="text-[11px] font-black text-gray-800">{booking.participants} Orang</p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.bookingStatus === 'CANCELLED' && booking.cancelReason && (
                                        <div className="bg-red-50 p-3 rounded-2xl border border-red-100 mt-2">
                                            <p className="text-[9px] font-black text-chili-red uppercase tracking-widest mb-1">Dibatalkan oleh {booking.cancelledBy === 'GUIDE' ? 'Pemandu (Anda)' : 'Pemesan'}</p>
                                            <p className="text-[10px] text-gray-600 font-medium">Alasan: {booking.cancelReason}</p>
                                        </div>
                                    )}

                                    {booking.bookingStatus === 'PENDING' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                                                className="flex-1 bg-gray-50 text-gray-400 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} /> Tolak
                                            </button>
                                            <button
                                                onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                                                className="flex-1 bg-padang-green text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-padang-green/30"
                                            >
                                                <CheckCircle2 size={14} /> Setujui
                                            </button>
                                        </div>
                                    )}

                                    {booking.bookingStatus === 'CONFIRMED'}
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package size={32} className="text-gray-200" />
                                </div>
                                <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Belum ada pesanan</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'packages' && (
                    <>
                        <div className="flex justify-between items-center px-2 mb-2">
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Daftar Paket ({packages.length})</h3>
                            <button
                                onClick={() => onNavigate(AppScreen.CREATE_PACKAGE)}
                                className="text-xs font-black text-padang-green uppercase tracking-widest flex items-center gap-1"
                            >
                                <Plus size={14} /> Baru
                            </button>
                        </div>

                        {packages.length > 0 ? (
                            packages.map(pkg => (
                                <div key={pkg.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 group">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-gray-100">
                                            <img src={pkg.photos[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80'} className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-black text-padang-green uppercase tracking-widest px-2 py-0.5 bg-padang-green/10 rounded-lg">
                                                    {pkg.category}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onNavigate(AppScreen.CREATE_PACKAGE, pkg)}
                                                        className="text-gray-400 hover:text-blue-500 transition-colors"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <h4 className="text-sm font-black text-gray-800 mt-1 mb-2 line-clamp-1">{pkg.title}</h4>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs font-bold text-gray-500">Rp {pkg.basePrice.toLocaleString()}</p>
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-[10px] font-black text-gray-700">4.8</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                                <Layout className="mx-auto text-gray-200 mb-4" size={48} />
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Belum ada paket tour</p>
                                <button className="mt-4 text-padang-green text-xs font-black uppercase tracking-widest">Buat Paket Pertama</button>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'stats' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Pesanan</p>
                                <p className="text-2xl font-black text-gray-800">{stats?.summary?.totalBookings || 0}</p>
                                <p className="text-[10px] font-bold text-green-500 mt-1">{stats?.summary?.confirmedBookings || 0} Berhasil</p>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Ulasan</p>
                                <p className="text-2xl font-black text-gray-800">{stats?.summary?.totalReviews || 0}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                    <p className="text-[10px] font-bold text-amber-500">{stats?.summary?.averageRating || '0.0'} Rata-rata</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Tren Pesanan</h3>
                                <div className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-padang-green" />
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bulanan</span>
                                </div>
                            </div>

                            <div className="h-32 flex items-end justify-between gap-2 px-2">
                                {stats?.monthlyChart?.map((item: any, i: number) => {
                                    const max = Math.max(...stats.monthlyChart.map((m: any) => m.value), 1);
                                    const height = (item.value / max) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div
                                                className="w-full bg-padang-green/20 rounded-t-lg relative group transition-all"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.value}
                                                </div>
                                                <div className="absolute inset-0 bg-padang-green rounded-t-lg scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                                            </div>
                                            <span className="text-[8px] font-black text-gray-400 uppercase">{item.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Top Packages */}
                        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Paket Terpopuler</h3>
                            <div className="space-y-4">
                                {stats?.topPackages?.map((pkg: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">
                                                0{i + 1}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800 line-clamp-1">{pkg.title}</p>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{pkg.count} Pesanan</p>
                                            </div>
                                        </div>
                                        <p className="text-xs font-black text-padang-green">Rp {pkg.revenue.toLocaleString()}</p>
                                    </div>
                                ))}
                                {(!stats?.topPackages || stats.topPackages.length === 0) && (
                                    <p className="text-center py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Belum ada data penjualan</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Reviews Summary */}
                        <div className="bg-padang-green p-6 rounded-[32px] text-white shadow-xl shadow-padang-green/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Star size={20} className="fill-white" />
                                </div>
                                <h3 className="text-xs font-black uppercase tracking-widest">Review Insights</h3>
                            </div>
                            <p className="text-[11px] font-bold opacity-80 leading-relaxed">
                                Anda memiliki rata-rata rating {stats?.summary?.averageRating || '0.0'} dari {stats?.summary?.totalReviews || 0} ulasan.
                                Wisatawan sangat menyukai keramahan dan pengetahuan Anda tentang sejarah Kota Padang.
                            </p>
                        </div>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
                        {message && (
                            <div className={`p-4 rounded-2xl mb-4 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-padang-green border border-green-100' : 'bg-red-50 text-chili-red border border-red-100'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                                <p className="text-xs font-bold">{message.text}</p>
                            </div>
                        )}
                        <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-padang-green rounded-full" />
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Update Data Pemandu</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bio Singkat</label>
                                    <textarea
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium outline-none h-32 focus:ring-2 ring-padang-green/20 transition-all"
                                        value={regData.bio}
                                        onChange={(e) => setRegData({ ...regData, bio: e.target.value })}
                                        placeholder="Ceritakan pengalamanmu sebagai pemandu..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bahasa (Pisahkan koma)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-padang-green/20"
                                            value={regData.languages}
                                            onChange={(e) => setRegData({ ...regData, languages: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pengalaman (Thn)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-padang-green/20"
                                            value={regData.yearsExperience}
                                            onChange={(e) => setRegData({ ...regData, yearsExperience: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Spesialisasi (Pisahkan koma)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold outline-none focus:ring-2 ring-padang-green/20"
                                        value={regData.specializations}
                                        onChange={(e) => setRegData({ ...regData, specializations: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleRegister}
                                    className="w-full bg-padang-green text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-padang-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Star size={16} /> Update Profil Guide
                                </button>
                            </div>
                        </section>

                        <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
                            <Clock className="text-amber-500 shrink-0" size={24} />
                            <div>
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Catatan</p>
                                <p className="text-[10px] font-bold text-amber-600 leading-relaxed mt-1">Mengupdate data profil akan memicu proses verifikasi ulang oleh tim admin TIC Padang.</p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* FAB - Create Package */}
            {guideInfo.status === 'APPROVED' && (
                <button
                    className="fixed bottom-32 right-6 h-16 w-16 bg-padang-green text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
                    onClick={() => onNavigate(AppScreen.CREATE_PACKAGE)}
                >
                    <Plus size={32} />
                </button>
            )}
        </div>
    );
};

export default GuideDashboardScreen;
