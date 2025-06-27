import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
        }
    }, [src]);

    return <video ref={videoRef} controls className="w-full" />;
}