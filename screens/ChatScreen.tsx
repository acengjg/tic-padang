import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Image as ImageIcon, MoreVertical, ShieldCheck } from 'lucide-react';
import { apiService } from '../client';
import { Message, Conversation } from '../types';

interface ChatScreenProps {
    conversationId: string;
    onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ conversationId, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversation, setConversation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;

    useEffect(() => {
        loadChat();
        const interval = setInterval(loadMessages, 3000); // Poll for new messages
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadChat = async () => {
        try {
            const [convs, msgs] = await Promise.all([
                apiService.getConversations(),
                apiService.getMessages(conversationId)
            ]);
            const currentConv = convs.find((c: any) => c.id === conversationId);
            setConversation(currentConv);
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to load chat", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        try {
            const msgs = await apiService.getMessages(conversationId);
            if (msgs.length !== messages.length) {
                setMessages(msgs);
            }
        } catch (error) {
            console.error("Failed to poll messages", error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        const content = newMessage.trim();
        setNewMessage('');

        try {
            const sentMsg = await apiService.sendMessage(conversationId, content);
            setMessages(prev => [...prev, sentMsg]);
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Gagal mengirim pesan");
        }
    };

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (loading) return null;

    const partner = conversation?.guide?.user || conversation?.members.find((m: any) => m.userId !== userId)?.user;

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="relative">
                        <img
                            src={partner?.avatar || `https://ui-avatars.com/api/?name=${partner?.name}`}
                            className="h-10 w-10 rounded-full object-cover border-2 border-padang-green/20"
                            alt=""
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h2 className="text-sm font-black text-gray-800">{partner?.name}</h2>
                            <ShieldCheck className="h-3 w-3 text-padang-green" />
                        </div>
                        <p className="text-[10px] font-bold text-padang-green uppercase tracking-widest truncate max-w-[150px]">
                            {conversation?.subjectTitle ? `${conversation.subjectTitle}${conversation.subjectDate ? ` (${conversation.subjectDate})` : ''}` : (conversation?.guideId ? 'Pemandu Lokal' : 'Traveler')}
                        </p>
                    </div>
                </div>
                <button className="h-10 w-10 text-gray-400">
                    <MoreVertical size={20} />
                </button>
            </header>

            {/* Messages */}
            <main className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === userId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <img
                                    src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${msg.sender?.name}`}
                                    className="h-8 w-8 rounded-full mr-2 self-end mb-1"
                                    alt=""
                                />
                            )}
                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${isMe
                                ? 'bg-padang-green text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                {msg.content}
                                <div className={`text-[9px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </main>

            {/* Input */}
            <footer className="p-4 bg-white border-t border-gray-100 pb-10">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-padang-green/20 transition-all">
                    <button className="text-gray-400 hover:text-padang-green transition-colors">
                        <ImageIcon size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Ketik pesan..."
                        className="flex-1 bg-transparent border-none py-2 text-sm font-medium focus:ring-0 outline-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${newMessage.trim() ? 'bg-padang-green text-white shadow-lg shadow-padang-green/30' : 'bg-gray-200 text-white'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatScreen;
