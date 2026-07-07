import { SEOHead } from "@/components/shared/seo-head";
import { MessageSquare, Users, HeartHandshake, Mic } from "lucide-react";
import Link from "next/link";

export default function KomunitasPage() {
  return (
    <>
      <SEOHead title="Komunitas - TeamVora" description="Bergabung dengan komunitas pengguna, kreator, dan engineer TeamVora di seluruh dunia." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[800px] text-center mb-24">
          <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
            Membangun Bersama
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6]">
            Tempat di mana para inovator, engineer, dan desainer berbagi cara mereka menggunakan TeamVora untuk pekerjaan yang lebih baik.
          </p>
        </section>

        {/* Community Channels */}
        <section className="container mx-auto px-6 max-w-[1000px] mb-32">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8 hover:border-[#111111] transition-colors group">
              <MessageSquare className="w-8 h-8 mb-6 text-[#111111]" />
              <h2 className="text-[24px] font-[700] mb-3">Forum Diskusi</h2>
              <p className="text-[16px] text-[#666666] leading-[1.6] mb-8">
                Tanyakan sesuatu, bagikan trik alur kerja Anda, atau request fitur baru langsung ke tim produk kami.
              </p>
              <button className="h-12 px-6 rounded-full bg-white border border-[#ECECEC] font-semibold text-[#111111] hover:bg-[#FAFAFA] transition-colors">
                Kunjungi Forum
              </button>
            </div>
            
            <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8 hover:border-[#111111] transition-colors group">
              <Users className="w-8 h-8 mb-6 text-[#111111]" />
              <h2 className="text-[24px] font-[700] mb-3">Grup Discord</h2>
              <p className="text-[16px] text-[#666666] leading-[1.6] mb-8">
                Ngobrol santai dan terhubung secara realtime dengan +10,000 pengguna aktif lainnya di seluruh dunia.
              </p>
              <button className="h-12 px-6 rounded-full bg-[#111111] font-semibold text-white hover:bg-[#000000] transition-colors">
                Gabung Discord
              </button>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="bg-[#111111] text-white py-24 mb-32 rounded-[40px] mx-6 md:mx-auto max-w-[1200px]">
          <div className="container mx-auto px-6 md:px-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <h2 className="text-[36px] md:text-[48px] font-[700] tracking-[-0.02em] mb-4">Acara Mendatang</h2>
                <p className="text-[18px] text-[#999999]">Meetup lokal, webinar, dan konferensi virtual.</p>
              </div>
              <button className="h-12 px-6 rounded-full border border-[#333333] text-white hover:bg-[#222222] transition-colors">
                Lihat Semua Acara
              </button>
            </div>

            <div className="space-y-6">
              {[
                { date: "24 Nov", title: "TeamVora DevCon 2026", type: "Virtual", icon: <Mic className="w-5 h-5"/> },
                { date: "15 Des", title: "Webinar: Pengenalan API Baru", type: "Zoom", icon: <HeartHandshake className="w-5 h-5"/> }
              ].map((ev, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-[#333333] bg-[#1A1A1A] hover:border-white transition-colors cursor-pointer group">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="text-[24px] font-bold text-[#999999] w-20">{ev.date}</div>
                    <div className="w-[1px] h-10 bg-[#333333] hidden md:block"></div>
                    <div>
                      <h3 className="text-[20px] font-[700] mb-1">{ev.title}</h3>
                      <p className="text-[14px] text-[#999999] flex items-center gap-2">{ev.icon} {ev.type}</p>
                    </div>
                  </div>
                  <div className="md:opacity-0 group-hover:opacity-100 transition-opacity text-white font-medium">
                    RSVP Sekarang →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
