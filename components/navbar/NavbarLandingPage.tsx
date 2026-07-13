"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { SignOutButton } from "../auth/AuthButtons";
import Image from "next/image";

function NavbarLandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const publicNavLinks = [
        { label: "Fitur", href: "#features" },
        { label: "Cara Kerja", href: "#how-it-works" },
        { label: "Harga", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-sm shadow-md"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <span
                            className={`text-h3 font-bold ${
                                scrolled ? "text-primary-900" : "text-white"
                            }`}
                        >
                            SkillPort
                        </span>
                        <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {publicNavLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-body-sm font-medium transition-colors ${
                                    scrolled
                                        ? "text-primary-700 hover:text-primary-900"
                                        : "text-white/80 hover:text-white"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {status === "loading" ? (
                            <div className="w-20 h-8 rounded-xl bg-neutral-200 animate-pulse"></div>
                        ) : session ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name || "User Avatar"}
                                            width={32}
                                            height={32}
                                            className="rounded-full border border-neutral-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center border border-neutral-200">
                                            <UserIcon className="w-4 h-4 text-secondary-600" />
                                        </div>
                                    )}
                                    <span
                                        className={`text-sm font-medium ${
                                            scrolled
                                                ? "text-primary-900"
                                                : "text-white"
                                        }`}
                                    >
                                        {session.user?.name || "User"}
                                    </span>
                                </div>
                                <SignOutButton />
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className={
                                        scrolled
                                            ? "text-primary-700"
                                            : "text-white hover:text-white hover:bg-white/10"
                                    }
                                >
                                    <Link href="/login">Masuk</Link>
                                </Button>
                                <Button className="bg-secondary-500 hover:bg-secondary-600 text-white">
                                    <Link href="/register">Daftar</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger className="md:hidden">
                            <Menu className={`w-6 h-6 ${scrolled ? 'text-primary-900' : 'text-white'}`} />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col gap-6 mt-8">
                                {publicNavLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-h4 text-primary-700 hover:text-primary-900"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                                    {status === "loading" ? (
                                        <div className="w-full h-10 rounded-xl bg-neutral-200 animate-pulse"></div>
                                    ) : session ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2 px-2">
                                                {session.user?.image ? (
                                                    <Image
                                                        src={session.user.image}
                                                        alt={session.user.name || "User Avatar"}
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full border border-neutral-200"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center border border-neutral-200">
                                                        <UserIcon className="w-5 h-5 text-secondary-600" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-primary-900">
                                                        {session.user?.name || "User"}
                                                    </span>
                                                    <span className="text-xs text-neutral-500">
                                                        {session.user?.email || ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div onClick={() => setMobileOpen(false)}>
                                                <SignOutButton />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center"
                                            >
                                                <Link
                                                    href="/login"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Masuk
                                                </Link>
                                            </Button>
                                            <Button className="w-full justify-center bg-secondary-500 hover:bg-secondary-600 text-white">
                                                <Link
                                                    href="/register"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    Daftar Gratis
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}

export default NavbarLandingPage;
