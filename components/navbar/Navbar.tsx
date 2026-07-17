"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

interface NavbarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: "client" | "talent" | null;
    };
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();

    const dashboardHref = user?.role === "client" 
        ? "/client/dashboard" 
        : user?.role === "talent" 
        ? "/talent/dashboard" 
        : "/login";

    const navItems = [
        { label: "Marketplace", href: "/home" },
        { label: "Dashboard", href: dashboardHref },
        { label: "Messages", href: user ? "/messages" : "/login" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50 px-4 lg:px-6 flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-900">SkillPort</span>
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-500"></span>
            </Link>

            <nav className="flex items-center gap-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`text-body-sm font-medium transition-colors ${
                                isActive 
                                    ? "text-primary-900 font-semibold border-b-2 border-secondary-500 pb-1"
                                    : "text-neutral-500 hover:text-primary-900"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
                    <Search className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full"></span>
                </button>
                {user ? (
                    <div className="flex items-center gap-2">
                        <img
                            src={user.image || "/default-avatar.png"}
                            alt={user.name || "User"}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-primary-900 hidden sm:block">
                            {user.name}
                        </span>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="text-body-sm font-semibold text-primary-900 hover:text-secondary-600 transition-colors"
                    >
                        Masuk
                    </Link>
                )}
            </div>
        </header>
    );
}