
import React from 'react';

interface YouTubePlayerProps {
    url: string;
    title?: string;
    className?: string;
    autoplay?: boolean;
    mute?: boolean;
    controls?: boolean;
    loop?: boolean;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
    url,
    title = 'YouTube video player',
    className = '',
    autoplay = false,
    mute = false,
    controls = true,
    loop = false
}) => {
    if (!url) return null;

    const getVideoId = (input: string) => {
        const trimmed = input.trim();

        // Handle short URLs (ID only)
        if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
            return trimmed;
        }

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = trimmed.match(regExp);

        if (match && match[2].length === 11) {
            return match[2];
        }

        // Catch-all for simple youtu.be/ID
        if (trimmed.includes('youtu.be/')) {
            const parts = trimmed.split('/');
            const id = parts[parts.length - 1].split('?')[0];
            if (id.length === 11) return id;
        }

        return null;
    };

    const videoId = getVideoId(url);

    if (!videoId) return null;

    const queryParams: Record<string, string> = {
        rel: '0',
        modestbranding: '1',
        autoplay: autoplay ? '1' : '0',
        mute: mute ? '1' : '0',
        controls: controls ? '1' : '0'
    };

    if (loop) {
        queryParams.loop = '1';
        queryParams.playlist = videoId;
    }

    const searchParams = new URLSearchParams(queryParams);

    return (
        <div className={`relative w-full aspect-video overflow-hidden bg-black ${className}`}>
            <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?${searchParams.toString()}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default YouTubePlayer;
