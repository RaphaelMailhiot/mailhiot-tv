'use client';

import {useEffect, useState} from 'react';
import {supabase} from '@/lib/supabase';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
    const [videos, setVideos] = useState<{ id: number; title: string; url: string; description: string }[]>([]);

    useEffect(() => {
        async function fetchData() {
            const {data, error} = await supabase.from('videos').select('*');
            if (error) console.error('Erreur Supabase:', error);
            else setVideos(data);
        }

        fetchData();
    }, []);

    return (
        <main className="p-8">
            <h1 className="text-xl font-bold">MailhiotTV 🎥</h1>
            <div>
                {videos.map((v) => (
                    <div key={v.id}>
                        {v.title}
                        <VideoPlayer src={v.url}/>
                        {v.description}
                    </div>
                ))}
            </div>
        </main>
    );
}