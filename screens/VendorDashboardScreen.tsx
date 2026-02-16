import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, ShoppingBag, Plus, Trash2, Edit3, CheckCircle, Package2, Clock, Truck, XCircle, Store, Save, X, MapPin, ChevronRight } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import { SouvenirProduct, SouvenirOrder } from '../types';
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

interface VendorDashboardScreenProps {
    onBack: () => void;
}

export const VendorDashboardScreen: React.FC<VendorDashboardScreenProps> = ({ onBack }) => {
    const isDesktop = window.location.pathname.includes('vendor.html');
    // Business Selection State
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    const [loadingBusinesses, setLoadingBusinesses] = useState(true);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    // Dashboard State
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
    const [products, setProducts] = useState<SouvenirProduct[]>([]);
    const [orders, setOrders] = useState<SouvenirOrder[]>([]);
    const [vendorProfile, setVendorProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [profileFormData, setProfileFormData] = useState({
        name: '',
        description: '',
        location: '',
        contact: '',
        image: '',
        videoUrl: '',
        lat: -0.947,
        lng: 100.417
    });

    // Product Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SouvenirProduct | null>(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: 'Makanan',
        images: ['']
    });

    // Initial Fetch: Get User Businesses
    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoadingBusinesses(true);
        try {
            const data = await apiService.getUserBusinesses();
            // We are interested in souvenirVendors
            const vendors = data.souvenirVendors || [];
            setBusinesses(vendors);

            if (vendors.length === 0) {
                // No business, prompt to create
                setIsCreatingNew(true);
            } else if (vendors.length === 1) {
                // Auto select if only one
                setSelectedVendorId(vendors[0].id);
            }
            // If > 1, stay on selection screen (selectedVendorId null)
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBusinesses(false);
        }
    };

    // Fetch Dashboard Data when selectedVendorId changes or activeTab changes
    useEffect(() => {
        if (selectedVendorId) {
            fetchDashboardData();
        }
    }, [selectedVendorId, activeTab]);

    const fetchDashboardData = async () => {
        if (!selectedVendorId) return;
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const data = await apiService.getVendorProducts(selectedVendorId);
                setProducts(data);
            } else if (activeTab === 'orders') {
                const data = await apiService.getVendorOrders(selectedVendorId);
                setOrders(data);
            } else if (activeTab === 'profile') {
                const data = await apiService.getVendorProfile(selectedVendorId);
                setVendorProfile(data);
                setProfileFormData({
                    name: data.name || '',
                    description: data.description || '',
                    location: data.location || '',
                    contact: data.contact || '',
                    image: data.image || '',
                    videoUrl: data.videoUrl || '',
                    lat: data.lat || -0.947,
                    lng: data.lng || 100.417
                });
            }
        } catch (err) {
            console.error('Fetch Vendor Data Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewBusiness = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            // Apply as new vendor
            await apiService.applyAsVendor({
                ...profileFormData,
                // userId will be added by backend
            });
            alert('Pendaftaran toko berhasil diajukan! Menunggu verifikasi admin.');
            setIsCreatingNew(false);
            fetchBusinesses(); // Refresh list
        } catch (err: any) {
            alert(err.message || 'Gagal mendaftar');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVendorId) return;
        setIsSavingProfile(true);
        try {
            await apiService.updateVendorProfile({
                ...profileFormData,
                id: selectedVendorId
            });
            fetchDashboardData();
            alert('Profil toko berhasil diperbarui');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Gagal memperbarui profil');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            await apiService.updateVendorOrderStatus(orderId, status);
            fetchDashboardData();
            alert('Status pesanan diperbarui');
        } catch (err) {
            alert('Gagal memperbarui status');
        }
    };

    const handleOpenProductModal = (product: SouvenirProduct | null = null) => {
        if (product) {
            setEditingProduct(product);
            setProductFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category,
                images: product.images.length > 0 ? product.images : ['']
            });
        } else {
            setEditingProduct(null);
            setProductFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: 'Makanan',
                images: ['']
            });
        }
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVendorId) return;

        try {
            if (editingProduct) {
                await apiService.updateVendorProduct(editingProduct.id, productFormData);
            } else {
                await apiService.createVendorProduct({
                    ...productFormData,
                    vendorId: selectedVendorId
                });
            }
            setIsProductModalOpen(false);
            fetchDashboardData();
            alert('Produk berhasil disimpan');
        } catch (err) {
            alert('Gagal menyimpan produk');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
        try {
            await apiService.deleteVendorProduct(id);
            fetchDashboardData();
            alert('Produk berhasil dihapus');
        } catch (err) {
            alert('Gagal menghapus produk');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-amber-500 bg-amber-50';
            case 'PROCESSING': return 'text-blue-500 bg-blue-50';
            case 'COMPLETED': return 'text-green-500 bg-green-50';
            case 'CANCELLED': return 'text-red-500 bg-red-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    // --- RENDER LOGIC ---

    // 1. Loading Businesses
    if (loadingBusinesses) {
        return (
            <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="h-10 w-10 border-4 border-padang-green/30 border-t-padang-green rounded-full animate-spin"></div>
            </div>
        );
    }

    // 2. Select Business UI (if multiple or explicitly going back to list, or none and creating)
    if (!selectedVendorId || isCreatingNew) {
        if (isCreatingNew) {
            // Render Registration Form
            return (
                <div className="bg-gray-50 min-h-screen pb-20">
                    <div className="bg-white pt-12 pb-4 px-4 flex flex-row items-center border-b border-gray-100 sticky top-0 z-10">
                        <button onClick={() => {
                            if (businesses.length > 0) setIsCreatingNew(false);
                            else onBack();
                        }} className="p-2">
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Daftar Toko Baru</h1>
                    </div>
                    <div className="p-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex flex-row items-center gap-2">
                                <Store className="text-padang-green" size={24} />
                                Informasi Usaha
                            </h2>
                            <form onSubmit={handleCreateNewBusiness} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Nama Toko</label>
                                    <input type="text" required value={profileFormData.name} onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Nama usaha Anda" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Lokasi Toko</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input type="text" required value={profileFormData.location} onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Alamat lengkap" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Kontak WhatsApp</label>
                                    <input type="text" required value={profileFormData.contact} onChange={(e) => setProfileFormData({ ...profileFormData, contact: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="Contoh: 628XXXXXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">URL Foto Toko</label>
                                    <input type="text" required value={profileFormData.image} onChange={(e) => setProfileFormData({ ...profileFormData, image: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
                                    {profileFormData.image && (
                                        <div className="mt-2 h-40 w-full rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={getProxiedImageUrl(profileFormData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Logo+Toko')} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Video YouTube (Opsional)</label>
                                    <input type="text" value={profileFormData.videoUrl} onChange={(e) => setProfileFormData({ ...profileFormData, videoUrl: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="URL Video YouTube..." />
                                    <VideoPreview url={profileFormData.videoUrl} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 block px-1">Latitude</label>
                                        <input type="number" step="any" required value={profileFormData.lat} onChange={(e) => setProfileFormData({ ...profileFormData, lat: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 block px-1">Longitude</label>
                                        <input type="number" step="any" required value={profileFormData.lng} onChange={(e) => setProfileFormData({ ...profileFormData, lng: parseFloat(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none" />
                                    </div>
                                </div>
                                <MapPicker lat={profileFormData.lat} lng={profileFormData.lng} onChange={(lat, lng) => setProfileFormData({ ...profileFormData, lat, lng })} />
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Deskripsi</label>
                                    <textarea required value={profileFormData.description} onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[100px]" placeholder="Deskripsi usaha..." />
                                </div>
                                <button type="submit" disabled={isSavingProfile} className="w-full bg-padang-green text-white py-4 rounded-2xl font-black shadow-lg shadow-padang-green/20">
                                    {isSavingProfile ? 'Menyimpan...' : 'Daftar Sekarang'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }

        // Render List of Businesses
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="bg-white pt-12 pb-4 px-4 flex flex-row items-center border-b border-gray-100 sticky top-0 z-10">
                    <button onClick={() => {
                        if (businesses.length > 1) setSelectedVendorId(null);
                        else onBack();
                    }} className="p-2">
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Pilih Toko Anda</h1>
                </div>
                <div className="p-4 space-y-4">
                    {businesses.map((vendor) => (
                        <button
                            key={vendor.id}
                            onClick={() => setSelectedVendorId(vendor.id)}
                            className="w-full bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-row items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden shrink-0">
                                <SafeImage src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-gray-800">{vendor.name}</h3>
                                <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider mt-1 ${vendor.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                    vendor.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                        'bg-red-100 text-red-600'
                                    }`}>
                                    {vendor.status}
                                </div>
                            </div>
                            <ChevronRight className="text-gray-400" />
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            setProfileFormData({
                                name: '', description: '', location: '', contact: '', image: '', videoUrl: '',
                                lat: -0.947, lng: 100.417
                            });
                            setIsCreatingNew(true);
                        }}
                        className="w-full bg-padang-green/10 p-4 rounded-3xl border border-dashed border-padang-green/50 flex flex-row items-center justify-center gap-2 hover:bg-padang-green/20 transition-all text-padang-green font-bold"
                    >
                        <Plus size={20} />
                        Tambah Toko Baru
                    </button>
                </div>
            </div>
        );
    }

    // 3. Render Dashboard (selectedVendorId is active)
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
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Dashboard Vendor</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kelola Toko Oleh-oleh</p>
                </div>
                <button onClick={() => setSelectedVendorId(null)} className="absolute right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase hidden sm:block">Ganti Toko</span>
                        <Store size={18} className="text-gray-600" />
                    </div>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-row bg-white px-6 py-2 border-b border-gray-100 sticky top-[72px] z-10">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'products' ? 'border-padang-green text-padang-green' : 'border-transparent text-gray-400'}`}
                >
                    <Package size={18} />
                    <span className="ml-2 font-bold text-sm">Produk</span>
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'orders' ? 'border-padang-green text-padang-green' : 'border-transparent text-gray-400'}`}
                >
                    <ShoppingBag size={18} />
                    <span className="ml-2 font-bold text-sm">Pesanan</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-3 flex flex-row items-center justify-center border-b-2 transition-all ${activeTab === 'profile' ? 'border-padang-green text-padang-green' : 'border-transparent text-gray-400'}`}
                >
                    <Store size={18} />
                    <span className="ml-2 font-bold text-sm">Profil Toko</span>
                </button>
            </div>

            <div className="flex-1 p-4 pb-20">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="h-10 w-10 border-4 border-padang-green/30 border-t-padang-green rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-xs font-bold mt-4">Memuat data...</p>
                    </div>
                ) : activeTab === 'profile' ? (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex flex-row items-center gap-2">
                                <Store className="text-padang-green" size={24} />
                                Informasi Usaha
                            </h2>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Nama Toko</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.name}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        placeholder="Nama usaha Anda"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Lokasi Toko</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            value={profileFormData.location}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                            placeholder="Alamat lengkap toko"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Kontak WhatsApp</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.contact}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, contact: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        placeholder="Contoh: 628XXXXXXXXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">URL Foto Toko</label>
                                    <input
                                        type="text"
                                        required
                                        value={profileFormData.image}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, image: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        placeholder="https://..."
                                    />
                                    {profileFormData.image && (
                                        <div className="mt-2 h-40 w-full rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={getProxiedImageUrl(profileFormData.image)} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Logo+Toko')} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Video YouTube (Opsional)</label>
                                    <input
                                        type="text"
                                        value={profileFormData.videoUrl}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, videoUrl: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        placeholder="URL Video YouTube..."
                                    />
                                    <VideoPreview url={profileFormData.videoUrl} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 block px-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={profileFormData.lat}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, lat: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600 block px-1">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={profileFormData.lng}
                                            onChange={(e) => setProfileFormData({ ...profileFormData, lng: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none"
                                        />
                                    </div>
                                </div>

                                <MapPicker lat={profileFormData.lat} lng={profileFormData.lng} onChange={(lat, lng) => setProfileFormData({ ...profileFormData, lat, lng })} />

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600 block px-1">Deskripsi Usaha</label>
                                    <textarea
                                        required
                                        value={profileFormData.description}
                                        onChange={(e) => setProfileFormData({ ...profileFormData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[120px]"
                                        placeholder="Jelaskan mengenai usaha oleh-oleh Anda..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || isSavingProfile}
                                    className="w-full bg-padang-green text-white py-4 rounded-2xl font-black shadow-lg shadow-padang-green/20 flex flex-row items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isSavingProfile ? (
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
                ) : activeTab === 'products' ? (
                    <div>
                        <button
                            onClick={() => handleOpenProductModal()}
                            className="w-full bg-padang-green p-4 rounded-2xl flex flex-row items-center justify-center mb-6 shadow-lg shadow-padang-green/20 hover:bg-padang-green/90 transition-all active:scale-[0.98]"
                        >
                            <Plus size={20} className="text-white" />
                            <span className="text-white font-bold ml-2">Tambah Produk Baru</span>
                        </button>

                        {products.length === 0 ? (
                            <div className="flex flex-col items-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <Package2 size={64} className="text-gray-200" />
                                <p className="text-gray-400 mt-4 font-bold">Belum ada produk</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {products.map((item) => (
                                    <div key={item.id} className="bg-white rounded-3xl p-4 flex flex-row shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden border border-gray-50">
                                            <SafeImage src={item.images[0]} alt={item.name} className="w-full h-full object-cover" fallbackSrc="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=100" />
                                        </div>
                                        <div className="flex-1 ml-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-gray-800 font-bold text-base truncate">{item.name}</h3>
                                                <p className="text-padang-green font-black text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Stok: {item.stock} • {item.category}</p>
                                            </div>
                                            <div className="flex flex-row gap-2 mt-2">
                                                <button
                                                    onClick={() => handleOpenProductModal(item)}
                                                    className="px-4 py-2 bg-gray-50 rounded-xl flex flex-row items-center border border-gray-100 hover:bg-gray-100 transition-all"
                                                >
                                                    <Edit3 size={14} className="text-gray-500" />
                                                    <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1.5">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(item.id)}
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
                ) : (
                    <div className="space-y-5">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                                <ShoppingBag size={64} className="text-gray-200" />
                                <p className="text-gray-400 mt-4 font-bold">Belum ada pesanan</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
                                    <div className="flex flex-row justify-between items-center mb-4 pb-4 border-b border-gray-50">
                                        <div>
                                            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">ID Pesanan</p>
                                            <p className="text-gray-800 font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className={`px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                                            <p className="text-[9px] font-black uppercase tracking-widest">{order.status}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4 bg-gray-50 p-4 rounded-2xl">
                                        <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Pelanggan</p>
                                        <p className="text-gray-800 font-bold text-sm">{order.user?.name}</p>
                                        <p className="text-gray-500 text-[11px] font-bold mt-0.5">{order.user?.phone || 'No phone'}</p>
                                        <div className="flex flex-row items-start gap-2 mt-2">
                                            <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                            <p className="text-gray-500 text-[10px] font-medium leading-relaxed">{order.shippingAddress}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex flex-row items-center border-b border-gray-50/50 pb-2 last:border-0 last:pb-0">
                                                <div className="w-8 h-8 rounded-lg bg-padang-green/10 flex items-center justify-center mr-3 shrink-0">
                                                    <span className="text-padang-green font-black text-[10px]">{item.quantity}x</span>
                                                </div>
                                                <p className="text-gray-700 text-xs flex-1 font-bold">{item.product?.name}</p>
                                                <p className="text-gray-800 font-black text-xs">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-row justify-between items-center mt-4 pt-4 border-t-2 border-dashed border-gray-100">
                                        <p className="text-gray-800 font-black text-base">Total Transaksi</p>
                                        <p className="text-padang-green font-black text-base">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    {order.status === 'PENDING' && (
                                        <div className="flex flex-row gap-3 mt-6">
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                                                className="flex-1 bg-padang-green p-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-padang-green/10 hover:bg-padang-green/90 transition-all active:scale-[0.98]"
                                            >
                                                Terima Pesanan
                                            </button>
                                            <button
                                                onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                                className="flex-1 bg-red-50 p-4 rounded-2xl text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-[0.98]"
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    )}
                                    {order.status === 'PROCESSING' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                            className="w-full mt-6 bg-blue-500 p-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]"
                                        >
                                            Selesaikan Pesanan & Kirim
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 bg-padang-green text-white flex flex-row justify-between items-center text-bold">
                            <h3 className="text-lg font-bold">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-8 overflow-y-auto space-y-5">
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Nama Produk</p>
                                <input
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all"
                                    placeholder="Contoh: Kripik Sanjai"
                                    value={productFormData.name}
                                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Harga (Rp)</p>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all"
                                        value={productFormData.price}
                                        onChange={(e) => setProductFormData({ ...productFormData, price: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Stok</p>
                                    <input
                                        required
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all"
                                        value={productFormData.stock}
                                        onChange={(e) => setProductFormData({ ...productFormData, stock: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Kategori</p>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all appearance-none"
                                    value={productFormData.category}
                                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                                >
                                    <option value="Makanan">Makanan</option>
                                    <option value="Pakaian">Pakaian</option>
                                    <option value="Kerajinan">Kerajinan</option>
                                    <option value="Aksesori">Aksesori</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">URL Gambar Produk</p>
                                <input
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all"
                                    placeholder="https://..."
                                    value={productFormData.images[0]}
                                    onChange={(e) => setProductFormData({ ...productFormData, images: [e.target.value] })}
                                />
                                {productFormData.images[0] && (
                                    <img src={getProxiedImageUrl(productFormData.images[0])} className="mt-2 w-full h-32 object-cover rounded-2xl border border-gray-100" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Logo+Toko')} />
                                )}
                            </div>
                            <div>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1.5 ml-1">Deskripsi Produk</p>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-padang-green/20 transition-all min-h-[100px] resize-none"
                                    placeholder="Detail produk..."
                                    value={productFormData.description}
                                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-padang-green text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-padang-green/20 mt-4 flex flex-row items-center justify-center gap-2">
                                <Save size={18} />
                                Simpan Produk
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
