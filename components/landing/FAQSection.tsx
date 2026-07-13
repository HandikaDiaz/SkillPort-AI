import { faqs } from "@/lib/landingData";
import { ChevronRight } from "lucide-react";
import FadeIn from "../ui/fadeIn";

export default function FAQSection() {
    return (
        <section id="faq" className="py-20 bg-neutral-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-16">
                        <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">
                            FAQ
                        </p>
                        <h2 className="text-h1 text-primary-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
                    </div>
                </FadeIn>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <details className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-secondary-300 transition-colors">
                                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                    <span className="text-body-sm font-semibold text-primary-900 pr-4">{faq.q}</span>
                                    <ChevronRight className="w-5 h-5 text-neutral-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                                </summary>
                                <div className="px-5 pb-5 text-body-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}