import { SEOHead } from "@/components/shared/seo-head";
import { Check } from "lucide-react";
import Link from "next/link";

export default function HargaPage() {
  const plans = [
    {
      name: "Gratis",
      desc: "Untuk tim kecil yang baru mulai mengatur proyek mereka.",
      price: "0",
      features: [
        "Hingga 5 anggota tim",
        "Tugas dan proyek tidak terbatas",
        "Tampilan Kanban & List",
        "Riwayat aktivitas 30 hari",
        "Integrasi dasar (Slack, Google Drive)",
        "Dukungan komunitas"
      ],
      cta: "Mulai Gratis",
      href: "/register"
    },
    {
      name: "Pro",
      desc: "Bagi tim berkembang yang butuh alat kolaborasi dan pelaporan.",
      price: "12",
      popular: true,
      features: [
        "Anggota tim tidak terbatas",
        "Semua fitur Gratis",
        "Tampilan Timeline & Gantt",
        "Custom Fields & Workflow",
        "Riwayat aktivitas tidak terbatas",
        "Otomatisasi AI (1,000 tasks/bln)",
        "Dukungan prioritas 24/7"
      ],
      cta: "Coba Pro Gratis (14 Hari)",
      href: "/register"
    },
    {
      name: "Enterprise",
      desc: "Keamanan, kontrol, dan dukungan tingkat lanjut untuk korporasi.",
      price: "Custom",
      features: [
        "Semua fitur Pro",
        "SAML SSO & Advanced Provisioning",
        "Log audit komprehensif",
        "Dedicated Success Manager",
        "Otomatisasi AI tidak terbatas",
        "Service Level Agreement (SLA) 99.99%",
        "Penagihan via Invoice"
      ],
      cta: "Hubungi Penjualan",
      href: "/kontak"
    }
  ];

  return (
    <>
      <SEOHead title="Harga Langganan - TeamVora" description="Pilih paket yang paling sesuai dengan kebutuhan tim Anda." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        <section className="container mx-auto px-6 max-w-[1200px] text-center mb-24">
          <h1 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] mb-8">
            Harga Sederhana, <br className="hidden md:block"/> Tanpa Kejutan
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6] max-w-[800px] mx-auto mb-16">
            Mulai secara gratis dan tingkatkan paket Anda seiring dengan pertumbuhan tim. Anda hanya membayar apa yang Anda gunakan.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {plans.map((plan, idx) => (
              <div key={idx} className={`rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${plan.popular ? 'bg-white border-2 border-[#111111] shadow-2xl scale-100 md:scale-105 z-10' : 'bg-[#FAFAFA] border border-[#ECECEC]'}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-[12px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Paling Populer
                  </span>
                )}
                
                <h3 className="text-[24px] font-[700] mb-2">{plan.name}</h3>
                <p className="text-[15px] text-[#666666] mb-8 h-12">{plan.desc}</p>
                
                <div className="mb-8">
                  {plan.price === 'Custom' ? (
                    <span className="text-[48px] font-[800] tracking-[-0.02em]">Custom</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[24px] font-bold">$</span>
                      <span className="text-[48px] font-[800] tracking-[-0.02em]">{plan.price}</span>
                      <span className="text-[16px] text-[#666666] font-medium">/user/bulan</span>
                    </div>
                  )}
                </div>

                <Link href={plan.href} className={`w-full h-12 flex items-center justify-center rounded-xl font-semibold mb-10 transition-colors ${plan.popular ? 'bg-[#111111] text-white hover:bg-[#000000]' : 'bg-white border border-[#ECECEC] text-[#111111] hover:bg-[#F5F5F5]'}`}>
                  {plan.cta}
                </Link>

                <div className="space-y-4 flex-1">
                  <p className="text-[14px] font-bold uppercase tracking-wider mb-6">Termasuk:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#111111] shrink-0" />
                      <span className="text-[15px] text-[#444444]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="container mx-auto px-6 max-w-[800px] mt-32 text-center border-t border-[#ECECEC] pt-32">
          <h2 className="text-[32px] font-[700] mb-6">Ada pertanyaan?</h2>
          <p className="text-[18px] text-[#666666] mb-8">Kunjungi Pusat Bantuan kami untuk melihat FAQ seputar penagihan dan langganan.</p>
          <Link href="/bantuan" className="font-semibold underline underline-offset-4 hover:text-[#666666] transition-colors">
            Lihat Pusat Bantuan
          </Link>
        </section>

      </main>
    </>
  );
}
