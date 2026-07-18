"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBadge";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export default function ClientProjects() {
    const router = useRouter();
    const { data: session } = useSession();
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filters = [
        { id: "all", label: "Semua" },
        { id: "active", label: "Aktif" },
        { id: "open", label: "Terbuka" },
        { id: "completed", label: "Selesai" },
        { id: "disputed", label: "Sengketa" },
    ];

    // Fetch projects dari Convex
    const projects = useQuery(
        api.projects.getByClientWithFilter,
        session?.user?.id
            ? {
                clientId: session.user.id as any,
                status: filter !== "all" ? filter : undefined,
                search: search || undefined,
            }
            : "skip"
    );

    // const isLoading = projects === undefined;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return {
                    color: "success" as const,
                    label: "Aktif",
                    borderColor: "border-l-secondary-500",
                };
            case "open":
                return {
                    color: "success" as const,
                    label: "Terbuka",
                    borderColor: "border-l-neutral-300",
                };
            case "completed":
                return {
                    color: "success" as const,
                    label: "Selesai",
                    borderColor: "border-l-success",
                };
            case "disputed":
                return {
                    color: "error" as const,
                    label: "Sengketa",
                    borderColor: "border-l-error",
                };
            default:
                return {
                    color: "neutral" as const,
                    label: status,
                    borderColor: "border-l-neutral-300",
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">Manajemen Proyek</h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola semua proyek Anda.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-neutral-300">
                        <Plus className="w-4 h-4 mr-2" /> Impor Template
                    </Button>
                    <Button
                        className="bg-primary-900 hover:bg-primary-800 text-white"
                        onClick={() => router.push("/client/projects/new")}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Buat Proyek Baru
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${filter === f.id
                                ? "bg-primary-900 text-white"
                                : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 ml-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari proyek..."
                            className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="border-neutral-300">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {projects?.length === undefined ? (
                    <div className="col-span-3 text-center py-12 text-neutral-500">
                        Belum ada proyek.{" "}
                        <button
                            onClick={() => router.push("/client/projects/new")}
                            className="text-info hover:underline"
                        >
                            Buat proyek pertama
                        </button>
                    </div>
                ) : (
                    projects?.map((project) => {
                        const statusConfig = getStatusConfig(project.status);
                        // Fetch milestones untuk project ini
                        const milestones = useQuery(
                            api.milestones.getByProject,
                            { projectId: project._id }
                        );
                        const completedMilestones =
                            milestones?.filter((m) => m.status === "approved").length || 0;

                        return (
                            <div
                                key={project._id}
                                className={`bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:-translate-y-1 hover:shadow-card-hover transition-all cursor-pointer overflow-hidden ${statusConfig.borderColor} border-l-4`}
                                onClick={() => router.push(`/client/projects/${project._id}`)}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <StatusBadge
                                            status={statusConfig.color}
                                            label={statusConfig.label}
                                        />
                                        <button
                                            className="p-1 rounded hover:bg-neutral-100 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Open dropdown menu
                                            }}
                                        >
                                            <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                                        </button>
                                    </div>

                                    <h3 className="text-h4 text-primary-900 mb-2 line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="text-body-sm text-neutral-500 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-data text-primary-800">
                                            {formatCurrency(project.budget, project.currency)}
                                        </span>
                                    </div>

                                    {project.status === "active" && milestones && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-caption text-neutral-500">
                                                    Progress
                                                </span>
                                                <span className="text-caption text-neutral-500">
                                                    {completedMilestones}/{milestones.length}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary-500 rounded-full transition-all"
                                                    style={{
                                                        width: `${(completedMilestones / milestones.length) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                                        <div className="flex items-center gap-2">
                                            {project.talentAvatar ? (
                                                <img
                                                    src={project.talentAvatar}
                                                    alt={project.talentName}
                                                    className="w-7 h-7 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-neutral-200 flex items-center justify-center">
                                                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                                                </div>
                                            )}
                                            <span className="text-caption text-neutral-500">
                                                {project.talentName || "Belum ada talenta"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-caption text-neutral-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatRelativeTime(project.deadline)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}