import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, MapPin, Users, Send, Info, Tag } from 'lucide-react';
import { apiService } from '../client';
import { AppScreen, Destination } from '../types';

interface CreateBuddyPostScreenProps {
    onBack: () => void;
    onSuccess: () => void;
}

const CreateBuddyPostScreen: React.FC<CreateBuddyPostScreenProps> = ({ onBack, onSuccess }) => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        destinationId: '',
        startDate: '',
        endDate: '',
        maxBuddies: 2,
        budgetRange: 'Economy',
        requirements: ''
    });

    useEffect(() => {
        loadDestinations();
    }, []);

    const loadDestinations = async () => {
        try {
            const data = await apiService.getDestinations();
            setDestinations(data);
        } catch (error) {
            console.error("Failed to load destinations", error);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
            alert("Silakan isi semua data penting");
            return;
        }

        setLoading(true);
        try {
            await apiService.createBuddyPost(formData);
            onSuccess();
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Gagal membuat postingan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <header className="px-5 pt-12 pb-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black text-gray-800 tracking-tight">Cari Teman</h1>
                </div>
            </header>

            <main className="p-5 space-y-8 pb-32">
                {/* Title & Desc */}
                <section className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Judul Rencana</label>
                        <input
                            type="text"
                            placeholder="Misal: Jalan santai ke Pantai Air Manis"
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-padang-green/20 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Ceritakan Rencanamu</label>
                        <textarea
                            placeholder="Kapan berangkat, apa saja kegiatannya, dll..."
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none h-32 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </section>

                {/* Location & Budget */}
                <div className="grid grid-cols-1 gap-6">
                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Tujuan Destinasi</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green size-5" />
                            <select
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-padang-green/20 outline-none appearance-none"
                                value={formData.destinationId}
                                onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                            >
                                <option value="">Tujuan Fleksibel</option>
                                {destinations.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Estimasi Budget</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green size-5" />
                            <select
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-padang-green/20 outline-none appearance-none"
                                value={formData.budgetRange}
                                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                            >
                                <option value="Economy">Ekonomis (Hemat)</option>
                                <option value="Mid-Range">Menengah (Standar)</option>
                                <option value="Premium">Premium (Mewah)</option>
                            </select>
                        </div>
                    </section>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Mulai</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green size-4" />
                            <input
                                type="date"
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-10 pr-4 text-xs font-bold outline-none"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                    </section>
                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Selesai</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green size-4" />
                            <input
                                type="date"
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-10 pr-4 text-xs font-bold outline-none"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </section>
                </div>

                {/* Max Buddies */}
                <section className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Max. Teman Dicari</label>
                        <span className="text-sm font-black text-padang-green">{formData.maxBuddies} Orang</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        className="w-full accent-padang-green h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                        value={formData.maxBuddies}
                        onChange={(e) => setFormData({ ...formData, maxBuddies: parseInt(e.target.value) })}
                    />
                </section>

                {/* Requirements */}
                <section className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Kriteria (Opsional)</label>
                    <div className="relative">
                        <Info className="absolute left-4 top-4 text-padang-green size-5" />
                        <textarea
                            placeholder="Misal: Harus suka fotografi, hobi makan pedas..."
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none h-24 resize-none"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        ></textarea>
                    </div>
                </section>
            </main>

            {/* Footer Button */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-5 pb-10 z-20 max-w-md mx-auto">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all text-sm font-black uppercase tracking-widest ${loading ? 'bg-gray-200 text-white' : 'bg-padang-green text-white shadow-padang-green/30 active:scale-95'
                        }`}
                >
                    {loading ? 'Membuat Posting...' : (
                        <>Selesaikan & Posting <Send size={18} /></>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default CreateBuddyPostScreen;
