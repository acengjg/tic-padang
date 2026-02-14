import React, { useState, useEffect } from 'react';
import { getProxiedImageUrl } from '../client';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt, fallbackSrc, className, ...props }) => {
    const [imgSrc, setImgSrc] = useState<string>('');
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (src) {
            setImgSrc(getProxiedImageUrl(src));
            setHasError(false);
        }
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc || `https://api.dicebear.com/7.x/initials/svg?seed=${alt}`);
        }
    };

    return (
        <img
            src={imgSrc || `https://api.dicebear.com/7.x/initials/svg?seed=${alt}`}
            alt={alt}
            className={className}
            onError={handleError}
            {...props}
        />
    );
};
