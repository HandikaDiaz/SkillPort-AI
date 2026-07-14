"use client";

import { Button } from "@/components/ui/button";
import DashboardWidget from "@/components/ui/dashboardWidget";
import StatusBadge from "@/components/ui/statusBadge";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
    Banknote,
    ChevronRight,
    Clock,
    FolderKanban,
    Plus,
    Sparkles,
    Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TalentDashboard() {
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
    const openProjects = projects?.filter((p) => p.status === "open") || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">
                        Selamat datang, {session?.user?.name?.split(" ")[0] || "Klien"}
                    </h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola proyek dan talenta Anda.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/client/settings")}
                        className="border-neutral-300"
                    >
                        Edit Profil
                    </Button>
                    <Button
                        onClick={() => router.push("/client/projects/new")}
                        className="bg-secondary-500 hover:bg-secondary-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Buat Proyek Baru
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <DashboardWidget
                    title="Total Proyek"
                    value={projects?.length || 0}
                    subtitle={`${activeProjects.length} aktif`}
                    icon={FolderKanban}
                    color="primary"
                />
                <DashboardWidget
                    title="Talenta Aktif"
                    value={activeProjects.length}
                    subtitle="1 menunggu review"
                    icon={Users}
                    color="secondary"
                />
                <DashboardWidget
                    title="Dana di Escrow"
                    value="IDR 45,000,000"
                    subtitle="$ 2,850"
                    icon={Banknote}
                    color="warning"
                    trend={{ value: 8, isPositive: true }}
                />
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Proyek Aktif</h2>
                    <div className="space-y-3">
                        {activeProjects.map((project, i) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
                                onClick={() => router.push(`/client/projects/${project._id}`)}
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <FolderKanban className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-body-sm font-medium text-primary-800">
                                        {project.title}
                                    </p>
                                    <p className="text-caption text-neutral-500">
                                        {project.category} • {project.talentName || "Belum ada talenta"}
                                    </p>
                                </div>
                                <StatusBadge status="success" label="Aktif" />
                                <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </motion.div>
                        ))}
                        {activeProjects.length === 0 && (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada proyek aktif
                            </p>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Status Escrow</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-success-light/50 border border-success/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Banknote className="w-5 h-5 text-success" />
                                <span className="text-body-sm font-medium text-primary-800">
                                    Dana Terkunci
                                </span>
                            </div>
                            <p className="text-data text-success mb-1">USD 5,000</p>
                            <p className="text-caption text-neutral-500 mb-3">
                                {activeProjects.length} proyek aktif
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-5 h-5 text-primary-600" />
                                <span className="text-body-sm font-medium text-primary-800">
                                    Menunggu Deposit
                                </span>
                            </div>
                            <p className="text-data text-primary-800 mb-1">USD 2,500</p>
                            <p className="text-caption text-neutral-500">
                                {openProjects.length} proyek terbuka
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Notifikasi Terbaru</h2>
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
                                    <p className="text-body-sm text-primary-800">{notif.title}</p>
                                    <p className="text-caption text-neutral-500">{notif.message}</p>
                                </div>
                            </div>
                        ))}
                        {(!notifications || notifications.length === 0) && (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada notifikasi
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Aksi Cepat</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/client/projects/new")}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all text-left"
                        >
                            <div className="w-10 h-10 rounded-lg bg-secondary-50 flex items-center justify-center">
                                <Plus className="w-5 h-5 text-secondary-600" />
                            </div>
                            <div>
                                <p className="text-body-sm font-medium text-primary-800">
                                    Buat Proyek Baru
                                </p>
                                <p className="text-caption text-neutral-500">
                                    Posting kebutuhan proyek Anda
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
                        </button>
                        <button
                            onClick={() => router.push("/talent")}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all text-left"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-body-sm font-medium text-primary-800">
                                    Cari Talenta
                                </p>
                                <p className="text-caption text-neutral-500">
                                    Jelajahi talenta terbaik
                                </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-primary-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                        <h3 className="text-h4 text-white">
                            Sudah punya talenta? Pindahkan ke SkillPort AI
                        </h3>
                        <p className="text-body-sm text-primary-300">
                            Hemat 90% fee platform dengan BYOC.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push("/client/byoc")}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white flex-shrink-0"
                >
                    Pelajari BYOC <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}