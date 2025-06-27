export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdirSync, existsSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const title = formData.get('title')?.toString() || 'Titre par défaut';
    const description = formData.get('description')?.toString() || '';
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ message: 'Aucun fichier reçu' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const filename = `${timestamp}-${originalName}`;

    const inputDir = path.join(process.cwd(), 'input');
    if (!existsSync(inputDir)) mkdirSync(inputDir);

    const filepath = path.join(inputDir, filename);
    writeFile(filepath, buffer, (err) => {
        if (err) throw err;
    });

    // Attendre la fin du script Node.js
    await new Promise<void>((resolve, reject) => {
        const convert = spawn('node', ['scripts/convert-and-upload.js', filename, title, description], {
            stdio: 'inherit',
        });

        convert.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Erreur de conversion (code ${code})`));
            }
        });
    });

    return NextResponse.json({ message: '✅ Vidéo reçue et conversion lancée' });
}