import 'dotenv/config';
import { spawn } from 'child_process';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Vérification des variables d'environnement
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes dans .env.local');
    process.exit(1);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mp4Filename = process.argv[2] || 'film.mp4';
const videoTitle = process.argv[3] || 'Titre automatique';
const videoDescription = process.argv[4] || 'Vidéo générée automatiquement';
const mp4Path = `./input/${mp4Filename}`;
const videoId = `video-${Date.now()}`;
const outputDir = `./public/videos/${videoId}`;

async function main() {
    if (!fs.existsSync(mp4Path)) {
        console.error(`❌ Fichier source introuvable : ${mp4Path}`);
        process.exit(1);
    }

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
                title: videoTitle,
                url: `/videos/${videoId}/index.m3u8`,
                description: videoDescription,
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
}

main();