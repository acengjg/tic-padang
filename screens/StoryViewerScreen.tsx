import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { apiService, API_BASE_URL } from '../client';
import { Story, StoryComment } from '../types';

interface StoryViewerProps {
    stories: Story[];
    initialStoryIndex: number;
    onClose: () => void;
}

const StoryViewerScreen: React.FC<StoryViewerProps> = ({ stories, initialStoryIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [localComments, setLocalComments] = useState<StoryComment[]>([]);

    const story = stories[currentIndex];
    const media = story.media[currentMediaIndex];

    // Initialize state when story changes
    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('user_data') || '{}').id;
        const liked = story.likes.some(l => l.userId === userId);
        setIsLiked(liked);
        setLikesCount(story.likes.length);
        setLocalComments(story.comments);
        setCurrentMediaIndex(0);
    }, [story]);

    const handleNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentMediaIndex < story.media.length - 1) {
            setCurrentMediaIndex(prev => prev + 1);
        } else if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handlePrev = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentMediaIndex > 0) {
            setCurrentMediaIndex(prev => prev - 1);
        } else if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const res = await apiService.likeStory(story.id);
            setIsLiked(res.liked);
            setLikesCount(prev => res.liked ? prev + 1 : prev - 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const newComment = await apiService.commentStory(story.id, commentText);
            setLocalComments(prev => [newComment, ...prev]);
            setCommentText('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            {/* Main Content Area */}
            <div className="relative w-full h-full max-w-md mx-auto bg-black flex flex-col" onClick={handleNext}>

                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                    {story.media.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-white transition-all duration-300 ${idx < currentMediaIndex ? 'w-full' :
                                    idx === currentMediaIndex ? 'w-full' : 'w-0'
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full border-2 border-padang-green p-[2px]">
                            <img
                                src={story.user.avatar || `https://ui-avatars.com/api/?name=${story.user.name}`}
                                className="w-full h-full rounded-full object-cover bg-gray-800"
                                alt=""
                            />
                        </div>
                        <div className="text-white drop-shadow-md">
                            <span className="font-bold text-sm block">{story.user.name}</span>
                            {story.location && (
                                <span className="text-xs opacity-80 flex items-center gap-1">
                                    <MapPin size={10} /> {story.location}
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 bg-black/20 rounded-full backdrop-blur-md text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Media */}
                <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
                    {media.type === 'VIDEO' ? (
                        <video
                            src={media.url.startsWith('http') ? media.url : `${API_BASE_URL.replace('/api', '')}${media.url}`}
                            className="w-full h-full object-contain"
                            autoPlay
                            loop
                            muted={false}
                            playsInline
                        />
                    ) : (
                        <img
                            src={media.url.startsWith('http') ? media.url : `${API_BASE_URL.replace('/api', '')}${media.url}`}
                            className="w-full h-full object-contain"
                            alt="Story"
                        />
                    )}

                    {/* Navigation Areas */}
                    <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={handlePrev} />
                    <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={handleNext} />
                </div>

                {/* Footer / Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-8 px-4 z-20">
                    {story.caption && (
                        <p className="text-white text-sm mb-4 line-clamp-2 drop-shadow-sm">
                            <span className="font-bold mr-2">{story.user.name}</span>
                            {story.caption}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center">
                                <button className="p-2" onClick={handleLike}>
                                    <Heart
                                        size={28}
                                        className={`transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`}
                                    />
                                </button>
                                <span className="text-white text-xs font-bold">{likesCount}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <button className="p-2" onClick={() => setShowComments(true)}>
                                    <MessageCircle size={28} className="text-white" />
                                </button>
                                <span className="text-white text-xs font-bold">{localComments.length}</span>
                            </div>
                            <button className="p-2">
                                <Send size={28} className="text-white -rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Sheet */}
                {showComments && (
                    <div
                        className="absolute inset-0 z-30 bg-black/80 backdrop-blur-sm flex flex-col justify-end"
                        onClick={(e) => { e.stopPropagation(); setShowComments(false); }}
                    >
                        <div
                            className="bg-white rounded-t-[32px] h-3/4 flex flex-col w-full max-w-md mx-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <span className="font-bold text-gray-800">Komentar ({localComments.length})</span>
                                <button onClick={() => setShowComments(false)}><X size={20} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {localComments.map(comment => (
                                    <div key={comment.id} className="flex gap-3">
                                        <img
                                            src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.name}`}
                                            className="w-8 h-8 rounded-full bg-gray-200"
                                            alt=""
                                        />
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-bold mr-2">{comment.user.name}</span>
                                                {comment.content}
                                            </p>
                                            <span className="text-[10px] text-gray-400">Baru saja</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleComment} className="p-4 border-t flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Tulis komentar..."
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-padang-green/50"
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="p-2 bg-padang-green text-white rounded-full disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryViewerScreen;
