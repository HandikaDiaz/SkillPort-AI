"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    ShieldCheck,
    TrendingUp,
    ExternalLink,
    Copy,
    CheckCircle,
    QrCode,
    Share2,
    ChevronDown,
    ChevronUp,
    Download,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DEFAULT_DIMENSIONS = [
    { key: "communicating", label: "Communicating", score: 85 },
    { key: "evaluating", label: "Evaluating", score: 78 },
    { key: "persuading", label: "Persuading", score: 72 },
    { key: "leading", label: "Leading", score: 88 },
    { key: "deciding", label: "Deciding", score: 90 },
    { key: "trusting", label: "Trusting", score: 82 },
    { key: "disagreeing", label: "Disagreeing", score: 75 },
    { key: "scheduling", label: "Scheduling", score: 86 },
];

export default function TalentCredentials() {
    const { data: session } = useSession();
    const userId = session?.user?.id as any;

    const credential = useQuery(
        api.credentials.getByUser,
        userId ? { userId } : "skip"
    );
    const dimensions = useQuery(
        api.credentials.getCultureDimensions,
        userId ? { userId } : "skip"
    );
    const events = useQuery(
        api.credentials.getEvents,
        userId ? { userId } : "skip"
    );

    const [score, setScore] = useState(0);
    const [showEmbed, setShowEmbed] = useState(false);
    const [copied, setCopied] = useState(false);

    const targetScore = credential?.globalScore ?? 87;
    const displayDimensions = dimensions?.length ? dimensions : DEFAULT_DIMENSIONS;

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setScore((prev) => {
                    if (prev >= targetScore) {
                        clearInterval(interval);
                        return targetScore;
                    }
                    return prev + 1;
                });
            }, 15);
            return () => clearInterval(interval);
        }, 500);
        return () => clearTimeout(timer);
    }, [targetScore]);

    const handleCopy = () => {
        const link = `https://skillport.ai/t/${session?.user?.name?.toLowerCase().replace(/\s+/g, "-") || "talent"}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const profileLink = `https://skillport.ai/t/${session?.user?.name?.toLowerCase().replace(/\s+/g, "-") || "talent"}`;

    // if (credential === undefined) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[60vh]">
    //             <motion.div
    //                 animate={{ rotate: 360 }}
    //                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    //             >
    //                 <ShieldCheck className="w-8 h-8 text-secondary-500" />
    //             </motion.div>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-h1 text-primary-900">Digital Credential Saya</h1>
                <p className="text-body text-neutral-500 mt-1">
                    Verifikasi on-chain reputasi profesional Anda.
                </p>
            </div>

            {/* Hero Credential Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-secondary-300 shadow-credential p-8"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 border border-secondary-200 mb-4">
                        <ShieldCheck className="w-5 h-5 text-secondary-600" />
                        <span className="text-body-sm font-semibold text-secondary-700">
                            {credential?.isVerified
                                ? "Global Ready — Verified Talent"
                                : "Menunggu Verifikasi"}
                        </span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <p className="text-caption text-neutral-500 mb-2">
                        Global Readiness Score
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-[64px] font-bold text-secondary-600 leading-none">
                            {score}
                        </span>
                        <span className="text-h1 text-neutral-400">/100</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-body-sm text-success font-medium">
                            {credential?.previousScore
                                ? `+${targetScore - credential.previousScore} dari proyek terakhir`
                                : "Score awal"}
                        </span>
                    </div>
                </div>

                {/* Culture Map Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {displayDimensions.map((dim) => (
                        <div key={dim.key} className="text-center">
                            <div className="relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dim.score}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="absolute top-0 left-0 h-full bg-secondary-500 rounded-full"
                                />
                            </div>
                            <p className="text-caption text-neutral-600">{dim.label}</p>
                            <p className="text-body-sm font-semibold text-primary-800">
                                {dim.score}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-caption text-neutral-500">
                        <CheckCircle className="w-4 h-4 text-secondary-500" />
                        Terverifikasi On-Chain
                    </div>
                    <span className="text-neutral-300">|</span>
                    <button className="flex items-center gap-1 text-caption text-info hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Lihat Verifikasi
                    </button>
                </div>
            </motion.div>

            {/* Share Section */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-4">Bagikan Credential</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                    <Button variant="outline" className="border-neutral-300">
                        <FaLinkedin className="w-4 h-4 mr-2" /> LinkedIn
                    </Button>
                    <Button variant="outline" className="border-neutral-300">
                        <ExternalLink className="w-4 h-4 mr-2" /> Behance
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="border-neutral-300"
                    >
                        {copied ? (
                            <CheckCircle className="w-4 h-4 mr-2 text-success" />
                        ) : (
                            <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? "Disalin!" : "Salin Link"}
                    </Button>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <input
                        type="text"
                        value={profileLink}
                        readOnly
                        className="flex-1 bg-transparent text-body-sm text-neutral-600 outline-none"
                    />
                    <Button size="sm" variant="ghost" onClick={handleCopy}>
                        {copied ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <button
                    onClick={() => setShowEmbed(!showEmbed)}
                    className="flex items-center gap-2 mt-3 text-body-sm text-info hover:underline"
                >
                    <Share2 className="w-4 h-4" />
                    {showEmbed ? "Sembunyikan" : "Tampilkan"} Embed Code
                    {showEmbed ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
                {showEmbed && (
                    <div className="mt-3 p-4 rounded-lg bg-primary-900 text-primary-300 font-mono text-caption overflow-x-auto">
                        {`<iframe src="https://skillport.ai/embed/credential/${session?.user?.name?.toLowerCase().replace(/\s+/g, "-") || "talent"}" width="300" height="200" frameborder="0"></iframe>`}
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-6">
                    Riwayat Pembaruan Credential
                </h2>
                <div className="relative pl-6">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-secondary-200"></div>
                    {events?.length === 0 ? (
                        <p className="text-body-sm text-neutral-500 py-4">
                            Belum ada riwayat pembaruan
                        </p>
                    ) : (
                        events?.map((item, i) => (
                            <div key={item._id} className="relative mb-6 last:mb-0">
                                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-secondary-500 border-2 border-white"></div>
                                <p className="text-caption text-neutral-400 mb-1">
                                    {new Date(item.date).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                                <p className="text-body-sm text-primary-800">{item.event}</p>
                                {item.scoreChange && (
                                    <span className="text-caption text-success">
                                        +{item.scoreChange} poin
                                    </span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 text-center">
                <h2 className="text-h3 text-primary-900 mb-4">QR Code Verifikasi</h2>
                <div className="inline-block p-4 rounded-xl bg-neutral-100 mb-4">
                    <QrCode className="w-40 h-40 text-primary-800" />
                </div>
                <p className="text-body-sm text-neutral-500 mb-4">
                    Scan untuk verifikasi on-chain instan.
                </p>
                <Button variant="outline" className="border-neutral-300">
                    <Download className="w-4 h-4 mr-2" /> Unduh QR Code
                </Button>
            </div>
        </div>
    );
}