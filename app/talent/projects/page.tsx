"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Send,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import StatusBadge from "@/components/ui/statusBadge";

export default function TalentProjects() {
    const router = useRouter();
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("available");

    const tabs = [
        { id: "available", label: "Proyek Tersedia" },
        { id: "mine", label: "Proyek Saya" },
        { id: "byoc", label: "BYOC Invites" },
    ];

    const availableProjects = useQuery(api.projects.getOpen);
    const myProjects = useQuery(
        api.projects.getByTalent,
        session?.user?.id ? { talentId: session.user.id as any } : "skip"
    );
    const byocInvites = useQuery(
        api.projects.getByocInvites,
        session?.user?.id ? { talentId: session.user.id as any } : "skip"
    );

    const isLoading = {
        available: availableProjects === undefined,
        mine: myProjects === undefined,
        byoc: byocInvites === undefined,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h1 text-primary-900">Proyek & Peluang</h1>
                <p className="text-body text-neutral-500 mt-1">
                    Temukan dan kelola proyek Anda.
                </p>
            </div>

            <div className="flex border-b border-neutral-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-body-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                            ? "border-secondary-500 text-secondary-700"
                            : "border-transparent text-neutral-500 hover:text-primary-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "available" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {isLoading.available ? (
                        <div className="col-span-2 text-center py-12 text-neutral-500">
                            Memuat proyek...
                        </div>
                    ) : availableProjects?.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-neutral-500">
                            Belum ada proyek tersedia
                        </div>
                    ) : (
                        availableProjects?.map((project) => (
                            <div
                                key={project._id}
                                className="bg-white rounded-xl border border-neutral-200 hover:border-secondary-300 hover:-translate-y-1 hover:shadow-card-hover transition-all p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <StatusBadge status="success" label="Terbuka" />
                                    <span className="text-caption text-neutral-400">
                                        {Math.floor((project.deadline - Date.now()) / 86400000)} hari lagi
                                    </span>
                                </div>

                                <h3 className="text-h4 text-primary-900 mb-2">{project.title}</h3>
                                <p className="text-body-sm text-neutral-500 mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary-50 text-secondary-700 text-caption font-medium">
                                        <Sparkles className="w-3 h-3" />
                                        85% cocok
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                    <span className="text-data text-primary-800">
                                        {formatCurrency(project.budget, project.currency)}
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-secondary-500 hover:bg-secondary-600 text-white"
                                    >
                                        Ajukan Proposal
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "mine" && (
                <div className="space-y-4">
                    {isLoading.mine ? (
                        <div className="text-center py-12 text-neutral-500">
                            Memuat proyek...
                        </div>
                    ) : myProjects?.length === 0 ? (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada proyek yang Anda ambil
                        </div>
                    ) : (
                        myProjects?.map((project) => {
                            const milestones = useQuery(
                                api.milestones.getByProject,
                                { projectId: project._id }
                            );

                            const completedMilestones =
                                milestones?.filter((m) => m.status === "approved").length || 0;
                            const isCompleted = project.status === "completed";

                            return (
                                <div
                                    key={project._id}
                                    className={`bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-all p-5 ${isCompleted
                                        ? "bg-success-light/30"
                                        : "border-l-4 border-l-secondary-500"
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <StatusBadge
                                                    status={
                                                        isCompleted
                                                            ? "success"
                                                            : project.status === "active"
                                                                ? "success"
                                                                : "warning"
                                                    }
                                                    label={
                                                        isCompleted
                                                            ? "Selesai"
                                                            : project.status === "active"
                                                                ? "Aktif"
                                                                : "Menunggu"
                                                    }
                                                />
                                                <span className="text-caption text-neutral-500">
                                                    {project.clientName}
                                                </span>
                                            </div>
                                            <h3 className="text-h4 text-primary-900 mb-1">
                                                {project.title}
                                            </h3>
                                            <p className="text-body-sm text-neutral-500">
                                                {formatCurrency(project.budget, project.currency)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {!isCompleted && milestones && (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {milestones.map((m, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-2.5 h-2.5 rounded-full ${m.status === "approved"
                                                                    ? "bg-secondary-500"
                                                                    : m.status === "submitted"
                                                                        ? "bg-warning"
                                                                        : m.status === "in_progress"
                                                                            ? "bg-info"
                                                                            : "bg-neutral-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-caption text-neutral-500">
                                                        {completedMilestones}/{milestones.length}
                                                    </span>
                                                </div>
                                            )}

                                            {project.status === "active" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-secondary-500 text-secondary-700 hover:bg-secondary-50"
                                                >
                                                    <Send className="w-3.5 h-3.5 mr-1" /> Submit
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    router.push(`/talent/projects/${project._id}`)
                                                }
                                            >
                                                Detail <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* BYOC Invites */}
            {activeTab === "byoc" && (
                <div className="space-y-6">
                    <div className="bg-primary-900 rounded-xl p-6">
                        <h2 className="text-h3 text-white mb-2">
                            BYOC: Undang Klien Anda Sendiri
                        </h2>
                        <p className="text-body-sm text-primary-300 mb-4">
                            Biaya hanya 1.25% — hemat hingga 90% fee platform.
                        </p>
                        <Button
                            onClick={() => router.push("/talent/byoc")}
                            className="bg-secondary-500 hover:bg-secondary-600 text-white"
                        >
                            Undang Klien Baru
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 p-6">
                        <h3 className="text-h4 text-primary-900 mb-4">Riwayat BYOC</h3>
                        {isLoading.byoc ? (
                            <div className="text-center py-8 text-neutral-500">
                                Memuat...
                            </div>
                        ) : byocInvites?.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500">
                                Belum ada BYOC invite
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {byocInvites?.map((invite) => (
                                    <div
                                        key={invite._id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div>
                                            <p className="text-body-sm font-medium text-primary-800">
                                                {invite.title}
                                            </p>
                                            <p className="text-caption text-neutral-500">
                                                {invite.clientName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <StatusBadge
                                                status={
                                                    invite.status === "active" ? "success" : "neutral"
                                                }
                                                label={
                                                    invite.status === "active" ? "Aktif" : "Selesai"
                                                }
                                            />
                                            <span className="text-caption text-neutral-400">
                                                {new Date(invite.createdAt).toLocaleDateString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}