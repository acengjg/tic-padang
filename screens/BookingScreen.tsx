import React, { useState } from 'react';
import { ChevronLeft, Calendar as CalendarIcon, Users, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiService } from '../client';
import { TourPackage, AppScreen } from '../types';

interface BookingScreenProps {
    pkg: TourPackage;
    onBack: () => void;
    onSuccess: (bookingId: string) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ pkg, onBack, onSuccess }) => {
    const [participants, setParticipants] = useState(1);
    const [tourDate, setTourDate] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const totalPrice = pkg.basePrice * participants;

    const handleBooking = async () => {
        if (!tourDate) {
            alert("Silakan pilih tanggal tour");
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                packageId: pkg.id,
                tourDate,
                participants,
                specialRequests
            };
            const result = await apiService.createBooking(bookingData);
            setIsSuccess(true);
            setTimeout(() => onSuccess(result.id), 2000);
        } catch (error) {
            console.error("Booking failed", error);
            alert("Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 bg-green-100 rounded-[40px] flex items-center justify-center text-green-600 mb-6 shadow-lg shadow-green-100">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Pesanan Berhasil!</h2>
                <p className="text-sm text-gray-400 font-bold mb-8">Pemandu Anda akan segera mengonfirmasi pesanan ini.</p>
                <div className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Paket</span>
                        <span className="text-xs font-black text-gray-800">{pkg.title}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal</span>
                        <span className="text-xs font-black text-gray-800">{new Date(tourDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Bayar</span>
                        <span className="text-xs font-black text-padang-green">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32 animate-in slide-in-from-right duration-400">
            {/* Header */}
            <header className="bg-white px-5 pt-12 pb-6 border-b border-gray-100 flex items-center gap-4">
                <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-black text-gray-800">Detail Pesanan</h1>
            </header>

            <main className="p-5 space-y-6">
                {/* Package Summary */}
                <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex gap-4">
                    <img
                        src={pkg.photos[0] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"}
                        className="h-20 w-20 rounded-2xl object-cover"
                        alt=""
                    />
                    <div>
                        <span className="text-[10px] font-black text-padang-green uppercase tracking-widest mb-1 block">{pkg.category}</span>
                        <h3 className="text-sm font-black text-gray-800 leading-tight mb-2">{pkg.title}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400">
                            <CalendarIcon size={12} className="text-padang-green" />
                            <span className="text-[10px] font-bold">Instan Konfirmasi</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Pilih Tanggal</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-padang-green size-5" />
                            <input
                                type="date"
                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-padang-green/20 outline-none appearance-none"
                                value={tourDate}
                                onChange={(e) => setTourDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </section>

                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Jumlah Peserta</label>
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-800">Peserta</p>
                                    <p className="text-[10px] font-bold text-gray-400">Maks. {pkg.maxParticipants} orang</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                    className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 font-black hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="text-sm font-black text-gray-800 w-4 text-center">{participants}</span>
                                <button
                                    onClick={() => setParticipants(Math.min(pkg.maxParticipants, participants + 1))}
                                    className="h-8 w-8 rounded-lg bg-padang-green/10 flex items-center justify-center text-padang-green font-black hover:bg-padang-green/20"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Permintaan Khusus (Opsional)</label>
                        <textarea
                            placeholder="Misal: alergi makanan, butuh jemputan, dll."
                            className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm font-medium shadow-sm focus:ring-2 focus:ring-padang-green/20 outline-none h-32 resize-none"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                        ></textarea>
                    </section>
                </div>

                {/* Payment Summary */}
                <section className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard size={14} className="text-padang-green" /> Ringkasan Pembayaran
                    </h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>{participants} x Tiket Paket</span>
                            <span>Rp {(pkg.basePrice * participants).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                            <span>Biaya Layanan</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="h-[1px] bg-gray-50 my-2"></div>
                        <div className="flex justify-between">
                            <span className="text-sm font-black text-gray-800">Total Harga</span>
                            <span className="text-sm font-black text-padang-green">Rp {totalPrice.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Fixed Bottom Button */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-5 pt-4 pb-12 z-40 max-w-md mx-auto">
                <button
                    onClick={handleBooking}
                    disabled={loading || !tourDate}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all text-sm font-black uppercase tracking-widest ${loading || !tourDate ? 'bg-gray-200 text-white shadow-none' : 'bg-padang-green text-white shadow-padang-green/30 active:scale-95'
                        }`}
                >
                    {loading ? 'Memproses...' : (
                        <>Konfirmasi Pesanan <ArrowRight size={18} /></>
                    )}
                </button>
            </footer>
        </div>
    );
};

export default BookingScreen;
