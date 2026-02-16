import React, { useState, useEffect } from 'react';
import { ChevronLeft, Utensils, Plus, Trash2, Edit3, Store, Save, X, MapPin, Camera, FileText, Map as MapIcon, Shield, ChevronRight, ShoppingBag } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import { CulinarySpot, CulinaryMenu } from '../types';
import { SafeImage } from '../components/SafeImage';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const VideoPreview: React.FC<{ url: string }> = ({ url }) => {
    if (!url) return null;

    const getVideoId = (input: string) => {
        const trimmed = input.trim();
        if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) return trimmed;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = trimmed.match(regExp);
        if (match && match[2].length === 11) return match[2];
        return null;
    };

    const videoId = getVideoId(url);
    if (!videoId) return (
        <div className="mt-2 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-center">
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider">Format URL tidak valid</p>
        </div>
    );

    return (
        <div className="mt-2 relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-black">
            <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

const MapPicker: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const leafletRef = React.useRef<any>(null);
    const markerRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (!mapRef.current || leafletRef.current) return;

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

        setTimeout(() => map.invalidateSize(), 100);
        setTimeout(() => map.invalidateSize(), 500);

        return () => {
            if (leafletRef.current) {
                leafletRef.current.remove();
                leafletRef.current = null;
            }
        };
    }, []);

    React.useEffect(() => {
        if (leafletRef.current && markerRef.current) {
            const currentPos = markerRef.current.getLatLng();
            if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
                markerRef.current.setLatLng([lat, lng]);
                leafletRef.current.panTo([lat, lng]);
            }
        }
    }, [lat, lng]);

    return (
        <div className="space-y-2 mt-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lokasi di Peta</label>
            <div className="relative">
                <div ref={mapRef} className="h-80 w-full rounded-2xl border border-gray-100 overflow-hidden shadow-inner relative bg-gray-50" style={{ minHeight: '320px', zIndex: 1 }} />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { latitude, longitude } = position.coords;
                                    onChange(latitude, longitude);
                                },
                                (error) => {
                                    alert('Gagal mendapatkan lokasi: ' + error.message);
                                },
                                { enableHighAccuracy: true }
                            );
                        } else {
                            alert('Geolocation tidak didukung browser ini.');
                        }
                    }}
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-lg border border-gray-100 z-[1000] hover:bg-gray-50 transition-all active:scale-95"
                    title="Gunakan Lokasi Saya"
                >
                    <MapPin className="h-5 w-5 text-blue-500" />
                </button>
            </div>
            <p className="text-[9px] text-gray-400 font-bold italic ml-1">* Klik atau geser penanda untuk mengatur lokasi.</p>
        </div>
    );
};

interface CulinaryDashboardScreenProps {
    onBack: () => void;
}

export const CulinaryDashboardScreen: React.FC<CulinaryDashboardScreenProps> = ({ onBack }) => {
    const isDesktop = window.location.pathname.includes('vendor.html');
    // Multi-Business State
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
    const [loadingBusinesses, setLoadingBusinesses] = useState(true);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Dashboard State
    const [activeTab, setActiveTab] = useState<'menu' | 'profile' | 'orders'>('menu');
    const [spot, setSpot] = useState<CulinarySpot | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Profile Form State
    const [profileFormData, setProfileFormData] = useState({
        name: '',
        category: 'Cafe',
        description: '',
        address: '',
        contact: '',
        image: '',
        videoUrl: '',
        priceRange: '',
        lat: -0.947,
        lng: 100.417,
        facilities: [] as string[],
        isHalal: true
    });

    // Menu Modal State
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<CulinaryMenu | null>(null);
    const [menuFormData, setMenuFormData] = useState({
        name: '',
        description: '',
        price: 0,
        image: ''
    });

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoadingBusinesses(true);
        try {
            const data = await apiService.getUserBusinesses();
            const spots = data.culinarySpots || [];
            setBusinesses(spots);

            if (spots.length === 0) {
                setIsCreatingNew(true);
            } else if (spots.length === 1) {
                setSelectedSpotId(spots[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBusinesses(false);
        }
    };

    useEffect(() => {
        if (selectedSpotId) {
            fetchDashboardData();
        }
    }, [selectedSpotId, activeTab]);

    const fetchDashboardData = async () => {
        if (!selectedSpotId) return;
        setLoading(true);
        try {
            const data = await apiService.getCulinaryVendorProfile(selectedSpotId);
            setSpot(data);
            if (data) {
                setProfileFormData({
                    name: data.name || '',
                    category: data.category || 'Cafe',
                    description: data.description || '',
                    address: data.address || '',
                    contact: data.contact || '',
                    image: data.image || '',
                    videoUrl: data.videoUrl || '',
                    priceRange: data.priceRange || '',
                    lat: data.lat || -0.947,
                    lng: data.lng || 100.417,
                    facilities: Array.isArray(data.facilities) ? data.facilities : [],
                    isHalal: data.isHalal !== false
                });
            }

            if (activeTab === 'orders') {
                const ordersData = await apiService.getCulinaryOrders(selectedSpotId);
                setOrders(ordersData);
            }
        } catch (err) {
            console.error('Fetch Culinary Dashboard Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        if (!window.confirm(`Ubah status pesanan menjadi ${status}?`)) return;
        try {
            await apiService.updateCulinaryOrderStatus(orderId, status);
            fetchDashboardData();
        } catch (err) {
            alert('Gagal memperbarui status pesanan');
        }
    };

    const handleCreateNewBusiness = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Apply as new culinary spot
            await apiService.applyCulinaryVendor(profileFormData);
            alert('Pendaftaran usaha kuliner berhasil diajukan! Menunggu verifikasi admin.');
            setIsCreatingNew(false);
            fetchBusinesses();
        } catch (err: any) {
            alert('Gagal mendaftar: ' + (err.message || 'Error'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpotId) return;
        setIsSaving(true);
        try {
            await apiService.updateCulinaryVendorProfile({
                ...profileFormData,
                id: selectedSpotId
            });
            fetchDashboardData();
            alert('Profil berhasil diperbarui');
        } catch (err: any) {
            console.error('Save Profile Error:', err);
            alert('Gagal memperbarui profil: ' + (err.message || 'Error tidak diketahui'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenMenuModal = (menu: CulinaryMenu | null = null) => {
        if (menu) {
            setEditingMenu(menu);
            setMenuFormData({
                name: menu.name,
                description: menu.description,
                price: menu.price,
                image: menu.image || ''
            });
        } else {
            setEditingMenu(null);
            setMenuFormData({
                name: '',
                description: '',
                price: 0,
                image: ''
            });
        }
        setIsMenuModalOpen(true);
    };

    const handleSaveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpotId) return;
        try {
            if (editingMenu) {
                await apiService.updateCulinaryMenu(editingMenu.id, menuFormData);
            } else {
                await apiService.addCulinaryMenu({
                    ...menuFormData,
                    spotId: selectedSpotId
                });
            }
            setIsMenuModalOpen(false);
            fetchDashboardData();
            alert('Menu berhasil disimpan');
        } catch (err: any) {
            console.error('Save Menu Error:', err);
            alert('Gagal menyimpan menu: ' + (err.message || 'Error tidak diketahui'));
        }
    };

    const handleDeleteMenu = async (id: string) => {
        if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
        try {
            await apiService.deleteCulinaryMenu(id);
            fetchDashboardData();
            alert('Menu berhasil dihapus');
        } catch (err) {
            alert('Gagal menghapus menu');
        }
    };

    // --- RENDER LOGIC ---

    if (loadingBusinesses) {
        return (
            <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!selectedSpotId || isCreatingNew) {
        if (isCreatingNew) {
            return (
                <div className="bg-gray-50 min-h-screen pb-20">
                    <div className="bg-white pt-12 pb-4 px-4 flex flex-row items-center border-b border-gray-100 sticky top-0 z-10">
                        <button onClick={() => {
                            if (businesses.length > 0) setIsCreatingNew(false);
                            else onBack();
                        }} className="p-2">
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Daftar Usaha Baru</h1>
                    </div>
                    <div className="p-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex flex-row items-center gap-2">
                                <Utensils className="text-orange-500" size={24} />
                                Informasi Tempat
                            </h2>
                            <form onSubmit={handleCreateNewBusiness} className="space-y-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Nama Tempat</label>
                                    <input type="text" required value={profileFormData.name} onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Kategori</label>
                                    <select value={profileFormData.category} onChange={(e) => setProfileFormData({ ...profileFormData, category: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800">
                                        <option value="Cafe">Cafe</option>
                                        <option value="Restoran">Restoran</option>
                                        <option value="Warung">Warung</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">URL Foto Utama</label>
                                    <input type="text" required value={profileFormData.image} onChange={(e) => setProfileFormData({ ...profileFormData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" placeholder="https://..." />
                                    {profileFormData.image && (
                                        <div className="mt-2 h-40 w-full rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={getProxiedImageUrl(profileFormData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Foto+Usaha')} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Link Video YouTube</label>
                                    <input type="text" value={profileFormData.videoUrl} onChange={(e) => setProfileFormData({ ...profileFormData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" placeholder="ID YouTube atau Link..." />
                                    <VideoPreview url={profileFormData.videoUrl} />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Deskripsi Lengkap</label>
                                    <textarea required value={profileFormData.description} onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800 min-h-[100px] resize-none" />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Alamat</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="text" required value={profileFormData.address} onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Latitude</label>
                                        <input type="number" step="any" required value={profileFormData.lat} onChange={(e) => setProfileFormData({ ...profileFormData, lat: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Longitude</label>
                                        <input type="number" step="any" required value={profileFormData.lng} onChange={(e) => setProfileFormData({ ...profileFormData, lng: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" />
                                    </div>
                                </div>

                                <MapPicker lat={profileFormData.lat} lng={profileFormData.lng} onChange={(lat, lng) => setProfileFormData({ ...profileFormData, lat, lng })} />

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">No. WhatsApp</label>
                                    <input type="text" required value={profileFormData.contact} onChange={(e) => setProfileFormData({ ...profileFormData, contact: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" placeholder="08xx-xxxx-xxxx" />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Fasilitas (pisahkan dengan koma)</label>
                                    <input type="text" value={(profileFormData.facilities || []).join(', ')} onChange={(e) => setProfileFormData({ ...profileFormData, facilities: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800" placeholder="WiFi, Parking, AC, Outdoor Seating" />
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <input type="checkbox" id="isHalal" checked={profileFormData.isHalal} onChange={(e) => setProfileFormData({ ...profileFormData, isHalal: e.target.checked })} className="h-6 w-6 text-orange-500 rounded-lg border-gray-300 focus:ring-orange-500 transition-all" />
                                    <label htmlFor="isHalal" className="text-sm font-bold text-gray-700 cursor-pointer">Tempat ini menyediakan makanan Halal</label>
                                </div>

                                <button type="submit" disabled={isSaving} className="w-full bg-orange-500 text-white py-5 rounded-[24px] font-black shadow-xl shadow-orange-500/20 mt-8">
                                    {isSaving ? 'Menyimpan...' : 'Daftar Sekarang'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-white pt-12 pb-4 px-4 flex flex-row items-center border-b border-gray-100 sticky top-0 z-10">
                    <button onClick={onBack} className="p-2">
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Pilih Usaha Kuliner</h1>
                </div>
                <div className="p-4 space-y-4">
                    {businesses.map((spot) => (
                        <button
                            key={spot.id}
                            onClick={() => setSelectedSpotId(spot.id)}
                            className="w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-row items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shrink-0">
                                <SafeImage src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-gray-800">{spot.name}</h3>
                                <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider mt-1 ${spot.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                    spot.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {spot.status}
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400" />
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            setProfileFormData({
                                name: '', category: 'Cafe', description: '', address: '', contact: '', image: '', videoUrl: '', priceRange: '',
                                lat: -0.947, lng: 100.417, facilities: [], isHalal: true
                            });
                            setIsCreatingNew(true);
                        }}
                        className="w-full bg-orange-500/10 p-4 rounded-3xl border border-dashed border-orange-500/50 flex flex-row items-center justify-center gap-2 hover:bg-orange-500/20 transition-all text-orange-500 font-bold"
                    >
                        <Plus size={20} />
                        Tambah Usaha Baru
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                {!isDesktop && (
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                )}
                <div className="flex-1">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Dashboard Kuliner</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kelola Tempat Makan</p>
                </div>
                <button onClick={() => setSelectedSpotId(null)} className="absolute right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase hidden sm:block">Ganti Usaha</span>
                        <Store size={18} className="text-gray-600" />
                    </div>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-row bg-white px-6 py-2 border-b border-gray-100 sticky top-[72px] z-10">
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'menu' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'}`}
                >
                    <Utensils size={18} />
                    <span className="ml-2 font-bold text-sm">Menu</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'profile' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'}`}
                >
                    <Store size={18} />
                    <span className="ml-2 font-bold text-sm">Profil Usaha</span>
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'orders' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400'}`}
                >
                    <ShoppingBag size={18} />
                    <span className="ml-2 font-bold text-sm">Pesanan</span>
                </button>
            </div>

            <div className="flex-1 p-4 pb-20">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="h-10 w-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-xs font-bold mt-4">Memuat data...</p>
                    </div>
                ) : activeTab === 'profile' ? (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex flex-row items-center gap-2">
                                <Utensils className="text-orange-500" size={24} />
                                Informasi Tempat
                            </h2>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Nama Tempat</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.name}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Kategori</label>
                                    <select
                                        value={profileFormData.category}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, category: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                    >
                                        <option value="Cafe">Cafe</option>
                                        <option value="Restoran">Restoran</option>
                                        <option value="Warung">Warung</option>
                                        <option value="Dessert">Dessert</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Range Harga (Otomatis)</label>
                                    <div className="w-full bg-gray-100 border border-gray-100 rounded-2xl py-4 px-6 font-bold text-gray-500">
                                        {(() => {
                                            if (!spot?.menu || spot.menu.length === 0) return 'Belum ada menu';
                                            const prices = spot.menu.map((m: any) => parseInt(m.price) || 0).filter((p: number) => p > 0);
                                            if (prices.length === 0) return 'Belum ada harga';
                                            const min = Math.min(...prices);
                                            const max = Math.max(...prices);
                                            return min === max
                                                ? `Rp ${min.toLocaleString('id-ID')}`
                                                : `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
                                        })()}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">URL Foto Utama</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.image}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, image: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        placeholder="https://..."
                                    />
                                    {profileFormData.image && (
                                        <div className="mt-2 h-40 w-full rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={getProxiedImageUrl(profileFormData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Foto+Usaha')} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Link Video YouTube</label>
                                    <input
                                        type="text"
                                        value={profileFormData.videoUrl}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, videoUrl: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        placeholder="ID YouTube atau Link..."
                                    />
                                    <VideoPreview url={profileFormData.videoUrl} />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Deskripsi Lengkap</label>
                                    <textarea
                                        required
                                        value={profileFormData.description}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800 min-h-[120px] resize-none"
                                        placeholder="Ceritakan tentang tempat kuliner ini..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Alamat</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={profileFormData.address}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={profileFormData.lat}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, lat: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={profileFormData.lng}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, lng: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        />
                                    </div>
                                </div>

                                <MapPicker lat={profileFormData.lat} lng={profileFormData.lng} onChange={(lat, lng) => setProfileFormData({ ...profileFormData, lat, lng })} />

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">No. WhatsApp</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.contact}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, contact: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">Fasilitas (pisahkan dengan koma)</label>
                                    <input
                                        type="text"
                                        value={(profileFormData.facilities || []).join(', ')}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, facilities: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-orange-500/5 transition-all text-gray-800"
                                        placeholder="WiFi, Parking, AC, Outdoor Seating"
                                    />
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <input
                                        type="checkbox"
                                        id="isHalal"
                                        checked={profileFormData.isHalal}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, isHalal: e.target.checked })}
                                        className="h-6 w-6 text-orange-500 rounded-lg border-gray-300 focus:ring-orange-500 transition-all"
                                    />
                                    <label htmlFor="isHalal" className="text-sm font-bold text-gray-700 cursor-pointer">Tempat ini menyediakan makanan Halal</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || isSaving}
                                    className="w-full bg-orange-500 text-white py-5 rounded-[24px] font-black shadow-xl shadow-orange-500/20 flex flex-row items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-8"
                                >
                                    {isSaving ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : activeTab === 'orders' ? (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <ShoppingBag size={64} className="text-gray-200" />
                                <p className="text-gray-400 mt-4 font-bold">Belum ada pesanan</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                                                <SafeImage src={order.user.avatar || 'https://via.placeholder.com/40'} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{order.user.name}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                            order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-600' :
                                                order.status === 'READY' ? 'bg-green-100 text-green-600' :
                                                    order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-red-100 text-red-600'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-start text-sm">
                                                <div className="flex-1">
                                                    <div className="flex gap-2">
                                                        <span className="font-bold text-orange-500">{item.quantity}x</span>
                                                        <span className="font-medium text-gray-700">{item.menu.name}</span>
                                                    </div>
                                                    {item.note && <p className="text-xs text-gray-400 italic mt-0.5">"{item.note}"</p>}
                                                </div>
                                                <span className="font-bold text-gray-800 ml-4">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                                            <span className="font-black text-xs text-gray-500 uppercase tracking-widest">Total Pesanan</span>
                                            <span className="font-black text-orange-500 text-lg">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                                        </div>
                                        {order.note && (
                                            <div className="bg-amber-50 p-2 rounded-xl text-xs text-amber-700 mt-2">
                                                <span className="font-bold">Catatan Pesanan:</span> {order.note}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {order.status === 'PENDING' && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                                className="py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, 'CONFIRMED')}
                                                className="py-3 rounded-xl bg-orange-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                                            >
                                                Terima Pesanan
                                            </button>
                                        </div>
                                    )}

                                    {order.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(order.id, 'READY')}
                                            className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            Pesanan Siap Disajikan
                                        </button>
                                    )}

                                    {order.status === 'READY' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                            className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                        >
                                            Selesaikan Pesanan
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ) : ( // This is now the 'menu' tab content
                    <div>
                        <button
                            onClick={() => handleOpenMenuModal()}
                            className="w-full bg-orange-500 p-4 rounded-2xl flex flex-row items-center justify-center mb-6 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
                        >
                            <Plus size={20} className="text-white" />
                            <span className="text-white font-bold ml-2">Tambah Menu Baru</span>
                        </button>

                        {!spot?.menu || spot.menu.length === 0 ? (
                            <div className="flex flex-col items-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <Utensils size={64} className="text-gray-200" />
                                <p className="text-gray-400 mt-4 font-bold">Belum ada menu</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {spot.menu.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-4 flex flex-row shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100">
                                            <SafeImage src={item.image || ''} alt={item.name} className="w-full h-full object-cover" fallbackSrc="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=100" />
                                        </div>
                                        <div className="flex-1 ml-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-gray-800 font-bold text-base truncate">{item.name}</h3>
                                                <p className="text-orange-600 font-black text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-400 text-[10px] font-bold mt-0.5 line-clamp-1">{item.description}</p>
                                            </div>
                                            <div className="flex flex-row gap-2 mt-2">
                                                <button
                                                    onClick={() => handleOpenMenuModal(item)}
                                                    className="px-4 py-2 bg-gray-50 rounded-xl flex flex-row items-center border border-gray-100 hover:bg-gray-100 transition-all"
                                                >
                                                    <Edit3 size={14} className="text-gray-500" />
                                                    <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1.5">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMenu(item.id)}
                                                    className="px-4 py-2 bg-red-50 rounded-xl flex flex-row items-center border border-red-50 hover:bg-red-100 transition-all"
                                                >
                                                    <Trash2 size={14} className="text-red-400" />
                                                    <span className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-1.5">Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Modal */}
            {isMenuModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 bg-orange-500 text-white flex flex-row justify-between items-center font-bold">
                            <h3 className="text-lg">{editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
                            <button onClick={() => setIsMenuModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveMenu} className="p-8 overflow-y-auto space-y-5">
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Nama Menu</p>
                                <input
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="Contoh: Rendang Daging"
                                    value={menuFormData.name}
                                    onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Harga (Rp)</p>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    value={menuFormData.price}
                                    onChange={(e) => setMenuFormData({ ...menuFormData, price: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">URL Gambar Menu</p>
                                <input
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    placeholder="https://..."
                                    value={menuFormData.image}
                                    onChange={(e) => setMenuFormData({ ...menuFormData, image: e.target.value })}
                                />
                                {menuFormData.image && (
                                    <img src={getProxiedImageUrl(menuFormData.image)} className="mt-2 w-full h-32 object-cover rounded-2xl border border-gray-100" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Logo+Menu')} />
                                )}
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Deskripsi Menu</p>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[100px] resize-none"
                                    placeholder="Detail menu (porsi, isi, dll)..."
                                    value={menuFormData.description}
                                    onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 mt-4 flex flex-row items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                <Save size={18} />
                                Simpan Menu
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
