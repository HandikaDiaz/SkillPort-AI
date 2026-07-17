"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { GoogleSignInButton, GitHubSignInButton } from "@/components/auth/AuthButtons";
import Link from "next/link";
import { Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage(props: {
    searchParams: Promise<{ role?: string }>;
}) {
    const searchParams = use(props.searchParams);
    const urlRole = searchParams.role;
    const { data: session } = useSession();
    const router = useRouter();

    const [selectedRole, setSelectedRole] = useState<"client" | "talent" | null>(null);

    // Initialize role if passed in searchParams (e.g. from Hero section buttons)
    useEffect(() => {
        if (urlRole === "client" || urlRole === "talent") {
            setSelectedRole(urlRole);
        }
    }, [urlRole]);

    useEffect(() => {
        if (session) {
            if (selectedRole) {
                router.push(`/?role=${selectedRole}/dashboard`);
            } else {
                router.push("/");
            }
        }
    }, [session, selectedRole, router]);

    if (session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-neutral-900">
                <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-neutral-900 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md space-y-8 bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-white tracking-tight">SkillPort</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-500"></span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Buat Akun Baru
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        {selectedRole 
                            ? `Mendaftar sebagai ${selectedRole === "client" ? "Klien (Client)" : "Talenta (Talent)"}` 
                            : "Pilih peran Anda untuk mulai mengamankan transaksi kerja"}
                    </p>
                </div>

                {!selectedRole ? (
                    /* Step 1: Select Role */
                    <div className="flex flex-col gap-4 mt-8">
                        <button
                            onClick={() => setSelectedRole("client")}
                            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary-500/50 hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-secondary-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <Briefcase className="w-5 h-5 text-secondary-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-body-sm font-bold text-white flex items-center gap-2">
                                    Daftar sebagai Klien
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                </h3>
                                <p className="text-caption text-neutral-400 mt-0.5">
                                    Saya ingin mempekerjakan talenta kreatif
                                </p>
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedRole("talent")}
                            className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                <Users className="w-5 h-5 text-primary-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-body-sm font-bold text-white flex items-center gap-2">
                                    Daftar sebagai Talenta
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                </h3>
                                <p className="text-caption text-neutral-400 mt-0.5">
                                    Saya ingin menawarkan jasa kreatif
                                </p>
                            </div>
                        </button>
                    </div>
                ) : (
                    /* Step 2: OAuth Sign In */
                    <div className="mt-8 space-y-4">
                        <GoogleSignInButton role={selectedRole} />
                        <GitHubSignInButton role={selectedRole} />

                        <div className="text-center pt-2">
                            <button
                                onClick={() => setSelectedRole(null)}
                                className="text-xs text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
                            >
                                Kembali & ubah peran
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-4 text-center">
                    <div className="text-xs text-neutral-500">
                        Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                    </div>
                    <div className="text-sm text-neutral-400">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="font-semibold text-secondary-400 hover:text-secondary-300 transition-colors">
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
