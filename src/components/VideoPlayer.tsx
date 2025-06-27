import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls();
            hls.loadSource('/videos/ma-video.m3u8');
            hls.attachMedia(videoRef.current);
        }
    }, []);

    return <video ref={videoRef} controls className="w-full" />;
}
