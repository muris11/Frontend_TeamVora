"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Play, CheckCircle2, BarChart3, CheckSquare, Bell, User } from "lucide-react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const floatAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-8, 8, -8], 
    transition: { 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" as const
    } 
  }
};

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFAFA]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start w-full z-10"
          >
            {/* Badge */}
            <motion.div variants={fadeUpVariants} className="mb-8">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#ECECEC] bg-white text-[14px] font-medium text-[#111111] shadow-sm">
                TeamVora 2.0 Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeUpVariants}
              className="text-[48px] md:text-[64px] lg:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6 text-[#111111]"
            >
              Standar Baru untuk <br className="hidden md:block" />
              <span className="text-[#666666]">Manajemen Operasional</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={fadeUpVariants}
              className="text-[18px] text-[#666666] leading-[1.6] max-w-xl mb-10"
            >
              Tinggalkan proses manual yang membuang waktu. TeamVora menyatukan presensi, komunikasi tim, pengajuan cuti, dan kasbon dalam satu ruang kerja minimalis yang didesain untuk kecepatan.
            </motion.p>

            {/* CTA Group */}
            <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                href="/register"
                className="w-full sm:w-auto h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-[#111111] text-white text-[16px] font-semibold transition-all hover:bg-[#000000] hover:scale-[1.03] shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
              >
                Mulai Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="w-full sm:w-auto h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-white text-[#111111] border border-[#ECECEC] text-[16px] font-semibold transition-all hover:bg-[#FAFAFA] hover:scale-[1.03]"
              >
                <Play className="mr-2 w-5 h-5 fill-[#111111]" />
                Jadwalkan Demo
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-6 text-[14px] text-[#666666] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#111111]" />
                Tanpa kartu kredit
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#111111]" />
                Setup 5 menit
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#111111]" />
                Enterprise Ready
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="relative lg:h-[600px] w-full mt-10 lg:mt-0 flex items-center justify-center"
          >
            {/* Background Soft Gradient Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white rounded-full blur-[100px] opacity-60"></div>
            
            {/* Main Dashboard Image */}
            <div className="relative z-10 w-full max-w-[640px] px-4 md:px-0 mx-auto">
              <img 
                src="/hero_3d.png" 
                alt="TeamVora Dashboard" 
                className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            {/* Floating Cards (Animated) */}
            <motion.div 
              variants={floatAnimation} 
              initial="initial" 
              animate="animate" 
              className="absolute -right-8 top-20 z-20 bg-white p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#ECECEC] flex items-center gap-4 hidden md:flex"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#111111]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#111111]">+124% Growth</div>
                <div className="text-[12px] text-[#666666]">Analytics Updated</div>
              </div>
            </motion.div>

            <motion.div 
              variants={floatAnimation} 
              initial="initial" 
              animate="animate" 
              style={{ animationDelay: "2s" }}
              className="absolute -left-12 bottom-32 z-20 bg-white p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-[#ECECEC] flex items-center gap-4 hidden md:flex"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-[#111111]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#111111]">Task Completed</div>
                <div className="text-[12px] text-[#666666]">Just now by Team</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
