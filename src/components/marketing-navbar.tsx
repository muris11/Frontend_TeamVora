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
        { label: "Kontak", href: "/kontak" },
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md border-b border-border/40 shadow-sm py-3"
          : "bg-transparent py-5"
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
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-muted-foreground">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-foreground transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="h-9 px-4 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium shadow transition-colors hover:bg-primary/90"
          >
            Daftar
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
            className="hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <div className="flex flex-col gap-4 mt-4 w-48">
          <Link
            href="/login"
            className="h-12 flex items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Daftar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
