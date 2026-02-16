
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
    LayoutDashboard, ShoppingBag, Utensils, Settings, LogOut,
    Menu as MenuIcon, X, ChevronRight, Store, User as UserIcon
} from 'lucide-react';
import { apiService } from './client';
import { VendorDashboardScreen } from './screens/VendorDashboardScreen';
import { CulinaryDashboardScreen } from './screens/CulinaryDashboardScreen';
import LoginScreen from './screens/LoginScreen';
import { AppScreen } from './types';

// Simplified version of the main App component for vendors
const VendorApp: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'souvenir' | 'culinary' | 'settings'>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    // Check auth on load
    useEffect(() => {
        const token = localStorage.getItem('user_token');
        const savedUser = localStorage.getItem('user_data');
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (token: string, user: any) => {
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        setIsLoggedIn(true);
        setUserData(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        setIsLoggedIn(false);
        setUserData(null);
        window.location.href = '/vendor.html'; // Force reload
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-padang-green"></div></div>;

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black text-padang-green tracking-tight mb-2">Vendor Portal</h1>
                        <p className="text-gray-500 text-sm">Masuk untuk mengelola bisnis Anda</p>
                    </div>
                    <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={() => { }} isEmbedded={true} />
                </div>
            </div>
        );
    }

    const NavItem = ({ id, icon: Icon, label }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === id
                    ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            <Icon size={20} />
            {isSidebarOpen && <span>{label}</span>}
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-padang-green rounded-lg flex items-center justify-center text-white font-black">V</div>
                            <span className="font-black text-gray-800 tracking-tight">VENDOR</span>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-padang-green rounded-lg flex items-center justify-center text-white font-black mx-auto">V</div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                        {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>

                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    <div className="px-4 mb-2 opacity-50 text-[10px] font-black uppercase tracking-widest">{isSidebarOpen ? 'Main Menu' : '•••'}</div>
                    <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard Utama" />
                    <NavItem id="souvenir" icon={ShoppingBag} label="Toko Oleh-oleh" />
                    <NavItem id="culinary" icon={Utensils} label="Usaha Kuliner" />

                    <div className="my-4 border-t border-gray-100" />
                    <div className="px-4 mb-2 opacity-50 text-[10px] font-black uppercase tracking-widest">{isSidebarOpen ? 'Akun' : '•••'}</div>
                    <NavItem id="settings" icon={Settings} label="Pengaturan" />
                </div>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all ${!isSidebarOpen && 'justify-center px-0'
                            }`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <h2 className="text-lg font-black text-gray-800 tracking-tight">
                        {activeTab === 'dashboard' && 'Dashboard Utama'}
                        {activeTab === 'souvenir' && 'Manajemen Toko Oleh-oleh'}
                        {activeTab === 'culinary' && 'Manajemen Usaha Kuliner'}
                        {activeTab === 'settings' && 'Pengaturan Akun'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">{userData.name}</span>
                            <span className="text-xs text-gray-500">{userData.email}</span>
                        </div>
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
                            <UserIcon size={20} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab('souvenir')}>
                                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                    <ShoppingBag size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Toko Oleh-oleh</h3>
                                <p className="text-sm text-gray-500">Kelola produk souvenir dan pesanan</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab('culinary')}>
                                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                    <Utensils size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Usaha Kuliner</h3>
                                <p className="text-sm text-gray-500">Kelola menu makanan dan pesanan</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'souvenir' && (
                        <div className="h-full">
                            <VendorDashboardScreen onBack={() => setActiveTab('dashboard')} />
                        </div>
                    )}

                    {activeTab === 'culinary' && (
                        <div className="h-full">
                            <CulinaryDashboardScreen onBack={() => setActiveTab('dashboard')} />
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto text-center">
                            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">Pengaturan Akun</h3>
                            <p className="text-gray-500 mt-2">Fitur pengaturan akan segera tersedia.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const root = createRoot(document.getElementById('vendor-root')!);
root.render(<VendorApp />);
