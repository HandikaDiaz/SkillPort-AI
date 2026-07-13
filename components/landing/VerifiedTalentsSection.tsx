import { talentCards } from "@/lib/landingData";
import { Award, Shield } from "lucide-react";
import FadeIn from "../ui/fadeIn";

export default function VerifiedTalentsSection() {
    return (
        <section className="py-20 bg-neutral-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
                            Talenta Terverifikasi
                        </p>
                        <h2 className="text-h1 text-primary-900 mb-4">
                            Reputasi yang Tidak Bisa Dipalsukan
                        </h2>
                        <p className="text-body text-neutral-500 max-w-2xl mx-auto">
                            Setiap talenta memiliki Digital Credential yang terverifikasi on-chain.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {talentCards.map((talent, i) => (
                        <FadeIn key={i} delay={i * 0.15}>
                            <div className="bg-white rounded-2xl border border-neutral-200 hover:border-secondary-300 hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 p-6 text-center group">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={talent.avatar}
                                        alt={talent.name}
                                        className="w-24 h-24 rounded-full border-4 border-secondary-200 group-hover:border-secondary-400 transition-colors"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-h4 text-primary-900 mb-1">{talent.name}</h3>
                                <p className="text-body-sm text-neutral-500 mb-4">{talent.role}</p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 border border-secondary-200 mb-4">
                                    <Award className="w-4 h-4 text-secondary-600" />
                                    <span className="text-body-sm font-semibold text-secondary-700">
                                        Global Ready — Score {talent.score}/100
                                    </span>
                                </div>
                                <p className="text-body-sm text-neutral-500">{talent.projects} Proyek Selesai</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}