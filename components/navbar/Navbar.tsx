"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

interface NavbarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function Navbar({ user }: NavbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50 px-4 lg:px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-900">SkillPort</span>
                <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
            </Link>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
                    <Search className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2">
                    <img
                        src={user?.image || "/default-avatar.png"}
                        alt={user?.name || "User"}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-primary-900 hidden sm:block">
                        {user?.name}
                    </span>
                </div>
            </div>
        </header>
    );
}