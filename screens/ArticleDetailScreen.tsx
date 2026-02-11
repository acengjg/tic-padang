import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { apiService } from '../client';
import { ChevronLeft, Calendar, Share2, Clock, Bookmark } from 'lucide-react';

interface ArticleDetailScreenProps {
    article: Article;
    onBack: () => void;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string;
        avatar: string | null;
    };
}

const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ article, onBack }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [article.id]);

    const loadComments = async () => {
        const data = await apiService.getComments(article.id);
        setComments(data);
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            await apiService.submitComment(article.id, newComment);
            setNewComment('');
            loadComments();
        } catch (error) {
            alert('Gagal mengirim komentar. Pastikan Anda sudah login.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col bg-white min-h-screen">
            {/* Header Image */}
            <div className="relative h-[45vh] w-full shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Header Controls */}
                <div className="absolute top-12 left-6 right-6 flex justify-between items-center">
                    <button onClick={onBack} className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="flex gap-2">
                        <button className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="h-12 w-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/30 active:scale-90 transition-all">
                            <Bookmark className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Category Badge & Title Overlay */}
                <div className="absolute bottom-12 left-6 right-6">
                    <span className="bg-padang-green text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg mb-4 inline-block">
                        {article.category}
                    </span>
                    <h1 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">{article.title}</h1>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 bg-white rounded-t-[40px] -mt-10 relative px-6 pt-8 pb-32">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${article.author}`} alt={article.author} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">Oleh {article.author}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kontributor Resmi</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                                <Calendar className="h-3 w-3" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-padang-green">
                                <Clock className="h-3 w-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">5 Menit Baca</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Body */}
                <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 leading-relaxed text-[15px] font-medium whitespace-pre-wrap">
                        {article.content}
                    </p>
                </div>

                {/* Comments Section */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <h3 className="text-xl font-black text-gray-800 mb-6 tracking-tight">Komentar ({comments.length})</h3>

                    {/* Comment Form */}
                    <div className="flex gap-3 mb-8">
                        <div className="h-10 w-10 rounded-full bg-gray-100 shrink-0 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tulis pendapatmu..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 min-h-[100px]"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleSubmitComment}
                                    disabled={submitting || !newComment.trim()}
                                    className="bg-padang-green text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Mengirim...' : 'Kirim'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-gray-100 shrink-0 overflow-hidden border border-gray-50">
                                    <img src={comment.user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.name}`} alt={comment.user.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-gray-800">{comment.user.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">• {new Date(comment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Newsletter/Action Section */}
                <div className="mt-12 p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                    <h3 className="text-lg font-black text-gray-800 mb-2 uppercase tracking-tight">Suka artikel ini?</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6">Bagikan ke teman-temanmu agar mereka juga mendapatkan informasi terbaru tentang Padang.</p>
                    <button className="w-full bg-padang-green text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-padang-green/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <Share2 size={18} /> Bagikan Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailScreen;
