import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, Clock, CheckCircle2, XCircle, ShoppingBag, MapPin, Truck } from 'lucide-react';
import { apiService } from '../client';
import { SouvenirOrder, AppScreen } from '../types';
import { SafeImage } from '../components/SafeImage';

interface SouvenirOrdersScreenProps {
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
}

export const SouvenirOrdersScreen: React.FC<SouvenirOrdersScreenProps> = ({ onBack, onNavigate }) => {
    const [orders, setOrders] = useState<SouvenirOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const userData = localStorage.getItem('user_data');
            if (!userData) return;
            const user = JSON.parse(userData);
            const data = await apiService.getUserSouvenirOrders(user.id);
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'PROCESSING': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock size={12} />;
            case 'PROCESSING': return <Truck size={12} />;
            case 'COMPLETED': return <CheckCircle2 size={12} />;
            case 'CANCELLED': return <XCircle size={12} />;
            default: return <Package size={12} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-padang-green"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-in slide-in-from-right duration-500">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-30 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 border border-gray-100">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-gray-800">Pesanan Saya</h1>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {orders.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <ShoppingBag size={40} />
                        </div>
                        <h3 className="text-lg font-black text-gray-800">Belum Ada Pesanan</h3>
                        <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Anda belum memiliki riwayat pesanan oleh-oleh.</p>
                        <button
                            onClick={() => onNavigate(AppScreen.SOUVENIR_MARKETPLACE)}
                            className="bg-padang-green text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all"
                        >
                            Belanja Sekarang
                        </button>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID: {order.id.slice(-8)}</p>
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-padang-green" />
                                        <h3 className="font-black text-gray-800">{order.vendor?.name}</h3>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                                            <SafeImage src={item.product?.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-black text-gray-800 text-sm truncate">{item.product?.name}</h4>
                                            <p className="text-xs text-gray-400 font-bold">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Pembayaran</p>
                                    <p className="text-lg font-black text-padang-green">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                                </div>
                                {order.status === 'PENDING' && (
                                    <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-black">Menunggu Konfirmasi</span>
                                    </div>
                                )}
                            </div>

                            {order.shippingAddress && (
                                <div className="bg-gray-50 rounded-2xl p-4 flex gap-3 items-start">
                                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alamat Pengiriman</p>
                                        <p className="text-xs text-gray-600 font-bold line-clamp-2">{order.shippingAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
