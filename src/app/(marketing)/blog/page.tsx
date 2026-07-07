import { SEOHead } from "@/components/shared/seo-head";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const FEATURED_IMAGE = "https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

export default function BlogPage() {
  const posts = [
    {
      category: "Produk",
      date: "12 Okt 2026",
      title: "Memperkenalkan TeamVora 2.0: Lebih Cepat, Lebih Pintar",
      desc: "Pelajari bagaimana kami membangun ulang arsitektur inti TeamVora dengan Next.js 16 untuk menghadirkan pengalaman pengguna yang instan tanpa waktu muat.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "Studi Kasus",
      date: "05 Okt 2026",
      title: "Bagaimana Startup FinTech Meningkatkan Produktivitas 40%",
      desc: "Sebuah studi kasus tentang bagaimana peralihan ke TeamVora membantu tim terdistribusi mengurangi waktu meeting dan mempercepat peluncuran fitur.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "Engineering",
      date: "28 Sep 2026",
      title: "Skalabilitas Database untuk Jutaan Notifikasi Waktu Nyata",
      desc: "Selami detail teknis tentang bagaimana tim infrastruktur kami mengelola jutaan koneksi WebSocket dan memastikan ketersediaan 99.99%.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      category: "Kultur",
      date: "15 Sep 2026",
      title: "Bekerja Asinkron: Mengapa Kami Menghapus Rapat Harian",
      desc: "Meeting harian (daily stand-up) seringkali menghabiskan waktu. Berikut adalah panduan kami untuk beralih ke pelaporan berbasis teks yang lebih tenang.",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    }
  ];

  return (
    <>
      <SEOHead title="Blog - TeamVora" description="Berita, pembaruan, dan wawasan dari tim TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#ECECEC] pb-12">
            <div className="max-w-[600px]">
              <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
                Blog & Wawasan
              </h1>
              <p className="text-[18px] text-[#666666] leading-[1.6]">
                Temukan pengumuman fitur terbaru, studi kasus pelanggan, wawasan engineering, dan cerita tentang budaya kerja kami.
              </p>
            </div>
            
            <div className="flex gap-2 pb-2">
              {['Semua', 'Produk', 'Engineering', 'Kultur'].map(cat => (
                <button key={cat} className={`px-4 h-10 rounded-full border ${cat === 'Semua' ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#ECECEC] bg-white text-[#666666] hover:border-[#111111]'} font-medium text-[14px] transition-colors`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-24">
          <Link href="/blog/memperkenalkan-teamvora-2-0" className="group block h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden">
            <Image
              src={FEATURED_IMAGE}
              alt="Featured Post"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-[800px] text-white">
              <div className="flex items-center gap-3 mb-4 text-[14px] font-medium tracking-widest uppercase">
                <span className="text-[#999999]">Produk</span>
                <span className="w-1 h-1 rounded-full bg-[#666666]"></span>
                <span className="text-[#999999]">Baru Saja</span>
              </div>
              <h2 className="text-[32px] md:text-[48px] font-[700] leading-[1.2] tracking-tight mb-4">
                Panduan Definitif untuk Orkestrasi Tugas Skala Enterprise
              </h2>
              <p className="text-[16px] md:text-[18px] text-[#CCCCCC] leading-relaxed hidden md:block">
                Sistem enterprise tidak harus lambat. Di postingan ini, kami membedah cara kami mendesain ulang antarmuka TeamVora untuk menangani puluhan ribu proyek secara instan.
              </p>
            </div>
          </Link>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {posts.map((post, i) => (
              <Link key={i} href={`/blog/post-${i+1}`} className="group flex flex-col">
                <div className="relative h-[240px] md:h-[300px] rounded-3xl overflow-hidden bg-[#F5F5F5] mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4 text-[14px] font-medium text-[#666666]">
                  <span className="text-[#111111]">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D4D4D4]"></span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-[24px] font-[700] leading-[1.3] tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-[16px] text-[#666666] leading-relaxed mb-6 flex-1">
                  {post.desc}
                </p>
                <div className="flex items-center gap-2 font-semibold text-[15px]">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-24 text-center">
            <button className="h-12 px-8 rounded-full border border-[#ECECEC] font-semibold text-[#111111] hover:bg-[#FAFAFA] transition-colors">
              Muat Lebih Banyak
            </button>
          </div>
        </section>

      </main>
    </>
  );
}
