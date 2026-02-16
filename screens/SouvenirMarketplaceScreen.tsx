import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, Filter, ShoppingBag, Store, Star, ArrowRight } from 'lucide-react';
import { apiService } from '../client';
import { SouvenirProduct, AppScreen } from '../types';
import { SafeImage } from '../components/SafeImage';

interface SouvenirMarketplaceScreenProps {
    onNavigate: (screen: AppScreen, data?: any) => void;
    onBack: () => void;
}

const SouvenirMarketplaceScreen: React.FC<SouvenirMarketplaceScreenProps> = ({ onNavigate, onBack }) => {
    const [products, setProducts] = useState<SouvenirProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const categories = ['Semua', 'Makanan', 'Kerajinan', 'Pakaian', 'Aksesoris', 'Lainnya'];

    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await apiService.getSouvenirProducts({ category: selectedCategory });
            setProducts(data);
        } catch (error) {
            console.error("Failed to load souvenir products", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="bg-white px-5 pt-12 pb-6 rounded-b-[40px] shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Pasar Oleh-oleh</h1>
                        <p className="text-xs font-bold text-padang-green uppercase tracking-widest">Buah Tangan Khas Padang</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Cari keripik balado, rendang, dll..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-padang-green/20 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-padang-green text-white shadow-lg shadow-padang-green/30 scale-105'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Content */}
            <main className="px-5 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black text-gray-800">Produk Terpopuler</h2>
                    <button className="h-10 w-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-padang-green">
                        <Filter size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-[32px] h-64 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
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
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                product.vendorId && onNavigate(AppScreen.SOUVENIR_VENDOR_DETAIL, product.vendorId);
                                            }}
                                            className="bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 hover:bg-black/60 transition-colors w-full"
                                        >
                                            <Store size={10} className="text-white" />
                                            <span className="text-white text-[9px] font-bold truncate">{product.vendor?.name}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-black text-gray-800 mb-1 leading-tight line-clamp-2 h-10">{product.name}</h3>
                                    <p className="text-padang-green font-black text-md mb-3">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </p>
                                    <button className="w-full py-2.5 bg-gray-50 hover:bg-padang-green/10 text-padang-green rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                        Beli Sekarang <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-1">Produk Tidak Ditemukan</h3>
                        <p className="text-sm text-gray-400 font-medium">Coba cari dengan kata kunci lain</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SouvenirMarketplaceScreen;
