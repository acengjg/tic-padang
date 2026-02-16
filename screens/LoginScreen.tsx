
import React, { useState } from 'react';
import { Mail, Lock, Shield, ArrowRight, Sparkles, User as UserIcon } from 'lucide-react';
import { AppScreen } from '../types';

interface LoginScreenProps {
    onLoginSuccess: (token: string, userData: any) => void;
    onNavigate: (screen: AppScreen) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigate }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                onLoginSuccess(data.token, data.user);
            } else {
                setError(data.error || 'Login gagal dunsanak!');
            }
        } catch (err) {
            setError('Gagal menghubungi server. Pastikan backend aktif.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-white px-8 pt-12 pb-8 animate-in fade-in duration-500">
            <div className="mb-12">
                <div className="h-24 w-24 bg-padang-green rounded-[32px] overflow-hidden shadow-2xl shadow-padang-green/20 mb-8 rotate-3">
                    <img src="/logo.png" alt="TIC Digital Padang" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Salam,<br />Dunsanak!</h1>
                    <Sparkles className="h-6 w-6 text-padang-green animate-pulse" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Masuk untuak melanjutkan petualangan di Padang.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-300">
                        <div className="h-2 w-2 bg-chili-red rounded-full"></div>
                        <p className="text-xs font-bold text-chili-red">{error}</p>
                    </div>
                )}

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

                <div className="flex justify-end">
                    <button type="button" className="text-[11px] font-bold text-padang-green hover:underline">Lupo Password?</button>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-padang-green/30 text-sm font-medium text-white bg-gradient-to-r from-padang-green to-emerald-600 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-padang-green transition-all duration-200"
                >
                    Masuk
                </button>
            </form>

            <div className="mt-12 text-center pb-4">
                <p className="text-sm text-gray-400 font-medium">
                    Alum punya akun? <button onClick={() => onNavigate(AppScreen.REGISTER)} className="text-padang-green font-bold hover:underline">Daftar Gratis</button>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
