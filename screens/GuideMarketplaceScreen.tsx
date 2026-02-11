import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, ArrowRight, Filter, Search, ChevronLeft, CheckCircle2, Bell } from 'lucide-react';
import { apiService } from '../client';
import { TourPackage, AppScreen } from '../types';

interface GuideMarketplaceScreenProps {
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

const GuideMarketplaceScreen: React.FC<GuideMarketplaceScreenProps> = ({ onNavigate, onBack }) => {
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [guideInfo, setGuideInfo] = useState<any>(null);
    const [bookingCount, setBookingCount] = useState(0);

    const categories = ['Semua', 'Budaya', 'Kuliner', 'Alam', 'Petualangan', 'Seni'];

    useEffect(() => {
        loadPackages();
        loadGuideStatus();
    }, [selectedCategory]);

    const loadGuideStatus = async () => {
        try {
            const info = await apiService.checkGuideStatus();
            setGuideInfo(info);
            // Also load user bookings count for notification
            const bks = await apiService.getBookings();
            const activeCount = bks.filter((b: any) => b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED').length;
            setBookingCount(activeCount);
        } catch (error) {
            console.error("Failed to check guide status", error);
        }
    };

    const loadPackages = async () => {
        setLoading(true);
        try {
            const data = await apiService.getPackages({ category: selectedCategory });
            setPackages(data);
        } catch (error) {
            console.error("Failed to load packages", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPackages = packages.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.guide?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500">
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
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Pemandu Lokal</h1>
                        <p className="text-xs font-bold text-padang-green uppercase tracking-widest">Pengalaman Autentik</p>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            onClick={() => onNavigate(AppScreen.PROFILE, { showBookings: true })}
                            className="h-12 w-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center relative hover:bg-padang-green/10 hover:text-padang-green transition-all"
                        >
                            <Bell size={20} />
                            {bookingCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-chili-red text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-subtle">
                                    {bookingCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => onNavigate(AppScreen.GUIDE_DASHBOARD)}
                            className={`h-12 px-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${guideInfo?.status === 'APPROVED' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-padang-green/10 text-padang-green'}`}
                        >
                            {guideInfo?.status === 'APPROVED' ? (
                                <>Guide Approved <CheckCircle2 size={14} className="text-green-600" /></>
                            ) : guideInfo?.status === 'PENDING' ? (
                                <>Pending Verifikasi <Clock size={14} /></>
                            ) : (
                                <>Jadi Guide <Star size={14} className="fill-padang-green" /></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari pengalaman atau pemandu..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-padang-green text-white shadow-lg shadow-padang-green/30 scale-105'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="px-5 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-gray-800">Paket Wisata Populer</h2>
                    <button className="h-10 w-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-padang-green">
                        <Filter size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-[32px] h-80 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredPackages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 group active:scale-[0.98] transition-all duration-300"
                                onClick={() => onNavigate(AppScreen.TOUR_PACKAGE_DETAIL, pkg.id)}
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <img
                                        src={pkg.photos[0] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={pkg.title}
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                                        <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                                        <span className="text-[11px] font-black text-gray-800">{pkg.averageRating.toFixed(1)}</span>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-padang-green text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-padang-green/20">
                                        {pkg.category}
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <img
                                                src={pkg.guide?.user?.avatar || `https://ui-avatars.com/api/?name=${pkg.guide?.user?.name}`}
                                                className="h-6 w-6 rounded-full border border-white"
                                                alt=""
                                            />
                                            <span className="text-white text-xs font-bold">{pkg.guide?.user?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-gray-800 mb-2 leading-tight">{pkg.title}</h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Clock size={14} className="text-padang-green" />
                                            <span className="text-xs font-bold">{pkg.duration} {pkg.durationType === 'MULTI_DAY' ? 'Hari' : 'Jam'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Users size={14} className="text-padang-green" />
                                            <span className="text-xs font-bold">Maks. {pkg.maxParticipants} Orang</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mulai Dari</p>
                                            <p className="text-lg font-black text-padang-green">
                                                Rp {pkg.basePrice.toLocaleString('id-ID')}
                                                <span className="text-xs text-gray-400 font-bold">/org</span>
                                            </p>
                                        </div>
                                        <button className="h-12 w-12 bg-padang-green text-white rounded-2xl flex items-center justify-center shadow-lg shadow-padang-green/30 group-hover:translate-x-1 transition-transform">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-1">Tidak Ada Paket</h3>
                        <p className="text-sm text-gray-400 font-medium">Coba cari dengan kriteria lain</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GuideMarketplaceScreen;
