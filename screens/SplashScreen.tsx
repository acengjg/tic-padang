
import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-padang-green flex flex-col items-center justify-center z-[100] max-w-md mx-auto">
      <div className="relative animate-pulse">
        {/* Silhouette of Rumah Gadang (SVG Icon) */}
        <svg viewBox="0 0 100 60" className="h-24 w-36 fill-white drop-shadow-lg mb-6">
          <path d="M0 40 L20 20 L25 25 L50 0 L75 25 L80 20 L100 40 L100 60 L0 60 Z" />
          <rect x="42" y="45" width="16" height="15" fill="#FFD700" />
        </svg>
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
