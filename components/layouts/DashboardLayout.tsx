'use client';
import { type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../navbar/Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { data: session } = useSession();
    const role = session?.user?.role || 'client';

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar user={session?.user} />
            <Sidebar role={role as 'talent' | 'client'} />
            <main className="pt-16 pl-64 transition-all duration-300">
                <div className="p-6 lg:p-8 max-w-[1440px]">
                    {children}
                </div>
            </main>
        </div>
    );
}