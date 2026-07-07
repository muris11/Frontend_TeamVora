"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Gratis",
    description: "Cocok untuk tim kecil yang baru memulai.",
    price: "0",
    period: "selamanya",
    popular: false,
    features: [
      "Maksimal 5 pengguna",
      "Penyimpanan 2 GB",
      "Manajemen tugas dasar",
      "Dukungan komunitas"
    ],
    buttonText: "Mulai Gratis",
    buttonStyle: "bg-white text-[#111111] border border-[#ECECEC] hover:bg-[#FAFAFA]"
  },
  {
    name: "Pro",
    description: "Untuk perusahaan berkembang dengan kebutuhan lebih.",
    price: "49k",
    period: "per pengguna/bulan",
    popular: true,
    features: [
      "Pengguna tidak terbatas",
      "Penyimpanan 50 GB per pengguna",
      "Analitik tingkat lanjut",
      "Otomatisasi alur kerja",
      "Dukungan prioritas 24/7"
    ],
    buttonText: "Coba Gratis 14 Hari",
    buttonStyle: "bg-[#111111] text-white hover:bg-[#000000]"
  },
  {
    name: "Enterprise",
    description: "Skala maksimum dengan keamanan dan kontrol penuh.",
    price: "Kustom",
    period: "hubungi tim sales",
    popular: false,
    features: [
      "Semua fitur Pro",
      "Penyimpanan tidak terbatas",
      "Single Sign-On (SSO)",
      "Dedicated account manager",
      "Service Level Agreement (SLA)",
      "Self-hosted option"
    ],
    buttonText: "Hubungi Penjualan",
    buttonStyle: "bg-white text-[#111111] border border-[#ECECEC] hover:bg-[#FAFAFA]"
  }
];

export function PricingPreview() {
  return (
    <section id="harga" className="py-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
            Harga Transparan, <br className="hidden md:block" /> Sesuai Skala Anda
          </h2>
          <p className="text-[18px] text-[#666666] leading-[1.6]">
            Mulai gratis, tingkatkan saat Anda membutuhkan lebih banyak kekuatan. Tidak ada biaya tersembunyi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-[24px] p-8 flex flex-col h-full transition-transform hover:-translate-y-2 duration-300 ${
                plan.popular 
                  ? 'bg-white border-2 border-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.08)] py-12 z-10 scale-100 md:scale-105' 
                  : 'bg-white border border-[#ECECEC] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111111] text-white px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider">
                  Paling Populer
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-[22px] font-bold text-[#111111] mb-2">{plan.name}</h3>
                <p className="text-[14px] text-[#666666] min-h-[40px]">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end gap-2">
                  <span className="text-[48px] font-[800] tracking-tighter leading-none text-[#111111]">
                    {plan.price !== "Kustom" && "Rp"}
                    {plan.price}
                  </span>
                </div>
                <span className="text-[14px] text-[#666666] block mt-2">{plan.period}</span>
              </div>
              
              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#111111] shrink-0" strokeWidth={2} />
                      <span className="text-[15px] text-[#404040] leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href="/register"
                className={`w-full h-[52px] rounded-xl flex items-center justify-center text-[16px] font-semibold transition-colors ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
