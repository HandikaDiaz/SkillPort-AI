"use client";

import {
    AlertTriangle,
    Award,
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Mail,
    MessageSquare,
    Settings,
    Users,
    Wallet,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const clientNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/client" },
    { label: "Proyek", icon: FolderKanban, href: "/client/projects" },
    { label: "Keuangan", icon: Wallet, href: "/client/finance" },
    { label: "Talenta", icon: Users, href: "#" },
    { label: "Pesan", icon: MessageSquare, href: "/client/messages" },
    { label: "Pengaturan", icon: Settings, href: "/client/settings" },
];

const talentNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/talent" },
    { label: "Proyek", icon: FolderKanban, href: "/talent/projects" },
    { label: "Keuangan", icon: Wallet, href: "/talent/finance" },
    { label: "Credential", icon: Award, href: "/talent/credentials" },
    { label: "BYOC", icon: Mail, href: "/talent/byoc" },
    { label: "Pengaturan", icon: Settings, href: "/talent/settings" },
];

const sharedNavItems = [
    { label: "Sengketa", icon: AlertTriangle, href: "/disputes" },
    { label: "Bantuan", icon: HelpCircle, href: "/help" },
];

interface SidebarProps {
    role: "talent" | "client";
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = role === "client" ? clientNavItems : talentNavItems;

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <aside
            className={`fixed left-0 top-16 bottom-0 bg-white border-r border-neutral-200 z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"
                }`}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 py-4">
                    <nav className="space-y-1 px-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                        ? "bg-primary-900 text-white"
                                        : "text-primary-700 hover:bg-neutral-100"
                                        } ${collapsed ? "justify-center" : ""}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        className={`w-5 h-5 flex-shrink-0 ${isActive
                                            ? "text-white"
                                            : "text-primary-500 group-hover:text-primary-700"
                                            }`}
                                    />
                                    {!collapsed && (
                                        <span className="text-body-sm font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                    {isActive && !collapsed && (
                                        <div className="ml-auto w-1 h-5 bg-secondary-500 rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}

                        <div
                            className={`my-3 border-t border-neutral-200 ${collapsed ? "mx-2" : ""
                                }`}
                        ></div>

                        {sharedNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                        ? "bg-primary-900 text-white"
                                        : "text-primary-700 hover:bg-neutral-100"
                                        } ${collapsed ? "justify-center" : ""}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        className={`w-5 h-5 flex-shrink-0 ${isActive
                                            ? "text-white"
                                            : "text-primary-500 group-hover:text-primary-700"
                                            }`}
                                    />
                                    {!collapsed && (
                                        <span className="text-body-sm font-medium">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-2 border-t border-neutral-200">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center justify-center w-full p-2 rounded-lg text-primary-500 hover:bg-neutral-100 transition-colors"
                    >
                        {collapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error-light transition-colors w-full mt-1 ${collapsed ? "justify-center" : ""
                            }`}
                        title={collapsed ? "Keluar" : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                            <span className="text-body-sm font-medium">Keluar</span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}