import { SEOHead } from "@/components/shared/seo-head";
import { BookOpen, Search, ArrowRight, PlayCircle, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PanduanPage() {
  const guides = [
    { title: "Cara Mulai Cepat (Quick Start)", icon: <PlayCircle className="w-5 h-5"/>, time: "5 min baca" },
    { title: "Mengatur Proyek Pertama Anda", icon: <FileText className="w-5 h-5"/>, time: "8 min baca" },
    { title: "Mengundang & Mengelola Anggota Tim", icon: <Users className="w-5 h-5"/>, time: "4 min baca" },
    { title: "Otomatisasi dengan Workflow", icon: <Settings className="w-5 h-5"/>, time: "12 min baca" },
    { title: "Menghubungkan TeamVora ke Slack", icon: <LinkIcon className="w-5 h-5"/>, time: "3 min baca" },
    { title: "Praktik Terbaik: Manajemen Waktu", icon: <CheckCircle2 className="w-5 h-5"/>, time: "6 min baca" },
  ];

  return (
    <>
      <SEOHead title="Panduan & Tutorial - TeamVora" description="Pelajari cara menggunakan TeamVora secara maksimal." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="bg-[#FAFAFA] border-b border-[#ECECEC] py-24 mb-24">
          <div className="container mx-auto px-6 max-w-[800px] text-center">
            <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
              Panduan Pengguna
            </h1>
            <p className="text-[18px] text-[#666666] leading-[1.6] mb-12">
              Kuasai TeamVora dengan tutorial langkah demi langkah, video pelatihan, dan praktik terbaik industri.
            </p>
            
            <div className="relative max-w-[600px] mx-auto text-left">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
              <input 
                type="text" 
                placeholder="Cari tutorial (cth: 'cara buat proyek')..." 
                className="w-full h-14 pl-14 pr-6 rounded-xl border border-[#ECECEC] bg-white text-[16px] shadow-sm focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-32">
                <h3 className="font-bold text-[14px] uppercase tracking-wider mb-6 text-[#999999]">Kategori Topik</h3>
                <ul className="space-y-4 text-[16px] font-medium text-[#666666]">
                  <li><a href="#" className="text-[#111111] block">Mulai Cepat (Getting Started)</a></li>
                  <li><a href="#" className="hover:text-[#111111] transition-colors block">Manajemen Tugas & Proyek</a></li>
                  <li><a href="#" className="hover:text-[#111111] transition-colors block">Kolaborasi Tim</a></li>
                  <li><a href="#" className="hover:text-[#111111] transition-colors block">Otomatisasi & AI</a></li>
                  <li><a href="#" className="hover:text-[#111111] transition-colors block">Penagihan & Akun</a></li>
                  <li><a href="#" className="hover:text-[#111111] transition-colors block">Integrasi (API & Webhook)</a></li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <h2 className="text-[32px] font-[700] mb-8 tracking-[-0.02em]">Artikel Populer</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {guides.map((guide, i) => (
                  <Link key={i} href="#" className="group p-6 rounded-2xl border border-[#ECECEC] hover:border-[#111111] bg-white transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] flex items-center justify-center shrink-0 text-[#111111] border border-[#ECECEC]">
                        {guide.icon}
                      </div>
                      <div>
                        <h3 className="text-[18px] font-[700] mb-2 leading-snug group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                        <p className="text-[14px] text-[#999999]">{guide.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Video CTA */}
              <div className="mt-16 bg-[#111111] rounded-3xl p-10 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-[24px] font-[700] mb-3">Lebih suka menonton?</h3>
                  <p className="text-[16px] text-[#999999] max-w-[400px]">Kami memiliki puluhan kursus video di TeamVora Academy yang gratis untuk semua pengguna.</p>
                </div>
                <button className="h-12 px-6 rounded-full bg-white text-[#111111] font-semibold hover:bg-[#FAFAFA] shrink-0 inline-flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" /> Mulai Menonton
                </button>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}

// Dummy icons since some aren't imported above directly
function Users(props:any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function Settings(props:any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> }
function LinkIcon(props:any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> }
