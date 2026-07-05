"use client";

import Link from "next/link";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

export function MarketingFooter() {
  const { data: settings } = usePlatformSettings();

  const siteName = settings?.general?.site_name || "TeamVora";
  const logoUrl = settings?.general?.logo_url || "/icon.png";
  const tagline = settings?.general?.tagline || "Satu platform untuk seluruh operasional tim Anda. Dari melacak kehadiran hingga mengelola keuangan perusahaan dengan efisien.";
  const contactEmail = settings?.contact?.contact_email || "";
  const socialTwitter = settings?.social?.twitter_url || "";
  const socialLinkedin = settings?.social?.linkedin_url || "";
  const footerText = settings?.marketing?.footer_text || tagline;

  const parsedNavLinks: Array<{ label: string; href: string }> = (() => {
    if (!settings?.marketing?.nav_links) return [];
    try { return JSON.parse(settings.marketing.nav_links); } catch { return []; }
  })();

  return (
    <footer className="border-t border-border/50 bg-muted/20 relative z-10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src={logoUrl} alt={siteName} className="h-12 w-12 object-contain" />
              <span className="font-bold text-xl tracking-tight">{siteName}</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {footerText}
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              {socialTwitter && (
                <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                  X
                </a>
              )}
              {socialLinkedin && (
                <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                  in
                </a>
              )}
              {!socialTwitter && !socialLinkedin && (
                <>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer">
                    X
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer">
                    in
                  </div>
                </>
              )}
            </div>
          </div>

          {parsedNavLinks.length > 0 ? (
            <div className="lg:col-span-3">
              <h4 className="font-semibold mb-4">Tautan</h4>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {parsedNavLinks.map((link, i) => (
                  <Link key={i} href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="font-semibold mb-4">Produk</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <Link href="/fitur" className="hover:text-foreground transition-colors">Fitur</Link>
                  <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
                  <Link href="/tentang" className="hover:text-foreground transition-colors">Tentang Kami</Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Perusahaan</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <Link href="/kontak" className="hover:text-foreground transition-colors">Hubungi Kami</Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Sumber Daya</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <Link href="/blog" className="hover:text-foreground transition-colors">Blog & Artikel</Link>
                  <Link href="/panduan" className="hover:text-foreground transition-colors">Panduan Pengguna</Link>
                  <Link href="/bantuan" className="hover:text-foreground transition-colors">Pusat Bantuan</Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privasi" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat" className="hover:text-foreground transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
