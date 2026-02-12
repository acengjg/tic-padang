
import React, { useState, useEffect, useRef } from 'react';
import { Destination } from '../types';
import { API_BASE_URL, getProxiedImageUrl } from '../client';
import {
  ChevronLeft, Star, MapPin, Navigation, Heart, Share2,
  Clock, Ticket, Info, MessageSquare, ExternalLink, X,
  CheckCircle2, Sparkles, MoveHorizontal,
  Maximize2, View, Compass, Car, Bath, Coffee, Camera, Wifi, Utensils, RefreshCw, PlayCircle
} from 'lucide-react';
import VirtualTourScreen from './VirtualTourScreen';

interface DetailScreenProps {
  destination: Destination;
  onBack: () => void;
}

interface Facility {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const PanoramicViewer: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);

  useEffect(() => {
    const initViewer = () => {
      if (viewerRef.current && (window as any).pannellum) {
        // Destroy existing instance if any
        if (viewerInstance.current) {
          viewerInstance.current.destroy();
        }

        // Use proxy helper for external URLs to solve CORS and special handling (like Instagram)
        const panoramaUrl = getProxiedImageUrl(imageUrl);

        viewerInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: panoramaUrl,
          autoLoad: true,
          autoRotate: -2,
          showControls: false,
          compass: true,
          mouseZoom: false,
          crossOrigin: 'anonymous',
        });
      }
    };

    // Small delay to ensure container is ready
    const timer = setTimeout(initViewer, 100);
    return () => {
      clearTimeout(timer);
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, [imageUrl]);

  const toggleFullScreen = () => {
    if (viewerInstance.current) {
      viewerInstance.current.toggleFullscreen();
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-[32px] border border-gray-100 shadow-inner bg-black h-72 sm:h-96">
      <div ref={viewerRef} className="w-full h-full" />

      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/20 text-white">
          <Compass className="h-4 w-4" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
        <div className="bg-chili-red/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          VIRTUAL 360° MODE
        </div>
        <button
          onClick={toggleFullScreen}
          className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-padang-green shadow-lg pointer-events-auto active:scale-90 transition-transform border border-white/50"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

const LeafletMap: React.FC<{ lat: number; lng: number; popupContent: string }> = ({ lat, lng, popupContent }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    const checkForLeaflet = setInterval(() => {
      if ((window as any).L && mapRef.current && !leafletRef.current) {
        clearInterval(checkForLeaflet);
        const L = (window as any).L;

        // Fix icon path for Leaflet
        if (L.Icon.Default.prototype._getIconUrl) {
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        }

        const map = L.map(mapRef.current).setView([lat, lng], 15);
        leafletRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(popupContent)
          .openPopup();

        setTimeout(() => map.invalidateSize(), 300);
        setTimeout(() => map.invalidateSize(), 1200);
      }
    }, 100);

    return () => {
      clearInterval(checkForLeaflet);
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, [lat, lng, popupContent]);

  return <div ref={mapRef} className="w-full h-full z-0" />;
};

const DetailScreen: React.FC<DetailScreenProps> = ({ destination, onBack }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | '360' | 'ulasan' | 'lokasi'>('info');
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showEnhancedTour, setShowEnhancedTour] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'ulasan') {
      import('../client').then(({ apiService }) => {
        apiService.getReviews(destination.id).then(setReviews);
      });
    }
  }, [activeTab, destination.id]);

  const submitReview = async () => {
    if (!newReviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const { apiService } = await import('../client');
      await apiService.submitReview(destination.id, newReviewRating, newReviewComment);
      setNewReviewComment('');
      setNewReviewRating(5);
      const updatedReviews = await apiService.getReviews(destination.id);
      setReviews(updatedReviews);
      alert('Terima kasih atas ulasan Anda!');
    } catch (error) {
      alert('Gagal mengirim ulasan. Pastikan Anda sudah login.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${destination.name} - TIC-PADANG`,
      text: `Dunsanak! Cek wisata rancak ${destination.name} di ${destination.location}. Liburan makin seru pakai aplikasi TIC-PADANG!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) { }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Tautan disalin!');
      } catch (err) { }
    }
  };

  const openInGoogleMaps = () => {
    const { lat, lng } = destination.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const facilities: Facility[] = [
    { name: 'Parkir Luas', icon: <Car className="h-3.5 w-3.5" />, description: 'Area parkir aman untuk bus pariwisata dan mobil pribadi dunsanak. Tersedia petugas jaga 24 jam.' },
    { name: 'Toilet Bersih', icon: <Bath className="h-3.5 w-3.5" />, description: 'Tersedia toilet umum yang terawat dengan air bersih pegunungan yang menyegarkan.' },
    { name: 'Musholla', icon: <Compass className="h-3.5 w-3.5" />, description: 'Tempat ibadah yang nyaman dan tenang dengan peralatan sholat lengkap untuk dunsanak.' },
    { name: 'Area Kuliner', icon: <Utensils className="h-3.5 w-3.5" />, description: 'Berbagai pilihan makanan lokal khas Padang yang menggugah selera di sekitar lokasi wisata.' },
    { name: 'Spot Foto', icon: <Camera className="h-3.5 w-3.5" />, description: 'Banyak titik-titik estetis dan ikonik untuk mengabadikan momen liburan terbaik dunsanak.' },
    { name: 'WiFi Gratis', icon: <Wifi className="h-3.5 w-3.5" />, description: 'Akses internet kecepatan tinggi tersedia di area pusat informasi agar dunsanak tetap terhubung.' },
  ];

  return (
    <div ref={containerRef} className="relative bg-white min-h-screen pb-24 animate-in slide-in-from-bottom duration-500">
      <div className="relative w-full aspect-[4/5] min-h-[400px] max-h-[550px] overflow-hidden bg-gray-900">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-white/20 animate-spin" />
          </div>
        )}
        <div
          className="absolute inset-0 w-full h-full origin-top"
          style={{
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img
            src={getProxiedImageUrl(destination.image)}
            alt={destination.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${imageLoaded ? 'opacity-90 scale-100' : 'opacity-0 scale-110'}`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

        <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-30">
          <button onClick={onBack} className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg active:scale-90 transition-all">
              <Share2 className="h-5 w-5" />
            </button>
            <button onClick={handleFavorite} className={`h-10 w-10 rounded-full backdrop-blur-xl flex items-center justify-center border transition-all shadow-lg ${isFavorite ? 'bg-chili-red border-chili-red text-white scale-110' : 'bg-black/20 border-white/20 text-white'}`}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {destination.image360 && (
          <button
            onClick={() => {
              setActiveTab('360');
              document.getElementById('tabs-navigation')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="absolute bottom-20 right-6 z-30 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-chili-red rounded-full animate-ping opacity-25 scale-150"></div>
              <div className="relative h-14 w-14 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center text-chili-red border-2 border-chili-red group-hover:scale-110 transition-transform">
                <View className="h-6 w-6" />
                <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">360° VIEW</span>
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="relative -mt-12 bg-white rounded-t-[40px] p-6 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] z-20 border-t border-white/50">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 opacity-60" />

        <div className="mb-10">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-padang-green uppercase tracking-[4px] mb-2">{destination.category}</span>
              <h1 className="text-3xl font-black text-gray-800 leading-[1.1] tracking-tight">{destination.name}</h1>
            </div>
            <div className="bg-padang-green text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl shadow-padang-green/20 shrink-0 border border-white/20">
              <Star className="h-4 w-4 fill-white" />
              <span className="text-sm font-black">{destination.rating}</span>
            </div>
          </div>
          <button onClick={openInGoogleMaps} className="flex items-center gap-3 text-gray-400 text-sm hover:text-padang-green transition-all group text-left bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50 w-full">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
              <MapPin className="h-5 w-5 text-chili-red" />
            </div>
            <div>
              <p className="font-bold text-gray-600 line-clamp-1">{destination.location}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Sumatera Barat, Indonesia</p>
            </div>
          </button>
        </div>

        <div id="tabs-navigation" className="flex gap-2 mb-10 sticky top-0 bg-white/80 backdrop-blur-md py-4 z-40 overflow-x-auto no-scrollbar scroll-mt-0 border-b border-gray-50">
          {(['info', '360', 'ulasan', 'lokasi'] as const).map((tab) => {
            if (tab === '360' && !destination.image360) return null;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2.5 ${isActive ? 'bg-padang-green text-white shadow-xl shadow-padang-green/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                {tab === 'info' && <Info className="h-4 w-4" />}
                {tab === '360' && <View className="h-4 w-4" />}
                {tab === 'ulasan' && <MessageSquare className="h-4 w-4" />}
                {tab === 'lokasi' && <MapPin className="h-4 w-4" />}
                {tab === '360' ? 'Virtual 360' : tab}
              </button>
            );
          })}
        </div>

        <div className="text-gray-600 text-sm leading-relaxed min-h-[200px]">
          {activeTab === 'info' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
              <p className="mb-8 text-gray-500 leading-relaxed text-[13px]">{destination.description}</p>

              <div className="flex items-center justify-between mb-6 px-1">
                <h4 className="font-black text-gray-800 text-[10px] uppercase tracking-[3px] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-padang-green" /> Fasilitas & Layanan
                </h4>
                {selectedFacility && (
                  <button
                    onClick={() => setSelectedFacility(null)}
                    className="text-[9px] font-black text-chili-red uppercase tracking-widest bg-chili-red/5 px-4 py-2 rounded-2xl hover:bg-chili-red/10 transition-colors animate-in fade-in"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 mb-6">
                {facilities.map(f => (
                  <button
                    key={f.name}
                    onClick={() => {
                      setSelectedFacility(selectedFacility === f.name ? null : f.name);
                      if (window.navigator.vibrate) window.navigator.vibrate(25);
                    }}
                    className={`text-[10px] font-bold px-4 py-2.5 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 active:scale-95 ${selectedFacility === f.name
                      ? 'bg-padang-green text-white border-padang-green shadow-xl shadow-padang-green/20 scale-105'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-padang-green/30 hover:bg-padang-green/5'
                      }`}
                  >
                    <div className={`${selectedFacility === f.name ? 'text-white' : 'text-padang-green'}`}>
                      {f.icon}
                    </div>
                    {f.name}
                    {selectedFacility === f.name && <CheckCircle2 className="h-3 w-3 animate-in zoom-in" />}
                  </button>
                ))}
              </div>

              {selectedFacility && (
                <div className="bg-gradient-to-br from-padang-green/5 to-white p-7 rounded-[32px] border border-padang-green/10 relative mb-10 animate-in slide-in-from-top-4 duration-500 shadow-sm overflow-hidden group">
                  <div className="absolute top-0 right-0 h-24 w-24 bg-padang-green/5 rounded-full -mr-12 -mt-12 blur-xl" />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-padang-green shadow-md border border-gray-50 group-hover:rotate-6 transition-transform">
                        {facilities.find(f => f.name === selectedFacility)?.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-padang-green uppercase tracking-[2px] mb-0.5">Informasi Layanan</span>
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight">{selectedFacility}</h5>
                      </div>
                    </div>
                    <button onClick={() => setSelectedFacility(null)} className="h-10 w-10 rounded-2xl bg-white/50 flex items-center justify-center text-gray-400 hover:text-chili-red transition-all active:scale-90">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                    {facilities.find(f => f.name === selectedFacility)?.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === '360' && destination.image360 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <View className="h-4 w-4 text-padang-green" /> Eksplorasi Virtual 360°
                </h3>
                <span className="bg-padang-green/10 text-padang-green text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Enhanced VR Ready</span>
              </div>

              <div className="relative group rounded-[32px] overflow-hidden border border-gray-100 shadow-xl mb-6">
                <PanoramicViewer imageUrl={destination.image360} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex flex-col items-center justify-center pointer-events-none">
                  <button
                    onClick={() => setShowEnhancedTour(true)}
                    className="pointer-events-auto h-16 w-16 rounded-full bg-white/90 text-padang-green flex items-center justify-center shadow-2xl scale-110 hover:scale-125 active:scale-95 transition-all"
                  >
                    <PlayCircle className="h-8 w-8" />
                  </button>
                  <p className="text-white text-[10px] font-black uppercase tracking-[3px] mt-4 drop-shadow-lg">Buka Tur Virtual Enhanced</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-padang-green/5 to-white p-6 rounded-[32px] border border-padang-green/10">
                <h4 className="text-[10px] font-black text-padang-green uppercase tracking-widest mb-3">Fitur Premium Pro360</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Audio Narasi', desc: 'Dengarkan sejarah dunsanak' },
                    { label: 'Hotspot Info', desc: 'Klik detail objek sekitar' },
                    { label: 'VR Headset', desc: 'Gunakan Cardboard/VR' },
                    { label: 'Live Guide', desc: 'Pemandu virtual interaktif' }
                  ].map((f, i) => (
                    <div key={i} className="bg-white/50 p-3 rounded-2xl border border-white">
                      <p className="text-[9px] font-black text-gray-800">{f.label}</p>
                      <p className="text-[8px] text-gray-400 font-medium">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ulasan' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">

              <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm mb-3">Tulis Ulasan</h3>
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewReviewRating(star)}>
                      <Star className={`h-6 w-6 ${star <= newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-padang-green/50 mb-3"
                  placeholder="Bagaimana pengalaman dunsanak?"
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                />
                <button
                  onClick={submitReview}
                  disabled={isSubmittingReview}
                  className="w-full bg-padang-green text-white font-bold text-xs py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </div>

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 text-xs py-4">Belum ada ulasan. Jadilah yang pertama!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-off-white p-4 rounded-2xl border border-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} className="h-7 w-7 rounded-full object-cover" alt={review.user.name} />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-padang-green/10 flex items-center justify-center text-[10px] font-black text-padang-green">
                              {review.user?.name ? review.user.name.charAt(0) : 'U'}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-xs">{review.user?.name || 'Wisatawan'}</span>
                            <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex text-yellow-500 gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-2.5 w-2.5 ${s <= review.rating ? 'fill-yellow-500' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[12px] text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'lokasi' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400 h-[400px] rounded-[24px] overflow-hidden shadow-inner border border-gray-200 relative bg-gray-100">
              <LeafletMap
                lat={destination.coordinates.lat}
                lng={destination.coordinates.lng}
                popupContent={destination.name}
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl p-4 flex gap-3 z-50 border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <button onClick={handleFavorite} className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${isFavorite ? 'bg-red-50 text-chili-red border-chili-red/20' : 'bg-white text-gray-600 border-gray-200 shadow-sm'}`}>
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-chili-red' : ''}`} />
          {isFavorite ? 'Disimpan' : 'Simpan'}
        </button>
        <button onClick={openInGoogleMaps} className="flex-[1.5] bg-padang-green hover:bg-green-900 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-padang-green/20 transition-all active:scale-95 group">
          <Navigation className="h-4 w-4" /> Navigasi Ke Sini
        </button>
      </div>
      {showEnhancedTour && (
        <VirtualTourScreen
          destination={destination}
          onClose={() => setShowEnhancedTour(false)}
        />
      )}
    </div>
  );
};

export default DetailScreen;
