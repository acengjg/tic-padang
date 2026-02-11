
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { AppScreen } from '../types';

interface RegisterScreenProps {
    onLoginSuccess: (token: string, userData: any) => void;
    onNavigate: (screen: AppScreen) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onLoginSuccess, onNavigate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                onLoginSuccess(data.token, data.user);
            } else {
                setError(data.error || 'Gagal mendaftar!');
            }
        } catch (err) {
            setError('Gagal menghubungi server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-white px-8 pt-6 pb-8 animate-in fade-in duration-500">
            <button
                onClick={() => onNavigate(AppScreen.LOGIN)}
                className="self-start h-10 w-10 -ml-2 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 mb-4"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Mulai<br />Jelajah!</h1>
                    <Sparkles className="h-6 w-6 text-padang-green animate-pulse" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Buat akun untuk pengalaman tak terlupakan.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                        <div className="h-2 w-2 bg-chili-red rounded-full"></div>
                        <p className="text-xs font-bold text-chili-red">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Nama Lengkap</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-padang-green transition-colors">
                            <User size={20} />
                        </div>
                        <input
                            required
                            type="text"
                            placeholder="Sutan Sati"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-padang-green/5 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Alamat Email</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-padang-green transition-colors">
                            <Mail size={20} />
                        </div>
                        <input
                            required
                            type="email"
                            placeholder="contoh@padang.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-padang-green/5 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-padang-green transition-colors">
                            <Lock size={20} />
                        </div>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 focus:ring-4 focus:ring-padang-green/5 focus:bg-white outline-none transition-all font-bold text-gray-800"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-padang-green/30 text-sm font-medium text-white bg-gradient-to-r from-padang-green to-emerald-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-padang-green transition-all duration-200"
                >
                    Daftar Akun
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 font-medium">
                    Sudah punya akun? <button onClick={() => onNavigate(AppScreen.LOGIN)} className="text-padang-green font-bold hover:underline">Masuk</button>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
