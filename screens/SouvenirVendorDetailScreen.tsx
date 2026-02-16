import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, Store, Star, ArrowRight, MapPin, Phone, ShieldCheck, ShoppingBag } from 'lucide-react';
import { apiService } from '../client';
import { SouvenirProduct, SouvenirVendor, AppScreen } from '../types';
import { SafeImage } from '../components/SafeImage';

interface SouvenirVendorDetailScreenProps {
    vendorId: string;
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

export const SouvenirVendorDetailScreen: React.FC<SouvenirVendorDetailScreenProps> = ({ vendorId, onNavigate, onBack }) => {
    const [vendor, setVendor] = useState<SouvenirVendor | null>(null);
    const [products, setProducts] = useState<SouvenirProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadVendorData();
    }, [vendorId]);

    const loadVendorData = async () => {
        setLoading(true);
        try {
            const vendorData = await apiService.getSouvenirVendorDetail(vendorId);
            setVendor(vendorData);

            const productsData = await apiService.getSouvenirProducts({ vendorId });
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to load vendor data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !vendor) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-padang-green border-t-transparent"></div>
        </div>
    );

    if (!vendor) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
            <Store className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-lg font-black text-gray-800">Toko Tidak Ditemukan</h2>
            <button onClick={onBack} className="mt-4 text-padang-green font-bold text-sm uppercase tracking-widest">Kembali</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-in slide-in-from-right duration-300">
            {/* Header / Banner */}
            <div className="relative h-64 w-full bg-gray-200">
                <SafeImage
                    src={vendor.image}
                    className="w-full h-full object-cover"
                    alt={vendor.name}
                    fallbackSrc="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=800"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <button
                    onClick={onBack}
                    className="absolute top-12 left-5 h-10 w-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="absolute bottom-6 left-5 right-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-padang-green text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Verified Vendor</span>
                        <div className="flex items-center gap-1 text-white/80">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-bold">{vendor.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-white leading-tight mb-2">{vendor.name}</h1>
                    <div className="flex items-center gap-4 text-white/70">
                        <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold">{vendor.location}</span>
                        </div>
                        {vendor.contact && (
                            <div className="flex items-center gap-1">
                                <Phone size={12} />
                                <span className="text-[10px] font-bold">{vendor.contact}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* About / Stats */}
            <div className="px-5 -mt-4 relative z-10">
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                        {vendor.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-4 py-3 rounded-2xl w-fit">
                        <ShieldCheck size={18} />
                        <span className="text-[11px] font-black uppercase tracking-wider">Lulus Verifikasi Admin Padang</span>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <main className="px-5 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-black text-gray-800">Daftar Produk</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tersedia {products.length} Barang</p>
                    </div>
                </div>

                {/* Search in Vendor */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Cari produk di toko ini..."
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium shadow-sm focus:ring-2 focus:ring-padang-green/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50 group active:scale-[0.98] transition-all duration-300"
                                onClick={() => onNavigate(AppScreen.SOUVENIR_DETAIL, product.id)}
                            >
                                <div className="h-40 relative overflow-hidden">
                                    <SafeImage
                                        src={product.images[0]}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={product.name}
                                        fallbackSrc="https://images.unsplash.com/photo-1599481238640-4c1288750d7a?q=80&w=400"
                                    />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                                        <span className="text-[10px] font-black text-gray-800">{product.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-black text-gray-800 mb-1 leading-tight line-clamp-2 h-10">{product.name}</h3>
                                    <p className="text-padang-green font-black text-md mb-3">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                    <button className="w-full py-2.5 bg-gray-50 hover:bg-padang-green/10 text-padang-green rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                        Detail <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-1">Produk Tidak Ditemukan</h3>
                        <p className="text-sm text-gray-400 font-medium px-10">Toko ini tidak memiliki produk yang sesuai pencarian Anda</p>
                    </div>
                )}
            </main>
        </div>
    );
};
