export default function FooterSection() {
    return (
        <footer className="bg-primary-950 py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-h3 font-bold text-white">SkillPort</span>
                            <span className="w-2 h-2 rounded-full bg-secondary-500" />
                        </div>
                        <p className="text-body-sm text-primary-400 leading-relaxed">
                            Platform escrow untuk talenta kreatif Indonesia. Pembayaran terjamin, reputasi terverifikasi.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-h4 text-white mb-4">Produk</h4>
                        <ul className="space-y-2">
                            {["Escrow", "BYOC", "Digital Credential", "AI Stress Test"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-h4 text-white mb-4">Resources</h4>
                        <ul className="space-y-2">
                            {["Pusat Bantuan", "Blog", "Komunitas", "Webinar"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-h4 text-white mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {["Syarat & Ketentuan", "Kebijakan Privasi", "Kepatuhan Regulasi"].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-caption text-primary-500">
                        &copy; 2026 SkillPort AI. Kompatibel dengan visi BSPI 2030 Bank Indonesia.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-caption text-primary-500">Powered by</span>
                        <div className="flex items-center gap-3">
                            {["Next.js", "Convex", "Auth.js"].map((tech) => (
                                <span key={tech} className="px-2 py-1 rounded bg-primary-900 text-caption text-primary-400">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}