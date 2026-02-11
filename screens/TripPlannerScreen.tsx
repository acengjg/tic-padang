
import React, { useState } from 'react';
import { Leaf, Utensils, Theater, ShoppingBag, Landmark, Loader2, Calendar, DollarSign, Map, Check, X, Printer, Camera, Save } from 'lucide-react';
import { apiService } from '../client';
import { Destination } from '../types';

interface TripPlannerScreenProps {
    onBack?: () => void;
}

const TripPlannerScreen: React.FC<TripPlannerScreenProps> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [duration, setDuration] = useState(3);
    const [budget, setBudget] = useState(1000000);
    const [interests, setInterests] = useState<string[]>([]);

    const CATEGORIES = [
        { id: 'Alam', label: 'Alam', icon: Leaf },
        { id: 'Kuliner', label: 'Kuliner', icon: Utensils },
        { id: 'Budaya', label: 'Budaya', icon: Theater },
        { id: 'Belanja', label: 'Belanja', icon: ShoppingBag },
        { id: 'Religi', label: 'Religi', icon: Landmark },
        { id: 'Foto', label: 'Spot Foto', icon: Camera },
    ];

    const handleToggleInterest = (id: string) => {
        if (interests.includes(id)) {
            setInterests(interests.filter(i => i !== id));
        } else {
            setInterests([...interests, id]);
        }
    };

    const handleGenerate = async () => {
        if (interests.length === 0) {
            alert('Pilih setidaknya satu minat!');
            return;
        }

        setLoading(true);
        try {
            const data = await apiService.generateItinerary({
                duration,
                budget,
                interests
            });
            setResult(data);
            setStep(2);
        } catch (err) {
            alert('Gagal membuat itinerary. Coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };



    const handleSave = async () => {
        const title = prompt("Beri nama untuk rencana perjalanan ini:", "Liburan Seru di Padang");
        if (!title) return;

        setSaving(true);
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + 1); // Start tomorrow

            const savePromises = result.itinerary.map((dayPlan: any, index: number) => {
                const planDate = new Date(startDate);
                planDate.setDate(startDate.getDate() + index);

                return apiService.createPlan({
                    title: `${title} - Hari ${dayPlan.day}`,
                    date: planDate.toISOString().split('T')[0], // YYYY-MM-DD
                    items: dayPlan.items.map((item: any) => ({
                        time: item.time,
                        place: item.destination.name,
                        activity: item.activity
                    }))
                });
            });

            await Promise.all(savePromises);
            alert("Rencana perjalanan berhasil disimpan! Cek menu 'Planner'.");
            if (onBack) onBack();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan rencana perjalanan.");
        } finally {
            setSaving(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (step === 1) {
        return (
            <div className="p-6 pb-32">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">AI Trip Planner</h1>
                    <p className="text-gray-500 mt-2">Asisten cerdas untuk merencanakan liburan impian Anda di Padang.</p>
                </header>

                <section className="space-y-8">
                    {/* Duration */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Calendar size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800">Berapa lama liburan Anda?</h3>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2">
                            <button
                                onClick={() => setDuration(Math.max(1, duration - 1))}
                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:scale-105 transition-all text-gray-600 font-bold"
                            >-</button>
                            <span className="font-black text-2xl text-gray-800">{duration} Hari</span>
                            <button
                                onClick={() => setDuration(Math.min(14, duration + 1))}
                                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:scale-105 transition-all text-gray-600 font-bold"
                            >+</button>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <DollarSign size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800">Estimasi Budget (Per Orang)</h3>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="5000000"
                            step="100000"
                            value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            className="w-full accent-padang-green h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
                        />
                        <div className="text-center bg-green-50 text-green-700 py-3 rounded-xl font-bold border border-green-100">
                            Rp {budget.toLocaleString('id-ID')}
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <Map size={20} />
                            </div>
                            <h3 className="font-bold text-gray-800">Minat & Preferensi</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleToggleInterest(cat.id)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${interests.includes(cat.id)
                                        ? 'border-padang-green bg-padang-green/5 text-padang-green shadow-md shadow-padang-green/10'
                                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    <cat.icon size={20} className={interests.includes(cat.id) ? 'fill-current' : ''} />
                                    <span className="font-bold text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Menganalisis Rute...
                            </>
                        ) : (
                            'Buat Rencana Perjalanan'
                        )}
                    </button>
                </section>
            </div>
        );
    }

    // Result Section
    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="bg-white px-6 pt-12 pb-8 rounded-b-[40px] shadow-sm mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Itinerary Anda</h2>
                        <p className="text-gray-500 text-sm mt-1">{duration} Hari • {interests.join(', ')}</p>
                    </div>
                    <button onClick={() => setStep(1)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Estimasi Biaya</p>
                        <p className="text-xl font-black text-blue-600">Rp {result.totalCost.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Budget Anda</p>
                        <p className="text-sm font-bold text-gray-500">Rp {budget.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 space-y-8">
                {result.itinerary.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold italic">
                        Maaf, tidak ditemukan rute yang cocok. Coba ubah filter.
                    </div>
                ) : (
                    result.itinerary.map((dayPlan: any) => (
                        <div key={dayPlan.day} className="relative pl-4 border-l-2 border-dashed border-gray-300 ml-3">
                            <div className="absolute -left-[21px] top-0 bg-padang-green text-white h-10 w-10 rounded-xl flex items-center justify-center border-4 border-gray-50 shadow-md font-bold text-sm">
                                H{dayPlan.day}
                            </div>

                            <div className="mb-8 pt-1">
                                <h3 className="font-bold text-gray-800 ml-4 mb-4">Jadwal Hari Ke-{dayPlan.day}</h3>
                                <div className="space-y-4">
                                    {dayPlan.items.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4 hover:scale-[1.02] transition-transform">
                                            <div className="h-20 w-20 bg-gray-200 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={item.destination.image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full">{item.time}</span>
                                                    <span className="text-xs font-bold text-padang-green">
                                                        {item.cost === 0 ? 'Gratis' : `Rp ${item.cost.toLocaleString()}`}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 truncate">{item.destination.name}</h4>
                                                <p className="text-xs text-gray-500 truncate mt-1">{item.destination.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-center pointer-events-none z-10 gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="pointer-events-auto bg-padang-green text-white px-6 py-3 rounded-full font-bold shadow-xl shadow-padang-green/30 border border-white/20 flex items-center gap-2 hover:bg-green-600 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan Rencana
                </button>
                <button
                    onClick={handlePrint}
                    className="pointer-events-auto bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-all transform hover:-translate-y-1"
                >
                    <Printer size={18} />
                    PDF
                </button>
            </div>
        </div>
    );
};

export default TripPlannerScreen;
