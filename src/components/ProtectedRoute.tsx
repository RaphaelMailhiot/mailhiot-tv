'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.push('/login');
      else setLoading(false);
    };
    checkSession();
  }, [router]); // Ajout de router ici

  if (loading) return <div className="p-6">Chargement...</div>;

  return <>{children}</>;
}