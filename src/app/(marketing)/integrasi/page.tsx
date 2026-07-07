import { SEOHead } from "@/components/shared/seo-head";
import { Search, ArrowRight } from "lucide-react";

export default function IntegrasiPage() {
  const integrations = [
    { name: "Slack", desc: "Terima notifikasi tugas dan balas komentar langsung dari Slack.", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
    { name: "GitHub", desc: "Tautkan pull request dan commit ke tugas untuk sinkronisasi status otomatis.", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
    { name: "Figma", desc: "Sematkan desain Figma yang dapat berinteraksi langsung di dalam spesifikasi tugas.", icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
    { name: "Google Drive", desc: "Lampirkan dokumen, spreadsheet, dan presentasi langsung ke proyek.", icon: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" },
    { name: "Notion", desc: "Sinkronisasi halaman dan database Notion dengan manajemen tugas TeamVora.", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg" },
    { name: "Zoom", desc: "Buat link meeting Zoom secara instan dari acara kalender proyek.", icon: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Zoom_Icon.png" },
    { name: "Jira", desc: "Impor atau sinkronisasi 2 arah untuk migrasi yang mulus ke TeamVora.", icon: "https://cdn.iconscout.com/icon/free/png-256/free-jira-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-4-pack-logos-icons-2944983.png?f=webp&w=256" },
    { name: "Zapier", desc: "Hubungkan TeamVora dengan 5,000+ aplikasi lain melalui Zapier.", icon: "https://cdn.iconscout.com/icon/free/png-256/free-zapier-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-7-pack-logos-icons-2945237.png?f=webp&w=256" },
  ];

  return (
    <>
      <SEOHead title="Integrasi - TeamVora" description="Hubungkan TeamVora dengan aplikasi favorit Anda." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[1000px] mb-24 text-center">
          <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
            Terhubung dengan <br className="hidden md:block"/> Semuanya
          </h1>
          <p className="text-[18px] md:text-[20px] text-[#666666] leading-[1.6] max-w-[700px] mx-auto mb-12">
            Pusatkan pekerjaan Anda. TeamVora terintegrasi secara mulus dengan puluhan alat yang sudah Anda gunakan setiap hari.
          </p>
          
          <div className="relative max-w-[600px] mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
            <input 
              type="text" 
              placeholder="Cari aplikasi atau integrasi..." 
              className="w-full h-14 pl-14 pr-6 rounded-full border-2 border-[#ECECEC] bg-[#FAFAFA] text-[16px] focus:outline-none focus:border-[#111111] transition-colors"
            />
          </div>
        </section>

        {/* Categories & Grid */}
        <section className="container mx-auto px-6 max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            {['Semua', 'Komunikasi', 'Desain', 'Engineering', 'File Storage', 'CRM'].map(cat => (
              <button key={cat} className={`px-5 h-10 rounded-full border ${cat === 'Semua' ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#ECECEC] bg-white text-[#666666] hover:border-[#111111]'} font-medium text-[14px] transition-colors`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {integrations.map((app, i) => (
              <div key={i} className="group bg-white rounded-3xl p-8 border border-[#ECECEC] hover:border-[#111111] transition-colors flex flex-col h-full cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center mb-6 overflow-hidden p-2">
                  <img src={app.icon} alt={app.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[20px] font-[700] mb-3">{app.name}</h3>
                <p className="text-[14px] text-[#666666] leading-[1.6] flex-1 mb-6">
                  {app.desc}
                </p>
                <div className="text-[14px] font-semibold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                  Pelajari <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* Custom API CTA */}
        <section className="container mx-auto px-6 max-w-[1000px] mt-32">
          <div className="bg-[#111111] rounded-3xl p-12 md:p-16 text-center text-white">
            <h2 className="text-[32px] md:text-[40px] font-[700] tracking-[-0.02em] mb-6">
              Tidak menemukan alat Anda?
            </h2>
            <p className="text-[18px] text-[#999999] mb-10 max-w-[600px] mx-auto leading-relaxed">
              Kami menyediakan GraphQL dan REST API terbuka yang lengkap beserta dukungan Webhooks agar Anda bisa membangun integrasi kustom Anda sendiri.
            </p>
            <a href="https://docs.teamvora.web.id" target="_blank" rel="noopener noreferrer" className="h-[56px] px-8 inline-flex items-center justify-center rounded-full bg-white text-[#111111] text-[16px] font-semibold transition-all hover:bg-[#FAFAFA]">
              Baca Dokumentasi API
            </a>
          </div>
        </section>

      </main>
    </>
  );
}
