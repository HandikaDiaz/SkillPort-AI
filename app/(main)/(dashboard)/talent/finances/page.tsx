"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Banknote,
    Clock,
    TrendingUp,
    Download,
    FileText,
    Building2,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBadge";
import { formatDate } from "@/lib/utils";

export default function TalentFinance() {
    const { data: session } = useSession();
    const [withdrawAmount, setWithdrawAmount] = useState("");

    // Gunakan wallet untuk saldo utama
    const wallet = useQuery(
        api.wallets.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    // Gunakan transactions (tabel terpisah dari escrowTransactions) untuk riwayat
    const transactions = useQuery(
        api.transactions.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    // Rekening bank tersimpan
    const bankAccounts = useQuery(
        api.bankAccounts.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );

    const createWithdrawal = useMutation(api.finances.createWithdrawal);

    const banks = ["BCA", "Mandiri", "BNI", "BRI", "CIMB Niaga"];
    const [selectedBank, setSelectedBank] = useState(banks[0]);
    const [accountNumber, setAccountNumber] = useState("");

    const handleWithdraw = async () => {
        if (!session?.user?.id || !withdrawAmount) return;

        try {
            await createWithdrawal({
                userId: session.user.id as any,
                amount: parseInt(withdrawAmount),
                bankName: selectedBank,
                accountNumber,
            });
            setWithdrawAmount("");
            setAccountNumber("");
            alert("Pencairan berhasil diajukan!");
        } catch (error) {
            alert("Gagal mengajukan pencairan");
        }
    };

    // Buat balance-like object dari wallet agar kompatibel dengan UI yang ada
    const balance = wallet
        ? {
            available: wallet.balance,
            pending: wallet.pendingSettlement,
            totalEarned: wallet.totalEarned,
        }
        : undefined;

    // const isLoading = wallet === undefined || transactions === undefined;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h1 text-primary-900">Keuangan & Pencairan</h1>
                <p className="text-body text-neutral-500 mt-1">
                    Kelola pendapatan dan pencairan dana Anda.
                </p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl border border-secondary-300 p-6 shadow-credential">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-body-sm text-neutral-500">
                            Tersedia untuk Dicairkan
                        </span>
                        <Banknote className="w-5 h-5 text-secondary-600" />
                    </div>
                    <p className="text-data-lg text-primary-900">
                        {`IDR ${(balance?.available || 0).toLocaleString()}`}
                    </p>
                    <p className="text-body-sm text-neutral-500 mt-1">
                        $ {((balance?.available || 0) / 15600).toFixed(0)}
                    </p>
                    <Button
                        size="sm"
                        className="mt-4 bg-secondary-500 hover:bg-secondary-600 text-white w-full"
                        onClick={() => document.getElementById("withdraw-form")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        Cairkan ke Rekening
                    </Button>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-body-sm text-neutral-500">
                            Menunggu Settlement
                        </span>
                        <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <p className="text-data-lg text-primary-900">
                        {`IDR ${(balance?.pending || 0).toLocaleString()}`}
                    </p>
                    <p className="text-body-sm text-neutral-500 mt-1">
                        milestone menunggu approval
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-body-sm text-neutral-500">
                            Total Pendapatan
                        </span>
                        <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-data-lg text-primary-900">
                        {`IDR ${(balance?.totalEarned || 0).toLocaleString()}`}
                    </p>
                    <p className="text-body-sm text-neutral-500 mt-1">
                        sejak bergabung
                    </p>
                </div>
            </div>

            {/* Withdrawal Form */}
            <div id="withdraw-form" className="bg-white rounded-xl border border-neutral-200 p-6">
                <h2 className="text-h3 text-primary-900 mb-6">
                    Pencairan ke Rekening
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Pilih Bank
                            </label>
                            <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info bg-white text-primary-700"
                            >
                                {banks.map((bank) => (
                                    <option key={bank} value={bank} className="text-primary-700">
                                        {bank}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Nomor Rekening
                            </label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="1234 5678 9012"
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                            />
                        </div>
                        <div>
                            <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                Jumlah (IDR)
                            </label>
                            <input
                                type="number"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="Minimal Rp 100,000"
                                className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                            />
                            <p className="text-caption text-neutral-500 mt-1">
                                Maksimal: IDR {(balance?.available || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Building2 className="w-5 h-5 text-primary-600" />
                                <span className="text-body-sm font-medium text-primary-800">
                                    Ringkasan
                                </span>
                            </div>
                            <div className="space-y-2 text-body-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Jumlah</span>
                                    <span className="text-primary-800">
                                        {withdrawAmount
                                            ? `IDR ${parseInt(withdrawAmount).toLocaleString()}`
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Biaya</span>
                                    <span className="text-success">Rp 0 (gratis)</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="font-medium text-primary-800">
                                        Total Diterima
                                    </span>
                                    <span className="font-medium text-primary-800">
                                        {withdrawAmount
                                            ? `IDR ${parseInt(withdrawAmount).toLocaleString()}`
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-info-light border border-info/20">
                            <Clock className="w-4 h-4 text-info flex-shrink-0" />
                            <p className="text-caption text-info">
                                Estimasi pencairan: &lt;30 menit. Biaya: Rp 0 (gratis).
                            </p>
                        </div>
                        <Button
                            className="w-full bg-secondary-500 hover:bg-secondary-600 text-white"
                            disabled={
                                !withdrawAmount ||
                                parseInt(withdrawAmount) < 100000 ||
                                parseInt(withdrawAmount) > (balance?.available || 0) ||
                                !accountNumber
                            }
                            onClick={handleWithdraw}
                        >
                            Ajukan Pencairan <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-h3 text-primary-900">Riwayat Transaksi</h2>
                    <Button variant="outline" size="sm" className="border-neutral-300">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200">
                                <th className="text-left text-caption font-medium text-neutral-500 pb-3 pr-4">
                                    Tanggal
                                </th>
                                <th className="text-left text-caption font-medium text-neutral-500 pb-3 pr-4">
                                    Tipe
                                </th>
                                <th className="text-left text-caption font-medium text-neutral-500 pb-3 pr-4">
                                    Proyek
                                </th>
                                <th className="text-left text-caption font-medium text-neutral-500 pb-3 pr-4">
                                    Jumlah
                                </th>
                                <th className="text-left text-caption font-medium text-neutral-500 pb-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                                        Belum ada transaksi
                                    </td>
                                </tr>
                            ) : (
                                transactions?.map((tx) => (
                                    <tr
                                        key={tx._id}
                                        className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50"
                                    >
                                        <td className="py-4 pr-4 text-body-sm text-neutral-600">
                                            {formatDate(tx.createdAt)}
                                        </td>
                                        <td className="py-4 pr-4">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-caption font-medium ${tx.type === "withdrawal" || tx.type === "escrow_release"
                                                    ? "bg-info-light text-info"
                                                    : tx.type === "escrow_in"
                                                        ? "bg-success-light text-success"
                                                        : "bg-error-light text-error"
                                                    }`}
                                            >
                                                {tx.type === "withdrawal"
                                                    ? "Pencairan"
                                                    : tx.type === "escrow_release"
                                                        ? "Escrow Keluar"
                                                        : tx.type === "escrow_in"
                                                            ? "Escrow Masuk"
                                                            : "Refund"}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-body-sm text-primary-800">
                                            {tx.projectName}
                                        </td>
                                        <td className="py-4 pr-4 text-body-sm text-primary-800">
                                            IDR {tx.amount.toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge
                                                status={
                                                    tx.status === "success"
                                                        ? "success"
                                                        : tx.status === "pending" || tx.status === "processing"
                                                            ? "warning"
                                                            : "error"
                                                }
                                                label={
                                                    tx.status === "success"
                                                        ? "Berhasil"
                                                        : tx.status === "pending"
                                                            ? "Diproses"
                                                            : tx.status === "processing"
                                                                ? "Diproses"
                                                                : "Gagal"
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tax Report */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <div>
                            <h3 className="text-h4 text-primary-900">
                                Laporan Pajak 2026
                            </h3>
                            <p className="text-body-sm text-neutral-500">
                                Total pendapatan: IDR {(balance?.totalEarned || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-neutral-300">
                            <FileText className="w-4 h-4 mr-2" /> Lihat Invoice
                        </Button>
                        <Button
                            size="sm"
                            className="bg-primary-900 hover:bg-primary-800 text-white"
                        >
                            <Download className="w-4 h-4 mr-2" /> Unduh Ringkasan PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}