import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Arguments du script
const [,, filename, titleArg, descriptionArg] = process.argv;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mp4Path = path.join('./input', filename); // fichier source
const videoId = `video-${Date.now()}`;
const outputDir = path.join('./public/videos', videoId);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log('🎞️  Conversion HLS en cours...');

const ffmpeg = spawn('ffmpeg', [
    '-i', mp4Path,
    '-codec:', 'copy',
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
            title: titleArg || 'Titre automatique',
            url: `/videos/${videoId}/index.m3u8`,
            description: descriptionArg || 'Vidéo générée localement',
            created_at: new Date().toISOString()
        });

        if (error) {
            console.error('❌ Erreur insertion Supabase:', error);
        } else {
            console.log('✅ Vidéo ajoutée à Supabase 🎉');

            // 💥 Supprime le fichier source MP4
            fs.unlink(mp4Path, (err) => {
                if (err) {
                    console.error('⚠️ Erreur lors de la suppression du fichier source:', err);
                } else {
                    console.log('🧹 Fichier source supprimé avec succès.');
                }
            });
        }
    } else {
        console.error('❌ FFmpeg a échoué avec le code', code);
    }
});