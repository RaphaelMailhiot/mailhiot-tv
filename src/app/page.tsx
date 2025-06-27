'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('videos').select('*');
      if (error) console.error('Erreur Supabase:', error);
      else setVideos(data);
    }

    fetchData();
  }, []);

  return (
      <main className="p-8">
        <h1 className="text-xl font-bold">MailhiotTV 🎥</h1>
        <ul>
          {videos.map((v) => (
              <li key={v.id}>{v.title}</li>
          ))}
        </ul>
      </main>
  );
}