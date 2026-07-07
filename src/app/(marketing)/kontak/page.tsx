import { SEOHead } from "@/components/shared/seo-head";
import { Mail, MapPin, Phone } from "lucide-react";

export default function KontakPage() {
  return (
    <>
      <SEOHead title="Hubungi Kami - TeamVora" description="Hubungi tim support atau sales kami." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="container mx-auto px-6 max-w-[1000px] text-center mb-24">
          <h1 className="text-[48px] md:text-[72px] font-[800] leading-[1.1] tracking-[-0.02em] mb-8">
            Hubungi Kami
          </h1>
          <p className="text-[18px] md:text-[22px] text-[#666666] leading-[1.6] max-w-[800px] mx-auto">
            Kami siap membantu Anda. Silakan isi form di bawah atau kirim pesan ke tim yang tepat.
          </p>
        </section>

        {/* Contact Content */}
        <section className="container mx-auto px-6 max-w-[1200px] mb-32">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Form */}
            <div className="bg-[#FAFAFA] border border-[#ECECEC] rounded-3xl p-8 md:p-12">
              <h2 className="text-[28px] font-[700] tracking-[-0.02em] mb-8">Kirim Pesan</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-[#111111]">Nama Depan</label>
                    <input type="text" className="w-full h-12 rounded-xl border border-[#ECECEC] bg-white px-4 focus:outline-none focus:border-[#111111] transition-colors" placeholder="Cth: Budi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-medium text-[#111111]">Nama Belakang</label>
                    <input type="text" className="w-full h-12 rounded-xl border border-[#ECECEC] bg-white px-4 focus:outline-none focus:border-[#111111] transition-colors" placeholder="Cth: Santoso" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-[#111111]">Email Perusahaan</label>
                  <input type="email" className="w-full h-12 rounded-xl border border-[#ECECEC] bg-white px-4 focus:outline-none focus:border-[#111111] transition-colors" placeholder="budi@perusahaan.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-[#111111]">Kategori Topik</label>
                  <select className="w-full h-12 rounded-xl border border-[#ECECEC] bg-white px-4 focus:outline-none focus:border-[#111111] transition-colors appearance-none">
                    <option>Pilih topik...</option>
                    <option>Sales & Penjualan</option>
                    <option>Dukungan Pelanggan (Support)</option>
                    <option>Kemitraan (Partnership)</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-medium text-[#111111]">Pesan Anda</label>
                  <textarea className="w-full h-32 rounded-xl border border-[#ECECEC] bg-white p-4 focus:outline-none focus:border-[#111111] transition-colors resize-none" placeholder="Jelaskan bagaimana kami bisa membantu Anda..."></textarea>
                </div>
                <button type="button" className="w-full h-12 rounded-xl bg-[#111111] text-white font-semibold transition-all hover:bg-[#000000]">
                  Kirim Pesan Sekarang
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-12">
              <div>
                <h3 className="text-[22px] font-[700] mb-6">Informasi Kontak</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Dukungan Pelanggan</p>
                      <a href="mailto:support@teamvora.com" className="text-[#666666] hover:text-[#111111] transition-colors">support@teamvora.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Sales (Enterprise)</p>
                      <a href="mailto:sales@teamvora.com" className="text-[#666666] hover:text-[#111111] transition-colors">sales@teamvora.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Kantor Pusat</p>
                      <p className="text-[#666666] leading-relaxed">
                        Gedung Teknologi Vora Lt. 12<br />
                        Jl. Sudirman No. 45<br />
                        Jakarta Selatan, 12190<br />
                        Indonesia
                      </p>
                    </div>
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
