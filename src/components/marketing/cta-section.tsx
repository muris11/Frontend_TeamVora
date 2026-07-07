"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 bg-[#111111] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]"></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] text-white mb-8">
              Siap untuk Beralih?
            </h2>
            <p className="text-[20px] md:text-[24px] text-[#A3A3A3] leading-[1.5] max-w-2xl mx-auto mb-12">
              Bergabunglah dengan ribuan tim yang telah bekerja lebih cepat, lebih pintar, dan lebih terorganisir bersama TeamVora.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto h-[64px] px-10 inline-flex items-center justify-center rounded-full bg-white text-[#111111] text-[18px] font-bold transition-all hover:bg-[#FAFAFA] hover:scale-[1.03] shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto h-[64px] px-10 inline-flex items-center justify-center rounded-full bg-transparent text-white border border-[#333333] text-[18px] font-bold transition-all hover:bg-[#1A1A1A] hover:scale-[1.03]"
            >
              <Play className="mr-2 w-5 h-5 fill-white" />
              Hubungi Penjualan
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[14px] text-[#737373] mt-10"
          >
            Gratis 14 hari uji coba untuk paket Pro. Tidak perlu kartu kredit.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
