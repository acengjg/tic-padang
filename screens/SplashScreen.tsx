
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-padang-green flex flex-col items-center justify-center z-[100] max-w-md mx-auto">
      <div className="relative animate-in zoom-in duration-700">
        <img src="/logo.png" alt="TIC Digital Padang" className="h-40 w-40 object-contain drop-shadow-2xl mb-8" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-2">TIC-PADANG</h1>
      <p className="text-white/80 text-sm font-medium italic">Tourism Information Center Padang</p>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-[loading_2.5s_ease-in-out]"></div>
        </div>
        <p className="text-white/60 text-[10px] uppercase tracking-[3px]">Memuat Pengalaman Terbaik</p>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
