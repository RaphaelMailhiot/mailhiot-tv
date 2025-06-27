'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(videoRef.current);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = src;
            }
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            className="w-full max-w-3xl rounded shadow"
        />
    );
}
