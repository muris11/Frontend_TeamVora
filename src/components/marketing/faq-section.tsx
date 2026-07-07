"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Apa itu TeamVora?",
    answer: "TeamVora adalah platform manajemen operasional all-in-one yang menyatukan komunikasi tim, absensi, pengajuan cuti, dan kasbon dalam satu antarmuka yang bersih dan bebas gangguan."
  },
  {
    question: "Apakah ada batasan pengguna pada paket Gratis?",
    answer: "Ya, paket Gratis kami dirancang untuk tim kecil hingga 5 pengguna. Anda dapat melakukan upgrade ke paket Pro kapan saja seiring pertumbuhan tim Anda."
  },
  {
    question: "Bagaimana sistem keamanan data di TeamVora?",
    answer: "Keamanan adalah prioritas kami. Semua data dienkripsi dengan standar industri AES-256 (in-transit dan at-rest). Paket Enterprise juga mendukung SSO dan hosting khusus."
  },
  {
    question: "Apakah TeamVora terintegrasi dengan alat yang kami gunakan?",
    answer: "Tentu. TeamVora menyediakan integrasi native dengan platform populer seperti Slack, Google Workspace, GitHub, Figma, dan ratusan aplikasi lainnya melalui Zapier."
  },
  {
    question: "Bagaimana cara kerja fitur presensi?",
    answer: "Karyawan dapat melakukan check-in dan check-out melalui aplikasi web atau mobile dengan validasi lokasi (geofencing) opsional untuk memastikan akurasi data."
  },
  {
    question: "Apakah saya bisa mengatur hierarki persetujuan cuti?",
    answer: "Ya, TeamVora memungkinkan Anda untuk mengatur alur persetujuan multi-level yang disesuaikan dengan struktur organisasi perusahaan Anda."
  },
  {
    question: "Berapa lama waktu yang dibutuhkan untuk onboarding?",
    answer: "Sebagian besar tim dapat mengatur ruang kerja mereka dan mengundang seluruh anggota dalam waktu kurang dari 5 menit berkat desain antarmuka kami yang intuitif."
  },
  {
    question: "Apakah ada aplikasi mobile untuk TeamVora?",
    answer: "Ya, TeamVora tersedia sebagai aplikasi responsif di web dan kami juga menyediakan aplikasi native untuk iOS dan Android yang dapat diunduh di App Store dan Google Play."
  },
  {
    question: "Bagaimana dukungan pelanggan yang diberikan?",
    answer: "Paket Gratis mencakup dukungan komunitas dan dokumentasi ekstensif. Pengguna Pro dan Enterprise mendapatkan dukungan prioritas melalui email, chat, dan dedicated account manager."
  },
  {
    question: "Apakah ada kontrak jangka panjang?",
    answer: "Tidak, paket kami bersifat fleksibel dan dapat ditagih secara bulanan atau tahunan. Anda dapat membatalkan atau mengubah paket kapan saja."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-[800px]">
        <div className="text-center mb-16">
          <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-[18px] text-[#666666] leading-[1.6]">
            Temukan jawaban cepat untuk pertanyaan umum seputar TeamVora.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-[#ECECEC] rounded-2xl overflow-hidden transition-colors duration-300 ${openIndex === idx ? 'bg-[#FAFAFA]' : 'bg-white'}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(idx)}
              >
                <span className="text-[18px] font-bold text-[#111111] pr-8">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#ECECEC] bg-white flex items-center justify-center">
                  {openIndex === idx ? (
                    <Minus className="w-4 h-4 text-[#111111]" />
                  ) : (
                    <Plus className="w-4 h-4 text-[#111111]" />
                  )}
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
                  >
                    <div className="px-6 pb-6 text-[16px] text-[#666666] leading-[1.6]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
