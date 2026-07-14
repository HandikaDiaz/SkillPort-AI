"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Clock,
    Globe,
    ArrowRight,
    CheckCircle,
    Award,
    TrendingUp,
    RefreshCw,
    Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    STRESS_TEST_QUESTIONS,
    CULTURE_MAP_DIMENSIONS,
    RECOMMENDATIONS,
} from "@/lib/stressTestData";

type Phase = "intro" | "test" | "results";

export default function TalentStressTest() {
    const { data: session } = useSession();
    const userId = session?.user?.id as any;

    const createTest = useMutation(api.stressTests.create);
    const updateProgress = useMutation(api.stressTests.updateProgress);
    const completeTest = useMutation(api.stressTests.complete);

    const previousTest = useQuery(
        api.stressTests.getLatestByUser,
        userId ? { userId } : "skip"
    );

    const [phase, setPhase] = useState<Phase>("intro");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<
        Record<number, { option: number; dimension: string }>
    >({});
    const [timeLeft, setTimeLeft] = useState(900);
    const [showInsight, setShowInsight] = useState(false);
    const [score, setScore] = useState(0);
    const [testId, setTestId] = useState<string | null>(null);
    const [dimensionScores, setDimensionScores] = useState<
        { dimension: string; score: number }[]
    >([]);

    useEffect(() => {
        if (phase === "test" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
        if (timeLeft === 0 && phase === "test") {
            finishTest();
        }
    }, [phase, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const startTest = async () => {
        if (userId) {
            const id = await createTest({ userId });
            setTestId(id);
        }
        setPhase("test");
        setTimeLeft(900);
    };

    const handleAnswer = (optionIndex: number) => {
        setSelectedOption(optionIndex);
    };

    const nextQuestion = useCallback(async () => {
        if (selectedOption === null) return;

        const question = STRESS_TEST_QUESTIONS[currentQuestion];
        const newAnswers = {
            ...answers,
            [currentQuestion]: {
                option: selectedOption,
                dimension: question.dimension,
            },
        };
        setAnswers(newAnswers);
        setShowInsight(true);

        if (testId) {
            const formattedAnswers = Object.entries(newAnswers).map(
                ([idx, data]) => ({
                    questionId: STRESS_TEST_QUESTIONS[parseInt(idx)].id,
                    selectedOption: data.option,
                    dimension: data.dimension,
                })
            );
            await updateProgress({
                testId: testId as any,
                answers: formattedAnswers,
                timeSpent: 900 - timeLeft,
            });
        }

        setTimeout(() => {
            setShowInsight(false);
            setSelectedOption(null);
            if (currentQuestion < STRESS_TEST_QUESTIONS.length - 1) {
                setCurrentQuestion((c) => c + 1);
            } else {
                finishTest(newAnswers);
            }
        }, 2500);
    }, [selectedOption, currentQuestion, answers, testId, timeLeft]);

    const finishTest = async (
        finalAnswers: Record<number, { option: number; dimension: string }> = answers
    ) => {
        const dimensionTotals: Record<string, { total: number; count: number }> = {};
        Object.values(finalAnswers).forEach((answer) => {
            if (!dimensionTotals[answer.dimension]) {
                dimensionTotals[answer.dimension] = { total: 0, count: 0 };
            }
            const optionScore = 100 - answer.option * 25;
            dimensionTotals[answer.dimension].total += optionScore;
            dimensionTotals[answer.dimension].count += 1;
        });

        const calculatedDimensionScores = Object.entries(dimensionTotals).map(
            ([dim, data]) => ({
                dimension: dim,
                score: Math.round(data.total / data.count),
            })
        );

        const overallScore = Math.round(
            calculatedDimensionScores.reduce((sum, d) => sum + d.score, 0) /
            calculatedDimensionScores.length
        );

        setScore(overallScore);
        setDimensionScores(calculatedDimensionScores);

        if (testId) {
            await completeTest({
                testId: testId as any,
                score: overallScore,
                dimensionScores: calculatedDimensionScores,
                timeSpent: 900 - timeLeft,
            });
        }

        setPhase("results");
    };

    const resetTest = () => {
        setPhase("intro");
        setCurrentQuestion(0);
        setAnswers({});
        setScore(0);
        setTimeLeft(900);
        setTestId(null);
        setDimensionScores([]);
    };

    const question = STRESS_TEST_QUESTIONS[currentQuestion];

    // === INTRO PHASE ===
    if (phase === "intro") {
        return (
            <div className="space-y-8 max-w-3xl mx-auto">
                <div className="text-center">
                    <h1 className="text-h1 text-primary-900">AI Stress Test</h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Asesmen Kesiapan Global
                    </p>
                </div>

                {previousTest?.status === "completed" && (
                    <div className="p-4 rounded-lg bg-secondary-50 border border-secondary-200">
                        <div className="flex items-center gap-3">
                            <Award className="w-5 h-5 text-secondary-600" />
                            <div>
                                <p className="text-body-sm font-medium text-secondary-700">
                                    Tes Terakhir: {previousTest.score}/100
                                </p>
                                <p className="text-caption text-secondary-600">
                                    {new Date(previousTest.completedAt!).toLocaleDateString(
                                        "id-ID"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 p-4 rounded-lg bg-info-light border border-info/20">
                    <Sparkles className="w-5 h-5 text-info flex-shrink-0" />
                    <p className="text-body-sm text-info">
                        Ini bukan ujian. Tidak ada jawaban "salah". Tujuannya membantu Anda
                        memahami gaya komunikasi lintas budaya.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[
                        {
                            icon: Sparkles,
                            label: `${STRESS_TEST_QUESTIONS.length} Pertanyaan`,
                            desc: "Interaktif",
                        },
                        { icon: Clock, label: "15 Menit", desc: "Durasi" },
                        { icon: Globe, label: "8 Dimensi", desc: "Culture Map" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl border border-neutral-200 p-5 text-center hover:-translate-y-1 hover:shadow-card transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center mx-auto mb-3">
                                <item.icon className="w-6 h-6 text-secondary-600" />
                            </div>
                            <p className="text-h4 text-primary-900">{item.label}</p>
                            <p className="text-body-sm text-neutral-500">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary-900 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-h3 text-primary-900">Siap?</h2>
                            <p className="text-body-sm text-neutral-500">
                                Pastikan Anda berada di tempat tenang.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={startTest}
                        className="w-full bg-secondary-500 hover:bg-secondary-600 text-white py-4 text-base"
                    >
                        Mulai Asesmen <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    // === TEST PHASE ===
    if (phase === "test") {
        return (
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 w-48 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-secondary-500 rounded-full transition-all"
                                style={{
                                    width: `${((currentQuestion + 1) / STRESS_TEST_QUESTIONS.length) * 100
                                        }%`,
                                }}
                            ></div>
                        </div>
                        <span className="text-caption text-neutral-500">
                            {currentQuestion + 1}/{STRESS_TEST_QUESTIONS.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-body-sm text-neutral-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {!showInsight ? (
                        <motion.div
                            key={`q-${currentQuestion}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* AI Message */}
                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-10 h-10 rounded-full bg-info-light flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-info" />
                                </div>
                                <div className="flex-1 p-5 bg-white rounded-2xl rounded-tl-md border border-neutral-200 border-l-4 border-l-info">
                                    <p className="text-body text-primary-800 leading-relaxed">
                                        {question.question}
                                    </p>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 pl-14">
                                {question.options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedOption === i
                                                ? "border-secondary-500 bg-secondary-50"
                                                : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                            }`}
                                    >
                                        <span className="text-body-sm text-primary-700">
                                            {option}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {selectedOption !== null && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pl-14 mt-4"
                                >
                                    <Button
                                        onClick={nextQuestion}
                                        className="bg-secondary-500 hover:bg-secondary-600 text-white"
                                    >
                                        Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="insight"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 rounded-xl bg-info-light border border-info/20 text-center"
                        >
                            <Sparkles className="w-8 h-8 text-info mx-auto mb-3" />
                            <p className="text-body-sm text-info font-medium mb-1">
                                Insight
                            </p>
                            <p className="text-body text-primary-700">
                                {question.insight}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // === RESULTS PHASE ===
    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-h1 text-primary-900 mb-2">Asesmen Selesai!</h1>
                <p className="text-body text-neutral-500">
                    Berikut hasil evaluasi kesiapan komunikasi global Anda.
                </p>
            </motion.div>

            {/* Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-secondary-300 shadow-credential p-8 text-center"
            >
                <p className="text-body-sm text-neutral-500 mb-3">
                    Global Readiness Score
                </p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-[64px] font-bold text-secondary-600 leading-none">
                        {score}
                    </span>
                    <span className="text-h1 text-neutral-400">/100</span>
                </motion.div>
                <div className="flex items-center justify-center gap-2 mt-3">
                    <Award className="w-5 h-5 text-secondary-600" />
                    <span className="text-body-sm text-secondary-700 font-medium">
                        {score >= 80
                            ? "Global Ready"
                            : score >= 60
                                ? "Developing"
                                : "Needs Improvement"}
                    </span>
                </div>
            </motion.div>

            {/* Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-neutral-200 p-6"
            >
                <h2 className="text-h3 text-primary-900 mb-6">Breakdown Dimensi</h2>
                <div className="space-y-4">
                    {dimensionScores.map((dim, i) => (
                        <motion.div
                            key={dim.dimension}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-body-sm text-primary-700 capitalize">
                                    {dim.dimension}
                                </span>
                                <span className="text-body-sm font-semibold text-primary-800">
                                    {dim.score}
                                </span>
                            </div>
                            <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dim.score}%` }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.6 + i * 0.1,
                                        ease: "easeOut",
                                    }}
                                    className={`h-full rounded-full ${dim.score >= 80
                                            ? "bg-secondary-500"
                                            : dim.score >= 60
                                                ? "bg-warning"
                                                : "bg-error"
                                        }`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl border border-neutral-200 p-6"
            >
                <h2 className="text-h3 text-primary-900 mb-4">Rekomendasi</h2>
                <div className="space-y-3">
                    {RECOMMENDATIONS.map((tip, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50 border border-secondary-100"
                        >
                            <TrendingUp className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
                            <p className="text-body-sm text-primary-700">{tip}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
            >
                <Button
                    onClick={resetTest}
                    variant="outline"
                    className="border-neutral-300"
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Ulangi Asesmen
                </Button>
                <Button className="bg-secondary-500 hover:bg-secondary-600 text-white">
                    <CheckCircle className="w-4 h-4 mr-2" /> Simpan ke Profil
                </Button>
            </motion.div>
        </div>
    );
}