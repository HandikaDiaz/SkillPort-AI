"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Mail,
    Banknote,
    CheckCircle,
    Send,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    TrendingDown,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBadge";

const FAQS = [
    {
        q: "Apakah klien saya harus memahami kripto?",
        a: "Tidak. Mereka hanya melihat transfer bank biasa. Semua teknologi blockchain berjalan di belakang layar.",
    },
    {
        q: "Berapa biaya untuk klien?",
        a: "Gratis. Fee 1.25% dari sisi talenta.",
    },
    {
        q: "Apakah ini aman?",
        a: "Sangat aman. Dana terkunci dan hanya cair setelah approve.",
    },
];

export default function TalentBYOC() {
    const { data: session } = useSession();
    const userId = session?.user?.id as any;

    const invites = useQuery(
        api.byocInvites.getByTalent,
        userId ? { talentId: userId } : "skip"
    );
    const createInvite = useMutation(api.byocInvites.create);

    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        projectName: "",
        budget: "",
        milestoneCount: "3",
        message: "",
    });
    const [sent, setSent] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const budgetNum = parseFloat(formData.budget) || 5000;
    const otherFee = budgetNum * 0.2;
    const ourFee = budgetNum * 0.0125;
    const savings = otherFee - ourFee;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        if (!formData.clientName || !formData.clientEmail || !formData.projectName || !formData.budget) {
            setSubmitError("Semua field wajib diisi");
            return;
        }

        setIsSubmitting(true);

        try {
            await createInvite({
                talentId: userId,
                clientName: formData.clientName,
                clientEmail: formData.clientEmail,
                projectName: formData.projectName,
                budget: parseFloat(formData.budget),
                currency: "USD",
                milestoneCount: parseInt(formData.milestoneCount),
                message: formData.message || undefined,
            });

            setSent(true);
            setFormData({
                clientName: "",
                clientEmail: "",
                projectName: "",
                budget: "",
                milestoneCount: "3",
                message: "",
            });

            setTimeout(() => setSent(false), 3000);
        } catch (error) {
            setSubmitError("Gagal mengirim undangan");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-h1 text-primary-900">Bawa Klien Anda Sendiri (BYOC)</h1>
                <p className="text-body text-neutral-500 mt-1">
                    Undang klien pribadi Anda ke platform escrow kami.
                </p>
            </div>

            {/* Savings Calculator */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-6">Kalkulator Penghematan</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-xl bg-error-light/50 border border-error/20">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-body-sm text-neutral-500">Platform Lain</span>
                            <span className="text-caption text-error font-medium">Fee 20%</span>
                        </div>
                        <p className="text-h3 text-primary-900 mb-1">
                            Proyek {formData.budget ? `$${parseInt(formData.budget).toLocaleString()}` : "$5,000"}
                        </p>
                        <p className="text-h2 text-error font-bold line-through">
                            ${(budgetNum - otherFee).toLocaleString()}
                        </p>
                        <p className="text-caption text-error mt-1">
                            Anda kehilangan ${otherFee.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-5 rounded-xl bg-secondary-50 border border-secondary-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-body-sm text-neutral-500">SkillPort AI</span>
                            <span className="text-caption text-secondary-700 font-medium">Fee 1.25%</span>
                        </div>
                        <p className="text-h3 text-primary-900 mb-1">
                            Proyek {formData.budget ? `$${parseInt(formData.budget).toLocaleString()}` : "$5,000"}
                        </p>
                        <p className="text-h2 text-secondary-700 font-bold">
                            ${(budgetNum - ourFee).toLocaleString()}
                        </p>
                        <p className="text-caption text-secondary-600 mt-1">
                            Anda hemat ${savings.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg bg-secondary-500/10">
                    <TrendingDown className="w-5 h-5 text-secondary-600" />
                    <span className="text-body-sm font-semibold text-secondary-700">
                        Anda hemat: ${savings.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* How BYOC Works */}
            <div className="grid md:grid-cols-3 gap-5">
                {[
                    {
                        icon: Mail,
                        title: "Anda Undang",
                        desc: "Input email klien. Kami kirim undangan branded.",
                        step: 1,
                    },
                    {
                        icon: Banknote,
                        title: "Klien Deposit",
                        desc: "Klien bayar via transfer bank. Dana terkunci di escrow.",
                        step: 2,
                    },
                    {
                        icon: CheckCircle,
                        title: "Anda Kerja & Cair",
                        desc: "Submit deliverable. Klien approve. Dana cair.",
                        step: 3,
                    },
                ].map((item) => (
                    <div
                        key={item.step}
                        className="bg-white rounded-xl border border-neutral-200 p-5 text-center hover:-translate-y-1 hover:shadow-card transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-7 h-7 text-secondary-600" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-900 text-white flex items-center justify-center text-body-sm font-bold mx-auto mb-3">
                            {item.step}
                        </div>
                        <h3 className="text-h4 text-primary-900 mb-2">{item.title}</h3>
                        <p className="text-body-sm text-neutral-500">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Invite Form */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-6">Kirim Undangan ke Klien</h2>

                {sent ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="text-h3 text-primary-900 mb-2">Undangan Terkirim!</h3>
                        <p className="text-body-sm text-neutral-500">
                            Klien akan menerima email undangan dalam beberapa menit.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                        {submitError && (
                            <div className="p-3 rounded-lg bg-error-light border border-error/20 text-error text-body-sm">
                                {submitError}
                            </div>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                    Nama Klien
                                </label>
                                <input
                                    type="text"
                                    value={formData.clientName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, clientName: e.target.value })
                                    }
                                    placeholder="John Smith"
                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                    Email Klien
                                </label>
                                <input
                                    type="email"
                                    value={formData.clientEmail}
                                    onChange={(e) =>
                                        setFormData({ ...formData, clientEmail: e.target.value })
                                    }
                                    placeholder="john@company.com"
                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Nama Proyek
                            </label>
                            <input
                                type="text"
                                value={formData.projectName}
                                onChange={(e) =>
                                    setFormData({ ...formData, projectName: e.target.value })
                                }
                                placeholder="Website Redesign"
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                required
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                    Budget Total (USD)
                                </label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) =>
                                        setFormData({ ...formData, budget: e.target.value })
                                    }
                                    placeholder="5000"
                                    min="100"
                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                    Jumlah Milestone
                                </label>
                                <select
                                    value={formData.milestoneCount}
                                    onChange={(e) =>
                                        setFormData({ ...formData, milestoneCount: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info bg-white"
                                >
                                    {[2, 3, 4, 5].map((n) => (
                                        <option key={n} value={n}>
                                            {n} Milestone
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Pesan Personal (Opsional)
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }
                                placeholder="Halo, saya ingin mengajak Anda menggunakan platform escrow SkillPort AI untuk proyek kita..."
                                rows={3}
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-info-light border border-info/20">
                            <HelpCircle className="w-4 h-4 text-info flex-shrink-0" />
                            <p className="text-caption text-info">
                                Klien tidak perlu memahami kripto. Pengalaman identik dengan
                                transfer bank.
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-3"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Send className="w-4 h-4 mr-2" />
                            )}
                            {isSubmitting ? "Mengirim..." : "Kirim Undangan"}
                        </Button>
                    </form>
                )}
            </div>

            {/* Pending Invites */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-4">Undangan Terkirim</h2>
                <div className="space-y-3">
                    {invites?.length === 0 ? (
                        <p className="text-body-sm text-neutral-500 text-center py-8">
                            Belum ada undangan
                        </p>
                    ) : (
                        invites?.map((invite) => (
                            <div
                                key={invite._id}
                                className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 hover:bg-neutral-50 transition-colors"
                            >
                                <div>
                                    <p className="text-body-sm font-medium text-primary-800">
                                        {invite.projectName}
                                    </p>
                                    <p className="text-caption text-neutral-500">
                                        {invite.clientName} • {invite.clientEmail}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <StatusBadge
                                        status={
                                            invite.status === "active"
                                                ? "success"
                                                : invite.status === "sent"
                                                    ? "info"
                                                    : invite.status === "accepted"
                                                        ? "warning"
                                                        : "neutral"
                                        }
                                        label={
                                            invite.status === "active"
                                                ? "Aktif"
                                                : invite.status === "sent"
                                                    ? "Email Terkirim"
                                                    : invite.status === "accepted"
                                                        ? "Diterima"
                                                        : "Ditolak"
                                        }
                                    />
                                    <span className="text-caption text-neutral-400">
                                        {new Date(invite.sentAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-4">Pertanyaan Umum</h2>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="border border-neutral-200 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                            >
                                <span className="text-body-sm font-medium text-primary-800">
                                    {faq.q}
                                </span>
                                {openFaq === i ? (
                                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                                )}
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4 text-body-sm text-neutral-600">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}