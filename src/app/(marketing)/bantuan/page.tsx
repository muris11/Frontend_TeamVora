import { SEOHead } from "@/components/shared/seo-head";
import { MessageCircle, FileText, PhoneCall, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function BantuanPage() {
  return (
    <>
      <SEOHead title="Pusat Bantuan - TeamVora" description="Bantuan dan dukungan untuk pengguna TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Header */}
        <section className="container mx-auto px-6 max-w-[800px] text-center mb-24">
          <div className="w-16 h-16 rounded-2xl bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center mx-auto mb-8 text-[#111111]">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-[48px] md:text-[64px] font-[800] leading-[1.1] tracking-[-0.02em] mb-6">
            Pusat Bantuan
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6]">
            Bagaimana kami bisa membantu Anda hari ini?
          </p>
        </section>

        {/* Support Options */}
        <section className="container mx-auto px-6 max-w-[1000px] mb-32">
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/panduan" className="bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8 hover:border-[#111111] transition-colors group">
              <FileText className="w-8 h-8 mb-6 text-[#111111]" />
              <h2 className="text-[20px] font-[700] mb-3">Dokumentasi & Panduan</h2>
              <p className="text-[15px] text-[#666666] leading-[1.6]">
                Cari jawaban instan melalui ribuan artikel bantuan komprehensif kami.
              </p>
            </Link>
            
            <Link href="/kontak" className="bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8 hover:border-[#111111] transition-colors group">
              <MessageCircle className="w-8 h-8 mb-6 text-[#111111]" />
              <h2 className="text-[20px] font-[700] mb-3">Buat Tiket (Email)</h2>
              <p className="text-[15px] text-[#666666] leading-[1.6]">
                Tim dukungan kami akan merespon email Anda dalam waktu 24 jam kerja.
              </p>
            </Link>
            
            <Link href="/kontak" className="bg-[#111111] text-white rounded-3xl p-8 hover:bg-[#000000] transition-colors group">
              <PhoneCall className="w-8 h-8 mb-6 text-white" />
              <h2 className="text-[20px] font-[700] mb-3">Dukungan Prioritas</h2>
              <p className="text-[15px] text-[#999999] leading-[1.6]">
                Telepon dan bantuan live chat 24/7 (Khusus pengguna paket Enterprise).
              </p>
            </Link>
          </div>
        </section>

        {/* Top FAQs */}
        <section className="container mx-auto px-6 max-w-[800px] mb-20">
          <h2 className="text-[32px] font-[700] mb-8 tracking-[-0.02em]">Pertanyaan yang Sering Diajukan</h2>
          
          <div className="space-y-4">
            {[
              { q: "Bagaimana cara mereset password akun saya?", a: "Pergi ke halaman login, klik 'Lupa Password', dan masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan reset password." },
              { q: "Apakah saya bisa membatalkan langganan kapan saja?", a: "Ya. Anda dapat membatalkan langganan kapan pun melalui Pengaturan Akun > Penagihan. Langganan Anda akan tetap aktif hingga akhir periode pembayaran." },
              { q: "Bagaimana cara mengubah email yang terdaftar?", a: "Masuk ke Pengaturan Akun, pilih tab Profil, lalu klik ikon pensil di sebelah email Anda untuk mengubahnya." },
              { q: "Di mana saya bisa melihat faktur/invoice bulanan?", a: "Faktur dapat diunduh kapan saja di menu Pengaturan Akun > Penagihan > Riwayat Faktur." }
            ].map((faq, i) => (
              <div key={i} className="border border-[#ECECEC] rounded-2xl p-6 bg-white">
                <h3 className="font-bold text-[16px] mb-3">{faq.q}</h3>
                <p className="text-[15px] text-[#666666] leading-[1.6]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}
