"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "TeamVora mengubah cara kami bekerja. Sejak migrasi, efisiensi operasional kami meningkat 40% dan komunikasi tim menjadi jauh lebih transparan.",
    author: "Budi Santoso",
    role: "CTO, TechIndo",
    rating: 5,
    avatar: "BS"
  },
  {
    quote: "Sistem absensi dan kasbon yang terintegrasi sangat memudahkan HR kami. Tidak ada lagi rekap manual di akhir bulan yang membuang waktu.",
    author: "Siti Rahma",
    role: "HR Director, CreativeWorks",
    rating: 5,
    avatar: "SR"
  },
  {
    quote: "Desain UI-nya luar biasa bersih. Tim kami tidak butuh waktu lama untuk beradaptasi karena semuanya terasa intuitif dan cepat.",
    author: "Kevin Wijaya",
    role: "Product Manager, StartupNusantara",
    rating: 5,
    avatar: "KW"
  },
  {
    quote: "Kecepatan akses dan fitur real-time notification membuat kolaborasi remote kami berjalan tanpa hambatan. Sangat direkomendasikan.",
    author: "Diana Putri",
    role: "Remote Team Lead, GlobalTech",
    rating: 5,
    avatar: "DP"
  },
  {
    quote: "Customer support mereka luar biasa. Respons cepat dan selalu memberikan solusi tuntas untuk kebutuhan kustom perusahaan kami.",
    author: "Andi Pratama",
    role: "Operations Head, LogistikPlus",
    rating: 5,
    avatar: "AP"
  },
  {
    quote: "Audit log dan security features di TeamVora membuat kami yakin untuk menyimpan data konfidensial proyek klien skala enterprise.",
    author: "Maya Indah",
    role: "VP of Engineering, SecureData",
    rating: 5,
    avatar: "MI"
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Testimonials() {
  return (
    <section className="py-24 bg-white border-b border-[#ECECEC]">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
            Dicintai oleh Tim Terbaik
          </h2>
          <p className="text-[18px] text-[#666666] leading-[1.6]">
            Dengarkan langsung dari mereka yang telah mentransformasi cara kerja organisasinya bersama TeamVora.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testi, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              className="bg-white p-8 rounded-[24px] border border-[#ECECEC] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#111111] text-[#111111]" />
                  ))}
                </div>
                <p className="text-[16px] text-[#111111] leading-[1.6] mb-8 font-medium">
                  "{testi.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center text-[#111111] font-bold text-[14px]">
                  {testi.avatar}
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#111111]">{testi.author}</div>
                  <div className="text-[14px] text-[#666666]">{testi.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
