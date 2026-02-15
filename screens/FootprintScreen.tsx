import React, { useState, useEffect } from 'react';
import { Footprint, FootprintStats, AppScreen, Badge } from '../types';
import { apiService, getProxiedImageUrl } from '../client';
import { MapPin, Trophy, History, Camera, User, ChevronRight, Star, Clock, ChevronLeft, Map as MapIcon, Calendar, Sparkles, Award } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import JourneyMap from '../components/JourneyMap';

const StatCard: React.FC<{ label: string, value: string | number, icon: any, color: string }> = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 flex-1">
        <div className="flex items-center gap-2 mb-1.5">
            <div className={`p-1.5 rounded-lg bg-white/20`}>
                <Icon size={14} className="text-white" />
            </div>
            <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-2xl font-black text-white tracking-tight">{value}</p>
    </div>
);

const FootprintScreen: React.FC<{ onNavigate: (screen: AppScreen, data?: any) => void, onBack: () => void }> = ({ onNavigate, onBack }) => {
    const [stats, setStats] = useState<FootprintStats | null>(null);
    const [footprints, setFootprints] = useState<Footprint[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'timeline' | 'map'>('timeline');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, footprintsData, badgesData] = await Promise.all([
                    apiService.getFootprintStats(),
                    apiService.getFootprints(),
                    apiService.getBadges()
                ]);
                setStats(statsData);
                setFootprints(footprintsData);
                setBadges(badgesData);
            } catch (error) {
                console.error('Error fetching footprint data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-off-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-3xl border-4 border-padang-green/20 border-t-padang-green animate-spin"></div>
                        <MapPin className="absolute inset-0 m-auto text-padang-green animate-pulse" size={24} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mancari Jejak...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-off-white">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-padang-green to-emerald-700 pt-14 pb-12 px-6 rounded-b-[48px] shadow-2xl relative overflow-hidden shrink-0">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 h-48 w-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                <div className="relative z-10 flex items-center justify-between mb-8">
                    <button onClick={onBack} className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-95 transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[4px] mb-1 pl-1">Petualangan</span>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight">Jejak Wisata</h1>
                    </div>
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                        <Sparkles size={20} />
                    </div>
                </div>

                {/* Main Stats */}
                <div className="relative z-10 flex gap-4">
                    <StatCard label="Total Kunjungan" value={stats?.totalVisits || 0} icon={MapPin} color="bg-blue-500" />
                    <StatCard label="Poin Terkumpul" value={`${stats?.totalPoints || 0} pts`} icon={Award} color="bg-orange-500" />
                </div>
            </div>

            {/* Badges Quick View */}
            <div className="px-6 -mt-8 relative z-20 mb-8">
                <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-6 shadow-2xl shadow-black/5 border border-white">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-padang-green uppercase tracking-widest mb-0.5">Pencapaian</span>
                            <h2 className="text-sm font-black text-gray-800">Lencana Koleksi</h2>
                        </div>
                        <button
                            onClick={() => onNavigate(AppScreen.BADGES)}
                            className="bg-gray-50 hover:bg-padang-green/5 text-padang-green px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                        >
                            Lihat Semua <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar px-1">
                        {badges.length > 0 ? (
                            badges.slice(0, 5).map((badge) => (
                                <div key={badge.id} className="flex flex-col items-center shrink-0 group">
                                    <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center border-2 transition-all p-3 ${badge.unlocked ? 'bg-padang-green/5 border-padang-green/20' : 'bg-gray-50 border-gray-100 grayscale opacity-40'}`}>
                                        <img src={getProxiedImageUrl(badge.image)} className="w-full h-full object-contain" alt={badge.name} />
                                    </div>
                                    <span className={`text-[9px] font-black mt-2 uppercase tracking-tighter ${badge.unlocked ? 'text-gray-700' : 'text-gray-300'}`}>{badge.unlocked ? badge.name : 'Terkunci'}</span>
                                </div>
                            ))
                        ) : (
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-16 w-16 rounded-[24px] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center shrink-0">
                                    <Award size={20} className="text-gray-200" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Selection Tabs */}
            <div className="px-6 mb-6 shrink-0">
                <div className="bg-white p-1.5 rounded-3xl flex gap-1.5 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('timeline')}
                        className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'timeline' ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <History size={16} /> Timeline
                    </button>
                    <button
                        onClick={() => setActiveTab('map')}
                        className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'map' ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <MapIcon size={16} /> Jejak Peta
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 pb-32 ${activeTab === 'map' ? 'flex flex-col h-full overflow-hidden' : 'overflow-y-auto no-scrollbar'}`}>
                {activeTab === 'timeline' ? (
                    <div className="px-6 space-y-6">
                        {footprints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                                <div className="h-24 w-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 border-2 border-white shadow-sm">
                                    <Camera size={40} className="text-gray-200" />
                                </div>
                                <h3 className="text-lg font-black text-gray-800 mb-2">Alum ado jejak lai...</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">Mulai petualangan di Padang, lakukan scan QR atau Check-in untuak mencatat jejak wisata Anda!</p>
                            </div>
                        ) : (
                            footprints.map((item, idx) => (
                                <div key={item.id} className="relative group">
                                    {/* Vertical Line */}
                                    {idx !== footprints.length - 1 && (
                                        <div className="absolute left-[23px] top-12 bottom-[-24px] w-1 bg-gradient-to-b from-padang-green/20 to-transparent rounded-full"></div>
                                    )}

                                    <div className="flex gap-5">
                                        {/* Node Icon */}
                                        <div className="flex flex-col items-center">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-lg border border-gray-50 flex items-center justify-center z-10 transition-all group-hover:bg-padang-green group-hover:text-white group-hover:scale-110">
                                                {item.culinarySpotId ? <Camera size={20} /> : <MapPin size={20} />}
                                            </div>
                                        </div>

                                        {/* Card content */}
                                        <div className="flex-1 bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 group-hover:shadow-xl group-hover:border-padang-green/10 transition-all mb-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <Clock size={10} className="text-gray-300" />
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(item.visitDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <h4 className="font-black text-gray-800 text-sm group-hover:text-padang-green transition-colors">{item.destination?.name || item.culinarySpot?.name || item.event?.name || 'Kunjungan'}</h4>
                                                </div>
                                                <div className="flex gap-0.5 mt-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={10} className={s <= (item.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100'} />
                                                    ))}
                                                </div>
                                            </div>

                                            {item.note && (
                                                <div className="bg-gray-50 p-3 rounded-2xl mb-4 italic text-gray-500 text-[11px] leading-relaxed relative">
                                                    <span className="absolute -top-1 -left-1 text-2xl text-gray-200 font-serif leading-none">"</span>
                                                    {item.note}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 bg-padang-green/5 px-2.5 py-1.5 rounded-xl border border-padang-green/10">
                                                    <Trophy size={11} className="text-padang-green" />
                                                    <span className="text-[10px] font-black text-padang-green">+{item.pointsEarned} XP</span>
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {idx % 3 === 0 && (
                                                        <div className="h-6 w-6 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[8px] font-black text-blue-600"> solo </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="flex-1 px-6 pb-6 flex flex-col gap-4 h-full">
                        <div className="flex-1 bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-white relative min-h-[400px] h-full">
                            <JourneyMap key={`${activeTab}-${footprints.length}`} footprints={footprints} />
                        </div>
                        <div className="bg-padang-green/5 p-4 rounded-3xl border border-padang-green/10 flex items-center gap-3 shrink-0">
                            <div className="h-10 w-10 bg-padang-green rounded-2xl flex items-center justify-center text-white shrink-0">
                                <History size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-padang-green leading-relaxed uppercase tracking-tight">Visualisasi peta menampilkan jalur perjalanan Anda berdasarkan urutan waktu kunjungan.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FootprintScreen;
