"use client";

import { motion } from "motion/react";
import { ArrowRight, BarChart2, Sparkles, MessageSquare, ShieldCheck } from "lucide-react";

const sections = [
  {
    id: "analytics",
    title: "Analitik Waktu Nyata",
    description: "Ubah data menjadi wawasan yang dapat ditindaklanjuti. Pantau produktivitas tim, tren kehadiran, dan efisiensi proyek dalam satu dasbor terpusat yang selalu up-to-date.",
    icon: BarChart2,
    align: "left",
    mockup: (
      <div className="w-full relative px-4 mx-auto flex justify-center">
        <img src="/feature_2.png" alt="Analitik Waktu Nyata" className="w-full max-w-[500px] rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover aspect-[4/3]" />
      </div>
    )
  },
  {
    id: "ai",
    title: "Kecerdasan Buatan Terintegrasi",
    description: "Otomatiskan tugas membosankan. TeamVora AI membantu merangkum diskusi, membuat draft pengumuman, dan menyarankan pembagian tugas optimal berdasarkan beban kerja tim.",
    icon: Sparkles,
    align: "right",
    mockup: (
      <div className="w-full relative px-4 mx-auto flex justify-center">
        <img src="/hero_3d.png" alt="Kecerdasan Buatan Terintegrasi" className="w-full max-w-[500px] rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover aspect-[4/3]" />
      </div>
    )
  },
  {
    id: "collab",
    title: "Kolaborasi Tanpa Batas",
    description: "Satu tempat untuk semua percakapan. Mulai dari obrolan ringan hingga diskusi proyek krusial, tersusun rapi dengan dukungan thread, mention, dan berbagi file instan.",
    icon: MessageSquare,
    align: "left",
    mockup: (
      <div className="w-full relative px-4 mx-auto flex justify-center">
        <img src="/feature_2.png" alt="Kolaborasi Tanpa Batas" className="w-full max-w-[500px] rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover aspect-[4/3]" />
      </div>
    )
  },
  {
    id: "security",
    title: "Keamanan Kelas Enterprise",
    description: "Data Anda adalah prioritas kami. Dilengkapi enkripsi end-to-end, Single Sign-On (SSO), manajemen otorisasi tingkat lanjut, dan audit log komprehensif.",
    icon: ShieldCheck,
    align: "right",
    mockup: (
      <div className="w-full relative px-4 mx-auto flex justify-center">
        <img src="/hero_3d.png" alt="Keamanan Kelas Enterprise" className="w-full max-w-[500px] rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-500 object-cover aspect-[4/3]" />
      </div>
    )
  }
];

export function DeepDiveSections() {
  return (
    <div className="bg-white py-12">
      {sections.map((section, idx) => (
        <section key={section.id} className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-[1280px]">
            <div className={`flex flex-col lg:flex-row items-center gap-16 ${section.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Content */}
              <motion.div 
                initial={{ opacity: 0, x: section.align === 'left' ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center mb-6">
                  <section.icon className="w-6 h-6 text-[#111111]" strokeWidth={1.5} />
                </div>
                <h3 className="text-[32px] md:text-[40px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
                  {section.title}
                </h3>
                <p className="text-[18px] text-[#666666] leading-[1.6] mb-8">
                  {section.description}
                </p>
                <button className="flex items-center text-[16px] font-semibold text-[#111111] group pb-2 border-b-2 border-[#111111]">
                  Pelajari selengkapnya
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </button>
              </motion.div>

              {/* Mockup Visual */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className="w-full lg:w-1/2"
              >
                {section.mockup}
              </motion.div>

            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
