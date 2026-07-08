"use client";

import { motion } from "motion/react";
import { 
  MessageSquare, Shield, BarChart3, Calendar, 
  Folder, Users, Bell, Zap, ArrowRight 
} from "lucide-react";

const features = [
  {
    title: "Komunikasi Real-time",
    description: "Diskusi lancar dengan pesan instan antar divisi. Tanpa gangguan, murni produktivitas.",
    icon: MessageSquare,
  },
  {
    title: "Keamanan Enterprise",
    description: "Seluruh data perusahaan Anda dienkripsi dan diamankan dengan standar industri modern.",
    icon: Shield,
  },
  {
    title: "Laporan Kehadiran",
    description: "Pantau jam kerja tim secara presisi dengan dasbor absensi terpusat yang mudah dibaca.",
    icon: BarChart3,
  },
  {
    title: "Manajemen Jadwal",
    description: "Atur jadwal kerja shift, sinkronisasi kalender, dan pantau ketersediaan tim secara instan.",
    icon: Calendar,
  },
  {
    title: "Manajemen Dokumen",
    description: "Simpan file penting seperti slip gaji dan kontrak kerja dalam satu ruang penyimpanan aman.",
    icon: Folder,
  },
  {
    title: "Direktori Karyawan",
    description: "Akses profil, kontak, dan struktur organisasi perusahaan Anda hanya dengan satu klik.",
    icon: Users,
  },
  {
    title: "Pusat Notifikasi",
    description: "Jangan lewatkan satu pun update penting. Terima pemberitahuan instan di web dan mobile.",
    icon: Bell,
  },
  {
    title: "Alur Kerja Otomatis",
    description: "Persetujuan cuti dan kasbon bertingkat yang transparan. Karyawan mengajukan, manajer menyetujui.",
    icon: Zap,
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function FeaturesGrid() {
  return (
    <section id="fitur" className="py-24 bg-white relative">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-[36px] md:text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] text-[#111111] mb-6">
            Alur Kerja Tanpa Hambatan
          </h2>
          <p className="text-[18px] text-[#666666] leading-[1.6]">
            Semua alat yang tim Anda butuhkan terintegrasi dengan sempurna. Dirancang tanpa elemen membingungkan untuk fokus yang lebih tajam.
          </p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              className="group p-4 md:p-8 rounded-[24px] bg-white border border-[#ECECEC] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-[8px] transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[#111111] transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-[#111111] group-hover:text-white transition-colors duration-300" strokeWidth={1.75} />
              </div>
              <h3 className="text-[16px] md:text-[22px] font-bold text-[#111111] mb-2 md:mb-3 leading-[1.3]">{feature.title}</h3>
              <p className="text-[13px] md:text-[16px] text-[#666666] leading-[1.6] mb-4 md:mb-8 flex-1">
                {feature.description}
              </p>
              <button className="flex items-center text-[13px] md:text-[14px] font-semibold text-[#111111] group/btn">
                <span className="hidden md:inline">Pelajari Lebih Lanjut</span>
                <span className="md:hidden">Detail</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" strokeWidth={2} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
