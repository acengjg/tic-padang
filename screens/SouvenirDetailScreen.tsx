import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, Star, Store, MapPin, MessageCircle, ArrowRight, ShieldCheck, Info, ShoppingBag } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import { SouvenirProduct, AppScreen } from '../types';
import { SafeImage } from '../components/SafeImage';

interface SouvenirDetailScreenProps {
    productId: string;
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

export const SouvenirDetailScreen: React.FC<SouvenirDetailScreenProps> = ({ productId, onNavigate, onBack }) => {
    const [product, setProduct] = useState<SouvenirProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        loadProductDetail();
    }, [productId]);

    const loadProductDetail = async () => {
        try {
            const data = await apiService.getSouvenirProductDetail(productId);
            setProduct(data);
        } catch (error) {
            console.error("Failed to load product detail", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppOrder = () => {
        if (!product) return;
        const message = `Halo ${product.vendor?.name}, saya tertarik dengan produk ${product.name} yang ada di TIC Padang. Apakah stok masih tersedia?`;
        const phone = product.vendor?.contact || '6281234567890'; // Default fallback or use vendor contact
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleOrder = async () => {
        if (!product) return;

        const token = localStorage.getItem('user_token');
        if (!token) {
            alert('Silakan login terlebih dahulu untuk melakukan pemesanan');
            onNavigate(AppScreen.LOGIN);
            return;
        }

        const confirmOrder = window.confirm(`Apakah Anda yakin ingin memesan ${product.name} seharga Rp ${product.price.toLocaleString('id-ID')}?`);
        if (!confirmOrder) return;

        try {
            const orderData = {
                vendorId: product.vendorId,
                totalPrice: product.price,
                items: [
                    {
                        productId: product.id,
                        quantity: 1,
                        price: product.price
                    }
                ],
                shippingAddress: 'Ambil di Toko / Alamat default' // Simplified for now
            };

            await apiService.createSouvenirOrder(orderData);
            alert('Pesanan berhasil dibuat! Anda dapat melihat status pesanan di riwayat pesanan.');
            onNavigate(AppScreen.SOUVENIR_ORDERS);
        } catch (error) {
            console.error("Order error", error);
            alert('Gagal membuat pesanan. Silakan coba lagi.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-padang-green"></div>
            </div>
        );
    }

    if (!product) return <div className="text-center p-8">Produk tidak ditemukan</div>;

    const images = product.images.length > 0 ? product.images : ["https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800"];

    return (
        <div className="min-h-screen bg-white pb-32 animate-in slide-in-from-bottom duration-500 overflow-x-hidden">
            {/* Image Section */}
            <div className="relative aspect-square bg-gray-100">
                <SafeImage
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                <div className="absolute top-12 left-5 right-5 flex justify-between items-center z-10">
                    <button onClick={onBack} className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-2">
                        <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-lg">
                            <Share2 size={20} />
                        </button>
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`h-10 w-10 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg transition-all ${isFavorite ? 'bg-chili-red text-white border-chili-red' : 'bg-white/20 text-white'}`}
                        >
                            <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
                        </button>
                    </div>
                </div>

                {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`h-1.5 rounded-full transition-all ${activeImage === idx ? 'w-6 bg-white shadow-sm' : 'w-2 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="px-6 py-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-black text-padang-green uppercase tracking-[3px] mb-2 inline-block">
                            {product.category}
                        </span>
                        <h1 className="text-2xl font-black text-gray-800 leading-tight">
                            {product.name}
                        </h1>
                    </div>
                    <div className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-yellow-100">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-black">{product.rating.toFixed(1)}</span>
                    </div>
                </div>

                <div className="text-3xl font-black text-padang-green mb-8">
                    Rp {product.price.toLocaleString('id-ID')}
                </div>

                <div className="space-y-8">
                    {/* Vendor Card */}
                    <button
                        onClick={() => product.vendorId && onNavigate(AppScreen.SOUVENIR_VENDOR_DETAIL, product.vendorId)}
                        className="w-full bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex items-center gap-4 group active:scale-95 transition-all text-left"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 shrink-0">
                            <img
                                src={getProxiedImageUrl(product.vendor?.image || '')}
                                className="w-full h-full object-cover"
                                alt={product.vendor?.name}
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Vendor')}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Disediakan Oleh</p>
                            <h3 className="font-black text-gray-800 flex items-center gap-2">
                                {product.vendor?.name || 'Vendor'}
                                <ShieldCheck size={16} className="text-blue-500" />
                            </h3>
                            <div className="flex items-center gap-1 text-gray-400">
                                <MapPin size={10} />
                                <span className="text-[10px] font-bold">{product.vendor?.location || 'Sumatera Barat'}</span>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-gray-300 group-hover:text-padang-green transition-colors" />
                    </button>

                    {/* Description */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                            <Info size={16} className="text-padang-green" /> Deskripsi Produk
                        </h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock & Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 text-center">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Stok</p>
                            <p className="text-lg font-black text-gray-800">{product.stock}</p>
                        </div>
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 text-center">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Terjual</p>
                            <p className="text-lg font-black text-gray-800">100+</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 flex gap-3">
                <button
                    onClick={handleWhatsAppOrder}
                    className="h-16 w-16 bg-[#25D366] text-white rounded-3xl flex items-center justify-center shadow-xl shadow-green-100 active:scale-95 transition-all"
                    title="WhatsApp"
                >
                    <MessageCircle size={24} className="fill-white" />
                </button>
                <button
                    onClick={handleOrder}
                    className="flex-1 h-16 bg-padang-green text-white rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <ShoppingBag size={24} />
                    <span className="text-sm font-black uppercase tracking-widest">Beli Sekarang</span>
                </button>
            </div>
        </div>
    );
};
