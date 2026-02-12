
import React, { useState, useEffect, useRef } from 'react';
import { Destination } from '../types';
import { API_BASE_URL, getProxiedImageUrl } from '../client';
import {
    X, Maximize2, Minimize2, Volume2, VolumeX, Info,
    ChevronRight, ChevronLeft, Play, Pause, Compass,
    Eye, Monitor, Smartphone
} from 'lucide-react';

interface Hotspot {
    pitch: number;
    yaw: number;
    type: 'info' | 'scene';
    text: string;
    URL?: string;
    sceneId?: string;
}

interface VirtualTourScreenProps {
    destination: Destination;
    onClose: () => void;
}

const VirtualTourScreen: React.FC<VirtualTourScreenProps> = ({ destination, onClose }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPOI, setCurrentPOI] = useState<string>('Titik Utama');
    const [showInfoPanel, setShowInfoPanel] = useState(false);
    const [activeHotspot, setActiveHotspot] = useState<any>(null);
    const [volume, setVolume] = useState(0.7);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isVRMode, setIsVRMode] = useState(false);
    const [activeSceneIdx, setActiveSceneIdx] = useState(0);

    // Parse scenes
    const scenes = React.useMemo(() => {
        let parsed = [];
        if (destination.scenes) {
            try {
                parsed = typeof destination.scenes === 'string'
                    ? JSON.parse(destination.scenes)
                    : destination.scenes;
            } catch (e) { console.error("Failed to parse scenes", e); }
        }

        // Fallback to image360 if no scenes
        if (parsed.length === 0 && destination.image360) {
            parsed = [{
                id: 'main',
                name: 'Titik Utama',
                image360: destination.image360,
                hotspots: destination.hotspots
            }];
        }
        return parsed;
    }, [destination.scenes, destination.image360, destination.hotspots]);

    const activeScene = scenes[activeSceneIdx] || null;

    // Audio narration logic
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [audioProgress, setAudioProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Audio management
    useEffect(() => {
        if (destination.audioNarration) {
            const audio = new Audio(destination.audioNarration);
            audio.loop = true;
            audioRef.current = audio;

            if (isPlaying && !isMuted) {
                audio.play().catch(e => console.error("Audio playback error:", e));
            }

            const updateProgress = () => {
                if (audio.duration) {
                    setAudioProgress((audio.currentTime / audio.duration) * 100);
                    setDuration(audio.duration);
                }
            };

            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('loadedmetadata', updateProgress);

            return () => {
                audio.pause();
                audio.removeEventListener('timeupdate', updateProgress);
                audio.removeEventListener('loadedmetadata', updateProgress);
                audioRef.current = null;
            };
        }
    }, [destination.audioNarration]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying && !isMuted) {
                audioRef.current.play().catch(e => console.error("Audio play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, isMuted, volume]);

    useEffect(() => {
        const initViewer = () => {
            if (viewerRef.current && (window as any).pannellum && destination.image360) {
                if (viewerInstance.current) {
                    viewerInstance.current.destroy();
                }

                const currentImageUrl = activeScene?.image360 || destination.image360;
                if (!currentImageUrl) return;

                const panoramaUrl = getProxiedImageUrl(currentImageUrl);

                // Use hotspots from active scene
                let rawHotspots = activeScene?.hotspots || [];
                let hotspots = [];
                try {
                    hotspots = typeof rawHotspots === 'string'
                        ? JSON.parse(rawHotspots)
                        : rawHotspots;
                } catch (e) {
                    console.error("Failed to parse hotspots", e);
                }

                viewerInstance.current = (window as any).pannellum.viewer(viewerRef.current, {
                    type: 'equirectangular',
                    panorama: panoramaUrl,
                    autoLoad: true,
                    autoRotate: isPlaying ? -2 : 0,
                    showControls: false,
                    compass: true,
                    hotSpots: hotspots.map((h: any) => ({
                        ...h,
                        createTooltipFunc: (el: HTMLElement) => {
                            el.classList.add('custom-hotspot-label');
                            el.innerHTML = `
                                <div class="group relative flex flex-col items-center">
                                    <!-- Smaller Animated Ring -->
                                    <div class="absolute -inset-1 bg-padang-green/20 rounded-full animate-pulse blur-[2px]"></div>
                                    
                                    <!-- Compact Label -->
                                    <div class="relative bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/10 shadow-xl flex items-center gap-1.5 transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
                                        <div class="h-1.5 w-1.5 rounded-full bg-padang-green shadow-[0_0_6px_rgba(0,100,0,0.8)]"></div>
                                        <p class="text-[8px] font-black text-white uppercase tracking-[1.5px] whitespace-nowrap">${h.text || 'Info'}</p>
                                        <div class="h-3 w-3 rounded-md bg-white/10 flex items-center justify-center ml-0.5">
                                            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </div>
                                    </div>
                                    
                                    <!-- Short Stem -->
                                    <div class="w-px h-2 bg-gradient-to-b from-white/30 to-transparent"></div>
                                </div>
                            `;
                        },
                        clickHandlerFunc: () => {
                            setActiveHotspot(h);
                            setShowInfoPanel(true);
                        }
                    })),
                    crossOrigin: 'anonymous',
                });

                // Removed mousedown listener to keep audio playing during interaction
            }
        };

        const timer = setTimeout(initViewer, 200);
        return () => {
            clearTimeout(timer);
            if (viewerInstance.current) {
                viewerInstance.current.destroy();
            }
        };
    }, [activeSceneIdx, destination.image360, isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        if (viewerInstance.current) {
            viewerInstance.current.setOption('autoRotate', !isPlaying ? -2 : 0);
        }
    };

    const toggleVR = () => {
        // Basic VR toggle - pannellum doesn't have native "cardboard" split but we can simulate or use full screen
        if (viewerInstance.current) {
            viewerInstance.current.toggleFullscreen();
            // Pannellum documentation says it handles some device orientation if enabled
        }
        setIsVRMode(!isVRMode);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
            {/* Viewer Container */}
            <div className="flex-1 relative overflow-hidden">
                <div ref={viewerRef} className="w-full h-full" />

                {/* Overlay Controls - Top */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-2 pointer-events-auto">
                        <button
                            onClick={onClose}
                            className="h-12 w-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
                        >
                            <X size={24} />
                        </button>
                        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mt-2 max-w-[200px]">
                            <span className="text-[10px] font-black text-padang-green uppercase tracking-widest block mb-1">
                                {activeScene?.name || 'Area'}
                            </span>
                            <h2 className="text-white font-black text-sm leading-tight">{destination.name}</h2>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pointer-events-auto items-end">
                        <div
                            className="relative flex items-center"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            {showVolumeSlider && (
                                <div className="absolute right-14 bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl h-12 flex items-center animate-in slide-in-from-right-2 duration-200">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => {
                                            const newVol = parseFloat(e.target.value);
                                            setVolume(newVol);
                                            if (newVol > 0) setIsMuted(false);
                                            else setIsMuted(true);
                                        }}
                                        className="w-24 accent-padang-green cursor-pointer"
                                    />
                                    <span className="text-[10px] font-black text-white ml-3 w-8">{Math.round(volume * 100)}%</span>
                                </div>
                            )}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="h-12 w-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
                            >
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                        <button
                            onClick={toggleVR}
                            className="h-12 w-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
                        >
                            <Smartphone size={20} />
                        </button>
                        {/* Shrunk Play/Pause Button - Repositioned Below VR */}
                        <button
                            onClick={togglePlay}
                            className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-all shadow-2xl active:scale-90 ${isPlaying ? 'bg-padang-green/50 text-white border-white/40' : 'bg-black/40 text-white border-white/20'}`}
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>
                    </div>
                </div>

                {/* Guided Panel - Bottom */}
                <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-4 pointer-events-none">
                    {/* Quick POI Navigation */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-2">
                        {scenes.map((scene: any, idx: number) => (
                            <button
                                key={scene.id || idx}
                                onClick={() => setActiveSceneIdx(idx)}
                                className={`px-6 py-3 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest border transition-all ${activeSceneIdx === idx ? 'bg-white text-padang-green border-white shadow-xl' : 'bg-black/30 text-white/70 border-white/10 backdrop-blur-md hover:bg-black/40'}`}
                            >
                                {scene.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Hotspot Popup (Simulated) */}
                {showInfoPanel && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 z-[110] animate-in fade-in duration-300">
                        <div className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl relative animate-in zoom-in duration-300">
                            <button
                                onClick={() => setShowInfoPanel(false)}
                                className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400"
                            >
                                <X size={20} />
                            </button>
                            <div className="h-16 w-16 rounded-3xl bg-padang-green/10 flex items-center justify-center text-padang-green mb-6">
                                <Info size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">{activeHotspot?.text || 'Informasi'}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                                {activeHotspot?.description || 'Tidak ada deskripsi tersedia.'}
                            </p>
                            <button
                                onClick={() => setShowInfoPanel(false)}
                                className="w-full bg-padang-green py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-padang-green/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* VR HUD simulation (if active) */}
            {isVRMode && (
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 z-[120] flex items-center justify-center">
                    <div className="h-px w-20 bg-white/20"></div>
                    <div className="h-20 w-px bg-white/20 absolute"></div>
                    <div className="absolute bottom-12 flex flex-col items-center gap-2">
                        <div className="px-4 py-1.5 rounded-full bg-padang-green/80 text-white text-[8px] font-black uppercase tracking-[4px]">VR MODE ACTIVE</div>
                        <p className="text-white/40 text-[8px] font-bold">Gerakkan perangkat untuk melihat sekitar</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualTourScreen;
