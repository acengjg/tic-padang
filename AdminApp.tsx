
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    Users, MapPin, BarChart3, Settings,
    LogOut, Shield, Search, Plus, Trash2, Edit, X, Save, Map as MapIcon, Calendar, CheckCircle, XCircle
} from 'lucide-react';

const API_BASE_URL = '/api';

const MapPicker: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const leafletRef = React.useRef<any>(null);
    const markerRef = React.useRef<any>(null);

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
    const [activeTab, setActiveTab] = useState<'users' | 'destinations' | 'events' | 'promotions' | 'articles' | 'guides'>('users');
    const [items, setItems] = useState<any[]>([]);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
            fetchData();
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
            const res = await fetch(`${API_BASE_URL}/admin/${activeTab}`, {
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
            setFormData(item);
        } else {
            setEditingItem(null);
            if (activeTab === 'users') {
                setFormData({ name: '', email: '', password: '', role: 'USER', level: 1, points: 0 });
            } else if (activeTab === 'destinations') {
                setFormData({ name: '', category: 'Alam', rating: 4.5, location: '', image: '', image360: '', description: '', price: 'Gratis', lat: -0.947, lng: 100.417 });
            } else if (activeTab === 'events') {
                setFormData({ name: '', date: new Date().toISOString(), location: '', image: '', description: '', price: '' });
            } else if (activeTab === 'articles') {
                setFormData({ title: '', content: '', image: '', category: 'Wisata', author: 'Admin' });
            } else if (activeTab === 'guides') {
                setFormData({}); // Guides are manually verified, not typically created here
            } else {
                setFormData({ title: '', discount: '', image: '', videoUrl: '', provider: 'TIC-PADANG' });
            }
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingItem ? 'PUT' : 'POST';
        const url = editingItem ? `${API_BASE_URL}/admin/${activeTab}/${editingItem.id}` : `${API_BASE_URL}/admin/${activeTab}`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
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
            const res = await fetch(`${API_BASE_URL}/admin/${activeTab}/${id}`, {
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
                        { id: 'events', label: 'Event Kota', icon: Calendar },
                        { id: 'promotions', label: 'Promosi', icon: Settings },
                        { id: 'articles', label: 'Berita & Artikel', icon: BarChart3 },
                        { id: 'guides', label: 'Verifikasi Pemandu', icon: Shield },
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
                                    activeTab === 'events' ? 'Kelola Event' :
                                        activeTab === 'articles' ? 'Berita & Artikel' :
                                            activeTab === 'guides' ? 'Verifikasi Pemandu' : 'Kelola Promosi'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">TIC-PADANG Admin Control Center</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        disabled={activeTab === 'guides'}
                        className={`px-8 py-4 rounded-2xl flex items-center gap-2 font-bold shadow-xl transition-all ${activeTab === 'guides' ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-padang-green text-white shadow-padang-green/10 hover:scale-105 active:scale-95'}`}
                    >
                        <Plus size={20} /> Tambah {activeTab === 'users' ? 'User' : activeTab === 'destinations' ? 'Destinasi' : activeTab === 'events' ? 'Event' : activeTab === 'articles' ? 'Artikel' : 'Data'}
                    </button>
                </header>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {activeTab === 'users' ? 'Role / Level' :
                                        activeTab === 'destinations' ? 'Kategori / Lokasi' :
                                            activeTab === 'promotions' ? 'Diskon / Provider' :
                                                activeTab === 'guides' ? 'Status / Exp' :
                                                    activeTab === 'articles' ? 'Kategori / Author' : 'Lokasi / Harga'}
                                </th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                        Tidak ada data untuk {activeTab}
                                    </td>
                                </tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gray-100 overflow-hidden border border-gray-50">
                                                <img src={item.avatar || item.image || item.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${item.name || item.title || item.user?.name}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{item.name || item.title || item.user?.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {activeTab === 'users' ? item.email :
                                                        activeTab === 'guides' ? item.user?.email :
                                                            activeTab === 'promotions' ? item.provider :
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
                                                    activeTab === 'promotions' ? 'bg-orange-100 text-orange-600' :
                                                        activeTab === 'guides' ? (item.status === 'APPROVED' ? 'bg-padang-green/10 text-padang-green' : item.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600') :
                                                            activeTab === 'articles' ? 'bg-blue-100 text-blue-600' : 'bg-padang-green/10 text-padang-green'
                                                }`}>
                                                {activeTab === 'users' ? item.role :
                                                    activeTab === 'destinations' ? item.category :
                                                        activeTab === 'promotions' ? 'PROMO' :
                                                            activeTab === 'guides' ? item.status :
                                                                activeTab === 'articles' ? item.category : 'EVENT'}
                                            </span>
                                            <p className="text-[10px] text-gray-400 font-bold ml-1">
                                                {item.location || (activeTab === 'promotions' ? `${item.discount} • ${item.videoUrl ? 'With Video' : 'Image only'}` :
                                                    activeTab === 'guides' ? `${item.yearsExperience} Thn Exp • ${item.languages?.join(', ')}` :
                                                        activeTab === 'articles' ? `By ${item.author} • ${new Date(item.date).toLocaleDateString()}` :
                                                            typeof item.level === 'number' ? `Lvl ${item.level} • ${item.points} Pts` : '')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {activeTab === 'guides' && item.status === 'PENDING' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleVerifyGuide(item.id, 'APPROVED')}
                                                    className="p-2.5 bg-padang-green/10 text-padang-green hover:bg-padang-green hover:text-white rounded-xl transition-all"
                                                    title="Setujui"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyGuide(item.id, 'REJECTED')}
                                                    className="p-2.5 bg-red-50 text-chili-red hover:bg-chili-red hover:text-white rounded-xl transition-all"
                                                    title="Tolak"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-2.5 bg-gray-50 text-gray-400 hover:text-padang-green hover:bg-padang-green/5 rounded-xl transition-all"
                                                >
                                                    <Edit size={18} />
                                                </button>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in-95">
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

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
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
                                                <option value="Kuliner">Kuliner</option>
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
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Gambar 360° (Opsional)</label>
                                            <input type="text" value={formData.image360 || ''} onChange={(e) => setFormData({ ...formData, image360: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none" placeholder="https://..." />
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
                                                <option value="Kuliner">Kuliner</option>
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
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Konten Artikel</label>
                                            <textarea required value={formData.content || ''} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-padang-green/5 outline-none min-h-[200px]" placeholder="Tulis artikel lengkap di sini..." />
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
