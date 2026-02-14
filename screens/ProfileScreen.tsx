
import React, { useState, useEffect } from 'react';
import {
  User, Heart, Settings, HelpCircle, LogOut, ChevronRight,
  Award, Map, Bookmark, MessageSquare, ChevronLeft, Star, Clock,
  Shield, RefreshCw, XCircle, ArrowRight, CheckCircle2
} from 'lucide-react'; // This was likely a typo from previous edit or I should check the import
import { AppScreen } from '../types';
import { apiService } from '../client';

import { useLanguage } from '../context/LanguageContext';

const ProfileScreen: React.FC<{ onNavigate?: (screen: AppScreen, data?: any) => void; onLogout?: () => void; initialShowBookings?: boolean }> = ({ onNavigate, onLogout, initialShowBookings }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookings, setShowBookings] = useState(initialShowBookings || false);
  const [guideInfo, setGuideInfo] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
        const guideData = await apiService.checkGuideStatus();
        setGuideInfo(guideData);
      } catch (error) {
        console.error("Profile fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      apiService.getUserReviews(profile.id).then(setReviews);
      refreshBookings();
    }
  }, [profile]);

  const refreshBookings = async () => {
    try {
      const data = await apiService.getBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshReviews = async () => {
    if (profile?.id) {
      console.log("Refreshing reviews for user:", profile.id);
      try {
        const data = await apiService.getUserReviews(profile.id);
        console.log("Reviews fetched:", data.length, data);
        setReviews(data);
      } catch (e) {
        console.error("Failed to refresh reviews", e);
      }
    } else {
      console.log("Cannot refresh reviews: No profile ID");
    }
  };

  const handleCancelBooking = async (id: string) => {
    const reason = window.prompt("Berikan alasan pembatalan Anda:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("Alasan pembatalan harus diisi.");
      return;
    }

    try {
      await apiService.cancelBooking(id, reason);
      alert("Pesanan berhasil dibatalkan.");
      refreshBookings();
    } catch (error) {
      alert("Gagal membatalkan pesanan.");
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
  };

  const menuItems = [
    { icon: Bookmark, label: t.profile.my_bookings, count: String(bookings.length), action: () => setShowBookings(true) },
    { icon: Heart, label: t.profile.my_favorites, count: '12' },
    { icon: Map, label: t.profile.travel_history, count: '24' },
    {
      icon: MessageSquare,
      label: t.profile.review_history,
      count: String(reviews.length),
      action: () => {
        refreshReviews();
        setShowReviews(true);
      }
    },
    {
      icon: guideInfo?.status === 'APPROVED' ? CheckCircle2 : Star,
      label: guideInfo?.status === 'APPROVED' ? 'Info Guide Approved' : (guideInfo?.status === 'PENDING' ? 'Pending Verifikasi Guide' : 'Daftar Jadi Guide'),
      action: () => onNavigate && onNavigate(AppScreen.GUIDE_DASHBOARD)
    },
    { icon: Shield, label: t.profile.admin_panel, action: () => onNavigate && onNavigate(AppScreen.ADMIN_USERS) },
    { icon: Settings, label: t.profile.settings, action: () => onNavigate && onNavigate(AppScreen.SETTINGS) },
    { icon: HelpCircle, label: t.common.services },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-off-white">
        <RefreshCw className="h-10 w-10 text-padang-green animate-spin" />
      </div>
    );
  }

  if (showBookings) {
    return (
      <div className="flex flex-col h-full bg-off-white animate-in slide-in-from-right duration-300">
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
          <button
            onClick={() => setShowBookings(false)}
            className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-padang-green transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">Pesanan Saya</h2>
        </div>

        <div className="p-5 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl p-10 border border-dashed border-gray-200">
              <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-8 w-8 text-gray-200" />
              </div>
              <p className="text-sm font-bold text-gray-400">Belum ada pesanan tour.</p>
              <button onClick={() => onNavigate && onNavigate(AppScreen.GUIDE_MARKETPLACE)} className="mt-4 text-xs font-black text-padang-green uppercase tracking-widest">
                Cari Paket Tour
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99] space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-16 w-16 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                      <img src={booking.package?.photos?.[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80'} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-gray-800 truncate">{booking.package?.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Guide: {booking.guide?.user?.name}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${booking.bookingStatus === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                    booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                    {booking.bookingStatus}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tanggal</p>
                    <p className="text-[11px] font-black text-gray-800">{new Date(booking.tourDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Biaya</p>
                    <p className="text-[11px] font-black text-padang-green">Rp {booking.totalPrice.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const conversation = await apiService.startConversation(
                          booking.guideId,
                          booking.package?.title,
                          new Date(booking.tourDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        );
                        onNavigate && onNavigate(AppScreen.CHAT, conversation.id);
                      } catch (error) {
                        alert("Gagal menghubungi pemandu");
                      }
                    }}
                    className="flex-1 bg-white border border-gray-100 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-padang-green/5 hover:text-padang-green hover:border-padang-green/20 transition-all active:scale-[0.98]"
                  >
                    <MessageSquare size={14} /> Tanya Pemandu
                  </button>
                  {booking.bookingStatus === 'CONFIRMED' && (
                    <button
                      onClick={() => onNavigate && onNavigate(AppScreen.TOUR_PACKAGE_DETAIL, booking.packageId)}
                      className="px-6 bg-padang-green/10 text-padang-green py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-padang-green/20 transition-all active:scale-[0.98]"
                    >
                      DETAIL <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {booking.bookingStatus === 'CONFIRMED' && (
                  <div className="w-full bg-green-50/50 p-3 rounded-2xl border border-green-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-green-700 uppercase tracking-widest leading-none mb-1">Status Pembayaran</p>
                      <p className="text-[10px] font-black text-green-600 uppercase">TIKET AKTIF</p>
                    </div>
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                )}

                {booking.bookingStatus === 'PENDING' && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-400 font-bold italic text-center">* Menunggu konfirmasi dari pemandu.</p>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="w-full py-3 rounded-2xl bg-red-50 text-chili-red text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100"
                    >
                      <XCircle size={14} /> Batalkan Pesanan
                    </button>
                  </div>
                )}

                {booking.bookingStatus === 'CANCELLED' && booking.cancelReason && (
                  <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100">
                    <p className="text-[9px] font-black text-chili-red uppercase tracking-widest mb-1">
                      Dibatalkan oleh {booking.cancelledBy === 'USER' ? 'Anda' : 'Pemandu'}
                    </p>
                    <p className="text-[10px] text-gray-600 font-medium">Alasan: {booking.cancelReason}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div >
      </div >
    );
  }

  if (showReviews) {
    return (
      <div className="flex flex-col h-full bg-off-white animate-in slide-in-from-right duration-300">
        <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
          <button
            onClick={() => setShowReviews(false)}
            className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-padang-green transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">Riwayat Ulasan</h2>
        </div>

        <div className="p-5 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>Belum ada ulasan yang dibuat.</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                <div className="flex gap-4">
                  <img src={review.destination?.image || 'https://via.placeholder.com/100'} alt={review.destination?.name} className="h-16 w-16 rounded-xl object-cover shrink-0 bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${review.type === 'CULINARY' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                            {review.type === 'CULINARY' ? 'KULINER' : 'WISATA'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800 truncate pr-2 leading-tight">{review.destination?.name || (review.type === 'CULINARY' ? 'Tempat Kuliner' : 'Destinasi Wisata')}</h3>
                      </div>
                      <div className="flex text-yellow-500 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 ${i < review.rating ? 'fill-yellow-500' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mb-2">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed italic line-clamp-2">"{review.comment}"</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-off-white animate-in slide-in-from-right duration-300">
      <div className="bg-padang-green pt-8 pb-12 px-6 rounded-b-[40px] shadow-lg shadow-padang-green/10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-white/20 p-1">
              <img
                src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Avatar"
                className="h-full w-full rounded-full bg-white object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-golden-maroon rounded-full border-2 border-padang-green flex items-center justify-center">
              <Award className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">{profile?.name || 'User'}</h2>
            <p className="text-white/60 text-xs">Penjelajah Padang • Level {profile?.level || 1}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-white">{profile?.points || 0} Poin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-3 divide-x divide-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">12</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Favorit</p>
          </div>
          <div className="text-center" onClick={() => setShowReviews(true)}>
            <p className="text-lg font-bold text-gray-800 cursor-pointer">{reviews.length}</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Ulasan</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">15</p>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Negeri</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 space-y-3 pb-24">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.label.includes('Admin') && profile?.role !== 'ADMIN') return null;
          return (
            <button
              key={idx}
              onClick={item.action ? item.action : undefined}
              className="w-full bg-white p-4 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all border border-gray-50 active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-padang-green/10 transition-colors">
                  <Icon className="h-5 w-5 text-gray-400 group-hover:text-padang-green transition-colors" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count && <span className="text-[10px] font-bold text-padang-green bg-padang-green/10 px-2 py-0.5 rounded-full">{item.count}</span>}
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
              </div>
            </button>
          );
        })}

        <button
          onClick={handleLogoutClick}
          className="w-full mt-4 p-4 rounded-2xl flex items-center justify-between group hover:bg-red-50 transition-all border border-transparent active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-red-100/50 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-chili-red" />
            </div>
            <span className="text-sm font-bold text-chili-red">Keluar Akun</span>
          </div>
        </button>
      </div>

      <div className="pb-10 text-center">
        <p className="text-[10px] text-gray-300">Versi 1.2.0-stable</p>
        <p className="text-[9px] text-gray-200 mt-1">Dibuat dengan ❤️ di Ranah Padang</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
