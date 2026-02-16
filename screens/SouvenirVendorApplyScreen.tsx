import React, { useState } from 'react';
import { ChevronLeft, Store, MapPin, Phone, FileText, Camera, Send, CheckCircle2 } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';

interface SouvenirVendorApplyScreenProps {
    onBack: () => void;
}

export const SouvenirVendorApplyScreen: React.FC<SouvenirVendorApplyScreenProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        contact: '',
        image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=400' // Default placeholder
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.location || !formData.contact) {
            setError('Semua field wajib diisi');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await apiService.applyAsVendor(formData);
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
                <h1 className="flex-1 text-center text-lg font-bold text-gray-800 mr-8">Daftar Jadi Vendor</h1>
            </div>

            <div className="flex-1 p-4 pb-20">
                <div className="bg-padang-green/10 p-6 rounded-3xl mb-6 flex flex-row items-center">
                    <div className="w-12 h-12 bg-padang-green rounded-2xl flex items-center justify-center mr-4 shrink-0">
                        <Store color="white" size={24} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-padang-green font-bold text-lg">Buka Toko Oleh-oleh</h2>
                        <p className="text-padang-green/70 text-sm">Mulai tawarkan produk khas Anda ke wisatawan</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-2xl mb-4">
                        <p className="text-red-500 text-sm text-center font-bold">{error}</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-[32px] shadow-sm mb-10 space-y-5">
                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Nama Toko</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-padang-green/30 transition-all">
                            <Store size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Contoh: Rendang Gadih"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Deskripsi Toko</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-start px-4 border border-gray-100 focus-within:border-padang-green/30 transition-all">
                            <FileText size={20} className="text-gray-400 mr-3 mt-4" />
                            <textarea
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none min-h-[100px] resize-none"
                                placeholder="Ceritakan tentang toko Anda..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Alamat Lengkap</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-padang-green/30 transition-all">
                            <MapPin size={20} className="text-gray-400 mr-3" />
                            <input
                                className="flex-1 py-4 bg-transparent text-gray-800 font-bold outline-none"
                                placeholder="Alamat toko..."
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">No. WhatsApp</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-padang-green/30 transition-all">
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
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Foto Toko</p>
                        <div className="bg-gray-50 rounded-2xl flex flex-row items-center px-4 border border-gray-100 focus-within:border-padang-green/30 transition-all">
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
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Logo+Toko')}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full bg-padang-green p-5 rounded-2xl flex flex-row items-center justify-center shadow-lg shadow-padang-green/20 transition-all active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-padang-green/90'}`}
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
