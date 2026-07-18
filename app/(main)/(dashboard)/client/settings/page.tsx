"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    User,
    FileText,
    CreditCard,
    Bell,
    Shield,
    Camera,
    CheckCircle,
    Smartphone,
    Mail,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
    { id: "account", label: "Akun", icon: User },
    { id: "tax", label: "Dokumen Pajak", icon: FileText },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "security", label: "Keamanan", icon: Shield },
];

export default function ClientSettings() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("account");
    const [saved, setSaved] = useState(false);

    const settings = useQuery(
        api.userSettings.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );
    const bankAccounts = useQuery(
        api.bankAccounts.getByUser,
        session?.user?.id ? { userId: session.user.id as any } : "skip"
    );

    const updateSettings = useMutation(api.userSettings.upsert);
    const updateAvatar = useMutation(api.settings.updateAvatar);
    const removeBankAccount = useMutation(api.bankAccounts.remove);
    const setDefaultBankAccount = useMutation(api.bankAccounts.setDefault);

    const handleDeleteBankAccount = async (id: any) => {
        try {
            await removeBankAccount({ bankAccountId: id });
        } catch (error) {
            console.error("Gagal menghapus rekening bank:", error);
        }
    };

    const handleSetDefaultBankAccount = async (id: any) => {
        if (!session?.user?.id) return;
        try {
            await setDefaultBankAccount({
                bankAccountId: id,
                userId: session.user.id as any,
            });
        } catch (error) {
            console.error("Gagal menetapkan rekening default:", error);
        }
    };

    const isLoading = settings === undefined;

    const handleSave = async () => {
        if (!session?.user?.id) return;

        try {
            await updateSettings({
                userId: session.user.id as any,
                displayName,
                title,
                bio,
                location,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    };

    const [displayName, setDisplayName] = useState(session?.user?.name || "");
    const [title, setTitle] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [company, setCompany] = useState("");
    const [website, setWebsite] = useState("");

    const [notifications, setNotifications] = useState({
        milestoneApproved: true,
        paymentReceived: true,
        newProposal: false,
        deadlineReminder: true,
        weeklySummary: false,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleItems = [
        { key: "milestoneApproved" as const, label: "Milestone approval" },
        { key: "paymentReceived" as const, label: "Payment released" },
        { key: "newProposal" as const, label: "New proposal" },
        { key: "deadlineReminder" as const, label: "Deadline reminder" },
        { key: "weeklySummary" as const, label: "Weekly summary" },
    ];

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center h-64">
    //             <div className="animate-spin w-8 h-8 border-2 border-secondary-500 border-t-transparent rounded-full"></div>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h1 text-primary-900">Pengaturan & Kepatuhan</h1>
                <p className="text-body text-neutral-500 mt-1">
                    Kelola akun dan preferensi Anda.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Tab Navigation */}
                <div className="lg:w-52 flex lg:flex-col gap-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? "bg-primary-900 text-white"
                                : "text-primary-700 hover:bg-neutral-100"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-6">
                    {/* Account Tab */}
                    {activeTab === "account" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Profil Akun</h2>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={
                                            session?.user?.image ||
                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`
                                        }
                                        alt=""
                                        className="w-20 h-20 rounded-full border-2 border-neutral-200"
                                    />
                                    <button
                                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-900 text-white flex items-center justify-center hover:bg-primary-800 transition-colors"
                                        onClick={() => {
                                            // Handle avatar upload
                                        }}
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-h4 text-primary-900">
                                        {session?.user?.name}
                                    </p>
                                    <p className="text-body-sm text-neutral-500">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={session?.user?.email || ""}
                                        readOnly
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm bg-neutral-50 text-neutral-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        placeholder="Nama perusahaan"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Jakarta, Indonesia"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Bio
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={3}
                                        placeholder="Ceritakan sedikit tentang Anda..."
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t">
                                <Button
                                    onClick={handleSave}
                                    className="bg-primary-900 hover:bg-primary-800 text-white"
                                    disabled={saved}
                                >
                                    {saved ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" /> Tersimpan!
                                        </>
                                    ) : (
                                        "Simpan Perubahan"
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tax Tab */}
                    {activeTab === "tax" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Dokumen Pajak</h2>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-info-light border border-info/20">
                                <FileText className="w-5 h-5 text-info" />
                                <p className="text-body-sm text-info">
                                    Dokumen pajak di-generate otomatis berdasarkan transaksi Anda.
                                </p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    "W-8BEN (Non-US)",
                                    "W-9 (US Person)",
                                    "Invoice Template",
                                    "Tax Report 2026",
                                ].map((doc, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-neutral-400" />
                                            <span className="text-body-sm font-medium text-primary-800">
                                                {doc}
                                            </span>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-xs">
                                            Unduh PDF
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Billing Tab */}
                    {activeTab === "billing" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Metode Pembayaran</h2>

                            {/* Bank Accounts dari Convex */}
                            <div className="space-y-3">
                                {bankAccounts?.map((account: { _id: string; bankName: string; accountNumber: string; accountHolder: string; isDefault: boolean }) => (
                                    <div
                                        key={account._id}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${account.isDefault
                                            ? "border-secondary-300 bg-secondary-50"
                                            : "border-neutral-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5 text-secondary-600" />
                                            <div>
                                                <p className="text-body-sm font-medium text-primary-800">
                                                    {account.bankName}
                                                </p>
                                                <p className="text-caption text-neutral-500">
                                                    **** {account.accountNumber.slice(-4)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {account.isDefault ? (
                                                <span className="px-2 py-1 rounded-full bg-secondary-500 text-white text-caption font-medium">
                                                    Default
                                                </span>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-caption text-neutral-500 hover:text-primary-900"
                                                    onClick={() => handleSetDefaultBankAccount(account._id)}
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-error hover:bg-error-light p-1 h-8 w-8"
                                                onClick={() => handleDeleteBankAccount(account._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {(!bankAccounts || bankAccounts.length === 0) && (
                                    <p className="text-body-sm text-neutral-500 text-center py-4">
                                        Belum ada metode pembayaran
                                    </p>
                                )}
                            </div>

                            <Button variant="outline" className="border-neutral-300">
                                + Tambah Metode
                            </Button>

                            <div className="pt-6 border-t">
                                <h3 className="text-h4 text-primary-900 mb-4">
                                    Riwayat Billing
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        {
                                            date: "2026-06-15",
                                            desc: "Escrow Deposit - Website Redesign",
                                            amount: "$5,000",
                                            status: "success",
                                        },
                                        {
                                            date: "2026-06-01",
                                            desc: "Platform Fee",
                                            amount: "$62.50",
                                            status: "success",
                                        },
                                        {
                                            date: "2026-05-20",
                                            desc: "Escrow Deposit - UI Animation",
                                            amount: "$3,500",
                                            status: "success",
                                        },
                                    ].map((bill, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                                        >
                                            <div>
                                                <p className="text-body-sm text-primary-800">
                                                    {bill.desc}
                                                </p>
                                                <p className="text-caption text-neutral-500">
                                                    {bill.date}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-body-sm font-medium text-primary-800">
                                                    {bill.amount}
                                                </span>
                                                <span className="px-2 py-1 rounded-full bg-success-light text-success text-caption font-medium">
                                                    Paid
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">
                                Preferensi Notifikasi
                            </h2>

                            <div>
                                <h3 className="text-h4 text-primary-800 mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email
                                </h3>
                                <div className="space-y-3">
                                    {toggleItems.map((item) => (
                                        <label
                                            key={item.key}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                                        >
                                            <span className="text-body-sm text-primary-700">
                                                {item.label}
                                            </span>
                                            <button
                                                onClick={() => toggleNotification(item.key)}
                                                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key]
                                                    ? "bg-secondary-500"
                                                    : "bg-neutral-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key]
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                        }`}
                                                ></div>
                                            </button>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-h4 text-primary-800 mb-3 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" /> Push Notification
                                </h3>
                                <div className="space-y-3">
                                    {toggleItems.slice(0, 3).map((item) => (
                                        <label
                                            key={item.key}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                                        >
                                            <span className="text-body-sm text-primary-700">
                                                {item.label}
                                            </span>
                                            <button
                                                onClick={() => toggleNotification(item.key)}
                                                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[item.key]
                                                    ? "bg-secondary-500"
                                                    : "bg-neutral-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key]
                                                        ? "translate-x-6"
                                                        : "translate-x-1"
                                                        }`}
                                                ></div>
                                            </button>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Keamanan</h2>

                            <div>
                                <h3 className="text-h4 text-primary-800 mb-4">Ubah Password</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Password Saat Ini
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Minimal 8 karakter"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Konfirmasi Password Baru
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Ulangi password baru"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <Button className="bg-primary-900 hover:bg-primary-800 text-white w-fit">
                                        Update Password
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <h3 className="text-h4 text-primary-800 mb-4">
                                    Two-Factor Authentication
                                </h3>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-secondary-600" />
                                        <div>
                                            <p className="text-body-sm font-medium text-primary-800">
                                                Authenticator App
                                            </p>
                                            <p className="text-caption text-neutral-500">
                                                Menggunakan Google Authenticator
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-11 h-6 rounded-full bg-secondary-500 relative">
                                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-error/20">
                                <h3 className="text-h4 text-error mb-4">Danger Zone</h3>
                                <div className="p-4 rounded-lg border border-error/30 bg-error-light">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-body-sm font-medium text-error">
                                                Hapus Akun
                                            </p>
                                            <p className="text-caption text-error/70">
                                                Tindakan ini tidak dapat dibatalkan.
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="border-error text-error hover:bg-error hover:text-white"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}