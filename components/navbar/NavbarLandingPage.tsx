"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";

function NavbarLandingPage() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const publicNavLinks = [
        { label: 'Fitur', href: '#features' },
        { label: 'Cara Kerja', href: '#how-it-works' },
        { label: 'Harga', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <span className={`text-h3 font-bold ${scrolled ? 'text-primary-900' : 'text-white'}`}>SkillPort</span>
                        <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {publicNavLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-body-sm font-medium transition-colors ${scrolled ? 'text-primary-700 hover:text-primary-900' : 'text-white/80 hover:text-white'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" className={scrolled ? 'text-primary-700' : 'text-white hover:text-white hover:bg-white/10'}>
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button className="bg-secondary-500 hover:bg-secondary-600 text-white">
                            <Link href="/register">Daftar</Link>
                        </Button>
                    </div>

                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger className="md:hidden">
                            {/* <Button variant="ghost" size="sm" className={scrolled ? '' : 'text-white hover:text-white hover:bg-white/10'}> */}
                                <Menu className="w-6 h-6" />
                            {/* </Button> */}
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
                                    <Button variant="outline" className="w-full justify-center">
                                        <Link href="/login" onClick={() => setMobileOpen(false)}>Masuk</Link>
                                    </Button>
                                    <Button className="w-full justify-center bg-secondary-500 hover:bg-secondary-600 text-white">
                                        <Link href="/register" onClick={() => setMobileOpen(false)}>Daftar Gratis</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

export default NavbarLandingPage
