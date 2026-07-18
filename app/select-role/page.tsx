"use client";

import { useSession } from "next-auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Briefcase, Users, ArrowRight, Loader2 } from "lucide-react";

export default function SelectRolePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryRole = searchParams.get("role");
    const updateRoleMutation = useMutation(api.users.updateRole);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"client" | "talent" | null>(null);

    // Auto-handling if role is passed via query params (like /select-role?role=client)
    useEffect(() => {
        if (queryRole === "client" || queryRole === "talent") {
            handleSelectRole(queryRole as "client" | "talent");
        }
    }, [queryRole]);

    const handleSelectRole = async (role: "client" | "talent") => {
        if (!session?.user?.id) return;
        setIsLoading(true);
        setSelectedRole(role);
        try {
            // 1. Update in Convex DB
            await updateRoleMutation({
                id: session.user.id as Id<"users">,
                role: role,
            });

            // 2. Update NextAuth Session
            await update({ role });

            // 3. Redirect to dashboard
            router.push(`/${role}/dashboard`);
        } catch (error) {
            console.error("Failed to update role:", error);
            setIsLoading(false);
        }
    };

    if (!session) {
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

            <div className="w-full max-w-3xl space-y-8 bg-white/5 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="text-2xl font-bold text-white tracking-tight">SkillPort</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-500"></span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        Pilih Peran Anda
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
                        Tentukan bagaimana Anda ingin menggunakan SkillPort. Peran ini tidak dapat diubah setelah dikonfirmasi.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {/* Client Selection */}
                    <button
                        onClick={() => handleSelectRole("client")}
                        disabled={isLoading}
                        className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 group cursor-pointer ${selectedRole === "client"
                                ? "bg-secondary-500/20 border-secondary-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                    >
                        <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                            <Briefcase className="w-6 h-6 text-secondary-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            Klien (Client)
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Saya ingin mempekerjakan talenta kreatif, memanage proyek, dan mengamankan pembayaran dengan sistem escrow flat 5%.
                        </p>
                    </button>

                    {/* Talent Selection */}
                    <button
                        onClick={() => handleSelectRole("talent")}
                        disabled={isLoading}
                        className={`flex flex-col text-left p-6 rounded-2xl border transition-all duration-300 group cursor-pointer ${selectedRole === "talent"
                                ? "bg-primary-500/20 border-primary-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                            <Users className="w-6 h-6 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            Talenta (Talent)
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                        </h3>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            Saya adalah pekerja kreatif/freelancer yang ingin bekerja pada proyek, mengirimkan hasil kerja, dan menerima pembayaran aman.
                        </p>
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center gap-3 text-neutral-300 text-sm font-medium mt-6">
                        <Loader2 className="w-5 h-5 animate-spin text-secondary-500" />
                        <span>Menyiapkan profil {selectedRole === "client" ? "Klien" : "Talenta"} Anda...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
