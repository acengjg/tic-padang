import React, { useState, useEffect } from 'react';
import { ChevronLeft, Search, MessageSquare, Clock, ShieldCheck, MoreVertical, Bookmark } from 'lucide-react';
import { apiService } from '../client';
import { Conversation, AppScreen } from '../types';

interface ConversationsScreenProps {
    onBack: () => void;
    onNavigate: (screen: AppScreen, data?: any) => void;
}

const ConversationsScreen: React.FC<ConversationsScreenProps> = ({ onBack, onNavigate }) => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const data = await apiService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const partner = conv.guide?.user || conv.members.find((m: any) => m.userId !== userId)?.user;
        return partner?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-padang-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <header className="px-5 pt-12 pb-6 space-y-4 border-b border-gray-50 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-xl font-black text-gray-800">Pesan</h1>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari percakapan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 ring-padang-green/20 transition-all"
                    />
                </div>
            </header>

            {/* List */}
            <main className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(conv => {
                        const partner = conv.guide?.user || conv.members.find((m: any) => m.userId !== userId)?.user;
                        const lastMessage = conv.messages[0];

                        return (
                            <button
                                key={conv.id}
                                onClick={() => onNavigate(AppScreen.CHAT, conv.id)}
                                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 active:bg-gray-100 transition-all border-b border-gray-50 group"
                            >
                                <div className="relative shrink-0">
                                    <img
                                        src={partner?.avatar || `https://ui-avatars.com/api/?name=${partner?.name}`}
                                        className="h-14 w-14 rounded-2xl object-cover border-2 border-gray-50"
                                        alt=""
                                    />
                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-1">
                                            <h3 className="text-sm font-black text-gray-800 truncate">{partner?.name}</h3>
                                            {conv.guideId && <ShieldCheck className="h-3 w-3 text-padang-green" />}
                                        </div>
                                        {lastMessage && (
                                            <span className="text-[9px] font-bold text-gray-400">
                                                {new Date(lastMessage.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </span>
                                        )}
                                    </div>
                                    {conv.subjectTitle && (
                                        <div className="flex items-center gap-1 mb-1">
                                            <Bookmark className="h-3 w-3 text-padang-green" />
                                            <p className="text-[9px] font-bold text-padang-green uppercase truncate">
                                                {conv.subjectTitle} {conv.subjectDate && `• ${conv.subjectDate}`}
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-xs font-medium text-gray-500 line-clamp-1">
                                        {lastMessage ? lastMessage.content : "Belum ada pesan"}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="py-20 text-center px-10">
                        <div className="h-20 w-20 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={32} className="text-gray-200" />
                        </div>
                        <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest">Tidak ada pesan</h3>
                        <p className="text-xs text-gray-400 font-medium mt-2">Mulai petualanganmu dan hubungi pemandu lokal terbaik!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConversationsScreen;
