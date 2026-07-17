"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Lock,
    FolderKanban,
    Users,
    Banknote,
    Clock,
    ChevronRight,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardWidget from "@/components/ui/dashboardWidget";
import StatusBadge from "@/components/ui/statusBadge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";

export default function ClientDashboard() {
    const router = useRouter();
    const { data: session } = useSession();

    const projects = useQuery(
        api.projects.getByClient,
        session?.user?.id ? { clientId: session.user.id as any } : "skip"
    );
    const notifications = useQuery(
        api.notifications.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );

    const activeProjects = projects?.filter((p) => p.status === "active") || [];
    const totalLocked = activeProjects.reduce((sum, p) => sum + p.budget, 0);

    const todayActions = [
        {
            icon: Clock,
            title: "Milestone menunggu approval",
            badge: { status: "warning" as const, label: "Menunggu" },
            action: "Review",
        },
        {
            icon: Banknote,
            title: "Deposit escrow untuk proyek baru",
            badge: { status: "neutral" as const, label: "Belum Deposit" },
            action: "Deposit Sekarang",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">
                        Selamat datang, {session?.user?.name?.split(" ")[0] || "Klien"}
                    </h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola proyek dan escrow Anda.
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/client/projects/new")}
                    className="bg-primary-900 hover:bg-primary-800 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Buat Proyek Baru
                </Button>
            </div>

            {/* Widget Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <DashboardWidget
                    title="Dana Terkunci"
                    value={`$ ${totalLocked.toLocaleString()}`}
                    subtitle={`di ${activeProjects.length} proyek`}
                    icon={Lock}
                    color="primary"
                />
                <DashboardWidget
                    title="Proyek Aktif"
                    value={activeProjects.length}
                    subtitle="2 menunggu approval"
                    icon={FolderKanban}
                    color="warning"
                    trend={{ value: 25, isPositive: true }}
                />
                <DashboardWidget
                    title="Talenta Bekerja"
                    value={activeProjects.filter((p) => p.talentId).length}
                    subtitle="0 terlambat"
                    icon={Users}
                    color="secondary"
                />
                <DashboardWidget
                    title="Total Dibelanjakan"
                    value="$ 52,100"
                    subtitle="sejak bergabung"
                    icon={Banknote}
                    color="secondary"
                    trend={{ value: 12, isPositive: true }}
                />
            </div>

            {/* Widget Row 2 */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Today's Actions */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Aksi Hari Ini</h2>
                    <div className="space-y-3">
                        {todayActions.map((action, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
                                onClick={() => router.push("/client/projects")}
                            >
                                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                    <action.icon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-sm text-primary-800 truncate">
                                        {action.title}
                                    </p>
                                </div>
                                <StatusBadge
                                    status={action.badge.status}
                                    label={action.badge.label}
                                />
                                <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Escrow Overview */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Escrow Overview</h2>
                    <div className="space-y-3">
                        {activeProjects.slice(0, 3).map((project) => (
                            <div
                                key={project._id}
                                className="p-4 rounded-lg border-l-4 border-l-secondary-500 bg-neutral-50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-body-sm font-semibold text-primary-800 truncate">
                                        {project.title}
                                    </p>
                                </div>
                                <p className="text-caption text-neutral-500 mb-2">
                                    {project.currency} {project.budget.toLocaleString()}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Lock className="w-3.5 h-3.5 text-secondary-600" />
                                    <span className="text-caption text-secondary-700">
                                        Dana terkunci
                                    </span>
                                </div>
                            </div>
                        ))}
                        {activeProjects.length === 0 && (
                            <p className="text-body-sm text-neutral-500 text-center py-4">
                                Belum ada proyek aktif
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Widget Row 3 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Aktivitas Terbaru</h2>
                    <div className="space-y-3">
                        {notifications?.slice(0, 4).map((notif) => (
                            <div
                                key={notif._id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? "bg-neutral-300" : "bg-secondary-500"
                                        }`}
                                ></div>
                                <div className="flex-1">
                                    <p className="text-body-sm text-primary-800">
                                        {notif.title}
                                    </p>
                                    <p className="text-caption text-neutral-500">
                                        {notif.message}
                                    </p>
                                </div>
                                <span className="text-caption text-neutral-400 flex-shrink-0">
                                    {new Date(notif.createdAt).toLocaleDateString("id-ID")}
                                </span>
                            </div>
                        ))}
                        {(!notifications || notifications.length === 0) && (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada aktivitas
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Statistik Cepat</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                            <span className="text-body-sm text-neutral-600">
                                Proyek Selesai
                            </span>
                            <span className="text-body-sm font-semibold text-primary-800">
                                {projects?.filter((p) => p.status === "completed").length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                            <span className="text-body-sm text-neutral-600">
                                Proyek Terbuka
                            </span>
                            <span className="text-body-sm font-semibold text-primary-800">
                                {projects?.filter((p) => p.status === "open").length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                            <span className="text-body-sm text-neutral-600">
                                Total Proyek
                            </span>
                            <span className="text-body-sm font-semibold text-primary-800">
                                {projects?.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}