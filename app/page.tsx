"use client"
import NavbarLandingPage from "@/components/navbar/NavbarLandingPage";
import { Button } from "@/components/ui/button";
import { motion, useInView } from 'framer-motion';
import {
  Shield, Clock, Scale, UserCheck, Lock, Briefcase,
  Banknote, ChevronRight, CheckCircle, Sparkles, TrendingDown,
  Award, Users, ArrowRight
} from 'lucide-react';
import Link from "next/link";
import { useRef } from "react";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const trustStats = [
    { icon: Shield, value: '<3%', label: 'Risiko gagal bayar (dari 22%)' },
    { icon: TrendingDown, value: '1.25%', label: 'Fee platform (vs 20% lainnya)' },
    { icon: Clock, value: '<30 menit', label: 'Settlement ke rekening Rupiah' },
    { icon: Scale, value: '100%', label: 'Patuh regulasi Indonesia' },
  ];

  const howItWorks = [
    { icon: UserCheck, title: 'Onboarding & AI Stress Test', desc: 'Verifikasi skill dan kesiapan komunikasi global Anda.' },
    { icon: Lock, title: 'Kunci Dana Escrow', desc: 'Klien deposit dana sebelum kerja dimulai. Dana aman di smart contract.' },
    { icon: Briefcase, title: 'Kerjakan Proyek', desc: 'Kolaborasi dengan milestone tracking dan komunikasi real-time.' },
    { icon: Banknote, title: 'Dana Cair Otomatis', desc: 'Setelah disetujui, dana cair ke rekening Rupiah Anda dalam <30 menit.' },
  ];

  const problemSolutions = [
    {
      problem: 'Risiko Gagal Bayar',
      problemDesc: '22% freelancer mengalami pembayaran terlambat atau tidak dibayar.',
      solution: 'Escrow Terjamin',
      solutionDesc: 'Smart contract mengunci dana klien. 0% risiko non-payment.',
    },
    {
      problem: 'Fee Platform Tinggi',
      problemDesc: 'Platform global membebankan fee 20% dari pendapatan Anda.',
      solution: 'BYOC 1.25%',
      solutionDesc: 'Bawa klien Anda sendiri, bayar hanya 1.25% fee.',
    },
    {
      problem: 'Reputasi Tidak Terverifikasi',
      problemDesc: 'Portofolio bisa dipalsukan, review bisa dimanipulasi.',
      solution: 'Digital Credential',
      solutionDesc: 'Verifikasi on-chain yang tidak bisa dipalsukan.',
    },
  ];

  const talentCards = [
    { name: 'Budi Santoso', role: 'UI/UX Designer', score: 87, projects: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' },
    { name: 'Ani Wijaya', role: 'Motion Designer', score: 92, projects: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ani' },
    { name: 'Dewi Kusuma', role: '3D Artist', score: 78, projects: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi' },
  ];

  const faqs = [
    { q: 'Apa itu escrow dan bagaimana cara kerjanya?', a: 'Escrow adalah sistem penjaminan dana. Klien deposit dana sebelum kerja dimulai, dana terkunci aman, dan baru dicairkan ke talenta setelah pekerjaan disetujui.' },
    { q: 'Berapa biaya menggunakan SkillPort AI?', a: 'Fee platform hanya 1.25% untuk proyek BYOC (Bring Your Own Client), jauh lebih rendah dari platform lain yang membebankan 10-20%.' },
    { q: 'Apakah saya perlu memahami kripto?', a: 'Tidak sama sekali. Pengalaman menggunakan SkillPort AI identik dengan transfer bank biasa. Semua teknologi blockchain berjalan di belakang layar.' },
    { q: 'Berapa lama pencairan dana?', a: 'Kurang dari 30 menit setelah klien menyetujui milestone. Dana langsung masuk ke rekening bank Rupiah Anda.' },
    { q: 'Bagaimana dengan keamanan data saya?', a: 'Kami menggunakan enkripsi end-to-end dan mematuhi regulasi perlindungan data Indonesia. Data Anda aman dan tidak pernah dijual ke pihak ketiga.' },
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <NavbarLandingPage />

        <section className="relative min-h-[90vh] bg-primary-900 overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-info rounded-full blur-[128px]"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-300 rounded-full blur-[96px]"></div>
          </div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-300 text-body-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Platform Escrow untuk Talenta Kreatif Indonesia
                </div>
                <h1 className="text-display text-white mb-6 leading-[1.1]">
                  Pembayaran Terjamin untuk{' '}
                  <span className="text-secondary-400">Talenta Kreatif</span>{' '}
                  di Pasar Global
                </h1>
                <p className="text-body text-primary-300 mb-8 max-w-lg leading-relaxed">
                  Platform escrow berbasis smart contract. Dana klien terkunci sebelum kerja.
                  Cair ke rekening Rupiah setelah disetujui. Biaya flat 1.25% — tanpa risiko gagal bayar.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 transition-all hover:-translate-y-0.5">
                    <Link href="/register">Daftar sebagai Talenta</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary-600 text-black hover:bg-primary-800 hover:text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 transition-all hover:-translate-y-0.5">
                    <Link href="/register">Daftar sebagai Klien</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex -space-x-3">
                    {talentCards.map((t, i) => (
                      <img key={i} src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-primary-900" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-primary-900 bg-secondary-500 flex items-center justify-center text-white text-body-sm font-bold">+2K</div>
                  </div>
                  <p className="text-body-sm text-primary-400">
                    <span className="text-white font-semibold">2,000+</span> talenta telah bergabung
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-secondary-500/20 to-info/20 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-secondary-400" />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-white">Dana Terkunci</p>
                          <p className="text-caption text-primary-400">USD 5,000 - Website Redesign</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-caption font-medium">
                        Aman
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-info/20 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-info" />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-white">Milestone 2/4</p>
                          <p className="text-caption text-primary-400">High-Fidelity Design</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-warning/20 text-warning text-caption font-medium">
                        Review
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                          <Banknote className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-white">Dana Cair</p>
                          <p className="text-caption text-primary-400">USD 1,250 → IDR 19.5M</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-success/20 text-success text-caption font-medium">
                        Sukses
                      </div>
                    </div>
                    <div className="p-4 bg-secondary-500/10 rounded-xl border border-secondary-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-caption text-secondary-300">Anda Hemat</p>
                          <p className="text-h2 text-secondary-400 font-bold">USD 937</p>
                          <p className="text-caption text-secondary-300/70">dengan BYOC vs platform lain</p>
                        </div>
                        <TrendingDown className="w-12 h-12 text-secondary-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

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

        <section id="how-it-works" className="py-20 bg-neutral-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">Proses Kerja</p>
                <h2 className="text-h1 text-primary-900 mb-4">Cara Kerja SkillPort AI</h2>
                <p className="text-body text-neutral-500 max-w-2xl mx-auto">Empat langkah sederhana untuk memulai kerja sama yang aman dan terjamin.</p>
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

        <section id="features" className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">Solusi Kami</p>
                <h2 className="text-h1 text-primary-900 mb-4">Mengapa Memilih SkillPort AI?</h2>
                <p className="text-body text-neutral-500 max-w-2xl mx-auto">Kami memecahkan masalah fundamental yang dihadapi talenta kreatif Indonesia.</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {problemSolutions.map((item, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="group rounded-2xl border border-neutral-200 hover:border-secondary-300 hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                    <div className="p-6 bg-error-light/50 border-b border-error/10">
                      <span className="text-caption font-semibold text-error uppercase tracking-wider">Masalah</span>
                      <h3 className="text-h3 text-primary-900 mt-2 mb-2">{item.problem}</h3>
                      <p className="text-body-sm text-neutral-600">{item.problemDesc}</p>
                    </div>
                    <div className="p-6 bg-success-light/50">
                      <span className="text-caption font-semibold text-success uppercase tracking-wider">Solusi</span>
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

        <section className="py-20 bg-primary-900 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-500 rounded-full blur-[200px]"></div>
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
                    Sudah Punya Klien? <span className="text-secondary-400">Pindahkan ke Sini.</span> Biaya Lebih Rendah.
                  </h2>
                  <p className="text-body text-primary-300 mb-6 leading-relaxed">
                    Program BYOC — undang klien pribadi Anda ke escrow terjamin. Mereka bayar via transfer bank biasa. Anda hemat hingga 90% fee platform.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {['Fee hanya 1.25% vs 20%', 'Klien tidak perlu paham kripto', 'Pengalaman identik transfer bank', 'Dana cair <30 menit'].map((item, i) => (
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
                  <h3 className="text-h4 text-white mb-6 text-center">Perbandingan Biaya (Proyek USD 5,000)</h3>
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
                        <span className="text-caption text-secondary-400 font-medium">Fee 1.25%</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-body text-primary-400">USD 5,000</span>
                        <span className="text-h3 text-secondary-400 font-bold">USD 4,937</span>
                      </div>
                      <p className="text-caption text-secondary-300 mt-1">Anda hemat USD 937</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        <section className="py-20 bg-neutral-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">Talenta Terverifikasi</p>
                <h2 className="text-h1 text-primary-900 mb-4">Reputasi yang Tidak Bisa Dipalsukan</h2>
                <p className="text-body text-neutral-500 max-w-2xl mx-auto">Setiap talenta memiliki Digital Credential yang terverifikasi on-chain.</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
              {talentCards.map((talent, i) => (
                <FadeIn key={i} delay={i * 0.15}>
                  <div className="bg-white rounded-2xl border border-neutral-200 hover:border-secondary-300 hover:-translate-y-2 hover:shadow-card-hover transition-all duration-300 p-6 text-center group">
                    <div className="relative inline-block mb-4">
                      <img src={talent.avatar} alt={talent.name} className="w-24 h-24 rounded-full border-4 border-secondary-200 group-hover:border-secondary-400 transition-colors" />
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-h4 text-primary-900 mb-1">{talent.name}</h3>
                    <p className="text-body-sm text-neutral-500 mb-4">{talent.role}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 border border-secondary-200 mb-4">
                      <Award className="w-4 h-4 text-secondary-600" />
                      <span className="text-body-sm font-semibold text-secondary-700">Global Ready — Score {talent.score}/100</span>
                    </div>
                    <p className="text-body-sm text-neutral-500">{talent.projects} Proyek Selesai</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">Perbandingan</p>
                <h2 className="text-h1 text-primary-900 mb-4">SkillPort AI vs Platform Lain</h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-card">
                  <div className="grid grid-cols-3 bg-neutral-50 border-b border-neutral-200">
                    <div className="p-4 text-body-sm font-semibold text-primary-900">Fitur</div>
                    <div className="p-4 text-body-sm font-semibold text-secondary-700 text-center bg-secondary-50/50">SkillPort AI</div>
                    <div className="p-4 text-body-sm font-semibold text-neutral-500 text-center">Upwork</div>
                  </div>
                  {[
                    { feature: 'Fee Platform', skillport: '1.25%', other: '20%', highlight: true },
                    { feature: 'Escrow', skillport: 'Smart Contract', other: 'Basic', highlight: true },
                    { feature: 'Credential', skillport: 'On-Chain', other: 'Tidak ada', highlight: true },
                    { feature: 'Tax Document', skillport: 'Auto', other: 'Manual', highlight: false },
                    { feature: 'AI Stress Test', skillport: 'Included', other: 'Tidak ada', highlight: true },
                    { feature: 'BYOC Program', skillport: 'Ya', other: 'Tidak ada', highlight: false },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/30'} border-b border-neutral-100 last:border-b-0`}>
                      <div className="p-4 text-body-sm text-primary-700">{row.feature}</div>
                      <div className={`p-4 text-body-sm font-medium text-center ${row.highlight ? 'text-secondary-700' : 'text-primary-700'}`}>
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

        <section id="faq" className="py-20 bg-neutral-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <p className="text-body-sm font-semibold text-secondary-600 uppercase tracking-wider mb-3">FAQ</p>
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

        <section className="py-20 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary-500 rounded-full blur-[150px]"></div>
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

        <footer className="bg-primary-950 py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-h3 font-bold text-white">SkillPort</span>
                  <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                </div>
                <p className="text-body-sm text-primary-400 leading-relaxed">
                  Platform escrow untuk talenta kreatif Indonesia. Pembayaran terjamin, reputasi terverifikasi.
                </p>
              </div>
              <div>
                <h4 className="text-h4 text-white mb-4">Produk</h4>
                <ul className="space-y-2">
                  {['Escrow', 'BYOC', 'Digital Credential', 'AI Stress Test'].map((item) => (
                    <li key={item}><a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-h4 text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  {['Pusat Bantuan', 'Blog', 'Komunitas', 'Webinar'].map((item) => (
                    <li key={item}><a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-h4 text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  {['Syarat & Ketentuan', 'Kebijakan Privasi', 'Kepatuhan Regulasi'].map((item) => (
                    <li key={item}><a href="#" className="text-body-sm text-primary-400 hover:text-white transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-caption text-primary-500">&copy; 2026 SkillPort AI. Kompatibel dengan visi BSPI 2030 Bank Indonesia.</p>
              <div className="flex items-center gap-4">
                <span className="text-caption text-primary-500">Powered by</span>
                <div className="flex items-center gap-3">
                  {['Next.js', 'Convex', 'Auth.js'].map((tech) => (
                    <span key={tech} className="px-2 py-1 rounded bg-primary-900 text-caption text-primary-400">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
