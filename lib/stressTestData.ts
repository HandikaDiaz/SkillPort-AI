export interface StressTestQuestion {
    id: string;
    question: string;
    options: string[];
    dimension: string;
    insight: string;
}

export const STRESS_TEST_QUESTIONS: StressTestQuestion[] = [
    {
        id: "q1",
        question:
            'Klien Anda mengatakan: "I don\'t think this direction works. Can you start over?" Bagaimana Anda merespons?',
        options: [
            "Saya akan meminta klarifikasi lebih detail tentang apa yang tidak sesuai sebelum memulai ulang.",
            "Saya akan langsung memulai ulang tanpa bertanya untuk menghemat waktu.",
            "Saya akan menjelaskan mengapa direction ini bagus dan mencoba meyakinkan klien.",
            "Saya akan meminta contoh referensi dari klien untuk memahami ekspektasi mereka.",
        ],
        dimension: "communicating",
        insight:
            "Klien Barat cenderung direct. Mereka menghargai pertanyaan klarifikasi.",
    },
    {
        id: "q2",
        question:
            "Klien memberikan feedback yang sangat kritis pada hasil kerja Anda. Bagaimana reaksi Anda?",
        options: [
            "Saya menerima dengan terbuka dan bertanya bagaimana saya bisa memperbaikinya.",
            "Saya merasa sedikit tersinggung tapi tetap profesional.",
            "Saya membela hasil kerja saya dan menjelaskan proses pemikiran saya.",
            "Saya meminta pendapat dari rekan kerja lain.",
        ],
        dimension: "evaluating",
        insight:
            "Feedback kritis adalah norma dalam budaya Barat. Jangan anggap personal.",
    },
    {
        id: "q3",
        question:
            "Klien meminta fitur tambahan yang tidak ada dalam scope awal. Bagaimana Anda menanggapinya?",
        options: [
            "Saya menjelaskan bahwa ini di luar scope dan menawarkan opsi tambahan dengan biaya ekstra.",
            "Saya langsung mengerjakannya untuk menjaga hubungan baik.",
            "Saya mengatakan tidak bisa tanpa penjelasan lebih lanjut.",
            "Saya mengabaikan permintaan tersebut.",
        ],
        dimension: "persuading",
        insight:
            "Penting untuk menjaga batasan scope sambil tetap profesional.",
    },
    {
        id: "q4",
        question:
            "Tim klien mengalami konflik internal tentang arah desain. Bagaimana Anda membantu?",
        options: [
            "Saya menawarkan untuk mempresentasikan opsi dengan pro dan kontra masing-masing.",
            "Saya memilih satu arah dan mengerjakannya.",
            "Saya menunggu mereka menyelesaikan konflik sendiri.",
            "Saya meminta keputusan dari satu orang decision-maker.",
        ],
        dimension: "leading",
        insight: "Sebagai talenta, Anda bisa membantu memfasilitasi keputusan.",
    },
    {
        id: "q5",
        question:
            "Klien memberikan deadline yang sangat ketat. Bagaimana Anda merespons?",
        options: [
            "Saya mengevaluasi feasibility dan menawarkan timeline yang realistis.",
            "Saya langsung setuju tanpa memikirkan kapasitas.",
            "Saya menolak tanpa diskusi.",
            "Saya meminta extension tanpa evaluasi.",
        ],
        dimension: "deciding",
        insight: "Transparansi tentang kapasitas Anda sangat dihargai.",
    },
    {
        id: "q6",
        question:
            "Klien tidak merespons pesan Anda selama beberapa hari. Bagaimana Anda menindaklanjuti?",
        options: [
            "Saya kirim follow-up email yang sopan dengan menyebutkan urgency.",
            "Saya tunggu tanpa follow-up.",
            "Saya kirim pesan berulang kali setiap hari.",
            "Saya anggap proyek dibatalkan.",
        ],
        dimension: "trusting",
        insight: "Follow-up yang sopan dan profesional adalah norma yang baik.",
    },
    {
        id: "q7",
        question:
            "Klien mengusulkan metode kerja yang berbeda dari yang biasa Anda lakukan. Bagaimana Anda merespons?",
        options: [
            "Saya terbuka untuk mencoba metode baru dan menanyakan detailnya.",
            "Saya menolak dan menjelaskan metode saya yang biasa.",
            "Saya langsung setuju tanpa pertanyaan.",
            "Saya mengabaikan usulan tersebut.",
        ],
        dimension: "disagreeing",
        insight:
            "Fleksibilitas dalam metode kerja menunjukkan adaptabilitas Anda.",
    },
    {
        id: "q8",
        question:
            "Klien di zona waktu berbeda (12 jam) ingin meeting. Bagaimana Anda mengatur?",
        options: [
            "Saya cari waktu yang overlap dan tawarkan async alternatives.",
            "Saya ikuti zona waktu mereka tanpa memikirkan konsekuensi.",
            "Saya tolak meeting dan hanya komunikasi via email.",
            "Saya minta mereka menyesuaikan jadwal saya.",
        ],
        dimension: "scheduling",
        insight:
            "Komunikasi async adalah kunci kerja sama lintas zona waktu.",
    },
];

export const CULTURE_MAP_DIMENSIONS = [
    { key: "communicating", label: "Communicating", score: 85 },
    { key: "evaluating", label: "Evaluating", score: 78 },
    { key: "persuading", label: "Persuading", score: 72 },
    { key: "leading", label: "Leading", score: 88 },
    { key: "deciding", label: "Deciding", score: 90 },
    { key: "trusting", label: "Trusting", score: 82 },
    { key: "disagreeing", label: "Disagreeing", score: 75 },
    { key: "scheduling", label: "Scheduling", score: 86 },
];

export const RECOMMENDATIONS = [
    "Latih kemampuan persuading dengan role-play scenario bersama rekan kerja.",
    "Pelajari lebih dalam tentang budaya komunikasi langsung (direct) vs tidak langsung (indirect).",
    'Ikuti workshop "Working with Western Clients" di komunitas SkillPort.',
];