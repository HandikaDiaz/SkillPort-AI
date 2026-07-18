"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";

interface NavbarProps {
    user?: {
        id?: string | null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: "client" | "talent" | null;
    };
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const dashboardHref =
        user?.role === "client"
            ? "/client/dashboard"
            : user?.role === "talent"
            ? "/talent/dashboard"
            : "/login";

    const navItems = [
        { label: "Marketplace", href: "/home" },
        { label: "Dashboard", href: dashboardHref },
        { label: "Messages", href: user ? "/messages" : "/login" },
    ];

    // Fetch notifikasi terbaru jika user sudah login
    const notifications = useQuery(
        api.notifications.getRecentByUser,
        user?.id ? { userId: user.id as any } : "skip"
    );
    const unreadCount = useQuery(
        api.notifications.getUnreadCount,
        user?.id ? { userId: user.id as any } : "skip"
    );
    const markAllRead = useMutation(api.notifications.markAllRead);
    const markAsRead = useMutation(api.notifications.markAsRead);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotif(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        if (!user?.id) return;
        await markAllRead({ userId: user.id as any });
    };

    const handleNotifClick = async (notifId: string) => {
        await markAsRead({ notificationId: notifId as any });
    };

    const typeIcon: Record<string, string> = {
        payment: "💰",
        milestone: "🏆",
        deadline: "⏰",
        byoc: "🤝",
        system: "🔔",
        dispute: "⚠️",
        credential: "🎖️",
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-50 px-4 lg:px-6 flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary-900">SkillPort</span>
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-500"></span>
            </Link>

            <nav className="flex items-center gap-6">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/home" && pathname.startsWith(item.href));
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

                {/* Bell Notification */}
                <div className="relative" ref={notifRef}>
                    <button
                        id="navbar-bell-btn"
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 relative"
                        onClick={() => setShowNotif((v) => !v)}
                    >
                        <Bell className="w-5 h-5" />
                        {(unreadCount ?? 0) > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-500 rounded-full" />
                        )}
                    </button>

                    {showNotif && (
                        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-neutral-200 shadow-lg z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                                <span className="text-body-sm font-semibold text-primary-900">Notifikasi</span>
                                <div className="flex items-center gap-2">
                                    {(unreadCount ?? 0) > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            className="text-caption text-info hover:underline"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowNotif(false)}
                                        className="p-1 rounded hover:bg-neutral-100"
                                    >
                                        <X className="w-3.5 h-3.5 text-neutral-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-72 overflow-y-auto">
                                {!notifications || notifications.length === 0 ? (
                                    <div className="py-8 text-center text-body-sm text-neutral-400">
                                        Tidak ada notifikasi
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <button
                                            key={notif._id}
                                            className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-0 ${
                                                !notif.isRead ? "bg-secondary-50/40" : ""
                                            }`}
                                            onClick={() => handleNotifClick(notif._id)}
                                        >
                                            <span className="text-lg flex-shrink-0 mt-0.5">
                                                {typeIcon[notif.type] || "🔔"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-body-sm font-medium text-primary-800 truncate">
                                                    {notif.title}
                                                </p>
                                                <p className="text-caption text-neutral-500 truncate">
                                                    {notif.message}
                                                </p>
                                            </div>
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-secondary-500 flex-shrink-0 mt-1.5" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

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