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
      <div className="w-full aspect-[4/3] bg-white rounded-2xl border border-[#ECECEC] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
        <div className="h-12 border-b border-[#ECECEC] flex items-center px-6">
          <div className="w-24 h-4 bg-[#ECECEC] rounded"></div>
        </div>
        <div className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex items-end gap-4 h-32 border-b border-[#ECECEC] pb-4">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-[#111111] rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 border border-[#ECECEC] rounded-lg p-4">
              <div className="w-16 h-3 bg-[#ECECEC] rounded mb-2"></div>
              <div className="w-24 h-6 bg-[#111111] rounded"></div>
            </div>
            <div className="h-20 border border-[#ECECEC] rounded-lg p-4">
              <div className="w-16 h-3 bg-[#ECECEC] rounded mb-2"></div>
              <div className="w-24 h-6 bg-[#111111] rounded"></div>
            </div>
          </div>
        </div>
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
      <div className="w-full aspect-[4/3] bg-white rounded-2xl border border-[#ECECEC] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-6 flex flex-col justify-center gap-4 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4">
          <div className="p-4 bg-[#FAFAFA] rounded-tr-2xl rounded-bl-2xl rounded-br-2xl border border-[#ECECEC] self-start w-3/4">
            <div className="w-full h-3 bg-[#ECECEC] rounded mb-2"></div>
            <div className="w-2/3 h-3 bg-[#ECECEC] rounded"></div>
          </div>
          
          <div className="p-4 bg-[#111111] text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl self-end w-5/6 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <div className="text-[12px] font-medium text-white/80">AI Suggestion</div>
            </div>
            <div className="w-full h-3 bg-white/20 rounded mb-2"></div>
            <div className="w-full h-3 bg-white/20 rounded mb-2"></div>
            <div className="w-3/4 h-3 bg-white/20 rounded"></div>
          </div>
        </div>
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
      <div className="w-full aspect-[4/3] bg-white rounded-2xl border border-[#ECECEC] shadow-[0_20px_60px_rgba(0,0,0,0.06)] flex overflow-hidden">
        <div className="w-1/3 bg-[#FAFAFA] border-r border-[#ECECEC] p-4 flex flex-col gap-3">
          <div className="w-full h-8 border border-[#ECECEC] bg-white rounded flex items-center px-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-[#ECECEC]"></div>
          </div>
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ECECEC]"></div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="w-full h-2 bg-[#ECECEC] rounded"></div>
                <div className="w-2/3 h-2 bg-[#FAFAFA] rounded"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-end gap-3 pb-6 relative">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#ECECEC]"></div>
            <div className="w-3/4 h-12 bg-[#FAFAFA] border border-[#ECECEC] rounded-lg"></div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-[#111111]"></div>
            <div className="w-1/2 h-10 bg-[#111111] rounded-lg"></div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 h-10 border border-[#ECECEC] rounded-full flex items-center px-4 justify-between">
            <div className="w-1/3 h-2 bg-[#ECECEC] rounded"></div>
            <div className="w-6 h-6 rounded-full bg-[#111111]"></div>
          </div>
        </div>
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
      <div className="w-full aspect-[4/3] bg-[#111111] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        <div className="relative z-10 w-full max-w-[280px]">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <div className="w-3/4 h-4 bg-[#333333] rounded mb-3"></div>
            <div className="w-full h-2 bg-[#333333] rounded mb-1"></div>
            <div className="w-full h-2 bg-[#333333] rounded mb-8"></div>
            
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between w-full">
                <div className="w-1/2 h-3 bg-[#333333] rounded"></div>
                <div className="w-8 h-4 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="w-1/2 h-3 bg-[#333333] rounded"></div>
                <div className="w-8 h-4 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
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
                className="w-full lg:w-1/2 flex flex-col items-start"
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
