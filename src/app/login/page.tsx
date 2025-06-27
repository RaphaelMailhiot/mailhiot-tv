'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setError('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError('Email ou mot de passe incorrect.');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="p-10 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Connexion administrateur</h1>

            <input
                type="email"
                placeholder="Adresse courriel"
                className="w-full mb-4 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mot de passe"
                className="w-full mb-4 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleLogin}
                className="w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
                Se connecter
            </button>

            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
}
