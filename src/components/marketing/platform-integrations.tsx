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
          <div className="relative flex items-center justify-center mt-10 lg:mt-0 w-full px-4 sm:px-8">
            <img 
              src="/feature_2.png" 
              alt="Integrasi TeamVora" 
              className="w-full max-w-[500px] h-auto object-contain rounded-2xl drop-shadow-xl hover:scale-[1.02] transition-transform duration-500 mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
