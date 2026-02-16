import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Star, Clock, Users, MapPin,
    CheckCircle2, XCircle, Calendar, MessageCircle,
    ArrowRight, ShieldCheck, Info
} from 'lucide-react';
import { apiService } from '../client';
import YouTubePlayer from '../components/YouTubePlayer';
import { TourPackage, AppScreen } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface TourPackageDetailScreenProps {
    packageId: string;
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
    hideBookingBar?: boolean;
}

const LeafletMap: React.FC<{ lat: number; lng: number; popupContent: string }> = ({ lat, lng, popupContent }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);

    useEffect(() => {
        const initMap = () => {
            if (mapRef.current && !leafletRef.current) {
                if (mapRef.current.clientHeight === 0) {
                    setTimeout(initMap, 100);
                    return;
                }

                // Fix icon path for Leaflet
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });

                const map = L.map(mapRef.current).setView([lat, lng], 15);
                leafletRef.current = map;

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(popupContent)
                    .openPopup();

                setTimeout(() => map.invalidateSize(), 200);
            }
        };

        const timeoutId = setTimeout(initMap, 100);

        let resizeObserver: ResizeObserver | null = null;
        if (mapRef.current) {
            resizeObserver = new ResizeObserver(() => {
                if (leafletRef.current) {
                    leafletRef.current.invalidateSize();
                }
            });
            resizeObserver.observe(mapRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            if (resizeObserver) resizeObserver.disconnect();
            if (leafletRef.current) {
                leafletRef.current.remove();
                leafletRef.current = null;
            }
        };
    }, [lat, lng, popupContent]);

    return (
        <div className="w-full h-[320px] relative meeting-point-map-container">
            <style>{`
                .meeting-point-map-container .leaflet-container {
                    height: 100% !important;
                    width: 100% !important;
                    min-height: 320px;
                }
            `}</style>
            <div ref={mapRef} className="w-full h-full z-0" style={{ height: '320px', minHeight: '320px' }} />
        </div>
    );
};

const TourPackageDetailScreen: React.FC<TourPackageDetailScreenProps> = ({ packageId, onBack, onNavigate, hideBookingBar }) => {
    const userData = localStorage.getItem('user_data');
    const [pkg, setPkg] = useState<TourPackage | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'itinerary' | 'guide'>('info');

    const isOwner = pkg && userData && pkg.guide?.userId === JSON.parse(userData).id;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await apiService.getPackageDetail(packageId);
                setPkg(data);
            } catch (error) {
                console.error("Failed to fetch package detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [packageId]);

    const handleContactGuide = async () => {
        if (!pkg.guideId) return;
        try {
            const conversation = await apiService.startConversation(
                pkg.guideId,
                pkg.title,
                // Default to empty or today if no date selected yet, 
                // but usually chat from detail is "asking about THIS package"
                undefined
            );
            onNavigate(AppScreen.CHAT, conversation.id);
        } catch (error) {
            console.error("Failed to start conversation", error);
            alert("Gagal menghubungi pemandu");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-padang-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
                <h2 className="text-xl font-black text-gray-800 mb-2">Paket Tidak Ditemukan</h2>
                <button onClick={onBack} className="text-padang-green font-bold">Kembali</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative h-[400px]">
                <img
                    src={pkg.photos[0] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"}
                    className="w-full h-full object-cover"
                    alt={pkg.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <button
                    onClick={onBack}
                    className="absolute top-12 left-5 h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-95 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="absolute bottom-8 left-5 right-5">
                    <div className="flex gap-2 mb-3">
                        <span className="bg-padang-green text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-padang-green/40">
                            {pkg.category}
                        </span>
                        <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                            <span className="text-[11px] font-black text-gray-800">{pkg.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-white leading-tight mb-4">{pkg.title}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/80">
                            <Clock size={16} className="text-padang-green" />
                            <span className="text-xs font-bold">{pkg.duration} {pkg.durationType === 'MULTI_DAY' ? 'Hari' : 'Jam'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <Users size={16} className="text-padang-green" />
                            <span className="text-xs font-bold">Maks. {pkg.maxParticipants} Orang</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white sticky top-0 z-20 border-b border-gray-100 flex px-5 shadow-sm">
                {(['info', 'itinerary', 'guide'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-padang-green' : 'text-gray-400'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-padang-green rounded-t-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-5">
                {activeTab === 'info' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
                        {/* Description */}
                        <section>
                            <h3 className="text-lg font-black text-gray-800 mb-3">Tentang Pengalaman Ini</h3>
                            {pkg.videoUrl && <YouTubePlayer url={pkg.videoUrl} className="mb-6 rounded-3xl" />}
                            <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                                {pkg.description}
                            </p>
                        </section>

                        {/* Meeting Point */}
                        <section className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight">Titik Temu</h4>
                                    <p className="text-xs font-bold text-gray-500">{pkg.meetingPoint}</p>
                                </div>
                            </div>
                            <div className="h-[320px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100 meeting-point-map-container" style={{ height: '320px', minHeight: '320px' }}>
                                {pkg.meetingPointLat && pkg.meetingPointLng ? (
                                    <LeafletMap
                                        lat={pkg.meetingPointLat}
                                        lng={pkg.meetingPointLng}
                                        popupContent={`Titik Temu: ${pkg.meetingPoint}`}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-bold p-10 text-center">
                                        <MapPin size={32} className="mb-2 opacity-20" />
                                        <p className="text-[10px] uppercase tracking-widest">Peta belum tersedia untuk paket ini</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 gap-4">
                            <section className="bg-green-50/50 p-6 rounded-[32px] border border-green-100">
                                <h4 className="text-sm font-black text-green-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Termasuk
                                </h4>
                                <ul className="space-y-2">
                                    {pkg.inclusions.map((item, idx) => (
                                        <li key={idx} className="text-xs font-bold text-green-700 flex items-center gap-2">
                                            <div className="h-1 w-1 bg-green-400 rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="bg-rose-50/50 p-6 rounded-[32px] border border-rose-100">
                                <h4 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <XCircle size={16} /> Tidak Termasuk
                                </h4>
                                <ul className="space-y-2">
                                    {pkg.exclusions.map((item, idx) => (
                                        <li key={idx} className="text-xs font-bold text-rose-700 flex items-center gap-2">
                                            <div className="h-1 w-1 bg-rose-400 rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        {/* Requirements */}
                        <section className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100">
                            <h4 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Info size={16} /> Persyaratan
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Kebugaran</p>
                                    <p className="text-xs font-bold text-blue-700">{pkg.requirements?.fitnessLevel || 'Ringan'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Usia Minimal</p>
                                    <p className="text-xs font-bold text-blue-700">{pkg.requirements?.minAge || '5'} Tahun</p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'itinerary' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
                        <h3 className="text-lg font-black text-gray-800">Rencana Perjalanan</h3>
                        <div className="relative border-l-2 border-padang-green/20 ml-3 pl-8 space-y-10">
                            {pkg.itinerary.map((item: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[41px] top-0 h-6 w-6 bg-white border-4 border-padang-green rounded-full shadow-lg shadow-padang-green/20"></div>
                                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                        <span className="text-[10px] font-black text-padang-green uppercase tracking-widest mb-1 block">
                                            {item.time}
                                        </span>
                                        <h4 className="text-sm font-black text-gray-800 mb-1">{item.place}</h4>
                                        <p className="text-xs font-bold text-gray-500">{item.activity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'guide' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-400">
                        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 text-center">
                            <div
                                className="cursor-pointer group"
                                onClick={() => {
                                    const targetId = (pkg.guide?.user as any)?.id || (pkg.guide as any)?.userId;
                                    if (targetId) {
                                        onNavigate(AppScreen.PUBLIC_PROFILE, targetId);
                                    }
                                }}
                            >
                                <div className="relative inline-block mb-4 transition-transform group-hover:scale-105">
                                    <img
                                        src={pkg.guide?.user?.avatar || `https://ui-avatars.com/api/?name=${pkg.guide?.user?.name}`}
                                        className="h-24 w-24 rounded-[32px] object-cover border-4 border-gray-50 bg-gray-100"
                                        alt={pkg.guide?.user?.name}
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-padang-green text-white p-1.5 rounded-xl shadow-lg shadow-padang-green/30">
                                        <ShieldCheck size={20} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-gray-800 mb-1 group-hover:text-padang-green transition-colors">{pkg.guide?.user?.name}</h3>
                                <p className="text-xs font-bold text-padang-green uppercase tracking-widest mb-6">Pemandu Terverifikasi</p>
                            </div>

                            <div className="flex justify-center gap-8 mb-8">
                                <div className="text-center">
                                    <p className="text-lg font-black text-gray-800">{pkg.guide?.averageRating.toFixed(1)}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Rating</p>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-100 self-center"></div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-gray-800">{pkg.guide?.totalTours}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tour</p>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-100 self-center"></div>
                                <div className="text-center">
                                    <p className="text-lg font-black text-gray-800">{pkg.guide?.yearsExperience}+</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Tahun</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8 px-4 italic">
                                "{pkg.guide?.bio}"
                            </p>

                            {!isOwner && (
                                <button
                                    onClick={handleContactGuide}
                                    className="w-full bg-gray-50 text-gray-800 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors border border-gray-100"
                                >
                                    <MessageCircle size={18} className="text-padang-green" /> Hubungi Pemandu
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Bottom Booking Bar */}
            {!isOwner && !hideBookingBar && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 pt-4 pb-10 flex items-center justify-between z-50 max-w-md mx-auto shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Harga Per Orang</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-padang-green">Rp {pkg?.basePrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate(AppScreen.BOOKING, pkg)}
                        className="bg-padang-green text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-padang-green/30 active:scale-95 transition-all text-sm font-black uppercase tracking-widest"
                    >
                        Book Now <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TourPackageDetailScreen;
