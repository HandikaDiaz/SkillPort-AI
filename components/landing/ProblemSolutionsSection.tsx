import { problemSolutions } from "@/lib/landingData";
import { ArrowRight } from "lucide-react";
import FadeIn from "../ui/fadeIn";

export default function ProblemSolutionsSection() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
                            Solusi Kami
                        </p>
                        <h2 className="text-h1 text-primary-900 mb-4">Mengapa Memilih SkillPort AI?</h2>
                        <p className="text-body text-neutral-500 max-w-2xl mx-auto">
                            Kami memecahkan masalah fundamental yang dihadapi talenta kreatif Indonesia.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {problemSolutions.map((item, i) => (
                        <FadeIn key={i} delay={i * 0.15}>
                            <div className="group rounded-2xl border border-neutral-200 hover:border-secondary-300 hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                                <div className="p-6 bg-error-light/50 border-b border-error/10">
                                    <span className="text-caption font-semibold text-error uppercase tracking-wider">
                                        Masalah
                                    </span>
                                    <h3 className="text-h3 text-primary-900 mt-2 mb-2">{item.problem}</h3>
                                    <p className="text-body-sm text-neutral-600">{item.problemDesc}</p>
                                </div>
                                <div className="p-6 bg-success-light/50">
                                    <span className="text-caption font-semibold text-success uppercase tracking-wider">
                                        Solusi
                                    </span>
                                    <h3 className="text-h3 text-primary-900 mt-2 mb-2">{item.solution}</h3>
                                    <p className="text-body-sm text-neutral-600">{item.solutionDesc}</p>
                                    <div className="flex items-center gap-1 mt-4 text-secondary-600 font-medium text-body-sm group-hover:gap-2 transition-all">
                                        Pelajari <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}