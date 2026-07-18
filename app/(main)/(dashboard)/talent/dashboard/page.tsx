"use client";

import { Button } from "@/components/ui/button";
import DashboardWidget from "@/components/ui/dashboardWidget";
import StatusBadge from "@/components/ui/statusBadge";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Award,
    Banknote,
    ChevronRight,
    Clock,
    FolderKanban,
    Lock,
    Plus,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TalentDashboard() {
    const router = useRouter();
    const { data: session } = useSession();

    const activeProjects = useQuery(
        api.projects.getByTalentWithMilestones,
        session?.user?.id ? { talentId: session.user.id as any } : "skip"
    );
    const openProjects = useQuery(api.projects.getOpen);
    const notifications = useQuery(
        api.notifications.getRecentByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    const escrowBalance = useQuery(
        api.escrow.getBalanceByTalent,
        session?.user?.id ? { talentId: session.user.id as any } : "skip"
    );
    const credential = useQuery(
        api.credentials.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );

    const userName = session?.user?.name?.split(" ")[0] || "Talent";

    const urgentMilestones = activeProjects?.flatMap((project) =>
        project.milestones
            .filter((m) => m.status === "in_progress" || m.status === "submitted")
            .map((m) => ({
                title: m.title,
                project: project.title,
                deadline: Math.floor((m.deadline - Date.now()) / 86400000),
                status: m.status === "submitted" ? ("info" as const) : ("warning" as const),
                note: m.status === "submitted" ? "Menunggu Review Klien" : undefined,
            }))
    ).slice(0, 3) || [];

    if (!session) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin w-8 h-8 border-4 border-secondary-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">
                        Selamat datang, {userName}
                    </h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola proyek dan pendapatan Anda.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/talent/settings")}
                        className="border-neutral-300"
                    >
                        Edit Profil
                    </Button>
                    <Button
                        onClick={() => router.push("/talent/byoc")}
                        className="bg-secondary-500 hover:bg-secondary-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Undang Klien (BYOC)
                    </Button>
                </div>
            </div>

            {/* Widget Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <DashboardWidget
                    title="Pendapatan Bulan Ini"
                    value="IDR 0"
                    subtitle="$ 0"
                    icon={Banknote}
                    color="secondary"
                    trend={{ value: 0, isPositive: true }}
                />
                <DashboardWidget
                    title="Proyek Aktif"
                    value={activeProjects?.length || 0}
                    subtitle="1 deadline besok"
                    icon={FolderKanban}
                    color="warning"
                />
                <div
                    className="bg-secondary-50 rounded-xl border border-secondary-200 p-5 hover:-translate-y-0.5 hover:shadow-card-hover transition-all cursor-pointer"
                    onClick={() => router.push("/talent/credentials")}
                >
                    <div className="flex items-start justify-between mb-3">
                        <span className="text-body-sm font-medium text-secondary-700">
                            Global Readiness Score
                        </span>
                        <Award className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-data-lg text-secondary-700">
                            {credential?.globalScore ?? "—"}
                        </span>
                        <span className="text-h3 text-neutral-400">/100</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge
                            status={credential?.isVerified ? "success" : "neutral"}
                            label={credential?.isVerified ? "Verified" : "Unverified"}
                        />
                        {credential?.previousScore !== undefined && credential.globalScore !== undefined && (
                            <span className="text-caption text-secondary-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {credential.globalScore - credential.previousScore >= 0 ? "+" : ""}
                                {credential.globalScore - credential.previousScore}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Widget Row 2 */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Urgent Milestones */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Milestone Mendesak</h2>
                    <div className="space-y-3">
                        {urgentMilestones.length === 0 ? (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Tidak ada milestone mendesak
                            </p>
                        ) : (
                            urgentMilestones.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${m.status === "warning"
                                            ? "bg-warning-light"
                                            : "bg-info-light"
                                            }`}
                                    >
                                        {m.status === "warning" ? (
                                            <AlertTriangle className="w-5 h-5 text-warning" />
                                        ) : (
                                            <Clock className="w-5 h-5 text-info" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm font-medium text-primary-800">
                                            {m.title}
                                        </p>
                                        <p className="text-caption text-neutral-500">{m.project}</p>
                                    </div>
                                    {m.deadline > 0 && (
                                        <StatusBadge
                                            status="warning"
                                            label={`Deadline ${m.deadline} hari`}
                                        />
                                    )}
                                    {m.note && (
                                        <span className="text-caption text-neutral-500">{m.note}</span>
                                    )}
                                    {m.status === "warning" && (
                                        <Button
                                            size="sm"
                                            className="bg-secondary-500 hover:bg-secondary-600 text-white h-7 text-xs"
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Escrow Status */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Escrow Saya</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-success-light/50 border border-success/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Banknote className="w-5 h-5 text-success" />
                                <span className="text-body-sm font-medium text-primary-800">
                                    Dana Menunggu Pencairan
                                </span>
                            </div>
                            <p className="text-data text-success mb-1">
                                IDR {(escrowBalance?.available ?? 0).toLocaleString("id-ID")}
                            </p>
                            <p className="text-caption text-neutral-500 mb-3">
                                Estimasi cair: &lt;30 menit
                            </p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-success text-success hover:bg-success hover:text-white h-7 text-xs"
                                disabled
                            >
                                Cairkan ke Rekening
                            </Button>
                        </div>

                        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-5 h-5 text-primary-600" />
                                <span className="text-body-sm font-medium text-primary-800">
                                    Dana Terkunci
                                </span>
                            </div>
                            <p className="text-data text-primary-800 mb-1">
                                IDR {(escrowBalance?.locked ?? 0).toLocaleString("id-ID")}
                            </p>
                            <p className="text-caption text-neutral-500">
                                2 milestone menunggu submit
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Widget Row 3 */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Project Opportunities */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-h3 text-primary-900">Peluang Proyek</h2>
                        <button
                            onClick={() => router.push("/talent/projects")}
                            className="text-body-sm text-info hover:underline"
                        >
                            Lihat Semua
                        </button>
                    </div>
                    <div className="space-y-3">
                        {openProjects?.length === 0 ? (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada proyek tersedia
                            </p>
                        ) : (
                            openProjects?.map((project) => (
                                <div
                                    key={project._id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
                                    onClick={() => router.push("/talent/projects")}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-secondary-50 flex items-center justify-center flex-shrink-0">
                                        <FolderKanban className="w-5 h-5 text-secondary-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body-sm font-medium text-primary-800 truncate">
                                            {project.title}
                                        </p>
                                        <p className="text-caption text-neutral-500">
                                            {project.category} • {project.clientName}
                                        </p>
                                    </div>
                                    <span className="text-body-sm font-semibold text-secondary-700 flex-shrink-0">
                                        ${project.budget.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Aktivitas Terbaru</h2>
                    <div className="space-y-3">
                        {notifications?.length === 0 ? (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada aktivitas
                            </p>
                        ) : (
                            notifications?.map((notif) => (
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
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* BYOC Banner */}
            <div className="bg-primary-900 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-secondary-400" />
                    </div>
                    <div>
                        <h3 className="text-h4 text-white">
                            Sudah punya klien? Pindahkan ke SkillPort AI
                        </h3>
                        <p className="text-body-sm text-primary-300">
                            Hemat 90% fee platform dengan BYOC.
                        </p>
                    </div>
                </div>
                <Button
                    onClick={() => router.push("/talent/byoc")}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white flex-shrink-0"
                >
                    Pelajari BYOC <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}