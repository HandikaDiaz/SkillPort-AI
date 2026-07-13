import { trustStats } from "@/lib/landingData";
import FadeIn from "../ui/fadeIn";

export default function TrustStatsSection() {
    return (
        <section className="py-16 bg-white border-b border-neutral-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustStats.map((stat, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-14 h-14 rounded-2xl bg-secondary-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <stat.icon className="w-7 h-7 text-secondary-600" />
                                </div>
                                <p className="text-data text-primary-900 font-bold mb-1">{stat.value}</p>
                                <p className="text-body-sm text-neutral-500">{stat.label}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}