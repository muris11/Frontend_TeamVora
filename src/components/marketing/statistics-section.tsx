"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const stats = [
  { value: "10M+", label: "Tugas Diselesaikan", desc: "Produktivitas yang terukur setiap harinya." },
  { value: "99.9%", label: "Uptime Terjamin", desc: "Sistem yang selalu siap kapanpun Anda butuhkan." },
  { value: "50k+", label: "Tim Aktif", desc: "Dipercaya oleh ribuan perusahaan di seluruh dunia." }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function StatisticsSection() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <section className="py-24 bg-[#F5F5F5] border-y border-[#ECECEC]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-4">
            Skala yang Mendukung Pertumbuhan Anda
          </h2>
          <p className="text-[16px] text-[#666666] max-w-2xl mx-auto">
            Infrastruktur kelas enterprise yang dirancang untuk menangani beban kerja sebesar apapun tanpa penurunan performa.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="bg-white p-8 rounded-[24px] border border-[#ECECEC] text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            >
              <div className="text-[48px] md:text-[64px] font-[800] tracking-tighter text-[#111111] mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-[18px] font-bold text-[#111111] mb-2">
                {stat.label}
              </div>
              <p className="text-[14px] text-[#666666] leading-[1.6]">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
