import { SEOHead } from "@/components/shared/seo-head";
import { ListTodo, GanttChart, LineChart, Lock, Users, Zap, Layout, Bot } from "lucide-react";
import Link from "next/link";

export default function FiturPage() {
  const features = [
    { icon: <ListTodo className="w-6 h-6" />, title: "Manajemen Tugas", desc: "Buat, tetapkan, dan lacak status tugas dalam papan Kanban atau daftar." },
    { icon: <GanttChart className="w-6 h-6" />, title: "Timeline & Gantt", desc: "Visualisasikan linimasa proyek untuk memastikan setiap milestone tercapai." },
    { icon: <Users className="w-6 h-6" />, title: "Kolaborasi Tim", desc: "Komentar, sebutan (mentions), dan lampiran file terintegrasi di setiap tugas." },
    { icon: <Bot className="w-6 h-6" />, title: "Otomatisasi AI", desc: "Biarkan AI mengatur tugas berulang dan menyarankan perbaikan proses." },
    { icon: <LineChart className="w-6 h-6" />, title: "Pelaporan Lanjutan", desc: "Hasilkan laporan performa tim dan proyek secara instan dengan satu klik." },
    { icon: <Lock className="w-6 h-6" />, title: "Keamanan Enterprise", desc: "Kontrol akses terperinci dengan RBAC, SSO, dan log audit komprehensif." },
    { icon: <Zap className="w-6 h-6" />, title: "Notifikasi Real-time", desc: "Pembaruan seketika via WebSockets untuk menjaga semua orang di halaman yang sama." },
    { icon: <Layout className="w-6 h-6" />, title: "Tampilan Kustom", desc: "Sesuaikan tata letak, warna, dan bidang (custom fields) sesuai alur kerja Anda." },
  ];

  return (
    <>
      <SEOHead title="Fitur Lengkap - TeamVora" description="Jelajahi berbagai fitur tangguh TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-[1000px] text-center mb-24">
          <h1 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] mb-8">
            Satu Alat untuk <br className="hidden md:block"/> Seluruh Tim Anda
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6] max-w-[800px] mx-auto">
            TeamVora menyatukan perencanaan proyek, manajemen tugas, dan komunikasi tim ke dalam satu antarmuka yang sangat responsif.
          </p>
        </section>

        {/* Feature Highlights - 1 */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-32">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] border border-[#ECECEC] text-[14px] font-medium">
                <Layout className="w-4 h-4" /> Manajemen Proyek
              </div>
              <h2 className="text-[36px] md:text-[48px] font-[700] leading-[1.1] tracking-[-0.02em]">
                Atur proyek Anda dengan presisi.
              </h2>
              <p className="text-[18px] text-[#666666] leading-[1.6]">
                Pecah proyek besar menjadi tugas-tugas kecil yang mudah dikelola. Gunakan tampilan List, Kanban, atau Kalender untuk mendapatkan gambaran jelas tentang siapa mengerjakan apa dan kapan tenggat waktunya.
              </p>
              <ul className="space-y-4 text-[16px] font-medium pt-4">
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-blue-600"/> Tampilan papan yang dapat disesuaikan</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-blue-600"/> Custom fields untuk data unik</li>
                <li className="flex items-center gap-3"><Zap className="w-5 h-5 text-blue-600"/> Filter dan pencarian tingkat lanjut</li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-[#F5F5F5] rounded-3xl h-[400px] md:h-[500px] border border-[#ECECEC] shadow-sm relative overflow-hidden">
                <div className="absolute top-10 left-10 right-[-10px] bottom-[-10px] bg-white rounded-tl-2xl border border-[#ECECEC] shadow-xl p-6">
                   <div className="w-full h-8 bg-[#FAFAFA] rounded-md mb-4 flex items-center px-4"><div className="w-24 h-2 bg-[#E5E5E5] rounded-full"></div></div>
                   <div className="grid grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                         <div key={i} className="bg-[#FAFAFA] rounded-xl p-4 border border-[#ECECEC] h-[300px]">
                           <div className="w-16 h-3 bg-[#D4D4D4] rounded-full mb-4"></div>
                           <div className="space-y-3">
                             {[1,2].map(j => <div key={j} className="h-20 bg-white rounded-lg border border-[#ECECEC] shadow-sm"></div>)}
                           </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-[#111111] text-white py-32 mb-32">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <div className="text-center mb-20">
              <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.02em] mb-6">Segala yang Anda butuhkan</h2>
              <p className="text-[18px] text-[#999999] max-w-[600px] mx-auto">
                Dibangun untuk skala besar tanpa mengorbankan kecepatan atau kesederhanaan antarmuka.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {features.map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#222222] flex items-center justify-center text-white border border-[#333333]">
                    {f.icon}
                  </div>
                  <h3 className="text-[20px] font-[700]">{f.title}</h3>
                  <p className="text-[15px] text-[#999999] leading-[1.6]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 max-w-[800px] text-center">
          <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.02em] mb-8">
            Mulai bangun alur kerja Anda
          </h2>
          <Link href="/register" className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-[#111111] text-white text-[16px] font-semibold transition-all hover:bg-[#000000] hover:-translate-y-[2px]">
            Coba TeamVora Gratis
          </Link>
        </section>

      </main>
    </>
  );
}