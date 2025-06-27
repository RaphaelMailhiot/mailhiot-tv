import 'dotenv/config';
import { spawn } from 'child_process';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// CONFIG
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mp4Path = './input/film.mp4'; // fichier source
const videoId = `video-${Date.now()}`;
const outputDir = `./public/videos/${videoId}`;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log('🎞️  Conversion HLS en cours...');

const ffmpeg = spawn('ffmpeg', [
    '-i', mp4Path,
    '-c:v', 'copy',
    '-start_number', '0',
    '-hls_time', '10',
    '-hls_list_size', '0',
    '-f', 'hls',
    `${outputDir}/index.m3u8`
]);

ffmpeg.stderr.on('data', (data) => process.stdout.write(data.toString()));
ffmpeg.on('close', async (code) => {
    if (code === 0) {
        console.log('✅ Conversion terminée.');

        const { error } = await supabase.from('videos').insert({
            id: crypto.randomUUID(),
            title: 'Titre automatique',
            url: `/videos/${videoId}/index.m3u8`,
            description: 'Vidéo générée localement',
            created_at: new Date().toISOString()
        });

        if (error) {
            console.error('❌ Erreur insertion Supabase:', error);
        } else {
            console.log('✅ Vidéo ajoutée à Supabase 🎉');
        }
    } else {
        console.error('❌ FFmpeg a échoué avec le code', code);
    }
});
