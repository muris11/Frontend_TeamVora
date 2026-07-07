import { SEOHead } from "@/components/shared/seo-head";
import { Shield, Lock, CheckCircle2, Server } from "lucide-react";
import Link from "next/link";

export default function KeamananPage() {
  return (
    <>
      <SEOHead title="Keamanan Enterprise - TeamVora" description="Infrastruktur keamanan kelas dunia untuk melindungi data bisnis Anda." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[800px] text-center mb-24">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] text-white flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
            Keamanan Tingkat Enterprise
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6]">
            Kami memperlakukan keamanan data Anda dengan standar tertinggi, didukung oleh kepatuhan audit global dan infrastruktur anti-retas.
          </p>
        </section>

        {/* Pillars */}
        <section className="container mx-auto px-6 max-w-[1000px] mb-32">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl border border-[#ECECEC] bg-[#FAFAFA]">
              <Lock className="w-8 h-8 mb-4 text-[#111111]" />
              <h3 className="text-[20px] font-[700] mb-3">Enkripsi End-to-End</h3>
              <p className="text-[15px] text-[#666666] leading-[1.6]">
                Data ditransmisikan melalui jaringan yang dienkripsi TLS 1.3 dan disimpan (data at rest) menggunakan algoritma standar industri AES-256. Tidak ada orang di luar organisasi Anda yang dapat membacanya.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl border border-[#ECECEC] bg-[#FAFAFA]">
              <Server className="w-8 h-8 mb-4 text-[#111111]" />
              <h3 className="text-[20px] font-[700] mb-3">Infrastruktur Terisolasi</h3>
              <p className="text-[15px] text-[#666666] leading-[1.6]">
                Pelanggan Enterprise mendapatkan arsitektur Virtual Private Cloud (VPC) khusus. Basis data dan sumber daya komputasi diisolasi secara logis untuk mencegah kebocoran silang.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="bg-[#111111] text-white py-24 mb-32">
          <div className="container mx-auto px-6 max-w-[1000px] text-center">
            <h2 className="text-[32px] md:text-[40px] font-[700] tracking-[-0.02em] mb-16">
              Kepatuhan & Sertifikasi Global
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { title: "SOC 2 Type II", desc: "Kami diaudit setiap tahun secara independen atas standar keamanan, ketersediaan, dan kerahasiaan." },
                { title: "ISO 27001", desc: "Sistem Manajemen Keamanan Informasi kami tersertifikasi memenuhi pedoman ketat ISO internasional." },
                { title: "GDPR Compliant", desc: "Kami mematuhi seluruh hukum perlindungan privasi Eropa yang menjamin hak pengolahan data Anda." }
              ].map((cert, i) => (
                <div key={i} className="bg-[#222222] p-8 rounded-2xl border border-[#333333]">
                  <CheckCircle2 className="w-6 h-6 text-green-400 mb-4" />
                  <h3 className="font-bold text-[18px] mb-2">{cert.title}</h3>
                  <p className="text-[14px] text-[#999999] leading-[1.6]">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SSO CTA */}
        <section className="container mx-auto px-6 max-w-[800px] text-center">
          <h2 className="text-[32px] font-[700] tracking-[-0.02em] mb-6">
            Dukung Otentikasi Lanjutan
          </h2>
          <p className="text-[18px] text-[#666666] mb-10">
            Tim Enterprise dapat memaksakan login SSO (Okta, Google Workspace, Azure AD) dan Otentikasi Multi-Faktor (MFA) untuk seluruh karyawan mereka.
          </p>
          <Link href="/kontak" className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-[#111111] text-white text-[16px] font-semibold transition-all hover:bg-[#000000] hover:-translate-y-[2px]">
            Tingkatkan ke Enterprise
          </Link>
        </section>

      </main>
    </>
  );
}
