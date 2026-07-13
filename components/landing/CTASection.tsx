import { Button } from "@/components/ui/button";
import Link from "next/link";
import FadeIn from "../ui/fadeIn";

export default function CTASection() {
    return (
        <section className="py-20 bg-primary-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary-500 rounded-full blur-[150px]" />
            </div>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                <FadeIn>
                    <h2 className="text-h1 text-white mb-6">Siap Memulai Karir Global Anda?</h2>
                    <p className="text-body text-primary-300 max-w-2xl mx-auto mb-8">
                        Bergabung dengan 2,000+ talenta kreatif Indonesia yang sudah mendapatkan pembayaran terjamin dari klien global.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-secondary-500/25">
                            <Link href="/register">Daftar Gratis Sekarang</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-primary-600 text-black hover:bg-primary-800 hover:text-white font-semibold px-8 py-6 text-base rounded-xl">
                            <Link href="/login">Masuk</Link>
                        </Button>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}