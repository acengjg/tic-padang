
import React, { useState } from 'react';
import { Camera, AlertTriangle, Bus, Shield, Wifi, Phone, Map, ExternalLink } from 'lucide-react';

const ServicesScreen: React.FC = () => {
    const [cctvLocations] = useState([
        { id: 1, name: "Simpang Presiden", status: "Lancar", image: "https://diskominfo.padang.go.id/cctv/presiden.jpg" },
        { id: 2, name: "Simpang DPRD", status: "Padat", image: "https://diskominfo.padang.go.id/cctv/dprd.jpg" },
        { id: 3, name: "Pantai Padang", status: "Ramai", image: "https://diskominfo.padang.go.id/cctv/pantai.jpg" },
    ]);

    const [floodStatus] = useState({
        level: "Aman",
        height: "50 cm",
        location: "Banda Bakali",
        time: "10:30 WIB"
    });

    return (
        <div className="px-5 py-2 animate-in slide-in-from-right duration-300 pb-24">
            <header className="mb-6 mt-2">
                <h2 className="text-xl font-bold text-gray-800">Layanan Smart City</h2>
                <p className="text-gray-500 text-sm">Informasi layanan publik Kota Padang.</p>
            </header>

            {/* Emergency Call */}
            <div className="flex gap-3 mb-8">
                <a href="tel:112" className="flex-1 bg-chili-red text-white p-4 rounded-2xl shadow-lg shadow-chili-red/20 active:scale-95 transition-all flex flex-col items-center gap-2">
                    <Phone className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest">Darurat 112</span>
                </a>
                <a href="https://polri.go.id" target="_blank" rel="noreferrer" className="flex-1 bg-blue-500 text-white p-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex flex-col items-center gap-2">
                    <Shield className="h-6 w-6" />
                    <span className="text-xs font-black uppercase tracking-widest">Lapor Polisi</span>
                </a>
            </div>

            {/* Flood Early Warning */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" /> Pantauan Banjir
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400">{floodStatus.time}</span>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-[28px] border border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div className="flex justify-between items-end relative z-10">
                        <div>
                            <p className="text-xs text-blue-500 font-bold mb-1">Status Ketinggian Air</p>
                            <h4 className="text-2xl font-black text-gray-800 mb-1">{floodStatus.level}</h4>
                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                                <Map className="h-3 w-3" /> {floodStatus.location}
                            </p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
                            <span className="text-xl font-black text-blue-600">{floodStatus.height}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CCTV Traffic */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <Camera className="h-4 w-4 text-padang-green" /> CCTV Lalu Lintas
                    </h3>
                </div>
                <div className="space-y-4">
                    {cctvLocations.map(cctv => (
                        <div key={cctv.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group">
                            <div className="h-16 w-24 bg-gray-200 rounded-xl overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Camera className="h-6 w-6 text-white/80" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm mb-1">{cctv.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${cctv.status === 'Lancar' ? 'bg-padang-green' :
                                        cctv.status === 'Padat' ? 'bg-orange-500' : 'bg-red-500'
                                        }`}></span>
                                    <span className="text-xs text-gray-500">{cctv.status}</span>
                                </div>
                            </div>
                            <button className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trans Padang Routes */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                        <Bus className="h-4 w-4 text-purple-600" /> Rute Trans Padang
                    </h3>
                </div>
                <div className="bg-purple-50 p-5 rounded-[28px] border border-purple-100 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">Koridor 1: Pusat Kota - Kampus</h4>
                        <p className="text-xs text-purple-600">Bus tersedia setiap 15 menit</p>
                    </div>
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm">
                        Cek Lokasi
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ServicesScreen;
