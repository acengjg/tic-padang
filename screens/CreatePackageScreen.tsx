import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Save, Plus, Trash2, MapPin, Clock, Users, Info, DollarSign, X, Loader2, Map as MapIcon } from 'lucide-react';
import { apiService } from '../client';
import { AppScreen } from '../types';

const MapPicker: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

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
    }, []);

    useEffect(() => {
        if (leafletRef.current && markerRef.current) {
            const currentPos = markerRef.current.getLatLng();
            if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
                markerRef.current.setLatLng([lat, lng]);
                leafletRef.current.panTo([lat, lng]);
            }
        }
    }, [lat, lng]);

    return (
        <div className="space-y-4">
            <div ref={mapRef} className="h-64 w-full rounded-[32px] border border-gray-100 overflow-hidden shadow-inner z-0 relative bg-gray-100" />
            <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</label>
                    <input type="number" step="any" value={lat} onChange={e => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) onChange(val, lng);
                    }}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 ring-padang-green/20" />
                </div>
                <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</label>
                    <input type="number" step="any" value={lng} onChange={e => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) onChange(lat, val);
                    }}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold focus:ring-2 ring-padang-green/20" />
                </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold ml-1 italic leading-relaxed">
                * Geser penanda atau klik di peta untuk mengatur koordinat titik kumpul.
            </p>
        </div>
    );
};

interface CreatePackageScreenProps {
    onBack: () => void;
    onSuccess: () => void;
    editingPackage?: any;
}

const CreatePackageScreen: React.FC<CreatePackageScreenProps> = ({ onBack, onSuccess, editingPackage }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(editingPackage || {
        title: '',
        category: 'Cultural',
        description: '',
        duration: 1,
        durationType: 'HOUR',
        maxParticipants: 5,
        basePrice: 100000,
        meetingPoint: '',
        meetingPointLat: -0.947,
        meetingPointLng: 100.417,
        itinerary: [{ time: '09:00', place: '', activity: '' }],
        inclusions: [''],
        exclusions: [''],
        requirements: { fitnessLevel: 'Sedang', minAge: '10' },
        photos: ['']
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.basePrice) {
            alert("Harap isi semua informasi wajib");
            return;
        }

        setLoading(true);
        try {
            if (editingPackage) {
                await apiService.updatePackage(editingPackage.id, formData);
            } else {
                await apiService.createPackage(formData);
            }
            onSuccess();
        } catch (error) {
            alert("Gagal menyimpan paket");
        } finally {
            setLoading(false);
        }
    };

    const addItem = (field: 'inclusions' | 'exclusions' | 'photos') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const addItinerary = () => {
        setFormData({ ...formData, itinerary: [...formData.itinerary, { time: '', place: '', activity: '' }] });
    };

    const updateItem = (field: 'inclusions' | 'exclusions' | 'photos', index: number, value: string) => {
        const newList = [...formData[field]];
        newList[index] = value;
        setFormData({ ...formData, [field]: newList });
    };

    const updateItinerary = (index: number, field: 'time' | 'place' | 'activity', value: string) => {
        const newList = [...formData.itinerary];
        newList[index] = { ...newList[index], [field]: value };
        setFormData({ ...formData, itinerary: newList });
    };

    const removeItem = (field: 'itinerary' | 'inclusions' | 'exclusions' | 'photos', index: number) => {
        const newList = formData[field].filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, [field]: newList });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-40 animate-in fade-in duration-500">
            <header className="bg-white/80 backdrop-blur-md px-5 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-padang-green transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">
                            {editingPackage ? 'Edit Paket' : 'Buat Paket Baru'}
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Lengkapi detail perjalanan Anda</p>
                    </div>
                </div>
            </header>

            <main className="p-5 space-y-6 max-w-md mx-auto">
                {/* Basic Info */}
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-1 bg-padang-green rounded-full" />
                        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Informasi Dasar</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Judul Paket</label>
                        <input
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 ring-padang-green/20 transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Contoh: City Tour Padang Bersejarah"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                            <select
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Cultural">Budaya</option>
                                <option value="Culinary">Kuliner</option>
                                <option value="Nature">Alam</option>
                                <option value="Adventure">Petualangan</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga Dasar (Rp)</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green" />
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 text-xs font-bold focus:ring-2 ring-padang-green/20"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Durasi</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="w-20 bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold text-center"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                />
                                <select
                                    className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold appearance-none"
                                    value={formData.durationType}
                                    onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                                >
                                    <option value="HOUR">Jam</option>
                                    <option value="DAY">Hari</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Peserta</label>
                            <div className="relative">
                                <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-10 text-xs font-bold text-center focus:ring-2 ring-padang-green/20"
                                    value={formData.maxParticipants}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                    placeholder="5"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Description & Meeting Point */}
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-1 bg-padang-green rounded-full" />
                        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Detail & Lokasi</h2>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-flex flex items-center gap-1">
                            <Info size={10} /> Deskripsi Tour
                        </label>
                        <textarea
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium h-32 focus:ring-2 ring-padang-green/20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Jelaskan secara rinci tentang daya tarik paket tour ini..."
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <Plus size={10} className="text-padang-green" /> Lokasi Pertemuan (Nama Tempat)
                            </label>
                            <input
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 ring-padang-green/20 transition-all"
                                value={formData.meetingPoint}
                                onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                placeholder="Contoh: Lobi Hotel Ibis Padang atau Bandara BIM"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <MapIcon size={10} className="text-padang-green" /> Titik Koordinat (Peta)
                            </label>
                            <MapPicker
                                lat={formData.meetingPointLat || -0.947}
                                lng={formData.meetingPointLng || 100.417}
                                onChange={(lat, lng) => setFormData({ ...formData, meetingPointLat: lat, meetingPointLng: lng })}
                            />
                        </div>
                    </div>
                </section>

                {/* Facilities */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fasilitas (Inclusions)</h3>
                        <button onClick={() => addItem('inclusions')} className="h-8 w-8 bg-padang-green/10 text-padang-green rounded-lg flex items-center justify-center transition-transform active:scale-90">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.inclusions.map((item: string, i: number) => (
                            <div key={i} className="flex gap-2 group animate-in slide-in-from-right duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                                <input
                                    className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 text-xs font-semibold shadow-sm focus:border-padang-green outline-none transition-all"
                                    value={item}
                                    onChange={(e) => updateItem('inclusions', i, e.target.value)}
                                    placeholder="Misal: Makan Siang, Transportasi..."
                                />
                                <button onClick={() => removeItem('inclusions', i)} className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Exclusions */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-red-400">Tidak Termasuk (Exclusions)</h3>
                        <button onClick={() => addItem('exclusions')} className="h-8 w-8 bg-red-50 text-red-400 rounded-lg flex items-center justify-center transition-transform active:scale-90">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.exclusions.map((item: string, i: number) => (
                            <div key={i} className="flex gap-2 group animate-in slide-in-from-right duration-300">
                                <input
                                    className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 text-xs font-semibold shadow-sm focus:border-red-200 outline-none transition-all"
                                    value={item}
                                    onChange={(e) => updateItem('exclusions', i, e.target.value)}
                                    placeholder="Misal: Tiket Pesawat, Pengeluaran Pribadi..."
                                />
                                <button onClick={() => removeItem('exclusions', i)} className="text-gray-300 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Detailed Itinerary */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rencana Perjalanan (Itinerary)</h3>
                        <button onClick={addItinerary} className="h-8 w-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transition-transform active:scale-90">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {formData.itinerary.map((item: any, i: number) => (
                            <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3 relative group animate-in zoom-in duration-300">
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-20 space-y-1">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Waktu</label>
                                            <input
                                                className="w-full bg-gray-50 border-none rounded-xl p-2 text-[10px] font-bold text-center"
                                                value={item.time}
                                                onChange={(e) => updateItinerary(i, 'time', e.target.value)}
                                                placeholder="09:00"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Tempat</label>
                                            <input
                                                className="w-full bg-gray-50 border-none rounded-xl p-2 text-[10px] font-bold"
                                                value={item.place}
                                                onChange={(e) => updateItinerary(i, 'place', e.target.value)}
                                                placeholder="Contoh: Pantai Air Manis"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Aktivitas</label>
                                        <input
                                            className="w-full bg-gray-50 border-none rounded-xl p-2 text-[10px] font-bold"
                                            value={item.activity}
                                            onChange={(e) => updateItinerary(i, 'activity', e.target.value)}
                                            placeholder="Misal: Melihat Batu Malin Kundang..."
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem('itinerary', i)}
                                    className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-md border border-gray-100 rounded-full flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requirements */}
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-1 bg-orange-400 rounded-full" />
                        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Persyaratan & Ketentuan</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kebugaran</label>
                            <select
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold appearance-none"
                                value={formData.requirements.fitnessLevel}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    requirements: { ...formData.requirements, fitnessLevel: e.target.value }
                                })}
                            >
                                <option value="Ringan">Ringan</option>
                                <option value="Sedang">Sedang</option>
                                <option value="Berat">Berat</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usia Min (Thn)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 ring-orange-100 transition-all"
                                value={formData.requirements.minAge}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    requirements: { ...formData.requirements, minAge: e.target.value }
                                })}
                                placeholder="5"
                            />
                        </div>
                    </div>
                </section>


                {/* Photos URLs */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foto URL Galeri</h3>
                        <button onClick={() => addItem('photos')} className="h-8 w-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.photos.map((item: string, i: number) => (
                            <div key={i} className="flex gap-2 group">
                                <div className="relative flex-1">
                                    <input
                                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-xs font-medium shadow-sm focus:border-blue-200 outline-none transition-all"
                                        value={item}
                                        onChange={(e) => updateItem('photos', i, e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                    {item && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm animate-in zoom-in duration-300">
                                            <img src={item} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')} />
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => removeItem('photos', i)} className="text-gray-300 hover:text-red-400 transition-colors px-1">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer Actions */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-5 pb-10 z-30 max-w-lg mx-auto rounded-t-[40px] shadow-2xl animate-in slide-in-from-bottom duration-500">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-padang-green text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-padang-green/20 transition-all text-sm font-black uppercase tracking-widest disabled:bg-gray-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} /> Menyimpan...
                        </span>
                    ) : (
                        <>{editingPackage ? 'Simpan Perubahan' : 'Publish Paket Tour'} <Save size={18} /></>
                    )}
                </button>
            </footer>
        </div>
    );
};


export default CreatePackageScreen;
