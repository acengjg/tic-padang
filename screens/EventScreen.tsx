import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowLeft, Ticket, Share2, Heart, CalendarPlus, X } from 'lucide-react';
import { apiService, getProxiedImageUrl } from '../client';
import YouTubePlayer from '../components/YouTubePlayer';
import { Event, AppScreen } from '../types';

interface EventScreenProps {
    onBack: () => void;
}

const formatDate = (dateString: string, full: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: full ? 'short' : undefined
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

const EventDetail: React.FC<{ event: Event; onBack: () => void }> = ({ event, onBack }) => {
    return (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Hero Section */}
            <div className="relative h-[45vh] w-full">
                <img src={getProxiedImageUrl(event.image)} alt={event.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>

                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <Heart className="h-5 w-5" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-gray-900 to-transparent">
                    <div className="bg-padang-green/90 backdrop-blur-sm self-start inline-flex px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest mb-3 shadow-lg">
                        {event.price || 'Gratis'}
                    </div>
                    <h1 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">{event.name}</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="px-6 py-8 -mt-6 bg-white rounded-t-[32px] relative z-10 flex flex-col gap-8 min-h-[60vh]">
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    <div className="flex-1 min-w-[140px] bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Waktu</p>
                            <p className="text-sm font-bold text-gray-800">{new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                        </div>
                    </div>
                    <div className="flex-1 min-w-[140px] bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col gap-2">
                        <Calendar className="h-5 w-5 text-orange-500" />
                        <div>
                            <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest">Tanggal</p>
                            <p className="text-sm font-bold text-gray-800">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-chili-red" />
                        Lokasi Acara
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-4 items-center">
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 font-bold text-xs text-chili-red border border-gray-100">
                            MAP
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{event.location}</p>
                            <p className="text-xs text-gray-400">Padang, Sumatera Barat</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-800">Tentang Event</h3>
                    {event.videoUrl && <YouTubePlayer url={event.videoUrl} className="mb-4 rounded-2xl" />}
                    <p className="text-gray-600 leading-relaxed text-sm text-justify whitespace-pre-wrap">
                        {event.description}
                    </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-auto pt-8 pb-4 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-padang-green text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-padang-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <Ticket className="h-5 w-5" />
                            Booking Tiket
                        </button>
                        <button className="px-5 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors">
                            <CalendarPlus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventScreen: React.FC<EventScreenProps> = ({ onBack }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const loadEvents = async () => {
            const data = await apiService.getEvents();
            setEvents(data);
            setLoading(false);
        };
        loadEvents();
    }, []);

    if (selectedEvent) {
        return <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 px-6 py-6 flex items-center gap-5 bg-white shadow-xl shadow-black/5">
                <button
                    onClick={onBack}
                    className="h-12 w-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-all active:scale-90"
                >
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-padang-green uppercase tracking-[3px] mb-0.5">Berlangsung</span>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Event Kota</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm h-64 animate-pulse" />
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p>Belum ada event yang akan datang.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-[36px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer border border-gray-100/50 active:scale-[0.98]">
                            <div className="relative h-60 bg-gray-200">
                                <img
                                    src={getProxiedImageUrl(event.image)}
                                    className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-90 transition-all duration-1000"
                                    alt={event.name}
                                />
                                <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-padang-green shadow-xl border border-white uppercase tracking-widest">
                                    {event.price || 'Gratis'}
                                </div>
                                <div className="absolute bottom-5 left-5 right-5">
                                    <div className="bg-white/90 backdrop-blur-md self-start inline-flex px-4 py-2 rounded-2xl text-[10px] font-black text-gray-600 uppercase tracking-widest shadow-xl border border-white gap-2 items-center">
                                        <Calendar className="h-3.5 w-3.5 text-padang-green" />
                                        {new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                            <div className="p-7">
                                <h3 className="font-black text-xl text-gray-800 leading-tight mb-3 group-hover:text-padang-green transition-colors">{event.name}</h3>

                                <div className="flex items-center gap-3 text-gray-400 mb-6 bg-gray-50/50 p-2 rounded-2xl border border-gray-100/50">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                                        <MapPin className="h-5 w-5 text-chili-red" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-gray-300 tracking-[2px]">Lokasi</span>
                                        <span className="text-xs font-bold text-gray-600 truncate">{event.location}</span>
                                    </div>
                                </div>

                                <p className="text-[13px] text-gray-500 line-clamp-2 mb-8 font-medium leading-relaxed">
                                    {event.description}
                                </p>

                                <button className="w-full py-4 bg-padang-green text-white rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-xl shadow-padang-green/20 hover:bg-green-800 transition-all flex items-center justify-center gap-3">
                                    <Ticket className="h-4 w-4" />
                                    Beli Tiket
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventScreen;
