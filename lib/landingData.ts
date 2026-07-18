import {
    Shield, Clock, Scale, TrendingDown,
    UserCheck, Lock, Briefcase, Banknote,
} from "lucide-react";

export const trustStats = [
    { icon: Shield, value: "<3%", label: "Risiko gagal bayar (dari 22%)" },
    { icon: TrendingDown, value: "5%", label: "Fee platform (vs 20% lainnya)" },
    { icon: Clock, value: "<30 menit", label: "Settlement ke rekening Rupiah" },
    { icon: Scale, value: "100%", label: "Patuh regulasi Indonesia" },
];

export const howItWorks = [
    {
        icon: UserCheck,
        title: "Onboarding & AI Stress Test",
        desc: "Verifikasi skill dan kesiapan komunikasi global Anda.",
    },
    {
        icon: Lock,
        title: "Kunci Dana Escrow",
        desc: "Klien deposit dana sebelum kerja dimulai. Dana aman di smart contract.",
    },
    {
        icon: Briefcase,
        title: "Kerjakan Proyek",
        desc: "Kolaborasi dengan milestone tracking dan komunikasi real-time.",
    },
    {
        icon: Banknote,
        title: "Dana Cair Otomatis",
        desc: "Setelah disetujui, dana cair ke rekening Rupiah Anda dalam <30 menit.",
    },
];

export const problemSolutions = [
    {
        problem: "Risiko Gagal Bayar",
        problemDesc: "22% freelancer mengalami pembayaran terlambat atau tidak dibayar.",
        solution: "Escrow Terjamin",
        solutionDesc: "Smart contract mengunci dana klien. 0% risiko non-payment.",
    },
    {
        problem: "Fee Platform Tinggi",
        problemDesc: "Platform global membebankan fee 20% dari pendapatan Anda.",
        solution: "BYOC 5%",
        solutionDesc: "Bawa klien Anda sendiri, bayar hanya 5% fee.",
    },
    {
        problem: "Reputasi Tidak Terverifikasi",
        problemDesc: "Portofolio bisa dipalsukan, review bisa dimanipulasi.",
        solution: "Digital Credential",
        solutionDesc: "Verifikasi on-chain yang tidak bisa dipalsukan.",
    },
];

export const talentCards = [
    {
        name: "Budi Santoso",
        role: "UI/UX Designer",
        score: 87,
        projects: 12,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    },
    {
        name: "Ani Wijaya",
        role: "Motion Designer",
        score: 92,
        projects: 8,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ani",
    },
    {
        name: "Dewi Kusuma",
        role: "3D Artist",
        score: 78,
        projects: 6,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi",
    },
];

export const faqs = [
    {
        q: "Apa itu escrow dan bagaimana cara kerjanya?",
        a: "Escrow adalah sistem penjaminan dana. Klien deposit dana sebelum kerja dimulai, dana terkunci aman, dan baru dicairkan ke talenta setelah pekerjaan disetujui.",
    },
    {
        q: "Berapa biaya menggunakan SkillPort AI?",
        a: "Fee platform hanya 5% untuk proyek BYOC (Bring Your Own Client), jauh lebih rendah dari platform lain yang membebankan 10-20%.",
    },
    {
        q: "Apakah saya perlu memahami kripto?",
        a: "Tidak sama sekali. Pengalaman menggunakan SkillPort AI identik dengan transfer bank biasa. Semua teknologi blockchain berjalan di belakang layar.",
    },
    {
        q: "Berapa lama pencairan dana?",
        a: "Kurang dari 30 menit setelah klien menyetujui milestone. Dana langsung masuk ke rekening bank Rupiah Anda.",
    },
    {
        q: "Bagaimana dengan keamanan data saya?",
        a: "Kami menggunakan enkripsi end-to-end dan mematuhi regulasi perlindungan data Indonesia. Data Anda aman dan tidak pernah dijual ke pihak ketiga.",
    },
];