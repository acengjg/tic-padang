
import React, { useState } from 'react';
import { ShieldAlert, X, Phone, HeartPulse, ShieldCheck, AlertTriangle } from 'lucide-react';

const SOSButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Emergency Menu */}
      <div className={`fixed bottom-24 right-6 flex flex-col gap-4 items-end z-[70] transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-w-[240px] border border-gray-100">
          <div className="bg-chili-red px-4 py-3 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-white" />
            <span className="text-white font-bold text-sm">Bantuan Darurat</span>
          </div>
          <div className="p-2 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left group">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200">
                <ShieldCheck className="h-4 w-4 text-chili-red" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Polisi Pariwisata</p>
                <p className="text-[10px] text-gray-500">Fast Response (110)</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left group">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200">
                <HeartPulse className="h-4 w-4 text-chili-red" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Ambulans / Medis</p>
                <p className="text-[10px] text-gray-500">Hospital (118)</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left group">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200">
                <AlertTriangle className="h-4 w-4 text-chili-red" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">BPBD (Bencana Daerah)</p>
                <p className="text-[10px] text-gray-500">Disaster Response (112)</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition-colors text-left group">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200">
                <Phone className="h-4 w-4 text-chili-red" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Call Center 24 Jam</p>
                <p className="text-[10px] text-gray-500">Pusat Layanan Padang</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center z-[70] transition-all duration-300 transform ${
          isOpen 
            ? 'bg-white rotate-90 scale-90' 
            : 'bg-chili-red scale-100 hover:scale-110 active:scale-95 animate-sos-pulse'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-chili-red" />
        ) : (
          <ShieldAlert className="h-6 w-6 text-white" />
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
          </span>
        )}
      </button>
    </>
  );
};

export default SOSButton;
