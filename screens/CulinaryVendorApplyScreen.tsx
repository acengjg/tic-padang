import React, { useState } from 'react';
import { ChevronLeft, Utensils, MapPin, Phone, FileText, Camera, Send, CheckCircle2, DollarSign, Map as MapIcon } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
        setTimeout(() => map.invalidateSize(), 1000);
        setTimeout(() => map.invalidateSize(), 2000);
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
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <MapIcon size={12} className="text-orange-500" /> Lokasi di Peta
            </label>
            <div ref={mapRef} className="h-80 w-full rounded-2xl border border-gray-100 overflow-hidden shadow-inner relative bg-gray-50 z-0" style={{ minHeight: '320px' }} />
            <p className="text-[9px] text-gray-400 font-bold italic ml-1">* Klik atau geser penanda untuk mengatur lokasi usaha.</p>
        </div>
    );
};

interface CulinaryVendorApplyScreenProps {
    onBack: () => void;
}

export const CulinaryVendorApplyScreen: React.FC<CulinaryVendorApplyScreenProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Restoran',
        description: '',
        address: '',
        contact: '',
        priceRange: 'Rp 20.000 - Rp 50.000',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400', // Default placeholder
        lat: -0.947, // Default Padang
        lng: 100.354
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.address || !formData.contact) {
            setError('Semua field wajib diisi');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await apiService.applyCulinaryVendor(formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Gagal mengirim pendaftaran');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 min-h-screen">
                <CheckCircle2 size={80} color="#10b981" />
                <h1 className="text-2xl font-bold text-gray-800 mt-6 text-center">Pendaftaran Terkirim!</h1>
                <p className="text-gray-500 mt-2 text-center">
                    Terima kasih telah mendaftar. Admin akan meninjau permohonan Anda dalam 1-2 hari kerja.
                </p>
                <button
                    onClick={onBack}
                    className="mt-10 bg-padang-green px-10 py-4 rounded-2xl text-white font-bold"
                >
                    Kembali ke Profil
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <div className="bg-white pt-12 pb-4 px-4 flex flex-row items-center border-b border-gray-100 sticky top-0 z-10 font-bold">
                <button onClick={onBack} className="p-2">
                    <ChevronLeft size={24} className="text-gray-600" />
                </button>
                <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Daftar Usaha Kuliner</h1>
            </div>

            <div className="flex-1 p-4 pb-20">
                <div className="bg-orange-500/10 p-6 rounded-3xl mb-6 flex flex-row items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mr-4 shrink-0">
                        <Utensils color="white" size={24} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-orange-600 font-bold text-lg">Mulai Usaha Kuliner</h2>
                        <p className="text-orange-600/70 text-sm">Tampilkan kelezatan masakan Anda ke pengunjung</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-2xl mb-4">
                        <p className="text-red-500 text-sm text-center font-bold">{error}</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-[32px] shadow-sm mb-10 space-y-5">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Nama Tempat / Warung</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <Utensils size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Contoh: Sate Padang Ajo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Kategori</p>
                        <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Restoran">Restoran</option>
                            <option value="Rumah Makan">Rumah Makan</option>
                            <option value="Warung">Warung</option>
                            <option value="Cafe">Cafe</option>
                            <option value="Kopi">Kopi</option>
                            <option value="Jajanan">Jajanan</option>
                        </select>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Deskripsi</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-start px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <FileText size={20} className="text-gray-400 mr-3 mt-4" />
                            <textarea
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none min-h-[100px] resize-none"
                                placeholder="Jelaskan menu andalan atau keunikan tempat Anda..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Alamat Lengkap</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <MapPin size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Alamat lengkap..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Latitude</p>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Longitude</p>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 font-bold outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    value={formData.lng}
                                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        <MapPicker
                            lat={formData.lat}
                            lng={formData.lng}
                            onChange={(lat, lng) => setFormData({ ...formData, lat, lng })}
                        />
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Kisaran Harga</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <DollarSign size={20} className="text-gray-400 mr-3" />
                            <select
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none appearance-none"
                                value={formData.priceRange}
                                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                            >
                                <option value="< Rp 20.000">&lt; Rp 20.000</option>
                                <option value="Rp 20.000 - Rp 50.000">Rp 20.000 - Rp 50.000</option>
                                <option value="Rp 50.000 - Rp 100.000">Rp 50.000 - Rp 100.000</option>
                                <option value="> Rp 100.000">&gt; Rp 100.000</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">No. WhatsApp</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <Phone size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Contoh: 62812..."
                                type="tel"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Foto Utama</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-orange-500/30 transition-all">
                            <Camera size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Link Instagram / Link Foto..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        {formData.image && (
                            <div className="mt-2 h-40 w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                                <img
                                    src={getProxiedImageUrl(formData.image)}
                                    className="w-full h-full object-cover"
                                    alt="Preview"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Foto+Usaha')}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full bg-orange-500 p-5 rounded-2xl flex flex-row items-center justify-center shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-600'}`}
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <div className="flex flex-row items-center justify-center gap-2">
                                <Send size={20} className="text-white" />
                                <span className="text-white font-black uppercase tracking-wider text-sm">Kirim Pendaftaran</span>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
