"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

export function MarketingFooter() {
  const { data: settings } = usePlatformSettings();

  const siteName = settings?.general?.site_name || "TeamVora";
  const logoUrl = settings?.general?.logo_url || "/icon.png";

  return (
    <footer className="bg-white border-t border-[#ECECEC] pt-24 pb-12 relative z-10 font-sans">
      <div className="container mx-auto px-6 max-w-[1280px]">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-24">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <img src={logoUrl} alt={siteName} className="h-10 w-10 object-contain transition-transform group-hover:scale-105" />
              <span className="font-extrabold text-[22px] tracking-tight text-[#111111]">{siteName}</span>
            </Link>
            <p className="text-[16px] text-[#666666] mb-8 max-w-sm leading-relaxed">
              Sistem operasi bisnis yang bersih dan responsif. Dirancang untuk tim modern yang mengutamakan kecepatan.
            </p>
            <div className="mb-4">
              <h4 className="font-bold text-[#111111] mb-4 text-[14px] uppercase tracking-wider">Berlangganan Newsletter</h4>
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="Email Anda..." 
                  className="h-12 w-full md:w-64 px-4 rounded-l-xl border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111] transition-colors"
                />
                <button className="h-12 px-5 rounded-r-xl bg-[#111111] text-white flex items-center justify-center hover:bg-[#000000] transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[#111111] mb-6 text-[14px] uppercase tracking-wider">Perusahaan</h4>
            <div className="flex flex-col gap-4 text-[16px] text-[#666666]">
              <Link href="/tentang" className="hover:text-[#111111] transition-colors">Tentang Kami</Link>
              <Link href="/kontak" className="hover:text-[#111111] transition-colors">Hubungi Kami</Link>
              <Link href="/blog" className="hover:text-[#111111] transition-colors">Berita</Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-[#111111] mb-6 text-[14px] uppercase tracking-wider">Produk</h4>
            <div className="flex flex-col gap-4 text-[16px] text-[#666666]">
              <Link href="/fitur" className="hover:text-[#111111] transition-colors">Fitur</Link>
              <Link href="/harga" className="hover:text-[#111111] transition-colors">Harga</Link>
              <Link href="/changelog" className="hover:text-[#111111] transition-colors">Changelog</Link>
              <Link href="/integrasi" className="hover:text-[#111111] transition-colors">Integrasi</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-[#111111] mb-6 text-[14px] uppercase tracking-wider">Sumber Daya</h4>
            <div className="flex flex-col gap-4 text-[16px] text-[#666666]">
              <Link href="/panduan" className="hover:text-[#111111] transition-colors">Panduan</Link>
              <Link href="/bantuan" className="hover:text-[#111111] transition-colors">Pusat Bantuan</Link>
              <a href="https://docs.teamvora.web.id" target="_blank" rel="noopener noreferrer" className="hover:text-[#111111] transition-colors">Dokumentasi API</a>
              <Link href="/komunitas" className="hover:text-[#111111] transition-colors">Komunitas</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-[#111111] mb-6 text-[14px] uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-4 text-[16px] text-[#666666]">
              <Link href="/privasi" className="hover:text-[#111111] transition-colors">Kebijakan Privasi</Link>
              <Link href="/syarat" className="hover:text-[#111111] transition-colors">Syarat Ketentuan</Link>
              <Link href="/keamanan" className="hover:text-[#111111] transition-colors">Keamanan</Link>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#ECECEC] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[14px] text-[#999999]">
            &copy; {new Date().getFullYear()} {siteName} Inc. Hak Cipta Dilindungi.
          </p>
          
          <div className="flex items-center gap-6 text-[#999999] text-[14px]">
            <a href="#" aria-label="Twitter" className="hover:text-[#111111] transition-colors">
              Twitter
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[#111111] transition-colors">
              LinkedIn
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#111111] transition-colors">
              Instagram
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
