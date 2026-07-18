import { Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FadeIn from "../ui/fadeIn";

export default function BYOCSection() {
    const listItems = [
        "Fee hanya 5% vs 20%",
        "Klien tidak perlu paham kripto",
        "Pengalaman identik transfer bank",
        "Dana cair <30 menit",
    ];

    return (
        <section className="py-20 bg-primary-900 overflow-hidden relative">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[200px]" />
            </div>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <FadeIn>
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-300 text-body-sm font-medium mb-6">
                                <Users className="w-4 h-4" />
                                BYOC - Bring Your Own Client
                            </span>
                            <h2 className="text-h1 text-white mb-6">
                                Sudah Punya Klien?{" "}
                                <span className="text-secondary-400">Pindahkan ke Sini.</span> Biaya
                                Lebih Rendah.
                            </h2>
                            <p className="text-body text-primary-300 mb-6 leading-relaxed">
                                Program BYOC — undang klien pribadi Anda ke escrow terjamin. Mereka bayar via transfer bank biasa. Anda hemat hingga 90% fee platform.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {listItems.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-body-sm text-primary-300">
                                        <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-8 py-6 rounded-xl">
                                <Link href="/register">Pelajari BYOC</Link>
                            </Button>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-h4 text-white mb-6 text-center">
                                Perbandingan Biaya (Proyek USD 5,000)
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-body-sm text-primary-300">Platform Lain</span>
                                        <span className="text-caption text-error font-medium">Fee 20%</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-body text-primary-400 line-through">USD 5,000</span>
                                        <span className="text-h3 text-error font-bold">USD 4,000</span>
                                    </div>
                                    <p className="text-caption text-error mt-1">Anda kehilangan USD 1,000</p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center">
                                        <ArrowRight className="w-4 h-4 text-white rotate-90" />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-secondary-500/10 border border-secondary-500/20">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-body-sm text-secondary-300">SkillPort AI</span>
                                        <span className="text-caption text-secondary-400 font-medium">Fee 5%</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-body text-primary-400">USD 5,000</span>
                                        <span className="text-h3 text-secondary-400 font-bold">USD 4,525</span>
                                    </div>
                                    <p className="text-caption text-secondary-300 mt-1">Anda hemat USD 525</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}