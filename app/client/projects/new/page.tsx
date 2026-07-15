"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneInput {
    title: string;
    description: string;
    amount: number;
    deadline: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const createProject = useMutation(api.projects.create);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("ui_ux");
    const [budget, setBudget] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [deadline, setDeadline] = useState("");
    const [milestones, setMilestones] = useState<MilestoneInput[]>([
        { title: "", description: "", amount: 0, deadline: "" },
    ]);

    const addMilestone = () => {
        setMilestones([...milestones, { title: "", description: "", amount: 0, deadline: "" }]);
    };

    const removeMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
        const updated = [...milestones];
        updated[index] = { ...updated[index], [field]: value };
        setMilestones(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        try {
            const projectId = await createProject({
                title,
                description,
                category,
                budget: parseInt(budget),
                currency,
                clientId: session.user.id as any,
                clientName: session.user.name || "Anonymous",
                clientAvatar: session.user.image || undefined,
                deadline: new Date(deadline).getTime(),
                milestones: milestones.map((m) => ({
                    ...m,
                    amount: parseInt(m.amount as any),
                    deadline: new Date(m.deadline).getTime(),
                })),
            });

            router.push(`/client/projects/${projectId}`);
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Gagal membuat proyek");
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-neutral-500 hover:text-primary-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <h1 className="text-h1 text-primary-900 mb-2">Buat Proyek Baru</h1>
            <p className="text-body text-neutral-500 mb-8">
                Isi detail proyek Anda untuk menemukan talenta terbaik.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <h2 className="text-h4 text-primary-900">Informasi Dasar</h2>

                    <div>
                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                            Judul Proyek
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                            placeholder="Contoh: Website Redesign untuk Startup"
                        />
                    </div>

                    <div>
                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                            Deskripsi
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                            placeholder="Jelaskan kebutuhan proyek Anda..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Kategori
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                            >
                                <option value="ui_ux">UI/UX Design</option>
                                <option value="motion">Motion Graphics</option>
                                <option value="3d">3D Visualization</option>
                                <option value="branding">Branding</option>
                                <option value="web">Web Development</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Deadline
                            </label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Budget
                            </label>
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                required
                                min="100"
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                placeholder="5000"
                            />
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Mata Uang
                            </label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                            >
                                <option value="USD">USD</option>
                                <option value="IDR">IDR</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-h4 text-primary-900">Milestone</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addMilestone}
                            className="border-neutral-300"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Tambah
                        </Button>
                    </div>

                    {milestones.map((milestone, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg border border-neutral-200 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-body-sm font-medium text-neutral-500">
                                    Milestone {index + 1}
                                </span>
                                {milestones.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMilestone(index)}
                                        className="p-1 rounded hover:bg-error-light text-error"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={milestone.title}
                                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                                    required
                                    placeholder="Judul milestone"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                />
                            </div>

                            <div>
                                <textarea
                                    value={milestone.description}
                                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                                    required
                                    rows={2}
                                    placeholder="Deskripsi deliverable"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    value={milestone.amount}
                                    onChange={(e) => updateMilestone(index, "amount", parseInt(e.target.value) || 0)}
                                    required
                                    min="0"
                                    placeholder="Jumlah (USD)"
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                />
                                <input
                                    type="date"
                                    value={milestone.deadline}
                                    onChange={(e) => updateMilestone(index, "deadline", e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-neutral-300"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        className="bg-primary-900 hover:bg-primary-800 text-white"
                    >
                        Buat Proyek
                    </Button>
                </div>
            </form>
        </div>
    );
}