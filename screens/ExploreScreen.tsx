import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppScreen, Destination } from '../types';
import { CATEGORIES } from '../constants';
import { apiService, getProxiedImageUrl } from '../client';
import { List, Star, MapPin, Search, RotateCcw, Tag as TagIcon, Map, Navigation, LocateFixed, ZoomIn, ZoomOut, RefreshCw, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface ExploreMapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
}

// Map Component for Explore
const LeafletExploreMap = React.forwardRef<ExploreMapHandle, {
  destinations: Destination[];
  onMarkerClick: (d: Destination) => void;
  userLocation: { lat: number; lng: number } | null;
}>(({ destinations, onMarkerClick, userLocation }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  React.useImperativeHandle(ref, () => ({
    flyTo: (lat: number, lng: number, zoom: number = 16) => {
      if (leafletRef.current) {
        leafletRef.current.flyTo([lat, lng], zoom, {
          animate: true,
          duration: 1.5
        });
      }
    }
  }));

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

        const map = L.map(mapRef.current, {
          zoomControl: false
        }).setView([-0.947, 100.354], 12);
        leafletRef.current = map;

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        setTimeout(() => map.invalidateSize(), 300);
      }
    }, 100);

    return () => {
      clearInterval(checkForLeaflet);
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Alam': return '#10b981'; // Green
      case 'Budaya': return '#f59e0b'; // Amber
      case 'Belanja': return '#8b5cf6'; // Violet
      case 'Religi': return '#3b82f6'; // Blue
      default: return '#10b981'; // Default
    }
  };

  useEffect(() => {
    if (leafletRef.current) {
      const L = (window as any).L;
      // Clear existing markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      destinations.forEach(d => {
        const color = getCategoryColor(d.category);

        const marker = L.circleMarker([d.coordinates.lat, d.coordinates.lng], {
          radius: 10,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        })
          .addTo(leafletRef.current)
          .on('click', () => onMarkerClick(d));

        marker.bindTooltip(`
          <div class="flex flex-col gap-0.5">
            <span class="font-black text-gray-800">${d.name}</span>
            <span class="text-[9px] font-bold uppercase tracking-widest" style="color: ${color}">${d.category}</span>
          </div>
        `, {
          permanent: false,
          direction: 'top',
          className: 'rounded-xl border-none shadow-xl px-3 py-2 bg-white/90 backdrop-blur-sm'
        });

        markersRef.current.push(marker);
      });

      if (userLocation) {
        const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
          radius: 8,
          fillColor: "#3b82f6",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(leafletRef.current).bindPopup("Lokasi Anda");
        markersRef.current.push(userMarker);
      }

      if (destinations.length > 0) {
        const group = L.featureGroup(markersRef.current.filter(m => m.getLatLng));
        if (group.getBounds().isValid()) {
          leafletRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
      }
    }
  }, [destinations, userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="h-full w-full z-0" />
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => leafletRef.current?.zoomIn()}
          className="h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-padang-green active:scale-90 transition-all border border-gray-100"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={() => leafletRef.current?.zoomOut()}
          className="h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-padang-green active:scale-90 transition-all border border-gray-100"
        >
          <ZoomOut size={20} />
        </button>
      </div>
    </div>
  );
});

// Custom Image component with Placeholder
const ImageWithPlaceholder: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse flex flex-col items-center justify-center">
          <svg viewBox="0 0 100 60" className="h-10 w-16 fill-gray-300 opacity-40 mb-2">
            <path d="M0 40 L20 20 L25 25 L50 0 L75 25 L80 20 L100 40 L100 60 L0 60 Z" />
          </svg>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[2px]">Memuat Gambar</span>
        </div>
      )}
      <img
        src={getProxiedImageUrl(src)}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-all duration-700`}
      />
    </div>
  );
};

interface ExploreScreenProps {
  onNavigate: (screen: AppScreen, data?: any) => void;
  searchQuery?: string;
  onSearch?: (q: string) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onNavigate, searchQuery = '', onSearch }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]>('Semua');
  const [isMapView, setIsMapView] = useState(false);
  const exploreMapRef = useRef<ExploreMapHandle>(null);
  const [activeFeaturedId, setActiveFeaturedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSortingByDistance, setIsSortingByDistance] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const PULL_THRESHOLD = 80;
  const MAX_PULL = 150;

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const data = await apiService.getDestinations();
      setDestinations(data);
    } catch (error) {
      console.error("Failed to fetch destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(0);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
    await fetchDestinations();
    setIsRefreshing(false);
    if (window.navigator.vibrate) window.navigator.vibrate([30, 30]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const isAtTop = !scrollRef.current || scrollRef.current.scrollTop === 0;
    if (isAtTop && !isRefreshing) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;
    if (distance > 0) {
      if (scrollRef.current && scrollRef.current.scrollTop === 0) {
        const resistance = 0.5;
        const constrainedDistance = Math.min(distance * resistance, MAX_PULL);
        setPullDistance(constrainedDistance);
      }
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (pullDistance > PULL_THRESHOLD) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const requestLocation = () => {
    return new Promise<{ lat: number, lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        (err) => {
          setLocationError("Izin lokasi diperlukan.");
          setTimeout(() => setLocationError(null), 3000);
          reject(err);
        }
      );
    });
  };

  const handleToggleDistanceSort = async () => {
    if (!isSortingByDistance) {
      if (!userLocation) {
        try {
          await requestLocation();
          setIsSortingByDistance(true);
        } catch (e) { }
      } else setIsSortingByDistance(true);
    } else setIsSortingByDistance(false);
  };

  const handleResetFilter = () => {
    setActiveTab('Semua');
    if (onSearch) onSearch('');
    setIsSortingByDistance(false);
    setPullDistance(0);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const filteredAndSorted = useMemo(() => {
    let result = destinations.filter(d => activeTab === 'Semua' || d.category === activeTab);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    if (isSortingByDistance && userLocation) {
      result = [...result].sort((a, b) =>
        calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng) -
        calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng)
      );
    }
    return result;
  }, [destinations, activeTab, isSortingByDistance, userLocation, searchQuery]);

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="h-28 w-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner animate-pulse">
          <Search className="h-12 w-12 text-gray-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md">
          <XCircle className="h-6 w-6 text-chili-red" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Mak, alum ado lai...</h3>
      <p className="text-sm text-gray-500 max-w-[260px] mb-8 leading-relaxed">
        Rasanya belum ada data untuk kategori <span className="text-padang-green font-bold">"{activeTab}"</span> {searchQuery ? `dengan kata kunci "${searchQuery}"` : ''} di sini. Coba cari yang lain ya, Dunsanak!
      </p>
      <button onClick={handleResetFilter} className="flex items-center gap-3 bg-padang-green text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-padang-green/20 hover:bg-green-800 transition-all active:scale-95 group">
        <RotateCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
        Atur Ulang Filter
      </button>
    </div>
  );

  if (loading && !isRefreshing && destinations.length === 0) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-off-white">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-10 w-10 text-padang-green animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manggaleh Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-off-white relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Pull to Refresh Overlay */}
      <div className="absolute left-0 right-0 z-50 flex items-center justify-center transition-all duration-200 overflow-hidden pointer-events-none" style={{ height: isRefreshing ? 60 : pullDistance, top: 70 }}>
        <div className={`flex flex-col items-center gap-1 transition-all ${pullDistance > PULL_THRESHOLD || isRefreshing ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
          <div className="bg-white rounded-full p-2 shadow-lg border border-padang-green/10">
            <RefreshCw className={`h-5 w-5 text-padang-green ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullDistance * 2}deg)` }} />
          </div>
          <span className="text-[10px] font-bold text-padang-green uppercase tracking-widest bg-white/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {isRefreshing ? 'Mampabarui...' : pullDistance > PULL_THRESHOLD ? 'Lepaskan Dunsanak' : 'Tarik untuak mampabarui'}
          </span>
        </div>
      </div>

      {/* Header & Tabs */}
      <div className="sticky top-0 bg-off-white/90 backdrop-blur-md z-30 px-5 pt-3 pb-5 space-y-5 shrink-0">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-padang-green uppercase tracking-[3px] mb-1">Eksplorasi</span>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">Jelajah Padang</h2>
          </div>
          <div className="flex gap-2 mb-1">
            <button onClick={handleToggleDistanceSort} className={`h-11 px-4 rounded-2xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${isSortingByDistance ? 'bg-chili-red text-white border-chili-red shadow-lg shadow-chili-red/20' : 'bg-white text-gray-400 border-gray-100 shadow-sm'}`}>
              <LocateFixed className={`h-3.5 w-3.5 ${isSortingByDistance ? 'animate-pulse' : ''}`} /> Terdekat
            </button>
            <button onClick={() => { setIsMapView(!isMapView); setPullDistance(0); }} className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition-all active:scale-95 shadow-sm ${isMapView ? 'bg-padang-green text-white border-padang-green shadow-lg shadow-padang-green/20' : 'bg-white text-padang-green border-gray-100'}`}>
              {isMapView ? <List className="h-5 w-5" /> : <Map className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {locationError && <div className="text-[10px] text-chili-red font-black animate-bounce bg-red-50 px-4 py-2 rounded-xl border border-red-100 uppercase tracking-widest">{locationError}</div>}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const color = cat === 'Alam' ? 'border-emerald-500 text-emerald-600' :
              cat === 'Budaya' ? 'border-amber-500 text-amber-600' :
                cat === 'Belanja' ? 'border-violet-500 text-violet-600' :
                  cat === 'Religi' ? 'border-blue-500 text-blue-600' :
                    'border-padang-green text-padang-green';

            const activeBg = cat === 'Alam' ? 'bg-emerald-500' :
              cat === 'Budaya' ? 'bg-amber-500' :
                cat === 'Belanja' ? 'bg-violet-500' :
                  cat === 'Religi' ? 'bg-blue-500' :
                    'bg-padang-green';

            return (
              <button
                key={cat}
                onClick={() => { setActiveTab(cat); }}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === cat ? `${activeBg} text-white shadow-xl` : `bg-white text-gray-400 border border-gray-100 hover:${color}`}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar relative transition-transform duration-200 flex flex-col pb-20" style={{ transform: `translateY(${isRefreshing ? 60 : pullDistance}px)` }}>
        {filteredAndSorted.length === 0 ? renderEmptyState() : isMapView ? (
          <div className="h-full w-full relative bg-gray-200 overflow-hidden flex-1 min-h-[400px]">
            <LeafletExploreMap
              ref={exploreMapRef}
              destinations={filteredAndSorted}
              userLocation={userLocation}
              onMarkerClick={(d) => onNavigate(AppScreen.DETAIL, d)}
            />

            {/* Floating Search Bar on Map */}
            <div className="absolute top-6 left-5 right-5 z-[1000] animate-in slide-in-from-top-4 duration-500">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-padang-green" />
                </div>
                <input
                  type="text"
                  placeholder="Cari wisata Padang..."
                  className="w-full bg-white/95 backdrop-blur-xl border border-white rounded-[24px] py-4 pl-11 pr-5 text-sm font-bold placeholder:text-gray-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-padang-green/30 focus:bg-white transition-all caret-padang-green"
                  value={searchQuery}
                  onChange={(e) => onSearch?.(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearch?.('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:text-chili-red bg-gray-50/50 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Floating Search Results on Map */}
            {searchQuery && filteredAndSorted.length > 0 && (
              <div className="absolute bottom-6 left-0 right-0 z-[1000] px-5 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                  {filteredAndSorted.map(dest => (
                    <div
                      key={dest.id}
                      onClick={() => {
                        exploreMapRef.current?.flyTo(dest.coordinates.lat, dest.coordinates.lng);
                        setActiveFeaturedId(dest.id);
                        if (window.navigator.vibrate) window.navigator.vibrate(30);
                      }}
                      className={`min-w-[200px] h-24 bg-white/90 backdrop-blur-md rounded-3xl p-3 flex gap-3 shadow-2xl border transition-all snap-center cursor-pointer ${activeFeaturedId === dest.id ? 'border-padang-green ring-2 ring-padang-green/20 scale-105' : 'border-white'}`}
                    >
                      <div className="h-full w-20 rounded-2xl overflow-hidden shrink-0">
                        <ImageWithPlaceholder src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden">
                        <h4 className="font-black text-gray-800 text-xs truncate leading-tight mb-1">{dest.name}</h4>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] font-black">{dest.rating}</span>
                        </div>
                        <div className="bg-padang-green/10 self-start px-2 py-0.5 rounded-lg">
                          <span className="text-[8px] font-black text-padang-green uppercase">{dest.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="px-5 space-y-6 pt-4">
            {filteredAndSorted.map((item) => {
              const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, item.coordinates.lat, item.coordinates.lng).toFixed(1) : null;
              return (
                <div key={item.id} onClick={() => onNavigate(AppScreen.DETAIL, item)} className="bg-white rounded-[36px] shadow-sm border border-gray-100 overflow-hidden flex flex-col group active:scale-[0.98] transition-all duration-300 cursor-pointer hover:shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="relative h-60 overflow-hidden">
                    <ImageWithPlaceholder src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-90 transition-all duration-1000 ease-out" />

                    {/* Tags */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-md text-padang-green text-[10px] font-black px-4 py-2 rounded-2xl shadow-lg border border-white flex items-center gap-2 uppercase tracking-widest">
                        <TagIcon className="h-3 w-3" /> {item.category}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-3">
                      <button className="h-11 w-11 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-700 hover:text-chili-red transition-all shadow-xl border border-white active:scale-90"><Star className="h-5 w-5" /></button>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-400 px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <Star className="h-3 w-3 fill-black text-black" />
                          <span className="text-[10px] font-black text-black">{item.rating}</span>
                        </div>
                        {distance && (
                          <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                            <Navigation className="h-2.5 w-2.5 text-white" />
                            <span className="text-[10px] font-black text-white">{distance} KM</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black text-gray-800 text-lg group-hover:text-padang-green transition-colors leading-tight truncate pr-4">{item.name}</h3>
                      <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-padang-green group-hover:text-white transition-all shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                      <MapPin className="h-4 w-4 text-chili-red shrink-0" />
                      <span className="text-xs font-bold line-clamp-1">{item.location}</span>
                    </div>

                    <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ExploreScreen;
