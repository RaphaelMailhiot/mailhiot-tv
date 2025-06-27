'use client';

import { useState } from 'react';

export default function DashboardPage() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Uploader une vidéo 🎬</h1>

            <input
                type="text"
                placeholder="Titre de la vidéo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2 w-full p-2 border rounded"
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2 w-full p-2 border rounded"
            />

            <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-4"
            />

            <button
                onClick={handleUpload}
                className="bg-green-700 text-white px-4 py-2 rounded"
            >
                Convertir et publier
            </button>

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
