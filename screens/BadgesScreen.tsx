import React, { useState, useEffect } from 'react';
import { Badge } from '../types';
import { apiService } from '../client';
import { ChevronRight, Trophy, ShieldCheck, Lock, Star } from 'lucide-react';

interface BadgesScreenProps {
    onBack: () => void;
}

const BadgesScreen: React.FC<BadgesScreenProps> = ({ onBack }) => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const data = await apiService.getBadges();
                setBadges(data);
            } catch (error) {
                console.error('Error fetching badges:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, []);

    const tiers = {
        BRONZE: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        SILVER: { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
        GOLD: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
        DIAMOND: { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
        LEGEND: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-indigo-600 p-6 text-white shrink-0">
                <button onClick={onBack} className="mb-4 flex items-center text-indigo-100">
                    <ChevronRight className="rotate-180 mr-1" /> Back
                </button>
                <h1 className="text-2xl font-bold">Lencana & Pencapaian</h1>
                <p className="text-indigo-100 text-sm mt-1">Selesaikan tantangan untuk membuka lencana baru</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`relative bg-white rounded-[2rem] p-5 shadow-sm border transition-all ${badge.unlocked ? 'border-indigo-100 shadow-indigo-100/50' : 'border-slate-100 opacity-60 grayscale'}`}
                        >
                            <div className={`w-14 h-14 rounded-3xl mx-auto mb-4 flex items-center justify-center ${badge.unlocked ? tiers[badge.tier].bg : 'bg-slate-100'}`}>
                                {badge.unlocked ? (
                                    <Trophy className={tiers[badge.tier].color} size={32} />
                                ) : (
                                    <Lock className="text-slate-300" size={24} />
                                )}
                            </div>

                            <h3 className="text-center font-bold text-slate-800 text-sm leading-tight mb-1">{badge.name}</h3>
                            <p className="text-center text-[10px] text-slate-500 leading-tight mb-3 line-clamp-2">{badge.description}</p>

                            <div className={`flex items-center justify-center space-x-1 px-3 py-1 rounded-full border ${badge.unlocked ? tiers[badge.tier].color + ' ' + tiers[badge.tier].border : 'text-slate-300 border-slate-50'}`}>
                                <ShieldCheck size={10} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">{badge.tier}</span>
                            </div>

                            {!badge.unlocked && (
                                <div className="absolute top-3 right-3">
                                    <span className="text-[10px] font-bold text-slate-300">0/{badge.threshold}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Challenge Footer */}
                <div className="mt-10 bg-indigo-50 rounded-[2.5rem] p-6 border border-indigo-100">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-indigo-600 p-2 rounded-2xl shadow-lg shadow-indigo-200">
                            <Star className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-bold text-indigo-900 text-sm uppercase tracking-wider">Level Traveler</h2>
                            <p className="text-indigo-700 text-xs">Ayo terus menjelajah!</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-indigo-400">PROGRESS LEVEL SELANJUTNYA</span>
                            <span className="text-xs font-bold text-indigo-600">75%</span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden border border-indigo-100">
                            <div className="h-full bg-indigo-600 rounded-full w-[75%] shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                        </div>
                    </div>
                </div>
                <div className="h-24"></div>
            </div>
        </div>
    );
};

export default BadgesScreen;
