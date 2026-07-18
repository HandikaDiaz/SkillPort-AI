"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    User,
    Briefcase,
    Shield,
    Bell,
    Settings as SettingsIcon,
    Camera,
    CheckCircle,
    Trash2,
    ExternalLink,
    Plus,
    X,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TABS = [
    { id: "profile", label: "Profil Publik", icon: User },
    { id: "portfolio", label: "Portofolio", icon: Briefcase },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "preferences", label: "Preferensi Kerja", icon: SettingsIcon },
];

const DEFAULT_NOTIFICATIONS = [
    { key: "notifyMilestoneApproved", label: "Milestone approved", checked: true },
    { key: "notifyPaymentReceived", label: "Payment received", checked: true },
    { key: "notifyByocInvite", label: "New BYOC invite", checked: false },
    { key: "notifyDeadlineReminder", label: "Deadline reminder", checked: true },
    { key: "notifyWeeklySummary", label: "Weekly summary", checked: false },
];

export default function TalentSettings() {
    const { data: session } = useSession();
    const userId = session?.user?.id as any;

    const settings = useQuery(
        api.userSettings.getByUser,
        userId ? { userId } : "skip"
    );
    const upsertSettings = useMutation(api.userSettings.upsert);

    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");

    const [formData, setFormData] = useState({
        displayName: "",
        title: "",
        bio: "",
        location: "",
        languages: "",
        hourlyRate: "",
        projectRate: "",
        githubUrl: "",
        behanceUrl: "",
        dribbbleUrl: "",
        projectTypes: [] as string[],
        minBudget: "",
        maxBudget: "",
        preferredRegions: [] as string[],
        availability: [] as string[],
        notifications: {} as Record<string, boolean>,
    });

    useEffect(() => {
        if (settings) {
            setSkills(settings.skills || []);
            setFormData({
                displayName: settings.displayName || session?.user?.name || "",
                title: settings.title || "",
                bio: settings.bio || "",
                location: settings.location || "",
                languages: settings.languages?.join(", ") || "",
                hourlyRate: settings.hourlyRate?.toString() || "",
                projectRate: settings.projectRate?.toString() || "",
                githubUrl: settings.githubUrl || "",
                behanceUrl: settings.behanceUrl || "",
                dribbbleUrl: settings.dribbbleUrl || "",
                projectTypes: settings.projectTypes || [],
                minBudget: settings.minBudget?.toString() || "",
                maxBudget: settings.maxBudget?.toString() || "",
                preferredRegions: settings.preferredRegions || [],
                availability: settings.availability || [],
                notifications: {
                    notifyMilestoneApproved: settings.notifyMilestoneApproved ?? true,
                    notifyPaymentReceived: settings.notifyPaymentReceived ?? true,
                    notifyByocInvite: settings.notifyByocInvite ?? false,
                    notifyDeadlineReminder: settings.notifyDeadlineReminder ?? true,
                    notifyWeeklySummary: settings.notifyWeeklySummary ?? false,
                },
            });
        }
    }, [settings, session]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await upsertSettings({
                userId,
                displayName: formData.displayName,
                title: formData.title,
                bio: formData.bio,
                location: formData.location,
                languages: formData.languages.split(",").map((s) => s.trim()).filter(Boolean),
                hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
                projectRate: formData.projectRate ? parseFloat(formData.projectRate) : undefined,
                skills,
                githubUrl: formData.githubUrl || undefined,
                behanceUrl: formData.behanceUrl || undefined,
                dribbbleUrl: formData.dribbbleUrl || undefined,
                projectTypes: formData.projectTypes,
                minBudget: formData.minBudget ? parseFloat(formData.minBudget) : undefined,
                maxBudget: formData.maxBudget ? parseFloat(formData.maxBudget) : undefined,
                preferredRegions: formData.preferredRegions,
                availability: formData.availability,
                ...formData.notifications,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const toggleNotification = (key: string) => {
        setFormData((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key],
            },
        }));
    };

    const toggleArray = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => {
            const arr = prev[field] as string[];
            return {
                ...prev,
                [field]: arr.includes(value)
                    ? arr.filter((v) => v !== value)
                    : [...arr, value],
            };
        });
    };

    // if (settings === undefined) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[60vh]">
    //             <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-h1 text-primary-900">Profil & Pengaturan</h1>
                    <p className="text-body text-neutral-500 mt-1">
                        Kelola profil dan preferensi Anda.
                    </p>
                </div>
                <Link href={`/talent/${userId}`}>
                    <Button variant="outline" className="border-neutral-300">
                        <ExternalLink className="w-4 h-4 mr-2" /> Lihat Profil Publik
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-52 flex lg:flex-col gap-1 overflow-x-auto">
                    {TABS.map((tab) => (
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

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border border-neutral-200 p-6">
                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Profil Publik</h2>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={
                                            session?.user?.image ||
                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}`
                                        }
                                        alt=""
                                        className="w-24 h-24 rounded-full border-2 border-neutral-200"
                                    />
                                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-900 text-white flex items-center justify-center hover:bg-primary-800 transition-colors">
                                        <Camera className="w-4 h-4" />
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
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.displayName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, displayName: e.target.value })
                                            }
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Nama Panggilan
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Budi"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Judul Profesi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="Senior UI/UX Designer"
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) =>
                                            setFormData({ ...formData, bio: e.target.value })
                                        }
                                        placeholder="UI/UX Designer dengan pengalaman 3+ tahun..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info resize-none text-primary-700"
                                    />
                                    <p className="text-caption text-neutral-400 mt-1">
                                        {formData.bio.length}/300 karakter
                                    </p>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Lokasi
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) =>
                                                setFormData({ ...formData, location: e.target.value })
                                            }
                                            placeholder="Jakarta, Indonesia"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Bahasa
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.languages}
                                            onChange={(e) =>
                                                setFormData({ ...formData, languages: e.target.value })
                                            }
                                            placeholder="Indonesia, English"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Rate per Jam (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.hourlyRate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, hourlyRate: e.target.value })
                                            }
                                            placeholder="25"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Rate per Proyek (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.projectRate}
                                            onChange={(e) =>
                                                setFormData({ ...formData, projectRate: e.target.value })
                                            }
                                            placeholder="1500"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <SaveButton saved={saved} isSaving={isSaving} onSave={handleSave} />
                        </div>
                    )}

                    {/* Portfolio Tab */}
                    {activeTab === "portfolio" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Portofolio</h2>

                            <div>
                                <label className="block text-body-sm font-medium text-primary-700 mb-2">
                                    Skills
                                </label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-50 border border-secondary-200 text-body-sm text-secondary-700"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="hover:text-error"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && (e.preventDefault(), addSkill())
                                        }
                                        placeholder="Tambah skill..."
                                        className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                    />
                                    <Button
                                        onClick={addSkill}
                                        variant="outline"
                                        className="border-neutral-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <label className="block text-body-sm font-medium text-primary-700 mb-3">
                                    Link Integrasi
                                </label>
                                <div className="space-y-3">
                                    {[
                                        {
                                            name: "GitHub",
                                            url: formData.githubUrl,
                                            connected: !!formData.githubUrl,
                                        },
                                        {
                                            name: "Behance",
                                            url: formData.behanceUrl,
                                            connected: !!formData.behanceUrl,
                                        },
                                        {
                                            name: "Dribbble",
                                            url: formData.dribbbleUrl,
                                            connected: !!formData.dribbbleUrl,
                                        },
                                    ].map((link) => (
                                        <div
                                            key={link.name}
                                            className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-body-sm font-medium text-primary-800">
                                                    {link.name}
                                                </span>
                                                {link.url && (
                                                    <span className="text-caption text-neutral-500">
                                                        {link.url}
                                                    </span>
                                                )}
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={link.connected ? "outline" : "default"}
                                                className={
                                                    link.connected
                                                        ? "border-neutral-300 h-7 text-xs"
                                                        : "bg-primary-900 text-white h-7 text-xs"
                                                }
                                            >
                                                {link.connected ? "Terhubung" : "Hubungkan"}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <SaveButton saved={saved} isSaving={isSaving} onSave={handleSave} />
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Keamanan</h2>
                            <div>
                                <h3 className="text-h4 text-primary-800 mb-4">Ubah Password</h3>
                                <div className="grid gap-4 max-w-md">
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
                                <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 max-w-md">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-secondary-600" />
                                        <div>
                                            <p className="text-body-sm font-medium text-primary-800">
                                                Authenticator App
                                            </p>
                                            <p className="text-caption text-neutral-500">
                                                Google Authenticator
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
                                <div className="p-4 rounded-lg border border-error/30 bg-error-light max-w-md">
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
                                            className="border-error text-error hover:bg-error hover:text-white h-7 text-xs"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
                                        </Button>
                                    </div>
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
                            <div className="space-y-3">
                                {DEFAULT_NOTIFICATIONS.map((item) => (
                                    <label
                                        key={item.key}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                                    >
                                        <span className="text-body-sm text-primary-700">
                                            {item.label}
                                        </span>
                                        <div
                                            className={`w-11 h-6 rounded-full transition-colors relative ${formData.notifications[item.key]
                                                ? "bg-secondary-500"
                                                : "bg-neutral-300"
                                                }`}
                                            onClick={() => toggleNotification(item.key)}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.notifications[item.key]
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                                    }`}
                                            ></div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <SaveButton
                                saved={saved}
                                isSaving={isSaving}
                                onSave={handleSave}
                            />
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                        <div className="space-y-6">
                            <h2 className="text-h3 text-primary-900">Preferensi Kerja</h2>
                            <div className="grid gap-4">
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-2">
                                        Tipe Proyek
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Hourly", "Fixed-price", "Retainer"].map((type) => (
                                            <label
                                                key={type}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-neutral-50 ${formData.projectTypes.includes(type)
                                                    ? "border-secondary-500 bg-secondary-50"
                                                    : "border-neutral-200"
                                                    }`}
                                                onClick={() => toggleArray("projectTypes", type)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.projectTypes.includes(type)}
                                                    readOnly
                                                    className="rounded border-neutral-300 text-secondary-500 focus:ring-secondary-500"
                                                />
                                                <span className="text-body-sm text-primary-700">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Budget Minimum (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.minBudget}
                                            onChange={(e) =>
                                                setFormData({ ...formData, minBudget: e.target.value })
                                            }
                                            placeholder="500"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-body-sm font-medium text-primary-700 mb-1.5">
                                            Budget Maksimum (USD)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.maxBudget}
                                            onChange={(e) =>
                                                setFormData({ ...formData, maxBudget: e.target.value })
                                            }
                                            placeholder="10000"
                                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-info/20 focus:border-info text-primary-700"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-2">
                                        Preferensi Region
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Asia", "Eropa", "Amerika Utara", "Australia"].map(
                                            (region) => (
                                                <label
                                                    key={region}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-neutral-50 ${formData.preferredRegions.includes(region)
                                                        ? "border-secondary-500 bg-secondary-50"
                                                        : "border-neutral-200"
                                                        }`}
                                                    onClick={() =>
                                                        toggleArray("preferredRegions", region)
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.preferredRegions.includes(
                                                            region
                                                        )}
                                                        readOnly
                                                        className="rounded border-neutral-300 text-secondary-500 focus:ring-secondary-500"
                                                    />
                                                    <span className="text-body-sm text-primary-700">
                                                        {region}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-body-sm font-medium text-primary-700 mb-2">
                                        Ketersediaan
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Full-time", "Part-time", "Weekend only"].map((avail) => (
                                            <label
                                                key={avail}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-neutral-50 ${formData.availability.includes(avail)
                                                    ? "border-secondary-500 bg-secondary-50"
                                                    : "border-neutral-200"
                                                    }`}
                                                onClick={() => toggleArray("availability", avail)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.availability.includes(avail)}
                                                    readOnly
                                                    className="rounded border-neutral-300 text-secondary-500 focus:ring-secondary-500"
                                                />
                                                <span className="text-body-sm text-primary-700">
                                                    {avail}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <SaveButton
                                saved={saved}
                                isSaving={isSaving}
                                onSave={handleSave}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Save Button Component
function SaveButton({
    saved,
    isSaving,
    onSave,
}: {
    saved: boolean;
    isSaving: boolean;
    onSave: () => void;
}) {
    return (
        <div className="flex items-center gap-3 pt-4 border-t">
            <Button
                onClick={onSave}
                disabled={isSaving}
                className="bg-primary-900 hover:bg-primary-800 text-white"
            >
                {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : saved ? (
                    <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Tersimpan!
                    </>
                ) : (
                    "Simpan Perubahan"
                )}
            </Button>
        </div>
    );
}