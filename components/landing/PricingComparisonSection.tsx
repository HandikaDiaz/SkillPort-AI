import { CheckCircle } from "lucide-react";
import FadeIn from "../ui/fadeIn";

const comparisonData = [
    { feature: "Fee Platform", skillport: "5%", other: "20%", highlight: true },
    { feature: "Escrow", skillport: "Smart Contract", other: "Basic", highlight: true },
    { feature: "Credential", skillport: "On-Chain", other: "Tidak ada", highlight: true },
    { feature: "Tax Document", skillport: "Auto", other: "Manual", highlight: false },
    { feature: "AI Stress Test", skillport: "Included", other: "Tidak ada", highlight: true },
    { feature: "BYOC Program", skillport: "Ya", other: "Tidak ada", highlight: false },
];

export default function PricingComparisonSection() {
    return (
        <section id="pricing" className="py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
                            Perbandingan
                        </p>
                        <h2 className="text-h1 text-primary-900 mb-4">SkillPort AI vs Platform Lain</h2>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-card">
                            <div className="grid grid-cols-3 bg-neutral-50 border-b border-neutral-200">
                                <div className="p-4 text-body-sm font-semibold text-primary-900">Fitur</div>
                                <div className="p-4 text-body-sm font-semibold text-secondary-700 text-center bg-secondary-50/50">
                                    SkillPort AI
                                </div>
                                <div className="p-4 text-body-sm font-semibold text-neutral-500 text-center">Upwork</div>
                            </div>
                            {comparisonData.map((row, i) => (
                                <div
                                    key={i}
                                    className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/30"} border-b border-neutral-100 last:border-b-0`}
                                >
                                    <div className="p-4 text-body-sm text-primary-700">{row.feature}</div>
                                    <div
                                        className={`p-4 text-body-sm font-medium text-center ${row.highlight ? "text-secondary-700" : "text-primary-700"}`}
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            {row.highlight && <CheckCircle className="w-4 h-4 text-secondary-500" />}
                                            {row.skillport}
                                        </span>
                                    </div>
                                    <div className="p-4 text-body-sm text-neutral-500 text-center">{row.other}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}