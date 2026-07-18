"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Banknote,
    Lock,
    FolderKanban,
    TrendingUp,
    Clock,
    CheckCircle,
    ArrowRight,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardWidget from "@/components/ui/dashboardWidget";
import StatusBadge from "@/components/ui/statusBadge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ClientFinance() {
    const router = useRouter();
    const { data: session } = useSession();

    // Data keuangan klien: wallet saldo escrow & riwayat transaksi
    const wallet = useQuery(
        api.wallets.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    const transactions = useQuery(
        api.transactions.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
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

    const statusConfig: Record<string, { status: "success" | "warning" | "neutral" | "info" | "error"; label: string }> = {
        success: { status: "success", label: "Berhasil" },
        processing: { status: "info", label: "Diproses" },
        pending: { status: "warning", label: "Menunggu" },
        failed: { status: "error", label: "Gagal" },
    };

    const typeLabel: Record<string, string> = {
        withdrawal: "Penarikan",
        escrow_in: "Deposit Escrow",
        escrow_release: "Pelepasan Escrow",
        refund: "Refund",
        fee: "Biaya Platform",
        bonus: "Bonus",
    };

    const isLoading = wallet === undefined || transactions === undefined;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">Keuangan & Escrow</h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola escrow, transaksi, dan rekening bank Anda.
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
                    title="Dana Terkunci (Escrow)"
                    value={`IDR ${totalLocked.toLocaleString("id-ID")}`}
                    subtitle={`di ${activeProjects.length} proyek aktif`}
                    icon={Lock}
                    color="primary"
                />
                <DashboardWidget
                    title="Saldo Wallet"
                    value={`IDR ${(wallet?.balance ?? 0).toLocaleString("id-ID")}`}
                    subtitle={`≈ USD ${(wallet?.balanceUsd ?? 0).toLocaleString("en-US")}`}
                    icon={Banknote}
                    color="secondary"
                />
                <DashboardWidget
                    title="Total Dibelanjakan"
                    value={`IDR ${(wallet?.totalEarned ?? 0).toLocaleString("id-ID")}`}
                    subtitle="sejak bergabung"
                    icon={TrendingUp}
                    color="secondary"
                    trend={{ value: 12, isPositive: true }}
                />
                <DashboardWidget
                    title="Proyek Aktif"
                    value={activeProjects.length}
                    subtitle="escrow berjalan"
                    icon={FolderKanban}
                    color="warning"
                />
            </div>

            {/* Widget Row 2 */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Riwayat Transaksi */}
                <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-h3 text-primary-900">Riwayat Transaksi</h2>
                    </div>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-14 bg-neutral-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : !transactions || transactions.length === 0 ? (
                        <p className="text-body-sm text-neutral-500 text-center py-8">
                            Belum ada transaksi
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((tx, i) => {
                                const cfg = statusConfig[tx.status] ?? { status: "neutral" as const, label: tx.status };
                                return (
                                    <motion.div
                                        key={tx._id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                            {tx.type === "withdrawal" ? (
                                                <ArrowRight className="w-4 h-4 text-primary-600 rotate-180" />
                                            ) : tx.type === "escrow_release" ? (
                                                <CheckCircle className="w-4 h-4 text-success" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-neutral-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body-sm font-medium text-primary-800 truncate">
                                                {typeLabel[tx.type] || tx.type}
                                            </p>
                                            <p className="text-caption text-neutral-400">
                                                {tx.projectName || "—"} · {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-body-sm font-semibold text-primary-800">
                                                {tx.currency} {tx.amount.toLocaleString("id-ID")}
                                            </p>
                                            <StatusBadge status={cfg.status} label={cfg.label} />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Proyek Escrow Aktif */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-6">
                    <h2 className="text-h3 text-primary-900 mb-4">Escrow Aktif</h2>
                    <div className="space-y-3">
                        {activeProjects.length === 0 ? (
                            <p className="text-body-sm text-neutral-500 text-center py-8">
                                Belum ada proyek aktif
                            </p>
                        ) : (
                            activeProjects.slice(0, 4).map((project) => (
                                <div
                                    key={project._id}
                                    className="p-4 rounded-lg border-l-4 border-l-secondary-500 bg-neutral-50 cursor-pointer hover:bg-secondary-50 transition-colors"
                                    onClick={() => router.push("/client/projects")}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-body-sm font-semibold text-primary-800 truncate">
                                            {project.title}
                                        </p>
                                    </div>
                                    <p className="text-caption text-neutral-500">
                                        {project.currency} {project.budget.toLocaleString("id-ID")}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-secondary-600" />
                                        <span className="text-caption text-secondary-700">
                                            Dana terkunci · {project.escrowStatus}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        {activeProjects.length > 0 && (
                            <button
                                onClick={() => router.push("/client/projects")}
                                className="w-full text-body-sm text-info hover:underline pt-1 text-center"
                            >
                                Lihat semua proyek →
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-4">Notifikasi Keuangan Terbaru</h2>
                <div className="space-y-2">
                    {notifications?.filter((n) => n.type === "payment").slice(0, 5).map((notif) => (
                        <div
                            key={notif._id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                        >
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? "bg-neutral-300" : "bg-secondary-500"}`} />
                            <div className="flex-1">
                                <p className="text-body-sm text-primary-800">{notif.title}</p>
                                <p className="text-caption text-neutral-500">{notif.message}</p>
                            </div>
                            <span className="text-caption text-neutral-400 flex-shrink-0">
                                {new Date(notif.createdAt).toLocaleDateString("id-ID")}
                            </span>
                        </div>
                    ))}
                    {(!notifications || notifications.filter((n) => n.type === "payment").length === 0) && (
                        <p className="text-body-sm text-neutral-500 text-center py-6">
                            Belum ada notifikasi keuangan
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}