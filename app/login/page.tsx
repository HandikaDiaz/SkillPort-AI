import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GoogleSignInButton, GitHubSignInButton } from "@/components/auth/AuthButtons";
import Link from "next/link";

export default async function LoginPage() {
    const session = await auth();

    if (session) {
        redirect("/");
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
                        Selamat Datang Kembali
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">
                        Masuk untuk mengakses akun SkillPort Anda
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <GoogleSignInButton />
                    <GitHubSignInButton />
                </div>

                <div className="mt-6 flex flex-col gap-4 text-center">
                    <div className="text-xs text-neutral-500">
                        Dengan masuk, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi kami.
                    </div>
                    <div className="text-sm text-neutral-400">
                        Belum punya akun?{" "}
                        <Link href="/register" className="font-semibold text-secondary-400 hover:text-secondary-300 transition-colors">
                            Daftar gratis
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
