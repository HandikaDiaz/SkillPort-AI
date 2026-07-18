"use client";
import { motion } from "framer-motion";
import { Sparkles, Shield, Briefcase, Banknote, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { talentCards } from "@/lib/landingData";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] bg-primary-900 overflow-hidden flex items-center">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500 rounded-full blur-[128px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-info rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-300 rounded-full blur-[96px]" />
            </div>
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-300 text-body-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            Platform Escrow untuk Talenta Kreatif Indonesia
                        </div>
                        <h1 className="text-display text-white mb-6 leading-[1.1]">
                            Pembayaran Terjamin untuk{" "}
                            <span className="text-secondary-400">Talenta Kreatif</span> di
                            Pasar Global
                        </h1>
                        <p className="text-body text-primary-300 mb-8 max-w-lg leading-relaxed">
                            Platform escrow berbasis smart contract. Dana klien terkunci
                            sebelum kerja. Cair ke rekening Rupiah setelah disetujui. Biaya
                            flat 5% — tanpa risiko gagal bayar.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <Link href="/register">Daftar sebagai Talenta</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-primary-600 text-white hover:bg-secondary-400 hover:text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <Link href="/register">Daftar sebagai Klien</Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-6 mt-8">
                            <div className="flex -space-x-3">
                                {talentCards.map((t, i) => (
                                    <img
                                        key={i}
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full border-2 border-primary-900"
                                    />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-primary-900 bg-secondary-500 flex items-center justify-center text-white text-body-sm font-bold">
                                    +2K
                                </div>
                            </div>
                            <p className="text-body-sm text-primary-400">
                                <span className="text-white font-semibold">2,000+</span> talenta
                                telah bergabung
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-secondary-500/20 to-info/20 rounded-3xl blur-2xl" />
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-secondary-400" />
                                        </div>
                                        <div>
                                            <p className="text-body-sm font-semibold text-white">Dana Terkunci</p>
                                            <p className="text-caption text-primary-400">USD 5,000 - Website Redesign</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-caption font-medium">Aman</div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                                            <Briefcase className="w-6 h-6 text-info" />
                                        </div>
                                        <div>
                                            <p className="text-body-sm font-semibold text-white">Milestone 2/4</p>
                                            <p className="text-caption text-primary-400">High-Fidelity Design</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-warning/20 text-warning text-caption font-medium">Review</div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                                            <Banknote className="w-6 h-6 text-success" />
                                        </div>
                                        <div>
                                            <p className="text-body-sm font-semibold text-white">Dana Cair</p>
                                            <p className="text-caption text-primary-400">USD 1,250 → IDR 19.5M</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-success/20 text-success text-caption font-medium">Sukses</div>
                                </div>

                                <div className="p-4 bg-secondary-500/10 rounded-xl border border-secondary-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-caption text-secondary-300">Anda Hemat</p>
                                            <p className="text-h2 text-secondary-400 font-bold">USD 525</p>
                                            <p className="text-caption text-secondary-300/70">dengan BYOC vs platform lain</p>
                                        </div>
                                        <TrendingDown className="w-12 h-12 text-secondary-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}