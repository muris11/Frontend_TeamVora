"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

const checklist = [
  "Dashboard Interaktif",
  "Manajemen Tugas",
  "Otomatisasi Alur Kerja",
  "Integrasi API Pihak Ketiga",
  "Analitik Mendalam",
  "Sistem Notifikasi Real-time",
  "Webhooks & REST API",
  "Keamanan Tingkat Lanjut",
  "Role-based Access Control",
  "Audit Log Lengkap"
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function PlatformIntegrations() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Text & Checklist */}
          <div className="max-w-xl">
            <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
              Semua yang Anda Butuhkan, Dalam Satu Tempat
            </h2>
            <p className="text-[18px] text-[#666666] leading-[1.6] mb-10">
              Tidak perlu lagi berpindah antar aplikasi. TeamVora menyatukan seluruh alur kerja Anda dengan alat canggih yang dirancang secara khusus.
            </p>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {checklist.map((item, idx) => (
                <motion.div key={idx} variants={itemVariants} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[#111111]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[16px] text-[#111111] font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Integration Visuals */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Background blur */}
            <div className="absolute w-[300px] h-[300px] bg-white rounded-full blur-[100px] opacity-80 z-0"></div>
            
            {/* Center Core */}
            <div className="relative z-10 w-24 h-24 bg-[#111111] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex items-center justify-center text-white text-2xl font-bold tracking-tighter">
              TV
            </div>

            {/* Orbiting Elements (Simulated via absolute positioning & animation) */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border border-[#ECECEC] rounded-full border-dashed -z-10"
            ></motion.div>
            
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border border-[#ECECEC] rounded-full border-dashed -z-10 hidden md:block"
            ></motion.div>

            {/* Floating integration tags - Static for simplicity, could animate orbit */}
            <div className="absolute top-10 left-10 md:top-20 md:left-20 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              Slack
            </div>
            <div className="absolute bottom-20 left-4 md:bottom-32 md:left-10 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              Google Drive
            </div>
            <div className="absolute top-32 right-4 md:top-40 md:right-10 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              Notion
            </div>
            <div className="absolute bottom-10 right-20 md:bottom-20 md:right-32 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              GitHub
            </div>
            <div className="absolute -top-4 right-1/3 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              Figma
            </div>
            <div className="absolute -bottom-8 left-1/3 px-4 py-2 bg-white border border-[#ECECEC] rounded-full shadow-sm text-[14px] font-bold text-[#111111] transition-transform hover:scale-105 cursor-pointer">
              Jira
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
