import { SEOHead } from "@/components/shared/seo-head";

export default function ChangelogPage() {
  const logs = [
    {
      version: "v2.4.0",
      date: "05 Okt 2026",
      type: "Feature",
      title: "Otomatisasi Berbasis AI & Custom Webhooks",
      desc: "Kini Anda dapat membuat aturan otomatisasi tanpa kode. Contoh: Saat status tugas berubah menjadi 'Selesai', otomatis kirim pesan ke Slack dan ubah tugas dependen menjadi 'In Progress'. Kami juga merilis kapabilitas Webhook kustom untuk integrasi internal Anda.",
      fixes: ["Peningkatan kecepatan loading awal hingga 40%", "Memperbaiki bug di mana drag & drop Kanban tidak menyimpan urutan di Safari", "Filter teks kustom sekarang mendukung regex"]
    },
    {
      version: "v2.3.5",
      date: "12 Sep 2026",
      type: "Improvement",
      title: "Pembaruan Tampilan Gantt & Timeline",
      desc: "Menulis ulang komponen rendering Gantt chart dengan Canvas API. Sekarang Gantt dapat merender hingga 10,000 tugas tanpa penurunan FPS. Menambahkan dukungan untuk mengekspor timeline ke PDF resolusi tinggi.",
      fixes: ["Memperbaiki tooltip yang terpotong di layar kecil", "Sinkronisasi real-time yang lebih cepat saat 50+ orang mengedit dokumen bersama"]
    },
    {
      version: "v2.3.0",
      date: "28 Agu 2026",
      type: "Feature",
      title: "Role-Based Access Control (RBAC) Lanjutan",
      desc: "Administrator kini dapat membuat peran (role) kustom dengan perizinan yang sangat spesifik (granular). Anda bisa menentukan siapa saja yang bisa mengedit deskripsi, mendelete tugas, atau mengubah penagihan.",
      fixes: ["Mendukung lampiran file hingga 2GB untuk pengguna Enterprise", "Pencarian global kini menampilkan hasil dari dalam isi dokumen (Full-text search)"]
    },
    {
      version: "v2.2.1",
      date: "05 Agu 2026",
      type: "Bugfix",
      title: "Perbaikan Stabilitas & Patch Keamanan",
      desc: "Pembaruan rutin untuk meningkatkan keamanan infrastruktur WebSocket dan menambal beberapa edge-case UI pada mode gelap.",
      fixes: ["Memperbaiki masalah sesi login yang terkadang putus di aplikasi iOS", "Menghapus kedipan layar saat berpindah dari halaman utama ke pengaturan"]
    }
  ];

  return (
    <>
      <SEOHead title="Changelog - TeamVora" description="Pembaruan terbaru, rilis fitur, dan perbaikan bug." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[800px] mb-20 text-center">
          <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
            Pembaruan Terbaru
          </h1>
          <p className="text-[18px] text-[#666666] leading-[1.6]">
            Kami merilis fitur baru dan perbaikan setiap minggu. <br className="hidden md:block"/> Inilah yang sedang kami kerjakan akhir-akhir ini.
          </p>
        </section>

        {/* Timeline */}
        <section className="container mx-auto px-6 max-w-[800px]">
          <div className="relative border-l border-[#ECECEC] ml-4 md:ml-0 md:pl-8 space-y-24">
            
            {logs.map((log, i) => (
              <div key={i} className="relative pl-8 md:pl-0">
                <div className="absolute -left-[41px] md:-left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#111111]"></div>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <span className="text-[24px] font-[800] tracking-tight">{log.version}</span>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-[#D4D4D4]"></div>
                  <span className="text-[16px] text-[#666666] font-medium">{log.date}</span>
                  <div className="hidden md:block w-1 h-1 rounded-full bg-[#D4D4D4]"></div>
                  <span className={`text-[12px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${log.type === 'Feature' ? 'bg-[#E0F2FE] text-[#0369A1]' : log.type === 'Improvement' ? 'bg-[#FEF3C7] text-[#B45309]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>
                    {log.type}
                  </span>
                </div>

                <h3 className="text-[28px] font-[700] leading-[1.2] tracking-tight mb-4">{log.title}</h3>
                <p className="text-[16px] text-[#444444] leading-[1.7] mb-8">{log.desc}</p>

                <div className="bg-[#FAFAFA] rounded-2xl p-6 border border-[#ECECEC]">
                  <h4 className="font-bold text-[14px] uppercase tracking-wider mb-4">Peningkatan Lainnya</h4>
                  <ul className="space-y-3">
                    {log.fixes.map((fix, j) => (
                      <li key={j} className="flex items-start gap-3 text-[15px] text-[#666666]">
                        <span className="text-[#111111] mt-0.5">•</span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ))}

          </div>

          <div className="mt-24 text-center">
            <button className="h-12 px-8 rounded-full border border-[#ECECEC] font-semibold text-[#111111] hover:bg-[#FAFAFA] transition-colors">
              Muat Riwayat Lebih Lama
            </button>
          </div>
        </section>

      </main>
    </>
  );
}
