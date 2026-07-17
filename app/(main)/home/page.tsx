"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Star,
    MapPin,
    CheckCircle,
    Clock,
    TrendingUp,
    Sparkles,
    Zap,
    Globe,
    ChevronDown,
    Heart,
    Share2,
    ArrowRight,
    X,
    SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
interface Talent {
    id: string;
    name: string;
    role: string;
    tagline: string;
    avatar: string;
    coverImage: string;
    location: string;
    country: string;
    skills: string[];
    topSkills: string[];
    hourlyRate: number;
    projectRate: number;
    availability: "available" | "part_time" | "busy";
    credentialScore: number;
    isVerified: boolean;
    isTopRated: boolean;
    isRisingStar: boolean;
    completedProjects: number;
    rating: number;
    reviewCount: number;
    responseTime: string;
    languages: string[];
    badges: string[];
    portfolioPreview: { type: string; thumbnail: string }[];
    recentClients: { name: string; logo: string }[];
}

// --- Mock Data ---
const TALENTS: Talent[] = [
    {
        id: "t1",
        name: "Budi Santoso",
        role: "UI/UX Designer",
        tagline: "Crafting pixel-perfect experiences that convert visitors into customers",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop",
        location: "Jakarta",
        country: "ID",
        skills: ["UI Design", "UX Research", "Figma", "Prototyping", "Design Systems", "User Testing"],
        topSkills: ["Figma", "UI Design", "Design Systems"],
        hourlyRate: 25,
        projectRate: 1500,
        availability: "available",
        credentialScore: 94,
        isVerified: true,
        isTopRated: true,
        isRisingStar: false,
        completedProjects: 47,
        rating: 4.9,
        reviewCount: 38,
        responseTime: "< 2 jam",
        languages: ["Indonesia", "English"],
        badges: ["Top Rated", "100% On-Time", "5-Star Reviews"],
        portfolioPreview: [
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "Gojek", logo: "G" },
            { name: "Tokopedia", logo: "T" },
            { name: "Traveloka", logo: "Tr" },
        ],
    },
    {
        id: "t2",
        name: "Ani Wijaya",
        role: "Motion Designer",
        tagline: "Bringing brands to life through captivating motion and storytelling",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ani",
        coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=300&fit=crop",
        location: "Bandung",
        country: "ID",
        skills: ["After Effects", "Motion Graphics", "Cinema 4D", "Animation", "Lottie", "Video Editing"],
        topSkills: ["Motion Graphics", "After Effects", "Lottie"],
        hourlyRate: 35,
        projectRate: 2500,
        availability: "available",
        credentialScore: 91,
        isVerified: true,
        isTopRated: true,
        isRisingStar: false,
        completedProjects: 32,
        rating: 4.8,
        reviewCount: 29,
        responseTime: "< 4 jam",
        languages: ["Indonesia", "English"],
        badges: ["Top Rated", "Creative Excellence"],
        portfolioPreview: [
            { type: "video", thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=150&fit=crop" },
            { type: "video", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "Netflix", logo: "N" },
            { name: "Spotify", logo: "S" },
        ],
    },
    {
        id: "t3",
        name: "Dewi Kusuma",
        role: "3D Artist & Visualizer",
        tagline: "Transforming ideas into stunning 3D realities",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi",
        coverImage: "https://images.unsplash.com/photo-1633218388467-539651dcf81a?w=600&h=300&fit=crop",
        location: "Yogyakarta",
        country: "ID",
        skills: ["Blender", "3D Modeling", "Texturing", "Rendering", "Unreal Engine", "Product Viz"],
        topSkills: ["Blender", "3D Modeling", "Product Visualization"],
        hourlyRate: 40,
        projectRate: 3000,
        availability: "part_time",
        credentialScore: 88,
        isVerified: true,
        isTopRated: false,
        isRisingStar: true,
        completedProjects: 18,
        rating: 4.9,
        reviewCount: 15,
        responseTime: "< 6 jam",
        languages: ["Indonesia", "English", "Japanese"],
        badges: ["Rising Star", "Quick Responder"],
        portfolioPreview: [
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "IKEA", logo: "I" },
            { name: "Nike", logo: "Nk" },
        ],
    },
    {
        id: "t4",
        name: "Rudi Hartono",
        role: "Illustrator & Visual Artist",
        tagline: "Creating unique visual narratives that speak louder than words",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rudi",
        coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=300&fit=crop",
        location: "Surabaya",
        country: "ID",
        skills: ["Illustration", "Vector Art", "Character Design", "Digital Painting", "NFT Art", "Concept Art"],
        topSkills: ["Illustration", "Character Design", "Digital Painting"],
        hourlyRate: 28,
        projectRate: 1800,
        availability: "available",
        credentialScore: 85,
        isVerified: true,
        isTopRated: false,
        isRisingStar: true,
        completedProjects: 62,
        rating: 4.7,
        reviewCount: 51,
        responseTime: "< 3 jam",
        languages: ["Indonesia", "English"],
        badges: ["Rising Star", "Most Hired"],
        portfolioPreview: [
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "Disney", logo: "D" },
            { name: "Marvel", logo: "M" },
        ],
    },
    {
        id: "t5",
        name: "Siti Rahayu",
        role: "Brand Strategist & Designer",
        tagline: "Building brands that people fall in love with",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
        coverImage: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=300&fit=crop",
        location: "Jakarta",
        country: "ID",
        skills: ["Branding", "Logo Design", "Identity", "Print Design", "Packaging", "Brand Strategy"],
        topSkills: ["Branding", "Logo Design", "Brand Strategy"],
        hourlyRate: 45,
        projectRate: 3500,
        availability: "busy",
        credentialScore: 96,
        isVerified: true,
        isTopRated: true,
        isRisingStar: false,
        completedProjects: 89,
        rating: 5.0,
        reviewCount: 72,
        responseTime: "< 12 jam",
        languages: ["Indonesia", "English", "Mandarin"],
        badges: ["Top Rated", "Elite Talent", "100+ Projects"],
        portfolioPreview: [
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "Apple", logo: "A" },
            { name: "Google", logo: "G" },
            { name: "Microsoft", logo: "Ms" },
        ],
    },
    {
        id: "t6",
        name: "Agus Pratama",
        role: "Full-Stack Developer",
        tagline: "Engineering scalable solutions with cutting-edge technology",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Agus",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop",
        location: "Bandung",
        country: "ID",
        skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "DevOps"],
        topSkills: ["Next.js", "React", "TypeScript"],
        hourlyRate: 38,
        projectRate: 2800,
        availability: "available",
        credentialScore: 90,
        isVerified: true,
        isTopRated: true,
        isRisingStar: false,
        completedProjects: 54,
        rating: 4.8,
        reviewCount: 43,
        responseTime: "< 1 jam",
        languages: ["Indonesia", "English"],
        badges: ["Top Rated", "Quick Responder", "Tech Expert"],
        portfolioPreview: [
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop" },
            { type: "image", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=150&fit=crop" },
        ],
        recentClients: [
            { name: "Stripe", logo: "St" },
            { name: "Vercel", logo: "V" },
        ],
    },
];

const CATEGORIES = [
    { id: "all", label: "Semua", icon: Globe },
    { id: "ui-ux", label: "UI/UX Design", icon: Sparkles },
    { id: "motion", label: "Motion Graphics", icon: Zap },
    { id: "3d", label: "3D & Visualization", icon: TrendingUp },
    { id: "illustration", label: "Illustration", icon: Star },
    { id: "branding", label: "Branding", icon: CheckCircle },
    { id: "dev", label: "Development", icon: Clock },
];

const SORT_OPTIONS = [
    { id: "recommended", label: "Rekomendasi" },
    { id: "top-rated", label: "Rating Tertinggi" },
    { id: "newest", label: "Terbaru" },
    { id: "price-low", label: "Harga: Rendah ke Tinggi" },
    { id: "price-high", label: "Harga: Tinggi ke Rendah" },
];

// --- Components ---

function TalentCard({ talent, index }: { talent: Talent; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 hover:-translate-y-1">
                {/* Cover Image */}
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={talent.coverImage}
                        alt={talent.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {talent.isTopRated && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Top Rated
                            </span>
                        )}
                        {talent.isRisingStar && (
                            <span className="px-2.5 py-1 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Rising Star
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLiked ? "bg-red-500 text-white" : "bg-white/90 text-neutral-600 hover:bg-white"
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/90 text-neutral-600 hover:bg-white flex items-center justify-center transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Avatar Overlay */}
                    <div className="absolute -bottom-8 left-5">
                        <div className="relative">
                            <img
                                src={talent.avatar}
                                alt={talent.name}
                                className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg"
                            />
                            {talent.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-10 px-5 pb-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-primary-900 group-hover:text-secondary-600 transition-colors">
                                {talent.name}
                            </h3>
                            <p className="text-sm text-neutral-500">{talent.role}</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold">{talent.rating}</span>
                            </div>
                            <p className="text-xs text-neutral-400">({talent.reviewCount} reviews)</p>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                        {talent.tagline}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {talent.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {talent.responseTime}
                        </span>
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {talent.completedProjects} proyek
                        </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {talent.topSkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2.5 py-1 rounded-lg bg-secondary-50 text-secondary-700 text-xs font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                        {talent.skills.length > 3 && (
                            <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-500 text-xs">
                                +{talent.skills.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Portfolio Preview */}
                    <div className="flex gap-2 mb-4">
                        {talent.portfolioPreview.map((item, i) => (
                            <div
                                key={i}
                                className="relative flex-1 h-20 rounded-lg overflow-hidden group/item cursor-pointer"
                            >
                                <img
                                    src={item.thumbnail}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/30 transition-colors flex items-center justify-center">
                                    {item.type === "video" && (
                                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <Zap className="w-4 h-4 text-primary-900" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Clients */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-neutral-400">Klien terbaru:</span>
                        <div className="flex -space-x-2">
                            {talent.recentClients.map((client, i) => (
                                <div
                                    key={i}
                                    className="w-7 h-7 rounded-full bg-primary-900 text-white text-xs font-bold flex items-center justify-center border-2 border-white"
                                    title={client.name}
                                >
                                    {client.logo}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div>
                            <p className="text-lg font-bold text-primary-900">
                                ${talent.projectRate.toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-400">per proyek</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className={`px-3 py-1.5 rounded-full text-xs font-medium ${talent.availability === "available"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : talent.availability === "part_time"
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-red-50 text-red-700"
                                    }`}
                            >
                                {talent.availability === "available"
                                    ? "Tersedia"
                                    : talent.availability === "part_time"
                                        ? "Paruh Waktu"
                                        : "Sibuk"}
                            </span>
                            <Button
                                size="sm"
                                className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl px-4"
                            >
                                Undang <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function FilterSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [priceRange, setPriceRange] = useState([500, 5000]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const allSkills = Array.from(new Set(TALENTS.flatMap((t) => t.skills)));

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto lg:relative lg:w-64 lg:shadow-none lg:bg-transparent lg:block"
                    >
                        <div className="p-6 lg:p-0">
                            <div className="flex items-center justify-between mb-6 lg:hidden">
                                <h3 className="text-lg font-bold text-primary-900">Filter</h3>
                                <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-primary-900 mb-3">Rentang Harga</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-1 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
                                        <span className="text-xs text-neutral-400">Min</span>
                                        <p className="text-sm font-medium">${priceRange[0]}</p>
                                    </div>
                                    <span className="text-neutral-400">-</span>
                                    <div className="flex-1 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
                                        <span className="text-xs text-neutral-400">Max</span>
                                        <p className="text-sm font-medium">${priceRange[1]}</p>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full accent-secondary-500"
                                />
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-primary-900 mb-3">Keahlian</h4>
                                <div className="flex flex-wrap gap-2">
                                    {allSkills.slice(0, 12).map((skill) => (
                                        <button
                                            key={skill}
                                            onClick={() =>
                                                setSelectedSkills((prev) =>
                                                    prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedSkills.includes(skill)
                                                    ? "bg-secondary-500 text-white"
                                                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-primary-900 mb-3">Ketersediaan</h4>
                                <div className="space-y-2">
                                    {["available", "part_time", "busy"].map((status) => (
                                        <label key={status} className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 accent-secondary-500 rounded" />
                                            <span className="text-sm text-neutral-600 capitalize">
                                                {status === "available" ? "Tersedia" : status === "part_time" ? "Paruh Waktu" : "Sibuk"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-primary-900 mb-3">Minimum Rating</h4>
                                <div className="flex gap-2">
                                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                                        <button
                                            key={rating}
                                            className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
                                        >
                                            {rating}+
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button className="w-full bg-secondary-500 hover:bg-secondary-600 text-white">
                                Terapkan Filter
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// --- Main Page ---

export default function TalentDiscoveryPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortBy, setSortBy] = useState("recommended");
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredTalents = TALENTS.filter((talent) => {
        if (activeCategory !== "all") {
            // Simple category matching
            const categoryMap: Record<string, string[]> = {
                "ui-ux": ["UI/UX Designer"],
                motion: ["Motion Designer"],
                "3d": ["3D Artist"],
                illustration: ["Illustrator"],
                branding: ["Brand Strategist"],
                dev: ["Developer"],
            };
            if (!categoryMap[activeCategory]?.some((r) => talent.role.includes(r))) return false;
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                talent.name.toLowerCase().includes(q) ||
                talent.role.toLowerCase().includes(q) ||
                talent.skills.some((s) => s.toLowerCase().includes(q))
            );
        }
        return true;
    });

    const sortedTalents = [...filteredTalents].sort((a, b) => {
        switch (sortBy) {
            case "top-rated":
                return b.rating - a.rating;
            case "price-low":
                return a.projectRate - b.projectRate;
            case "price-high":
                return b.projectRate - a.projectRate;
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="relative bg-primary-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-secondary-300 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Temukan 1,240+ talenta kreatif terbaik Indonesia</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Hire Talenta Kreatif <br />
                            <span className="text-secondary-400">Tanpa Ribet</span>
                        </h1>
                        <p className="text-lg text-primary-300 mb-10 leading-relaxed">
                            Dari UI/UX designer, motion artist, hingga developer — semua dalam satu platform dengan escrow protection dan AI-powered matching.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 p-2">
                                <Search className="w-5 h-5 text-neutral-400 ml-4" />
                                <input
                                    type="text"
                                    placeholder="Cari nama, keahlian, atau role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-3 text-primary-900 outline-none text-base"
                                />
                                <Button className="bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl px-6 py-3">
                                    Cari
                                </Button>
                            </div>
                        </div>

                        {/* Quick Tags */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {["UI Designer", "Motion Graphics", "3D Artist", "React Developer", "Brand Identity"].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm hover:bg-white/20 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Category Bar */}
            <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                            ? "bg-primary-900 text-white shadow-lg shadow-primary-900/20"
                                            : "text-neutral-600 hover:bg-neutral-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-neutral-500">
                            Menampilkan <span className="font-semibold text-primary-900">{sortedTalents.length}</span> talenta
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-700 hover:border-neutral-300 transition-colors"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <AnimatePresence>
                                {showSortDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-xl z-20 py-2"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => {
                                                    setSortBy(option.id);
                                                    setShowSortDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${sortBy === option.id ? "text-secondary-600 font-medium" : "text-neutral-600"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Filter Toggle */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden border-neutral-300"
                        >
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex gap-8">
                    {/* Filters - Desktop */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar isOpen={true} onClose={() => { }} />
                    </div>

                    {/* Filters - Mobile */}
                    <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />

                    {/* Talent Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedTalents.map((talent, i) => (
                                <TalentCard key={talent.id} talent={talent} index={i} />
                            ))}
                        </div>

                        {sortedTalents.length === 0 && (
                            <div className="text-center py-20">
                                <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-primary-900 mb-2">Tidak ada talenta ditemukan</h3>
                                <p className="text-neutral-500">Coba ubah filter atau kata kunci pencarian Anda</p>
                            </div>
                        )}

                        {/* Load More */}
                        {sortedTalents.length > 0 && (
                            <div className="text-center mt-10">
                                <Button
                                    variant="outline"
                                    className="border-neutral-300 px-8 py-3 rounded-xl"
                                >
                                    Muat Lebih Banyak
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}