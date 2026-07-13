import { howItWorks } from "@/lib/landingData";
import FadeIn from "../ui/fadeIn";

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 bg-neutral-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
                            Proses Kerja
                        </p>
                        <h2 className="text-h1 text-primary-900 mb-4">Cara Kerja SkillPort AI</h2>
                        <p className="text-body text-neutral-500 max-w-2xl mx-auto">
                            Empat langkah sederhana untuk memulai kerja sama yang aman dan terjamin.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {howItWorks.map((step, i) => (
                        <FadeIn key={i} delay={i * 0.15}>
                            <div className="relative bg-white rounded-2xl p-6 border border-neutral-200 hover:border-secondary-300 hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 group">
                                <div className="absolute -top-4 -left-2 w-10 h-10 rounded-xl bg-secondary-500 text-white flex items-center justify-center font-bold text-body-sm shadow-lg shadow-secondary-500/25">
                                    {i + 1}
                                </div>
                                <div className="w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mb-4 group-hover:bg-secondary-100 transition-colors">
                                    <step.icon className="w-8 h-8 text-secondary-600" />
                                </div>
                                <h3 className="text-h4 text-primary-900 mb-2">{step.title}</h3>
                                <p className="text-body-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}