"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const steps = [
  { num: "01", title: "Create Workspace", desc: "Daftar dalam 2 menit tanpa kartu kredit." },
  { num: "02", title: "Invite Team", desc: "Undang anggota tim via tautan atau email." },
  { num: "03", title: "Manage Task", desc: "Tugaskan pekerjaan dan atur prioritas." },
  { num: "04", title: "Automation", desc: "Biarkan sistem menangani tugas berulang." },
  { num: "05", title: "Analytics", desc: "Pantau performa melalui dasbor visual." }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function WorkflowTimeline() {
  return (
    <section className="py-24 bg-[#FAFAFA] border-y border-[#ECECEC] overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
              Mulai dalam hitungan menit
            </h2>
            <p className="text-[18px] text-[#666666] leading-[1.6]">
              Proses orientasi (onboarding) yang sangat cepat. Tim Anda dapat langsung bekerja tanpa kurva pembelajaran yang curam.
            </p>
          </div>
          <button className="flex items-center text-[16px] font-semibold text-[#111111] group">
            Lihat Dokumentasi
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" strokeWidth={2} />
          </button>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mt-20"
        >
          {/* Horizontal Line (Desktop) */}
          <div className="hidden lg:block absolute top-[24px] left-[5%] w-[90%] h-[2px] bg-[#ECECEC] -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex flex-col items-center relative">
                {/* Number Badge */}
                <div className="w-12 h-12 rounded-full bg-white border border-[#111111] flex items-center justify-center text-[16px] font-bold text-[#111111] shadow-[0_4px_12px_rgba(0,0,0,0.05)] mb-6 transition-transform hover:scale-110 cursor-default z-10">
                  {step.num}
                </div>
                
                <h3 className="text-[18px] font-bold text-[#111111] mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#666666] leading-[1.6] text-center">
                  {step.desc}
                </p>
                
                {/* Vertical Line (Mobile) */}
                {idx !== steps.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-16 bottom-[-30px] w-[2px] bg-[#ECECEC] -z-10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
