import { ReactNode } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <ProtectedRoute>
            <Header />
            <main className="p-6">{children}</main>
        </ProtectedRoute>
    );
}