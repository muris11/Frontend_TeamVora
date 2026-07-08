"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

export function MarketingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: settings } = usePlatformSettings();

  const siteName = settings?.general?.site_name || "TeamVora";
  const logoUrl = settings?.general?.logo_url || "/icon.png";

  const parsedNavLinks: Array<{ label: string; href: string }> = (() => {
    if (!settings?.marketing?.nav_links) return [];
    try { return JSON.parse(settings.marketing.nav_links); } catch { return []; }
  })();

  const navItems = parsedNavLinks.length > 0
    ? parsedNavLinks
    : [
        { label: "Tentang", href: "/tentang" },
        { label: "Fitur", href: "/fitur" },
        { label: "Blog", href: "/blog" },
        { label: "Dokumentasi", href: "https://docs.teamvora.web.id" },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 h-[88px] flex items-center ${
        isScrolled
          ? "bg-white/70 backdrop-blur-[20px] border-b border-[#ECECEC]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={logoUrl} alt={siteName} className="h-12 w-12 object-contain transition-transform group-hover:scale-105" />
          <span className="font-bold text-xl tracking-tight">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] font-medium text-[#666666]">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href} className="hover:text-[#111111] transition-colors relative group">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#111111] transition-all group-hover:w-full rounded-full"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[15px] font-medium text-[#666666] hover:text-[#111111] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-[#111111] text-white text-[15px] font-semibold transition-all hover:bg-[#000000] hover:-translate-y-[2px]"
          >
            Mulai Gratis
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground z-50 transition-transform active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 text-lg font-medium transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-0 pointer-events-none"
        }`}
      >
        {navItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="hover:text-[#111111] text-[#666666] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className="flex flex-col gap-4 mt-4 w-48">
          <Link
            href="/login"
            className="h-12 flex items-center justify-center rounded-full border border-[#ECECEC] bg-white hover:bg-[#FAFAFA] text-[#111111] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="h-12 flex items-center justify-center rounded-full bg-[#111111] text-white shadow-md transition-colors hover:bg-[#000000]"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Mulai Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
