
import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronLeft, Star, Clock, MapPin, Share2,
    Heart, Wifi, Car, Sun, Shield, Banknote,
    Coffee, Tag, Image as ImageIcon, Utensils,
    Info, Sparkles, Navigation, Menu, MessageSquare, CheckCircle2, X
} from 'lucide-react';
import { apiService } from '../client';
import { SafeImage } from '../components/SafeImage';
import { CulinarySpot, AppScreen } from '../types';

interface CulinaryDetailScreenProps {
    spotId: string;
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

export const CulinaryDetailScreen: React.FC<CulinaryDetailScreenProps> = ({ spotId, onNavigate, onBack }) => {
    const [spot, setSpot] = useState<CulinarySpot | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'menu' | 'reviews'>('details');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            setScrollY(target.scrollTop);
        };

        const scrollContainer = document.querySelector('main');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        fetchSpotDetail();
    }, [spotId]);

    const fetchSpotDetail = async () => {
        try {
            const data = await apiService.getCulinarySpotDetail(spotId);
            setSpot(data);
        } catch (error) {
            console.error('Error fetching spot detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!spot) return;
        setSubmitting(true);
        try {
            await apiService.submitCulinaryReview(spot.id, reviewForm);
            alert('Ulasan berhasil dikirim!');
            setShowReviewForm(false);
            setReviewForm({ rating: 5, comment: '' });
            fetchSpotDetail(); // Refresh data
        } catch (error: any) {
            alert(error.message || 'Gagal mengirim ulasan');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-padang-primary"></div>
            </div>
        );
    }

    if (!spot) return <div className="text-center p-8">Spot not found</div>;

    return (
        <div ref={containerRef} className="relative bg-white min-h-screen pb-24 animate-in slide-in-from-bottom duration-500">
            {/* Hero Image Section */}
            <div className="relative w-full aspect-[4/5] min-h-[400px] max-h-[550px] overflow-hidden bg-gray-900">
                <div
                    className="absolute inset-0 w-full h-full origin-top"
                    style={{
                        transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <SafeImage
                        src={spot.image}
                        alt={spot.name}
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover object-center transition-all duration-1000 ${imageLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-110'}`}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-30">
                    <button onClick={onBack} className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg hover:bg-black/40 transition-colors">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex gap-3">
                        <button className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg active:scale-90 transition-all hover:bg-black/40">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`h-10 w-10 rounded-full backdrop-blur-xl flex items-center justify-center border transition-all shadow-lg ${isFavorite ? 'bg-chili-red border-chili-red text-white scale-110' : 'bg-black/20 border-white/20 text-white hover:bg-black/40'}`}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-16 left-6 right-6 z-20">
                    {spot.isHalal && (
                        <span className="px-3 py-1.5 bg-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-lg flex items-center gap-1.5 w-fit mb-3 border border-emerald-400/30">
                            <Shield size={12} className="fill-white" /> Halal Certified
                        </span>
                    )}
                </div>
            </div>

            {/* Main Content Container */}
            <div className="relative -mt-12 bg-white rounded-t-[40px] p-6 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] z-20 border-t border-white/50 min-h-[500px]">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 opacity-60" />

                {/* Header Info */}
                <div className="mb-10">
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-padang-green uppercase tracking-[4px] mb-2">{spot.category}</span>
                            <h1 className="text-3xl font-black text-gray-800 leading-[1.1] tracking-tight">{spot.name}</h1>
                        </div>
                        <div className="bg-padang-green text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl shadow-padang-green/20 shrink-0 border border-white/20">
                            <Star className="h-4 w-4 fill-white" />
                            <span className="text-sm font-black">{spot.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <button className="flex items-center gap-3 text-gray-400 text-sm hover:text-padang-green transition-all group text-left bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50 w-full mb-4">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                            <MapPin className="h-5 w-5 text-chili-red" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-600 line-clamp-1">{spot.address}</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Padang, Sumatera Barat</p>
                        </div>
                    </button>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {spot.facilities.slice(0, 3).map((fac, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-100 whitespace-nowrap">
                                {fac}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sticky Tabs */}
                <div id="tabs-navigation" className="flex gap-2 mb-8 sticky top-0 bg-white/95 backdrop-blur-md py-4 z-40 overflow-x-auto no-scrollbar scroll-mt-0 border-b border-gray-50">
                    {[
                        { id: 'details', label: 'Info', icon: Info },
                        { id: 'menu', label: 'Menu', icon: Coffee },
                        { id: 'reviews', label: 'Ulasan', icon: Star }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2.5 ${isActive ? 'bg-padang-green text-white shadow-xl shadow-padang-green/20 scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    <div className="p-5 space-y-6">
                        {/* DETAILS TAB */}
                        {activeTab === 'details' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 space-y-8">
                                <section>
                                    <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-[3px] flex items-center gap-2 mb-4">
                                        <Sparkles className="h-4 w-4 text-padang-green" /> Tentang Restoran
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-[13px]">{spot.description}</p>
                                </section>

                                <section>
                                    <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-[3px] flex items-center gap-2 mb-4">
                                        <Info className="h-4 w-4 text-padang-green" /> Informasi Penting
                                    </h3>

                                    <section>
                                        <h3 className="font-bold text-gray-900 mb-3 text-lg">Informasi</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 hover:bg-gray-100 transition-colors">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-padang-green">
                                                    <Clock size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Jam Buka</span>
                                                    <span className="text-xs font-black text-gray-800">08:00 - 22:00</span>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-start gap-3 hover:bg-gray-100 transition-colors">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-green-600">
                                                    <Banknote size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Harga</span>
                                                    <span className="text-xs font-black text-gray-800">
                                                        {(() => {
                                                            if (spot.priceRange && spot.priceRange.includes('Rp') && !spot.priceRange.includes('Rp Rp')) return spot.priceRange;

                                                            const menus = typeof spot.menuHighlights === 'string' ? JSON.parse(spot.menuHighlights) : (spot.menuHighlights || []);
                                                            const prices = Array.isArray(menus) ? menus.map((m: any) => parseInt(m.price) || 0).filter((p: number) => p > 0) : [];

                                                            if (prices.length > 0) {
                                                                const min = Math.min(...prices);
                                                                const max = Math.max(...prices);
                                                                return min === max ? `Rp ${min.toLocaleString('id-ID')}` : `Rp ${min.toLocaleString('id-ID')} - ${max.toLocaleString('id-ID')}`;
                                                            }

                                                            return spot.priceRange ? spot.priceRange.replace(/\$/g, 'Rp ') : '$$';
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-[3px] flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="h-4 w-4 text-padang-green" /> Fasilitas Lengkap
                                        </h3>
                                        <div className="flex flex-wrap gap-2.5">
                                            {spot.facilities.map((fac, idx) => (
                                                <span key={idx} className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-600 shadow-sm hover:border-padang-green/50 hover:bg-padang-green/5 transition-colors cursor-default">
                                                    {fac}
                                                </span>
                                            ))}
                                        </div>
                                    </section>


                                </section>
                            </div>
                        )}

                        {/* MENU TAB */}
                        {activeTab === 'menu' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                                <div className="flex justify-between items-center px-1">
                                    <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-[3px] flex items-center gap-2">
                                        <Utensils className="h-4 w-4 text-padang-green" /> Menu Andalan
                                    </h3>
                                </div>

                                {spot.menuHighlights?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all group">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-inner relative">
                                            {item.image ? (
                                                <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Coffee size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{item.name}</h4>
                                            <p className="text-padang-green font-black text-lg">
                                                Rp {item.price.toLocaleString('id-ID')}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">Favorit pelanggan</p>
                                        </div>
                                        <button className="self-center p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95">
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                ))}

                                {(!spot.menuHighlights || spot.menuHighlights.length === 0) && (
                                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-[32px] border border-gray-100 border-dashed">
                                        <Utensils size={40} className="mx-auto mb-3 text-gray-300 opacity-50" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Belum ada info menu</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-10 -mt-10 blur-2xl opacity-50" />

                                    <div className="flex items-center gap-6 mb-6 relative z-10">
                                        <div className="text-center">
                                            <div className="text-5xl font-black text-gray-900 tracking-tight">{spot.rating.toFixed(1)}</div>
                                            <div className="flex flex-col items-center mt-2">
                                                <div className="flex text-yellow-400 mb-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} size={14} className={`${s <= Math.round(spot.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">{spot.totalReviews} Ulasan</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            {[5, 4, 3, 2, 1].map((r) => (
                                                <div key={r} className="flex items-center gap-3">
                                                    <span className="w-3 text-[10px] font-bold text-gray-400">{r}</span>
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${r === 5 ? 70 : r === 4 ? 20 : 5}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Integrated Review Trigger */}
                                    {(() => {
                                        const userToken = localStorage.getItem('user_token');

                                        if (!userToken) {
                                            return (
                                                <div className="pt-6 border-t border-gray-100 relative z-10">
                                                    <p className="text-gray-500 text-xs font-medium text-center mb-4">Mau kasih nilai? Login dulu yuk!</p>
                                                    <button
                                                        onClick={() => alert('Silakan login melalui menu Profil')}
                                                        className="w-full py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
                                                    >
                                                        Login untuk Mengulas
                                                    </button>
                                                </div>
                                            );
                                        }

                                        if (!showReviewForm) {
                                            return (
                                                <div className="pt-6 border-t border-gray-100 text-center relative z-10">
                                                    <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-4">Beri rating tempat ini</p>
                                                    <div className="flex justify-center gap-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() => {
                                                                    setReviewForm({ ...reviewForm, rating: star });
                                                                    setShowReviewForm(true);
                                                                }}
                                                                className="group p-2 focus:outline-none transition-transform hover:scale-110 active:scale-90"
                                                            >
                                                                <Star
                                                                    size={32}
                                                                    className="text-gray-200 fill-gray-50 group-hover:text-yellow-400 group-hover:fill-yellow-400 transition-colors duration-200"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 relative z-10">
                                                <div className="flex justify-between items-center mb-4">
                                                    <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Tulis Ulasanmu</p>
                                                    <button
                                                        onClick={() => setShowReviewForm(false)}
                                                        className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>

                                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                                    <div className="flex justify-center gap-2 mb-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                                className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                                                            >
                                                                <Star
                                                                    size={36}
                                                                    className={`${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <textarea
                                                        required
                                                        autoFocus
                                                        value={reviewForm.comment}
                                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-padang-green/20 outline-none min-h-[120px] placeholder:text-gray-400"
                                                        placeholder="Ceritakan pengalamanmu... (Makanan, Pelayanan, Suasana)"
                                                    />

                                                    <button
                                                        type="submit"
                                                        disabled={submitting}
                                                        className="w-full py-4 bg-padang-green text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-padang-green/20 disabled:opacity-50 hover:bg-green-700 transition-all active:scale-95"
                                                    >
                                                        {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                                                    </button>
                                                </form>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Reviews List */}
                                <div className="space-y-4">
                                    {spot.reviews && spot.reviews.length > 0 ? (
                                        spot.reviews.map((review) => (
                                            <div key={review.id} className="bg-gray-50 p-5 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-white rounded-full overflow-hidden shadow-sm border border-gray-100">
                                                            {review.user?.avatar ? (
                                                                <img src={review.user.avatar} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-padang-green text-xs font-black bg-padang-green/5">
                                                                    {review.user?.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{review.user?.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="px-3 py-1 bg-white text-yellow-600 rounded-full text-[10px] font-black border border-yellow-100 flex items-center gap-1 shadow-sm">
                                                        <Star size={10} className="fill-yellow-500 text-yellow-500" /> {review.rating}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed mb-3 italic">"{review.comment}"</p>
                                                {review.photos && review.photos.length > 0 && (
                                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                                        {review.photos.map((photo, pIdx) => (
                                                            <img key={pIdx} src={photo} className="h-20 w-20 object-cover rounded-xl border border-gray-200 flex-shrink-0" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                                            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                                            <p className="text-xs font-bold uppercase tracking-widest">Belum ada ulasan</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl p-4 flex gap-3 z-50 border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${isFavorite ? 'bg-red-50 text-chili-red border-chili-red/20' : 'bg-white text-gray-600 border-gray-200 shadow-sm'}`}
                >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-chili-red' : ''}`} />
                    {isFavorite ? 'Disimpan' : 'Simpan'}
                </button>
                <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}`, '_blank')}
                    className="flex-[1.5] bg-padang-green hover:bg-green-900 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-padang-green/20 transition-all active:scale-95 group"
                >
                    <Navigation className="h-4 w-4" /> Navigasi Ke Sini
                </button>
            </div>
        </div>
    );
};
