'use client';
import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    // const { user, isLoggedIn } = useAuth();
    // const router = useRouter();

    // useEffect(() => {
    //     if (!isLoggedIn || !user) {
    //         router.push('/login');
    //     }
    // }, [isLoggedIn, user, router]);

    // if (!isLoggedIn || !user) return null;

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            <Sidebar role={user.role as 'talent' | 'client'} />
            <main className="pt-16 pl-64 transition-all duration-300">
                <div className="p-6 lg:p-8 max-w-[1440px]">
                    {children}
                </div>
            </main>
        </div>
    );
}