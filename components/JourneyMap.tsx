import React, { useEffect, useRef } from 'react';
import { Footprint } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet (though we use raw Leaflet here, icons might still need fix)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.Icon.Default.prototype;
// @ts-ignore
delete DefaultIcon._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
});


interface JourneyMapProps {
    footprints: Footprint[];
}

const JourneyMap: React.FC<JourneyMapProps> = ({ footprints }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<L.Map | null>(null);

    useEffect(() => {
        // Log dimensions
        if (mapRef.current) {
            console.log('JourneyMap Container Dimensions:', mapRef.current.clientWidth, mapRef.current.clientHeight);
        }

        const initMap = () => {
            if (mapRef.current && !leafletRef.current) {
                // Double check height
                if (mapRef.current.clientHeight === 0) {
                    console.warn('Map container has 0 height, waiting...');
                    setTimeout(initMap, 100);
                    return;
                }

                console.log('Initializing Leaflet Map...');
                // Initialize map centered on Padang
                const map = L.map(mapRef.current, {
                    zoomControl: false,
                    preferCanvas: true
                }).setView([-0.9471, 100.4172], 13);
                leafletRef.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Add markers for each footprint
                const markers = footprints.map(fp => {
                    const popupContent = fp.destination?.name || fp.culinarySpot?.name || fp.event?.name || 'Kunjungan';

                    // Custom Marker Icon based on type
                    const color = fp.culinarySpotId ? '#ff4d4d' : '#008444';
                    const iconHtml = `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`;

                    const customIcon = L.divIcon({
                        html: iconHtml,
                        className: 'custom-div-icon',
                        iconSize: [12, 12],
                        iconAnchor: [6, 6]
                    });

                    return L.marker([fp.lat, fp.lng], { icon: customIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div style="font-family: 'Inter', sans-serif; padding: 4px;">
                                <p style="margin: 0; font-size: 10px; font-weight: 900; color: #999; text-transform: uppercase; letter-spacing: 1px;">Kunjungan</p>
                                <p style="margin: 2px 0; font-size: 13px; font-weight: 900; color: #333;">${popupContent}</p>
                                <p style="margin: 0; font-size: 10px; color: #666;">${new Date(fp.visitDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        `);
                });

                // Add polyline to connect the journey
                if (footprints.length > 1) {
                    const latLngs = footprints
                        .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
                        .map(fp => [fp.lat, fp.lng] as [number, number]);

                    L.polyline(latLngs, {
                        color: '#008444',
                        weight: 4,
                        opacity: 0.8,
                        dashArray: '8, 12',
                        lineJoin: 'round'
                    }).addTo(map);
                }

                if (markers.length > 0) {
                    const group = L.featureGroup(markers);
                    map.fitBounds(group.getBounds().pad(0.2));
                }

                // Force resize
                setTimeout(() => {
                    map.invalidateSize();
                    console.log('Map invalidated. Size:', map.getSize());
                }, 200);
            }
        };

        // Delay init to allow rendering
        const timeoutId = setTimeout(initMap, 100);

        // Add ResizeObserver
        let resizeObserver: ResizeObserver | null = null;
        if (mapRef.current) {
            resizeObserver = new ResizeObserver(() => {
                if (leafletRef.current) {
                    leafletRef.current.invalidateSize();
                }
            });
            resizeObserver.observe(mapRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (leafletRef.current) {
                leafletRef.current.remove(); // Cleanup map on unmount
                leafletRef.current = null;
            }
        };
    }, [footprints]);

    return (
        <div className="w-full h-full relative bg-slate-100 z-0 flex flex-col">
            <style>{`
                .leaflet-container {
                    height: 100% !important;
                    width: 100% !important;
                    min-height: 400px;
                }
            `}</style>
            <div ref={mapRef} className="flex-1 w-full h-full min-h-[400px]" />
            <div className="absolute top-5 right-5 z-[1000]">
                <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-padang-green shadow-2xl border border-white flex items-center gap-2">
                    <div className="h-2 w-2 bg-padang-green rounded-full animate-pulse"></div>
                    {footprints.length} {footprints.length === 1 ? 'Jejak' : 'Jejak'} Terdeteksi
                </div>
            </div>
        </div>
    );
};

export default JourneyMap;
