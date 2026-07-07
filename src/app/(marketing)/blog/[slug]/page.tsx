import { SEOHead } from "@/components/shared/seo-head";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Share2, AtSign, Briefcase, Bookmark, Mail } from "lucide-react";

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  // Dummy post data
  const post = {
    title: "Memperkenalkan TeamVora 2.0: Lebih Cepat, Lebih Pintar",
    category: "Produk",
    date: "12 Okt 2026",
    author: "Rifqy",
    authorRole: "Head of Engineering",
    authorImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
  };

  const relatedBlogs = [
    {
      title: "Skalabilitas Database untuk Jutaan Notifikasi Waktu Nyata",
      category: "Engineering",
      date: "28 Sep 2026",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Bekerja Asinkron: Mengapa Kami Menghapus Rapat Harian",
      category: "Kultur",
      date: "15 Sep 2026",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    }
  ];

  return (
    <>
      <SEOHead title={`${post.title} - TeamVora Blog`} description="Artikel blog dari TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Breadcrumb */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#666666] hover:text-[#111111] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>
        </section>

        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-16">
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[32px] overflow-hidden relative group">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Title Inside Hero */}
            <div className="absolute bottom-0 left-0 p-8 md:p-12 lg:p-16 w-full max-w-[900px] text-white">
              <div className="flex items-center gap-3 mb-6 text-[14px] font-bold tracking-widest uppercase">
                <span className="text-[#999999]">{post.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span className="text-white">{post.date}</span>
              </div>
              <h1 className="text-[36px] md:text-[56px] lg:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em]">
                {post.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Left: Article Content */}
            <div className="lg:w-[65%]">
              
              {/* Author Info for Mobile (Hidden on Desktop) */}
              <div className="flex items-center gap-4 mb-10 lg:hidden border-b border-[#ECECEC] pb-8">
                <Image src={post.authorImage} alt={post.author} width={56} height={56} loading="lazy" className="w-14 h-14 rounded-full object-cover grayscale" />
                <div>
                  <div className="font-[700] text-[16px]">{post.author}</div>
                  <div className="text-[14px] text-[#666666]">{post.authorRole}</div>
                </div>
              </div>

              <article className="prose prose-lg prose-neutral max-w-none text-[#444444] leading-relaxed">
                <p className="text-[20px] md:text-[22px] leading-[1.6] text-[#111111] font-medium mb-10">
                  Pelajari bagaimana kami membangun ulang arsitektur inti TeamVora dengan Next.js 16 untuk menghadirkan pengalaman pengguna yang instan tanpa waktu muat.
                </p>
                
                <p>
                  Di TeamVora, kami percaya bahwa <em>software</em> manajemen tugas tidak boleh lebih lambat dari cara Anda berpikir. Ketika kami melihat data telemetri kami bulan lalu, kami menyadari bahwa meskipun aplikasi kami stabil, aplikasi ini mulai terasa "berat" bagi tim-tim besar (1.000+ pengguna) yang memiliki ratusan proyek aktif.
                </p>

                <h3 className="text-[28px] font-[700] text-[#111111] mt-12 mb-6 tracking-tight">Tantangan Kinerja</h3>
                <p>
                  Awalnya, klien kami menggunakan pendekatan CSR (Client-Side Rendering) murni. Ini berarti browser harus mengunduh JavaScript dalam jumlah besar, mem-parsing-nya, merender halaman kosong, kemudian mengambil data dari API, baru akhirnya merender antarmuka pengguna. Proses ini memakan waktu rata-rata 3,2 detik di jaringan 4G.
                </p>
                
                <p>
                  Bagi kami, 3 detik adalah keabadian.
                </p>

                <h3 className="text-[28px] font-[700] text-[#111111] mt-12 mb-6 tracking-tight">Menuju Next.js 16 & React Server Components</h3>
                <p>
                  Dengan React Server Components, kami dapat memindahkan beban kerja berat (<em>heavy lifting</em>) ke server. Kami tidak lagi mengirimkan pustaka format tanggal, markdown parser, atau modul kalkulasi grafik yang rumit ke browser pengguna.
                </p>
                
                <ul className="list-disc pl-6 mb-6 space-y-3">
                  <li><strong>Zero-Bundle Size:</strong> Banyak komponen UI statis sekarang sama sekali tidak menambah ukuran paket JS klien.</li>
                  <li><strong>Streaming:</strong> Header dan Sidebar langsung ditampilkan dalam 100ms pertama, sementara data tugas mengalir (<em>streaming</em>) segera setelah tersedia dari database.</li>
                  <li><strong>Caching Agresif:</strong> Menggunakan arsitektur jaringan Redis <em>edge</em> kami yang baru untuk menyajikan data instan.</li>
                </ul>

                <blockquote className="border-l-4 border-[#111111] pl-8 my-12 py-2 italic text-[24px] md:text-[28px] font-[700] text-[#111111] leading-snug tracking-tight bg-[#FAFAFA] rounded-r-2xl">
                  "Kami merancang ulang lapisan data (data layer) kami untuk beroperasi pada kecepatan pikiran manusia, bukan mesin."
                </blockquote>

                <h3 className="text-[28px] font-[700] text-[#111111] mt-12 mb-6 tracking-tight">Dampak pada Pengguna Akhir</h3>
                <p>
                  Hasil dari arsitektur baru ini adalah antarmuka yang sangat responsif. Drag and drop tugas di papan Kanban kini terasa seperti aplikasi desktop asli. Transisi antar proyek tidak lagi memunculkan *loading spinner* yang menyebalkan.
                </p>

                <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Code visualization" width={1200} height={675} loading="lazy" className="w-full h-auto rounded-2xl my-10 grayscale" />

                <h3 className="text-[28px] font-[700] text-[#111111] mt-12 mb-6 tracking-tight">Apa Selanjutnya?</h3>
                <p>
                  Pembaruan V2.0 ini saat ini diluncurkan secara bertahap kepada seluruh pengguna. Anda tidak perlu melakukan tindakan apapun; saat pembaruan ini mengenai ruang kerja (<em>workspace</em>) Anda, Anda hanya akan merasakan bahwa segalanya menjadi sangat, sangat cepat.
                </p>
              </article>
              
              {/* Share Footer */}
              <div className="flex items-center gap-4 mt-16 pt-8 border-t border-[#ECECEC]">
                <span className="font-bold text-[16px]">Bagikan Artikel Ini:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors"><AtSign className="w-4 h-4" /></button>
                  <button className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors"><Briefcase className="w-4 h-4" /></button>
                  <button className="w-10 h-10 rounded-full border border-[#ECECEC] flex items-center justify-center hover:bg-[#111111] hover:text-white transition-colors"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:w-[35%]">
              <div className="sticky top-32 space-y-10">
                
                {/* Author Card (Desktop) */}
                <div className="hidden lg:flex flex-col bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Image src={post.authorImage} alt={post.author} width={64} height={64} loading="lazy" className="w-16 h-16 rounded-full object-cover grayscale" />
                    <div>
                      <div className="font-[800] text-[18px]">{post.author}</div>
                      <div className="text-[14px] text-[#666666]">{post.authorRole}</div>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#666666] leading-relaxed mb-6">
                    Mantan engineer di perusahaan Fortune 500, kini fokus membangun alat yang membuat tim bekerja lebih efisien di TeamVora.
                  </p>
                  <button className="h-10 px-4 rounded-full border border-[#111111] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#111111] hover:text-white transition-colors w-full">
                    <AtSign className="w-4 h-4" /> Ikuti Penulis
                  </button>
                </div>

                {/* Newsletter Box */}
                <div className="bg-[#111111] text-white rounded-3xl p-8">
                  <div className="w-12 h-12 rounded-full bg-[#222222] flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[20px] font-[800] mb-3 leading-tight">Berlangganan Newsletter</h3>
                  <p className="text-[14px] text-[#999999] mb-6 leading-relaxed">
                    Dapatkan update terbaru tentang fitur, panduan, dan wawasan industri langsung ke inbox Anda setiap bulan.
                  </p>
                  <input type="email" placeholder="Alamat email Anda" className="w-full h-12 rounded-xl bg-[#222222] border border-[#333333] px-4 text-[14px] mb-3 focus:outline-none focus:border-white text-white" />
                  <button className="w-full h-12 rounded-xl bg-white text-[#111111] font-bold text-[14px] hover:bg-[#FAFAFA] transition-colors">
                    Berlangganan
                  </button>
                </div>

                {/* Related Blogs */}
                <div>
                  <h3 className="font-bold text-[18px] mb-6 flex items-center gap-2">
                    <Bookmark className="w-5 h-5" /> Blog Terkait
                  </h3>
                  <div className="space-y-6">
                    {relatedBlogs.map((b, i) => (
                      <Link key={i} href="#" className="group flex gap-4 items-start">
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F5F5F5]">
                          <Image src={b.image} alt={b.title} fill loading="lazy" sizes="96px" className="object-cover grayscale group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-[#666666] uppercase tracking-wider mb-2">{b.category}</div>
                          <h4 className="text-[15px] font-[700] leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                            {b.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
