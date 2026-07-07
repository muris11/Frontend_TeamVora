import { SEOHead } from "@/components/shared/seo-head";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Users, Globe2, Zap } from "lucide-react";
import Link from "next/link";

export default function TentangPage() {
  return (
    <>
      <SEOHead title="Tentang Kami - TeamVora" description="Mengenal lebih dekat visi, misi, dan tim di balik TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-[1000px] text-center mb-32">
          <h1 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] mb-8">
            Membangun Masa Depan <br className="hidden md:block"/> Kerja Kolaboratif
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6] max-w-[800px] mx-auto mb-12">
            TeamVora didirikan dengan satu tujuan sederhana: menghapus kerumitan dalam bekerja bersama. Kami merancang alat bantu yang sangat bersih, cepat, dan tangguh agar tim Anda bisa fokus pada hal yang paling penting.
          </p>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-6 max-w-[1000px] mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[36px] font-[700] mb-6 tracking-[-0.02em]">Kisah Kami</h2>
              <div className="space-y-4 text-[16px] md:text-[18px] text-[#666666] leading-[1.7]">
                <p>
                  Pada tahun 2024, kami menyadari bahwa sebagian besar alat manajemen proyek modern terlalu kompleks, lambat, dan memaksa pengguna beradaptasi dengan cara kerja alat tersebut, alih-alih sebaliknya.
                </p>
                <p>
                  Kami memutuskan untuk merombak ulang konsep ruang kerja digital. Tidak ada lagi menu yang berantakan, notifikasi yang mengganggu, atau waktu muat yang lama. Yang tersisa hanyalah fungsionalitas murni yang dibalut dalam desain minimalis.
                </p>
                <p>
                  Kini, TeamVora digunakan oleh ribuan tim dari berbagai skala perusahaan—mulai dari startup yang baru dirintis hingga korporasi multinasional—untuk merencanakan, membangun, dan meluncurkan produk hebat.
                </p>
              </div>
            </div>
            <div className="h-[500px] bg-[#F5F5F5] rounded-3xl overflow-hidden border border-[#ECECEC] relative">
               <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Tim TeamVora sedang berkolaborasi" width={1000} height={667} loading="lazy" className="w-full h-full object-cover grayscale opacity-90" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-[#FAFAFA] border-y border-[#ECECEC] py-32 mb-32">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <div className="text-center mb-20">
              <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.02em] mb-6">Nilai Inti Kami</h2>
              <p className="text-[18px] text-[#666666] max-w-[600px] mx-auto">
                Prinsip yang membimbing setiap keputusan produk dan bisnis kami.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Kecepatan di Atas Segalanya",
                  desc: "Setiap interaksi harus terasa instan. Kami terobsesi dengan milidetik karena kecepatan adalah pengalaman pengguna terbaik."
                },
                {
                  icon: <CheckCircle2 className="w-6 h-6" />,
                  title: "Desain yang Bertujuan",
                  desc: "Kesederhanaan bukanlah ketiadaan fitur, melainkan ketiadaan gangguan. Kami mendesain untuk kejernihan berpikir."
                },
                {
                  icon: <Globe2 className="w-6 h-6" />,
                  title: "Kerja Tanpa Batas",
                  desc: "Mendukung tim lintas waktu dan geografi. Alat kami dirancang untuk kolaborasi asinkron yang sempurna."
                }
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-10 rounded-3xl border border-[#ECECEC] hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center mb-8 text-[#111111] group-hover:scale-110 transition-transform">
                    {val.icon}
                  </div>
                  <h3 className="text-[22px] font-[700] mb-4">{val.title}</h3>
                  <p className="text-[16px] text-[#666666] leading-[1.6]">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 max-w-[800px] text-center">
          <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.02em] mb-8">
            Siap mengubah cara kerja tim Anda?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-[#111111] text-white text-[16px] font-semibold transition-all hover:bg-[#000000] hover:-translate-y-[2px] w-full sm:w-auto">
              Mulai Gratis Sekarang
            </Link>
            <Link href="/kontak" className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-white border border-[#ECECEC] text-[#111111] text-[16px] font-semibold transition-all hover:bg-[#FAFAFA] w-full sm:w-auto">
              Hubungi Penjualan
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
