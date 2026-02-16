
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Users, MapPin, BarChart3, Settings,
    LogOut, Shield, Search, Plus, Trash2, Edit, X, Save, Map as MapIcon, Calendar, CheckCircle, XCircle,
    Eye, Crosshair, Type, Utensils, Store, Package, ShoppingBag, Truck
} from 'lucide-react';

const API_BASE_URL = '/api';

const getProxiedImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') && !url.includes('api.dicebear.com')) {
        return `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(url)}`;
    }
    return url;
};

const SafeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(getProxiedImageUrl(src));
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(getProxiedImageUrl(src));
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${alt}`);
        }
    };

    return (
        <img
            src={imgSrc || `https://api.dicebear.com/7.x/initials/svg?seed=${alt}`}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

const ImagePreview: React.FC<{ url: string }> = ({ url }) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
    }, [url]);

    if (!url || !url.startsWith('http')) return null;

    return (
        <div className="mt-2 relative min-h-[160px] w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex flex-col items-center justify-center p-4">
            {!error ? (
                <img
                    src={getProxiedImageUrl(url)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                    onError={async () => {
                        try {
                            const res = await fetch(getProxiedImageUrl(url));
                            if (res.status === 404) setError('Gambar indak ditamukan (404). Periso baliak URL-nyo.');
                            else if (res.status === 500) {
                                const text = await res.text();
                                if (text.includes('did not return an image')) setError('Link ko bukan link gambar atau video nan valid.');
                                else setError('Server gagal ma-ambil gambar. Cubo link lain.');
                            }
                            else setError('Gagal memuat preview. Pastikan URL benar atau gunakan link lain.');
                        } catch (e) {
                            setError('Koneksi bamasalah. Cubo cek internet dunsanak.');
                        }
                    }}
                />
            ) : (
                <div className="text-center space-y-2">
                    <p className="text-[11px] font-black text-chili-red uppercase tracking-widest">{error}</p>
                    <p className="text-[9px] text-gray-400 font-medium px-4">Tips: Kalau dari IG/FB, pastikan postingan tu basifaik Publik.</p>
                </div>
            )}
        </div>
    );
};

const VideoPreview: React.FC<{ url: string }> = ({ url }) => {
    if (!url) return null;

    const getVideoId = (input: string) => {
        const trimmed = input.trim();
        if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) return trimmed;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = trimmed.match(regExp);
        if (match && match[2].length === 11) return match[2];
        if (trimmed.includes('youtu.be/')) {
            const parts = trimmed.split('/');
            const id = parts[parts.length - 1].split('?')[0];
            if (id.length === 11) return id;
        }
        return null;
    };

    const videoId = getVideoId(url);
    if (!videoId) return (
        <div className="mt-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 items-center justify-center flex">
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider">Format URL indak valid atau ID indak ditamukan</p>
        </div>
    );

    return (
        <div className="mt-2 relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-black flex items-center justify-center">
            <iframe
                className="absolute inset-0 w-full h-full border-0 shadow-2xl"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

const HotspotPicker: React.FC<{
    imageUrl: string;
    hotspots: any[];
    onChange: (hotspots: any[]) => void
}> = ({ imageUrl, hotspots, onChange }) => {
    const viewerRef = React.useRef<HTMLDivElement>(null);
    const viewerInstance = React.useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewerReady, setViewerReady] = useState(false);

    const initViewer = () => {
        if (!viewerRef.current || !imageUrl) return;

        // Wait for pannellum to be available in window
        if (!(window as any).pannellum) {
            console.error("Pannellum not found in window");
            setError("Library Pannellum belum dimuat. Cek koneksi internet.");
            return;
        }

        try {
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
            }

            const panoramaUrl = getProxiedImageUrl(imageUrl);

            console.log("Initializing Pannellum with URL:", panoramaUrl);

            viewerInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
                type: 'equirectangular',
                panorama: panoramaUrl,
                autoLoad: true,
                showControls: true,
                hotSpots: hotspots.map((h, i) => ({
                    ...h,
                    createTooltipFunc: (el: HTMLElement) => {
                        el.classList.add('custom-hotspot-label');
                        el.innerHTML = `
                            <div class="bg-black/90 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 shadow-2xl min-w-[150px] pointer-events-none">
                                <p class="text-[10px] font-black text-padang-green uppercase tracking-widest mb-1">${h.text || 'Hotspot'}</p>
                                ${h.description ? `<p class="text-[9px] text-white/70 leading-relaxed font-medium">${h.description}</p>` : ''}
                            </div>
                        `;
                    }
                })),
                crossOrigin: imageUrl.startsWith('http') ? 'anonymous' : undefined,
            });

            viewerInstance.current.on('load', () => {
                console.log("Pannellum Loaded Success");
                setIsLoading(false);
                setViewerReady(true);
                setError(null);
            });

            viewerInstance.current.on('error', (err: any) => {
                console.error("Pannellum Error Object:", err);
                setError(typeof err === 'string' ? err : (err.message || "Gagal memuat gambar 360. Pastikan URL benar."));
                setIsLoading(false);
            });
        } catch (e: any) {
            console.error("Initialization Exception:", e);
            setError(e.message);
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        setIsLoading(true);
        setViewerReady(false);
        setError(null);
        // Larger timeout to ensure DOM and libraries are ready
        const timer = setTimeout(initViewer, 1000);
        return () => {
            clearTimeout(timer);
            if (viewerInstance.current) viewerInstance.current.destroy();
        };
    }, [imageUrl]);

    const addHotspotAtCenter = () => {
        if (!viewerInstance.current || !viewerReady) {
            alert("Viewer belum siap. Silakan tunggu gambar muncul.");
            return;
        }

        const pitch = viewerInstance.current.getPitch();
        const yaw = viewerInstance.current.getYaw();

        const newHotspot = {
            pitch,
            yaw,
            type: 'info',
            text: 'Hotspot Baru',
            description: 'Tuliskan informasi detail di sini...'
        };

        const updated = [...hotspots, newHotspot];
        onChange(updated);

        // Add to live viewer
        try {
            viewerInstance.current.addHotSpot(newHotspot);
        } catch (e) {
            console.error("Error adding hotspot live:", e);
            // Fallback: re-init
            setTimeout(initViewer, 100);
        }
    };

    const addHotspotOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!viewerInstance.current || !viewerReady) {
            alert("Viewer belum siap. Silakan tunggu gambar muncul.");
            return;
        }

        const rect = viewerRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Convert screen coordinates to pitch and yaw
        const coords = viewerInstance.current.hottospotLocation(x, y);
        if (!coords) {
            console.warn("Could not get hotspot location from click coordinates.");
            return;
        }

        const newHotspot = {
            pitch: coords.pitch,
            yaw: coords.yaw,
            type: 'info',
            text: 'Hotspot Baru (Klik)',
            description: 'Tuliskan informasi detail di sini...'
        };

        const updated = [...hotspots, newHotspot];
        onChange(updated);

        try {
            viewerInstance.current.addHotSpot(newHotspot);
        } catch (e) {
            console.error("Error adding hotspot live from click:", e);
            setTimeout(initViewer, 100);
        }
    };

    const removeHotspot = (idx: number) => {
        const updated = hotspots.filter((_, i) => i !== idx);
        onChange(updated);
        // Best to re-init to sync UI exactly
        setTimeout(initViewer, 100);
    };

    const updateHotspot = (idx: number, data: any) => {
        const updated = [...hotspots];
        updated[idx] = { ...updated[idx], ...data };
        onChange(updated);
    };

    return (
        <div className="col-span-2 space-y-4">
            <div className="flex justify-between items-end">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                    <Crosshair size={12} className="text-chili-red" /> Virtual Tour Visual Editor
                </label>
                <button
                    type="button"
                    onClick={addHotspotAtCenter}
                    className="bg-chili-red hover:bg-chili-red/90 text-white text-[10px] font-black px-4 py-2.5 rounded-xl shadow-lg shadow-chili-red/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Kunci Hotspot di Posisi Ini
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 relative group">
                    <div
                        ref={viewerRef}
                        className="h-[650px] w-full rounded-[48px] border border-gray-100 overflow-hidden shadow-2xl bg-black relative"
                        onClick={addHotspotOnClick}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 transition-all">
                                <div className="h-12 w-12 border-4 border-padang-green border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-[10px] font-black text-white uppercase tracking-[4px]">Menghubungkan ke Panorama...</p>
                            </div>
                        )}
                        {error && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-xl z-20 p-12 text-center transition-all">
                                <div className="h-20 w-20 rounded-[32px] bg-chili-red/20 flex items-center justify-center text-chili-red mb-6 border border-chili-red/30">
                                    <X size={40} />
                                </div>
                                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-3">Gagal Memuat Viewer</h4>
                                <p className="text-[10px] text-white/60 mb-8 max-w-[280px] leading-relaxed italic">"{error}"</p>
                                <button
                                    onClick={initViewer}
                                    className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl active:scale-95"
                                >
                                    Coba Lagi
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 transition-opacity group-hover:opacity-40">
                        <Crosshair size={48} className="text-white" />
                    </div>
                </div>

                <div className="bg-white rounded-[48px] p-8 overflow-y-auto max-h-[650px] border border-gray-100 shadow-sm flex flex-col gap-6">
                    <div className="flex justify-between items-center px-1">
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manajemen Hotspot</h5>
                        <div className="bg-padang-green/10 text-padang-green px-2 py-0.5 rounded-full text-[9px] font-black">{hotspots.length} Spots</div>
                    </div>

                    {hotspots.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                            <Type size={32} className="text-gray-200 mb-3" />
                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed px-4">Belum ada titik interaktif. Geser gambar dan tempelkan hotspot baru.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {hotspots.map((h, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-[24px] border border-gray-100 space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="h-5 w-5 bg-padang-green text-white text-[9px] font-black flex items-center justify-center rounded-lg shadow-md shadow-padang-green/20">{i + 1}</span>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter italic">P:{h.pitch.toFixed(1)} Y:{h.yaw.toFixed(1)}</span>
                                        </div>
                                        <button type="button" onClick={() => removeHotspot(i)} className="text-gray-300 hover:text-chili-red transition-colors p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={h.text}
                                            onChange={(e) => updateHotspot(i, { text: e.target.value })}
                                            className="w-full text-sm font-bold text-gray-800 bg-white border border-gray-100 outline-none p-4 rounded-2xl focus:ring-2 focus:ring-padang-green/10 transition-all"
                                            placeholder="Judul (muncul saat hover)"
                                        />
                                        <textarea
                                            value={h.description || ''}
                                            onChange={(e) => updateHotspot(i, { description: e.target.value })}
                                            className="w-full text-xs font-medium text-gray-600 bg-white border border-gray-100 outline-none p-4 rounded-2xl focus:ring-2 focus:ring-padang-green/10 min-h-[150px] resize-y transition-all"
                                            placeholder="Informasi detail yang akan muncul saat hotspot di-klik..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
                <Shield size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 leading-relaxed">
                    <strong className="block mb-0.5">Tips Pengaturan:</strong>
                    Arahkan <span className="font-black italic">Crosshair</span> (tanda + di tengah layar) ke objek wisata yang ingin diberi penjelasan, lalu klik tombol merah di atas untuk mengunci titik tersebut. Isi judul dan deskripsi agar muncul sebagai info saat user melakukan tur.
                </p>
            </div>
        </div>
    );
};

const SceneManager: React.FC<{
    scenes: any[];
    onChange: (scenes: any[]) => void
}> = ({ scenes, onChange }) => {
    const [activeSceneIdx, setActiveSceneIdx] = useState(0);

    const addScene = () => {
        const newScene = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Scene ${scenes.length + 1}`,
            image360: '',
            hotspots: []
        };
        onChange([...scenes, newScene]);
        setActiveSceneIdx(scenes.length);
    };

    const removeScene = (idx: number) => {
        const updated = scenes.filter((_, i) => i !== idx);
        onChange(updated);
        if (activeSceneIdx >= updated.length) {
            setActiveSceneIdx(Math.max(0, updated.length - 1));
        }
    };

    const updateActiveScene = (data: any) => {
        const updated = [...scenes];
        updated[activeSceneIdx] = { ...updated[activeSceneIdx], ...data };
        onChange(updated);
    };

    const currentScene = scenes[activeSceneIdx];

    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {scenes.map((s, i) => (
                    <div key={s.id || i} className="relative group flex-shrink-0">
                        <button
                            type="button"
                            onClick={() => setActiveSceneIdx(i)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeSceneIdx === i ? 'bg-padang-green text-white border-padang-green shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-padang-green/30'}`}
                        >
                            {s.name || 'Untitled'}
                        </button>
                        {scenes.length > 1 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeScene(i);
                                }}
                                className="absolute -top-2 -right-2 bg-chili-red text-white h-5 w-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addScene}
                    className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-dashed border-gray-200 text-gray-400 hover:border-padang-green hover:text-padang-green transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Tambah Scene
                </button>
            </div>

            {currentScene ? (
                <div className="space-y-6 bg-white/50 p-6 rounded-[32px] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Scene (Navigasi POI)</label>
                            <input
                                type="text"
                                value={currentScene.name || ''}
                                onChange={(e) => updateActiveScene({ name: e.target.value })}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                placeholder="Misal: Halaman Depan"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar 360 Scene Ini</label>
                            <input
                                type="text"
                                value={currentScene.image360 || ''}
                                onChange={(e) => updateActiveScene({ image360: e.target.value })}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {currentScene.image360 ? (
                        <HotspotPicker
                            imageUrl={currentScene.image360}
                            hotspots={Array.isArray(currentScene.hotspots) ? currentScene.hotspots : []}
                            onChange={(h) => updateActiveScene({ hotspots: h })}
                        />
                    ) : (
                        <div className="p-10 border-2 border-dashed border-gray-100 rounded-[40px] text-center bg-white/30">
                            <Eye size={32} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Isi URL Gambar 360 untuk scene ini</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-[40px] text-center bg-white/30">
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Belum ada scene. Klik tombol "Tambah Scene" di atas.</p>
                </div>
            )}
        </div>
    );
};

const MapPicker: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const leafletRef = React.useRef<any>(null);
    const markerRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (leafletRef.current && markerRef.current) {
            const currentPos = markerRef.current.getLatLng();
            if (currentPos.lat !== lat || currentPos.lng !== lng) {
                markerRef.current.setLatLng([lat, lng]);
                leafletRef.current.setView([lat, lng], leafletRef.current.getZoom());
            }
        }
    }, [lat, lng]);

    React.useEffect(() => {
        const checkForLeaflet = setInterval(() => {
            if ((window as any).L && mapRef.current && !leafletRef.current) {
                clearInterval(checkForLeaflet);

                const L = (window as any).L;

                // Fix icon path for Leaflet
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                });

                const map = L.map(mapRef.current).setView([lat, lng], 15);
                leafletRef.current = map;

                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                markerRef.current = marker;

                marker.on('dragend', (e: any) => {
                    const position = e.target.getLatLng();
                    onChange(position.lat, position.lng);
                });

                map.on('click', (e: any) => {
                    const { lat, lng } = e.latlng;
                    marker.setLatLng([lat, lng]);
                    onChange(lat, lng);
                });

                // Invalidte size to fix rendering in modal
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);
                setTimeout(() => {
                    map.invalidateSize();
                }, 1200);
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

    // Update map view when coordinates change from outside (e.g. manual input)
    React.useEffect(() => {
        if (leafletRef.current && markerRef.current) {
            const currentPos = markerRef.current.getLatLng();
            // Use small epsilon for float comparison
            if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
                markerRef.current.setLatLng([lat, lng]);
                leafletRef.current.panTo([lat, lng]);
            }
        }
    }, [lat, lng]);

    return (
        <div className="col-span-2 space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <MapIcon size={12} className="text-padang-green" /> Pilih Lokasi di Peta
            </label>
            <div ref={mapRef} className="h-72 w-full rounded-3xl border border-gray-100 overflow-hidden shadow-inner z-0 relative bg-gray-100" />
            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">
                * Geser penanda merah atau klik di mana saja pada peta untuk mengatur koordinat.
            </p>
        </div>
    );
};

const AdminApp: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
    const [activeTab, setActiveTab] = useState<'users' | 'destinations' | 'events' | 'promotions' | 'articles' | 'guides' | 'culinary' | 'souvenir-vendors' | 'souvenir-products' | 'souvenir-orders'>('users');
    const [items, setItems] = useState<any[]>([]);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationCounts, setNotificationCounts] = useState({ guides: 0, culinary: 0, souvenirVendors: 0 });

    // Filter Logic
    const filteredItems = items.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();

        if (activeTab === 'users') {
            return (item.name?.toLowerCase().includes(query) ||
                item.email?.toLowerCase().includes(query) ||
                item.role?.toLowerCase().includes(query));
        }
        if (activeTab === 'destinations') {
            return (item.name?.toLowerCase().includes(query) ||
                item.location?.toLowerCase().includes(query) ||
                item.category?.toLowerCase().includes(query));
        }
        if (activeTab === 'culinary') {
            return (item.name?.toLowerCase().includes(query) ||
                item.address?.toLowerCase().includes(query) ||
                item.category?.toLowerCase().includes(query));
        }
        if (activeTab === 'events') {
            return (item.name?.toLowerCase().includes(query) ||
                item.location?.toLowerCase().includes(query));
        }
        if (activeTab === 'promotions') {
            return (item.title?.toLowerCase().includes(query) ||
                item.provider?.toLowerCase().includes(query));
        }
        if (activeTab === 'articles') {
            return (item.title?.toLowerCase().includes(query) ||
                item.author?.toLowerCase().includes(query) ||
                item.category?.toLowerCase().includes(query));
        }
        if (activeTab === 'guides') {
            return (item.user?.name?.toLowerCase().includes(query) ||
                item.user?.email?.toLowerCase().includes(query) ||
                item.status?.toLowerCase().includes(query));
        }
        if (activeTab === 'souvenir-vendors') {
            return (item.name?.toLowerCase().includes(query) || item.location?.toLowerCase().includes(query));
        }
        if (activeTab === 'souvenir-products') {
            return (item.name?.toLowerCase().includes(query) || item.category?.toLowerCase().includes(query));
        }
        if (activeTab === 'souvenir-orders') {
            return (item.id?.toLowerCase().includes(query) || item.user?.name?.toLowerCase().includes(query) || item.status?.toLowerCase().includes(query));
        }
        return true;
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotificationCounts(data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            fetchData();
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
            return () => clearInterval(interval);
        }
    }, [activeTab, token]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginForm)
            });
            const data = await res.json();
            if (data.token && data.user.role === 'ADMIN') {
                localStorage.setItem('admin_token', data.token);
                setToken(data.token);
                setIsLoggedIn(true);
            } else {
                alert(data.error || 'Hanya Admin yang bisa masuk!');
            }
        } catch (err) {
            alert('Login gagal');
        }
    };

    const fetchData = async () => {
        if (!token) return;
        try {
            console.log(`Fetching ${activeTab}...`);
            let endpoint = activeTab as string;
            if (activeTab === 'culinary') endpoint = 'culinary-spots';
            if (activeTab === 'souvenir-vendors') endpoint = 'souvenirs/vendors';
            if (activeTab === 'souvenir-products') endpoint = 'souvenirs/products';
            if (activeTab === 'souvenir-orders') endpoint = 'souvenirs/orders';

            const res = await fetch(`${API_BASE_URL}/admin/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            console.log(`Data received for ${activeTab}:`, data);
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                console.error('API did not return an array:', data);
                setItems([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setItems([]);
        }
    };

    const handleOpenModal = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            // Parse nested JSON if needed
            const hotspots = item.hotspots ? (typeof item.hotspots === 'string' ? JSON.parse(item.hotspots) : item.hotspots) : [];
            const scenes = item.scenes ? (typeof item.scenes === 'string' ? JSON.parse(item.scenes) : item.scenes) : [];
            const menuHighlights = item.menuHighlights ? (typeof item.menuHighlights === 'string' ? JSON.parse(item.menuHighlights) : item.menuHighlights) : [];

            // Migration: If no scenes but has image360, create initial scene
            let finalScenes = scenes;
            if (scenes.length === 0 && item.image360) {
                finalScenes = [{
                    id: 'main',
                    name: 'Titik Utama',
                    image360: item.image360,
                    hotspots: hotspots
                }];
            }

            setFormData({
                ...item,
                hotspots,
                scenes: finalScenes,
                menuHighlights
            });
        } else {
            setEditingItem(null);
            if (activeTab === 'users') {
                setFormData({ name: '', email: '', password: '', role: 'USER', level: 1, points: 0 });
            } else if (activeTab === 'destinations') {
                setFormData({
                    name: '', category: 'Alam', rating: 4.5, location: '', image: '',
                    image360: '', audioNarration: '', hotspots: [], scenes: [], isEnhanced: false,
                    description: '', price: 'Gratis', lat: -0.947, lng: 100.417, videoUrl: ''
                });
            } else if (activeTab === 'events') {
                setFormData({ name: '', date: new Date().toISOString(), location: '', image: '', description: '', price: '', videoUrl: '' });
            } else if (activeTab === 'articles') {
                setFormData({ title: '', content: '', image: '', category: 'Wisata', author: 'Admin', videoUrl: '' });
            } else if (activeTab === 'culinary') {
                setFormData({
                    name: '', category: 'Cafe', description: '', priceRange: '$$',
                    address: '', lat: -0.947, lng: 100.417, image: '', images: [],
                    facilities: [], openingHours: {}, menuHighlights: [], contact: '', isHalal: true, videoUrl: ''
                });
            } else if (activeTab === 'souvenir-vendors') {
                setFormData({ name: '', image: '', location: '', contact: '', description: '', rating: 4.5 });
            } else if (activeTab === 'souvenir-products') {
                setFormData({ name: '', description: '', price: 0, stock: 0, category: 'Lainnya', images: [], vendorId: '', rating: 4.5 });
            } else if (activeTab === 'souvenir-orders') {
                setFormData({}); // Orders are managed, not typically created manually here
            } else {
                setFormData({ title: '', discount: '', image: '', videoUrl: '', provider: 'TIC-PADANG' });
            }
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? 'PUT' : 'POST';
        let endpoint = activeTab as string;
        if (activeTab === 'culinary') endpoint = 'culinary-spots';
        if (activeTab === 'souvenir-vendors') endpoint = 'souvenirs/vendors';
        if (activeTab === 'souvenir-products') endpoint = 'souvenirs/products';
        if (activeTab === 'souvenir-orders') endpoint = 'souvenirs/orders';

        const url = editingItem ? `${API_BASE_URL}/admin/${endpoint}/${editingItem.id}` : `${API_BASE_URL}/admin/${endpoint}`;

        // Prepare formData for submission, especially for hotspots
        const dataToSubmit = { ...formData };

        // Auto-calculate price range for culinary
        if (activeTab === 'culinary') {
            const menus = dataToSubmit.menuHighlights || [];
            let calculatedRange = 'Harga Menyesuaikan'; // Default
            const prices = menus.map((m: any) => parseInt(m.price) || 0).filter((p: number) => p > 0);
            if (prices.length > 0) {
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                calculatedRange = min === max
                    ? `Rp ${min.toLocaleString('id-ID')}`
                    : `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
            }
            dataToSubmit.priceRange = calculatedRange;
        }

        if (activeTab === 'destinations') {
            if (dataToSubmit.hotspots) dataToSubmit.hotspots = JSON.stringify(dataToSubmit.hotspots);
            if (dataToSubmit.scenes) dataToSubmit.scenes = JSON.stringify(dataToSubmit.scenes);
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSubmit)
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            alert('Gagal menyimpan data');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Yakin ingin menghapus?')) return;
        try {
            let endpoint = activeTab as string;
            if (activeTab === 'culinary') endpoint = 'culinary-spots';
            if (activeTab === 'souvenir-vendors') endpoint = 'souvenirs/vendors';
            if (activeTab === 'souvenir-products') endpoint = 'souvenirs/products';

            const res = await fetch(`${API_BASE_URL}/admin/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (err) {
            alert('Gagal menghapus');
        }
    };

    const handleVerifyGuide = async (id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
        if (!window.confirm(`Yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} pemandu ini?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/guides/${id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchData();
            else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            alert('Gagal memproses verifikasi');
        }
    };

    const handleVerifyVendor = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!window.confirm(`Yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} vendor ini?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/souvenirs/vendors/${id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchData();
            else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            alert('Gagal memproses verifikasi vendor');
        }
    };

    const handleVerifyCulinary = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!window.confirm(`Yakin ingin ${status === 'APPROVED' ? 'menyetujui' : 'menolak'} usaha kuliner ini?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/culinary/${id}/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchData();
            else {
                const err = await res.json();
                alert(err.error);
            }
        } catch (err) {
            alert('Gagal memproses verifikasi kuliner');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setIsLoggedIn(false);
        setToken(null);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="h-16 w-16 bg-padang-green rounded-2xl flex items-center justify-center shadow-lg shadow-padang-green/20">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400 text-center text-sm mb-8">Silakan masuk untuk mengelola TIC-PADANG</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Admin</label>
                            <input
                                type="email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-padang-green/20 outline-none"
                                placeholder="admin@tic.com"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full mt-2 bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-padang-green/20 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                        <button className="w-full bg-padang-green text-white py-4 rounded-2xl font-bold shadow-xl shadow-padang-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Masuk Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="h-10 w-10 bg-padang-green rounded-xl flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="font-bold text-gray-800 tracking-tight text-xl">Admin TIC</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {[
                        { id: 'users', label: 'Pengguna', icon: Users },
                        { id: 'destinations', label: 'Destinasi', icon: MapPin },
                        { id: 'culinary', label: 'Kelola Kuliner', icon: Utensils, badge: notificationCounts.culinary },
                        { id: 'events', label: 'Event Kota', icon: Calendar },
                        { id: 'promotions', label: 'Promosi', icon: Settings },
                        { id: 'articles', label: 'Berita & Artikel', icon: BarChart3 },
                        { id: 'guides', label: 'Verifikasi Pemandu', icon: Shield, badge: notificationCounts.guides },
                        { id: 'souvenir-vendors', label: 'Vendor Oleh-oleh', icon: Store, badge: notificationCounts.souvenirVendors },
                    ].map((nav) => (
                        <button
                            key={nav.id}
                            onClick={() => setActiveTab(nav.id as any)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === nav.id
                                ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20 font-bold'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                        >
                            <nav.icon size={20} />
                            <span className="text-sm">{nav.label}</span>
                            {nav.badge !== undefined && nav.badge > 0 && (
                                <span className="ml-auto bg-chili-red text-white text-[10px] font-black px-2 py-0.5 rounded-full">{nav.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-4 px-4 py-4 text-chili-red font-bold hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="text-sm">Keluar</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                            {activeTab === 'users' ? 'Manajemen User' :
                                activeTab === 'destinations' ? 'Kelola Destinasi' :
                                    activeTab === 'culinary' ? 'Kelola Kuliner' :
                                        activeTab === 'events' ? 'Kelola Event' :
                                            activeTab === 'articles' ? 'Berita & Artikel' :
                                                activeTab === 'guides' ? 'Verifikasi Pemandu' :
                                                    activeTab === 'souvenir-vendors' ? 'Vendor Oleh-oleh' :
                                                        activeTab === 'souvenir-products' ? 'Produk Oleh-oleh' :
                                                            activeTab === 'souvenir-orders' ? 'Pesanan Oleh-oleh' :
                                                                'Kelola Promosi'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">TIC-PADANG Admin Control Center</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari data..."
                                className="pl-12 pr-6 py-4 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-padang-green/5 outline-none shadow-sm w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            disabled={activeTab === 'guides' || activeTab === 'souvenir-orders' || activeTab === 'souvenir-vendors' || activeTab === 'culinary'}
                            className={`px-8 py-4 rounded-2xl flex items-center gap-2 font-bold shadow-xl transition-all ${activeTab === 'guides' || activeTab === 'souvenir-orders' || activeTab === 'souvenir-vendors' || activeTab === 'culinary' ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-padang-green text-white shadow-padang-green/10 hover:scale-105 active:scale-95'}`}
                        >
                            <Plus size={20} /> Tambah {activeTab === 'users' ? 'User' : activeTab === 'destinations' ? 'Destinasi' : activeTab === 'culinary' ? 'Tempat Kuliner' : activeTab === 'events' ? 'Event' : activeTab === 'articles' ? 'Artikel' : activeTab === 'souvenir-vendors' ? 'Vendor' : activeTab === 'souvenir-products' ? 'Produk' : 'Data'}
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {activeTab === 'users' ? 'Role / Level' :
                                        activeTab === 'destinations' ? 'Kategori / Lokasi' :
                                            activeTab === 'culinary' ? 'Kategori / Harga' :
                                                activeTab === 'guides' ? 'Status / Exp' :
                                                    activeTab === 'articles' ? 'Kategori / Author' :
                                                        activeTab === 'souvenir-vendors' ? 'Lokasi / Rating' :
                                                            activeTab === 'souvenir-products' ? 'Kategori / Stok' :
                                                                activeTab === 'souvenir-orders' ? 'User / Total' : 'Lokasi / Harga'}
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                        Tidak ada data untuk {activeTab} {searchQuery && ` dengan kata kunci "${searchQuery}"`}
                                    </td>
                                </tr>
                            ) : filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-50">
                                                <SafeImage src={item.avatar || item.image || item.images?.[0] || item.user?.avatar} alt={item.name || item.title || item.user?.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.name || item.title || item.user?.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {activeTab === 'users' ? item.email :
                                                        activeTab === 'guides' ? item.user?.email :
                                                            activeTab === 'culinary' ? item.address :
                                                                activeTab === 'promotions' ? item.provider :
                                                                    activeTab === 'souvenir-vendors' ? item.location :
                                                                        activeTab === 'souvenir-products' ? item.category :
                                                                            activeTab === 'souvenir-orders' ? `ID: ${(item.id || '').slice(-8)}` :
                                                                                activeTab === 'articles' ? (item.content ? item.content.substring(0, 30) + '...' : '') :
                                                                                    activeTab === 'events' ? new Date(item.date).toLocaleDateString() : item.category}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-block self-start ${activeTab === 'users' ? (item.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600') :
                                                activeTab === 'destinations' ? (item.category === 'Alam' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600') :
                                                    activeTab === 'culinary' ? 'bg-orange-100 text-orange-600' :
                                                        activeTab === 'promotions' ? 'bg-orange-100 text-orange-600' :
                                                            activeTab === 'guides' ? (item.status === 'APPROVED' ? 'bg-padang-green/10 text-padang-green' : item.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600') :
                                                                activeTab === 'souvenir-vendors' ? (item.status === 'APPROVED' ? 'bg-padang-green/10 text-padang-green' : item.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600') :
                                                                    activeTab === 'articles' ? 'bg-blue-100 text-blue-600' : 'bg-padang-green/10 text-padang-green'
                                                }`}>
                                                {activeTab === 'users' ? item.role :
                                                    activeTab === 'destinations' ? item.category :
                                                        activeTab === 'culinary' ? item.category :
                                                            activeTab === 'promotions' ? 'PROMO' :
                                                                activeTab === 'guides' ? item.status :
                                                                    activeTab === 'souvenir-vendors' ? item.status :
                                                                        activeTab === 'souvenir-products' ? 'PRODUK' :
                                                                            activeTab === 'souvenir-orders' ? item.status :
                                                                                activeTab === 'articles' ? item.category : 'EVENT'}
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-bold ml-1">
                                                {item.location || (activeTab === 'culinary' ? (() => {
                                                    // Dynamic price calculation
                                                    if (item.priceRange && item.priceRange.includes('Rp') && !item.priceRange.includes('Rp Rp')) return item.priceRange;

                                                    const menus = typeof item.menuHighlights === 'string' ? JSON.parse(item.menuHighlights) : (item.menuHighlights || []);
                                                    const prices = Array.isArray(menus) ? menus.map((m: any) => parseInt(m.price) || 0).filter((p: number) => p > 0) : [];

                                                    if (prices.length > 0) {
                                                        const min = Math.min(...prices);
                                                        const max = Math.max(...prices);
                                                        return min === max ? `Rp ${min.toLocaleString('id-ID')}` : `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
                                                    }

                                                    return item.priceRange ? item.priceRange.replace(/\$/g, 'Rp ') : 'Harga Menyesuaikan';
                                                })() :
                                                    activeTab === 'promotions' ? `${item.discount} • ${item.videoUrl ? 'With Video' : 'Image only'}` :
                                                        activeTab === 'guides' ? `${item.yearsExperience} Thn Exp • ${item.languages?.join(', ')}` :
                                                            activeTab === 'souvenir-vendors' ? `${(item.rating || 0).toFixed(1)} Stars • ${item.contact || 'No Contact'}` :
                                                                activeTab === 'souvenir-products' ? `Stock: ${item.stock || 0} • Rp ${(item.price || 0).toLocaleString('id-ID')}` :
                                                                    activeTab === 'souvenir-orders' ? `${item.user?.name || 'Anonymous'} • Rp ${(item.totalPrice || 0).toLocaleString('id-ID')}` :
                                                                        activeTab === 'articles' ? `By ${item.author} • ${new Date(item.date).toLocaleDateString()}` :
                                                                            typeof item.level === 'number' ? `Lvl ${item.level} • ${item.points} Pts` : '')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {(activeTab === 'guides' || activeTab === 'souvenir-vendors' || activeTab === 'culinary') && item.status === 'PENDING' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (activeTab === 'guides') handleVerifyGuide(item.id, 'APPROVED');
                                                        else if (activeTab === 'souvenir-vendors') handleVerifyVendor(item.id, 'APPROVED');
                                                        else handleVerifyCulinary(item.id, 'APPROVED');
                                                    }}
                                                    className="p-2.5 bg-padang-green/10 text-padang-green hover:bg-padang-green hover:text-white rounded-xl transition-all"
                                                    title="Setujui"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (activeTab === 'guides') handleVerifyGuide(item.id, 'REJECTED');
                                                        else if (activeTab === 'souvenir-vendors') handleVerifyVendor(item.id, 'REJECTED');
                                                        else handleVerifyCulinary(item.id, 'REJECTED');
                                                    }}
                                                    className="p-2.5 bg-red-50 text-chili-red hover:bg-chili-red hover:text-white rounded-xl transition-all"
                                                    title="Tolak"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                {!(activeTab === 'guides' || activeTab === 'souvenir-vendors' || activeTab === 'culinary') && (
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-padang-green hover:bg-padang-green/5 rounded-xl transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-chili-red hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Full Screen Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[95vh] animate-in zoom-in-95">
                        <div className="p-8 bg-padang-green text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">{editingItem ? 'Update Data' : 'Tambah Baru'}</h3>
                                <p className="text-white/60 text-sm mt-1">{activeTab.toUpperCase()} Control</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all font-bold"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-8">
                                {activeTab === 'users' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email</label>
                                            <input required type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Password</label>
                                            <input type="password" placeholder={editingItem ? 'Kosongkan jika tidak ganti' : 'Password...'} value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Role Pengguna</label>
                                            <select value={formData.role || 'USER'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all font-bold">
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Level</label>
                                            <input type="number" value={formData.level || 1} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Poin</label>
                                            <input type="number" value={formData.points || 0} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none transition-all font-bold" />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'destinations' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Destinasi</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Kategori</label>
                                            <select value={formData.category || 'Alam'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold">
                                                <option value="Alam">Alam</option>
                                                <option value="Budaya">Budaya</option>
                                                <option value="Belanja">Belanja</option>
                                                <option value="Religi">Religi</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Rating (0-5)</label>
                                            <input type="number" step="0.1" min="0" max="5" value={formData.rating || 0} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Utama</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Link Video YouTube (Embed Link/ID)</label>
                                            <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="E.g. https://www.youtube.com/embed/XXXXX atau cuma ID-nya" />
                                            <VideoPreview url={formData.videoUrl} />
                                            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Jika diisi, video akan tampil di halaman detail.</p>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar 360° (Equirectangular)</label>
                                            <input type="text" value={formData.image360 || ''} onChange={(e) => setFormData({ ...formData, image360: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image360} />
                                        </div>

                                        <div className="col-span-2 bg-gradient-to-br from-padang-green/5 to-white p-6 rounded-[32px] border border-padang-green/10 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-[10px] font-black text-padang-green uppercase tracking-[3px]">Virtual Tour Enhanced</h4>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" checked={formData.isEnhanced || false} onChange={(e) => setFormData({ ...formData, isEnhanced: e.target.checked })} />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-padang-green"></div>
                                                    <span className="ms-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aktifkan Fitur Premium</span>
                                                </label>
                                            </div>

                                            {formData.isEnhanced && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Narasi Audio (MP3/Link)</label>
                                                        <input type="text" value={formData.audioNarration || ''} onChange={(e) => setFormData({ ...formData, audioNarration: e.target.value })} className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Manajemen Multi-Scene (Peta Navigasi POI)</label>
                                                        <p className="text-[10px] text-gray-400 font-bold ml-1 mb-4 italic">* Anda bisa menambahkan banyak lokasi (scene) dalam satu destinasi.</p>
                                                        <SceneManager
                                                            scenes={Array.isArray(formData.scenes) ? formData.scenes : []}
                                                            onChange={(newScenes) => setFormData({ ...formData, scenes: newScenes })}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deskripsi Lengkap</label>
                                            <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]" placeholder="Ceritakan tentang destinasi ini..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Lokasi</label>
                                            <input required type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Harga</label>
                                            <input type="text" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Latitude</label>
                                            <input required type="number" step="any" value={formData.lat || 0} onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Longitude</label>
                                            <input required type="number" step="any" value={formData.lng || 0} onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <MapPicker lat={formData.lat || -0.947} lng={formData.lng || 100.417} onChange={(lat, lng) => setFormData({ ...formData, lat, lng })} />
                                    </>
                                )}

                                {activeTab === 'promotions' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Judul Promosi</label>
                                            <input required type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Label Diskon/Promo</label>
                                            <input required type="text" value={formData.discount || ''} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" placeholder="E.g. Diskon 50%" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Provider</label>
                                            <input required type="text" value={formData.provider || ''} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Thumbnail</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Link Video YouTube (Embed Link/ID)</label>
                                            <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="E.g. https://www.youtube.com/embed/XXXXX atau cuma ID-nya" />
                                            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Jika diisi, video akan tampil menggantikan gambar di beranda.</p>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'events' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Event</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tanggal</label>
                                            <input required type="datetime-local" value={formData.date ? formData.date.slice(0, 16) : ''} onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Harga Tiket</label>
                                            <input type="text" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Gratis / Rp..." />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Lokasi</label>
                                            <input required type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Link Video YouTube (ID / URL)</label>
                                            <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Masukkan ID YouTube atau Link" />
                                            <VideoPreview url={formData.videoUrl} />
                                            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Video akan tampil secara otomatis di halaman detail.</p>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deskripsi Event</label>
                                            <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]" placeholder="Deskripsi lengkap event..." />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'articles' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Judul Artikel</label>
                                            <input required type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Kategori</label>
                                            <select value={formData.category || 'Wisata'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold">
                                                <option value="Wisata">Wisata</option>

                                                <option value="Budaya">Budaya</option>
                                                <option value="Event">Event</option>
                                                <option value="Tips">Tips</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Penulis</label>
                                            <input type="text" value={formData.author || 'Admin'} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Utama</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Link Video YouTube (Embed Link/ID)</label>
                                            <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="E.g. https://www.youtube.com/embed/XXXXX atau cuma ID-nya" />
                                            <VideoPreview url={formData.videoUrl} />
                                            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Jika diisi, video akan tampil di halaman detail artikel.</p>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Konten Artikel</label>
                                            <textarea required value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[200px]" placeholder="Tulis artikel lengkap di sini..." />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'souvenir-vendors' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Vendor</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Alamat/Lokasi</label>
                                            <input required type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Kontak (WhatsApp)</label>
                                            <input type="text" value={formData.contact || ''} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="628xx..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Rating (0-5)</label>
                                            <input type="number" step="0.1" value={formData.rating || 4.5} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Vendor</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deskripsi Vendor</label>
                                            <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]" placeholder="Deskripsi vendor oleh-oleh..." />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'souvenir-products' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Produk</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Kategori</label>
                                            <select value={formData.category || 'Lainnya'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold">
                                                <option value="Makanan">Makanan</option>
                                                <option value="Pakaian">Pakaian</option>
                                                <option value="Kerajinan">Kerajinan</option>
                                                <option value="Aksesori">Aksesori</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Vendor (ID)</label>
                                            <input required type="text" value={formData.vendorId || ''} onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Masukkan ID Vendor" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Harga (Rp)</label>
                                            <input required type="number" value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Stok</label>
                                            <input required type="number" value={formData.stock || 0} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Produk (Thumbnail)</label>
                                            <input required type="text" value={formData.image || (formData.images && formData.images[0]) || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value, images: [e.target.value] })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image || (formData.images && formData.images[0])} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deskripsi Produk</label>
                                            <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]" placeholder="Detail produk oleh-oleh..." />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'culinary' && (
                                    <>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nama Tempat Kuliner</label>
                                            <input required type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Kategori</label>
                                            <select value={formData.category || 'Cafe'} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold">
                                                <option value="Cafe">Cafe</option>
                                                <option value="Restoran">Restoran</option>
                                                <option value="Warung">Warung</option>
                                                <option value="Dessert">Dessert</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Range Harga (Otomatis)</label>
                                            <div className="w-full bg-gray-100 border border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-500">
                                                {(() => {
                                                    const menus = formData.menuHighlights || [];
                                                    if (!menus || menus.length === 0) return 'Belum ada menu';
                                                    const prices = menus.map((m: any) => parseInt(m.price) || 0).filter((p: number) => p > 0);
                                                    if (prices.length === 0) return 'Belum ada harga';
                                                    const min = Math.min(...prices);
                                                    const max = Math.max(...prices);
                                                    return min === max
                                                        ? `Rp ${min.toLocaleString('id-ID')}`
                                                        : `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
                                                })()}
                                            </div>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar Utama</label>
                                            <input required type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                            <ImagePreview url={formData.image} />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Link Video YouTube (ID / URL)</label>
                                            <input type="text" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Masukkan ID YouTube atau Link" />
                                            <VideoPreview url={formData.videoUrl} />
                                            <p className="text-[10px] text-gray-400 font-bold ml-1 italic">* Video akan tampil secara otomatis di halaman detail.</p>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deskripsi Lengkap</label>
                                            <textarea required value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]" placeholder="Ceritakan tentang tempat kuliner ini..." />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Alamat</label>
                                            <input required type="text" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Latitude</label>
                                            <input required type="number" step="any" value={formData.lat || 0} onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Longitude</label>
                                            <input required type="number" step="any" value={formData.lng || 0} onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none font-bold" />
                                        </div>
                                        <MapPicker lat={formData.lat || -0.947} lng={formData.lng || 100.417} onChange={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))} />
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nomor Kontak</label>
                                            <input type="text" value={formData.contact || ''} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="08xx-xxxx-xxxx" />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Fasilitas (pisahkan dengan koma)</label>
                                            <input type="text" value={(formData.facilities || []).join(', ')} onChange={(e) => setFormData({ ...formData, facilities: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="WiFi, Parking, AC, Outdoor Seating" />
                                        </div>
                                        <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                                            <input type="checkbox" id="isHalal" checked={formData.isHalal !== false} onChange={(e) => setFormData({ ...formData, isHalal: e.target.checked })} className="h-5 w-5 text-padang-green rounded" />
                                            <label htmlFor="isHalal" className="text-sm font-bold text-gray-700 cursor-pointer">Tempat ini menyediakan makanan Halal</label>
                                        </div>

                                        <div className="col-span-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Menu Unggulan</label>
                                                <button type="button" onClick={() => {
                                                    const currentMenus = formData.menuHighlights || [];
                                                    setFormData({ ...formData, menuHighlights: [...currentMenus, { name: '', price: '', image: '' }] });
                                                }} className="text-xs font-bold text-padang-green hover:underline">+ Tambah Menu</button>
                                            </div>

                                            {(formData.menuHighlights || []).map((menu: any, index: number) => (
                                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 relative group">
                                                    <button type="button" onClick={() => {
                                                        const newMenus = [...(formData.menuHighlights || [])];
                                                        newMenus.splice(index, 1);
                                                        setFormData({ ...formData, menuHighlights: newMenus });
                                                    }} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors p-2">
                                                        <Trash2 size={16} />
                                                    </button>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Menu</label>
                                                            <input type="text" value={menu.name} onChange={(e) => {
                                                                const newMenus = [...(formData.menuHighlights || [])];
                                                                newMenus[index].name = e.target.value;
                                                                setFormData({ ...formData, menuHighlights: newMenus });
                                                            }} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold focus:ring-2 focus:ring-padang-green/10 outline-none" placeholder="Contoh: Rendang" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga</label>
                                                            <input type="number" value={menu.price} onChange={(e) => {
                                                                const newMenus = [...(formData.menuHighlights || [])];
                                                                newMenus[index].price = e.target.value;
                                                                setFormData({ ...formData, menuHighlights: newMenus });
                                                            }} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold focus:ring-2 focus:ring-padang-green/10 outline-none" placeholder="Contoh: 25000" />
                                                        </div>
                                                        <div className="col-span-2 space-y-1">
                                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL Gambar</label>
                                                            <input type="text" value={menu.image} onChange={(e) => {
                                                                const newMenus = [...(formData.menuHighlights || [])];
                                                                newMenus[index].image = e.target.value;
                                                                setFormData({ ...formData, menuHighlights: newMenus });
                                                            }} className="w-full bg-white border border-gray-200 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-padang-green/10 outline-none" placeholder="https://..." />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {(formData.menuHighlights || []).length === 0 && (
                                                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
                                                    Belum ada menu unggulan. Klik "+ Tambah Menu" untuk menambahkan.
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button type="submit" className="flex-1 bg-padang-green text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-padang-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                    <Save size={20} /> Simpan Data Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = createRoot(document.getElementById('admin-root')!);
root.render(<AdminApp />);
