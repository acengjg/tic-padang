
import React, { useState, useEffect } from 'react';
import { Tag, Gift, ExternalLink, Copy, Clock, RefreshCw } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import { Promotion } from '../types';

const PromoScreen: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-off-white">
        <RefreshCw className="h-10 w-10 text-padang-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-2 animate-in slide-in-from-right duration-300 pb-10">
      <header className="mb-6 mt-2">
        <h2 className="text-xl font-bold text-gray-800">Promo & Penawaran</h2>
        <p className="text-gray-500 text-sm">Nikmati diskon eksklusif untuk liburanmu.</p>
      </header>

      <div className="space-y-6">
        {promotions.map((promo) => (
          <div key={promo.id} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:row">
            <div className="h-44 w-full relative">
              <img src={getProxiedImageUrl(promo.image)} alt={promo.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-chili-red text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                {promo.discount}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-base">{promo.title}</h3>
                <span className="text-[10px] font-bold text-padang-green bg-padang-green/5 px-2 py-1 rounded-lg border border-padang-green/10">
                  {promo.provider}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Gunakan kode ini untuk mendapatkan penawaran spesial di {promo.provider}.</p>

              <div
                onClick={() => handleCopy('TIK' + promo.title.substring(0, 5).toUpperCase())}
                className="flex items-center gap-3 p-3 bg-off-white rounded-xl border border-dashed border-padang-green/30 group cursor-pointer hover:bg-padang-green/5 transition-all"
              >
                <div className="flex-1">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Kode Promo</p>
                  <code className="font-mono text-base font-black text-padang-green tracking-widest">
                    TIK{promo.title.substring(0, 5).toUpperCase()}
                  </code>
                </div>
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:text-padang-green transition-all text-gray-400">
                  <Copy className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
        {promotions.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <Tag className="h-12 w-12 mx-auto mb-3" />
            <p className="text-sm font-bold">Belum ada promo aktif</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Hadiah Menantimu</h3>
          <div className="bg-chili-red/10 p-2 rounded-full">
            <Gift className="h-4 w-4 text-chili-red animate-bounce" />
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-padang-green to-green-900 p-6 rounded-[32px] text-white shadow-xl shadow-padang-green/20 overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-80 uppercase tracking-[2px] mb-2">Loyalty Program</p>
            <h4 className="text-xl font-bold mb-3">Kumpulkan 50 Poin!</h4>
            <p className="text-xs opacity-80 mb-6 leading-relaxed">
              Setiap kunjungan ke destinasi wisata memberimu poin untuk ditukar merchandise eksklusif TIC-PADANG.
            </p>
            <button className="w-full bg-white text-padang-green font-black text-xs py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
              Lihat Katalog Hadiah <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoScreen;
