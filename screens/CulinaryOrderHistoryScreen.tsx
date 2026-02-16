
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, ShoppingBag, Utensils, ChefHat, MapPin, Calendar, Receipt } from 'lucide-react';
import { apiService } from '../client';
import { SafeImage } from '../components/SafeImage';
import { AppScreen } from '../types';

interface CulinaryOrderHistoryScreenProps {
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

export const CulinaryOrderHistoryScreen: React.FC<CulinaryOrderHistoryScreenProps> = ({ onNavigate, onBack }) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = async () => {
        try {
            const data = await apiService.getUserCulinaryOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'READY': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Menunggu Konfirmasi';
            case 'ACCEPTED': return 'Diproses';
            case 'REJECTED': return 'Ditolak';
            case 'READY': return 'Siap Diambil/Diantar';
            case 'COMPLETED': return 'Selesai';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white px-6 py-5 shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-4 max-w-2xl mx-auto w-full">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">Riwayat Pesanan</h1>
                        <p className="text-xs font-medium text-gray-500">Pantau status pesanan kulinermu</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-md transition-all duration-300">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                            {order.spot?.image ? (
                                                <SafeImage src={order.spot.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Utensils size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{order.spot?.name}</h3>
                                            <div className="flex items-center gap-1.5 text-gray-400 mt-0.5">
                                                <Calendar size={12} />
                                                <span className="text-[10px] font-medium">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <div className="flex items-start gap-2">
                                                <span className="font-bold text-orange-500 min-w-[20px]">{item.quantity}x</span>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 font-medium">{item.menu.name}</span>
                                                    {item.note && <span className="text-[10px] text-gray-400 italic">"{item.note}"</span>}
                                                </div>
                                            </div>
                                            <span className="text-gray-900 font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Pesanan</span>
                                        <span className="text-lg font-black text-gray-900">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    {order.status === 'READY' && (
                                        <div className="flex gap-2">
                                            <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-500/20">
                                                Ambil Pesanan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt size={32} className="text-orange-400 opacity-80" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">Kamu belum pernah memesan makanan. Yuk cari kuliner favoritmu!</p>
                            <button
                                onClick={() => onNavigate('CULINARY')}
                                className="px-6 py-3 bg-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all"
                            >
                                Cari Kuliner
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
