'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="w-full px-6 py-4 bg-green-950 text-white flex justify-between items-center">
            <h1 className="text-lg font-bold">📺 MailhiotTV</h1>
            <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
            >
                Se déconnecter
            </button>
        </header>
    );
}