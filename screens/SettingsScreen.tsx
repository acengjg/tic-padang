
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, User, Mail, Lock, Camera, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { AppScreen } from '../types';
import { apiService } from '../client';

interface SettingsScreenProps {
    onNavigate: (screen: AppScreen) => void;
    onBack: () => void;
}

import { useLanguage } from '../context/LanguageContext';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, onBack }) => {
    const { language, setLanguage, t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await apiService.getProfile();
            setFormData({
                name: data.name || '',
                email: data.email || '',
                password: '', // Don't allow reading password back
                avatar: data.avatar || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('user_token');
            if (!token) throw new Error("Not logged in");

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: t.settings.save_success || 'Profil berhasil diperbarui!' });
                localStorage.setItem('user_data', JSON.stringify(data));
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal memperbarui profil' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan' });
        } finally {
            setSaving(false);
        }
    };

    const avatars = [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bandung",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Indo",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
    ];

    const langOptions = [
        { id: 'id' as const, name: 'Bahasa Indonesia', flag: '🇮🇩' },
        { id: 'en' as const, name: 'English', flag: '🇺🇸' },
        { id: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
    ];

    return (
        <div className="flex flex-col h-full bg-off-white animate-in slide-in-from-right duration-300">
            <div className="bg-white px-5 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
                <button
                    onClick={onBack}
                    className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-padang-green transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <h2 className="text-lg font-bold text-gray-800">{t.settings.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {message && (
                    <div className={`p-4 rounded-2xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-padang-green border border-green-100' : 'bg-red-50 text-chili-red border border-red-100'}`}>
                        {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        <p className="text-xs font-bold">{message.text}</p>
                    </div>
                )}

                {/* Language Selection */}
                <div className="mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t.settings.language}</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {langOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setLanguage(opt.id)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${language === opt.id ? 'border-padang-green bg-padang-green/5' : 'border-gray-50 bg-white'}`}
                            >
                                <span className="text-2xl mb-1">{opt.flag}</span>
                                <span className="text-[10px] font-bold text-gray-700">{opt.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Avatar Profil</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {avatars.map((url, idx) => (
                            <button
                                key={idx}
                                onClick={() => setFormData({ ...formData, avatar: url })}
                                className={`relative h-16 w-16 rounded-full border-2 transition-all p-1 ${formData.avatar === url ? 'border-padang-green scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={url} alt="Avatar option" className="h-full w-full rounded-full bg-white" />
                                {formData.avatar === url && (
                                    <div className="absolute -bottom-1 -right-1 bg-padang-green text-white rounded-full p-0.5 border-2 border-white">
                                        <CheckCircle className="h-3 w-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center text-[10px] text-gray-400 font-bold bg-white p-2 rounded-xl border border-gray-100 w-fit">
                        <div className="h-8 w-8 rounded-full border border-gray-200 p-0.5">
                            <img src={formData.avatar || avatars[0]} alt="Current" className="h-full w-full rounded-full" />
                        </div>
                        <span>Atau masukkan URL kustom dibawah</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Avatar (Opsional)</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Camera className="h-4 w-4" /></div>
                            <input
                                type="text"
                                value={formData.avatar}
                                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 font-medium"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User className="h-4 w-4" /></div>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 font-bold text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="h-4 w-4" /></div>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 font-medium text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-800 mb-4">Ganti Password</h4>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password Baru (Biarkan kosong jika tidak ganti)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="h-4 w-4" /></div>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 font-medium text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-padang-green text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-padang-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsScreen;
