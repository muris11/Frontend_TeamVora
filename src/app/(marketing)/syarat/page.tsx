import { SEOHead } from "@/components/shared/seo-head";

export default function SyaratPage() {
  return (
    <>
      <SEOHead title="Syarat dan Ketentuan - TeamVora" description="Syarat dan Ketentuan Layanan TeamVora." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        <section className="container mx-auto px-6 max-w-[800px]">
          <h1 className="text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] mb-4">Syarat & Ketentuan</h1>
          <p className="text-[16px] text-[#666666] mb-12">Berlaku efektif sejak: 15 Oktober 2026</p>

          <div className="prose prose-lg prose-neutral max-w-none text-[#444444] leading-relaxed">
            <p>
              Harap baca Ketentuan Layanan ini dengan saksama sebelum menggunakan platform TeamVora. Dengan mendaftar, mengakses, atau menggunakan layanan kami, Anda setuju untuk terikat oleh Ketentuan ini.
            </p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">1. Penggunaan Layanan</h3>
            <p>
              Anda setuju untuk menggunakan TeamVora hanya untuk tujuan yang sah dan sesuai dengan ketentuan ini. Anda bertanggung jawab penuh atas segala aktivitas yang terjadi di bawah akun Anda dan atas kerahasiaan kata sandi Anda. 
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Anda tidak diperkenankan mengunggah konten ilegal, berbahaya, atau melanggar hak cipta.</li>
              <li>Anda dilarang melakukan rekayasa balik (reverse engineering) pada aplikasi kami.</li>
              <li>Satu akun hanya boleh digunakan oleh individu yang terdaftar; dilarang berbagi kredensial login.</li>
            </ul>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">2. Berlangganan & Pembayaran</h3>
            <p>
              Untuk paket berbayar (Pro/Enterprise), tagihan dilakukan secara otomatis di awal siklus penagihan (bulanan atau tahunan). Jika pembayaran gagal, kami berhak menangguhkan akun Anda setelah masa tenggang 7 hari. Anda dapat membatalkan langganan kapan saja, namun kami tidak memberikan pengembalian dana parsial untuk bulan berjalan.
            </p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">3. Kepemilikan Kekayaan Intelektual</h3>
            <p>
              Seluruh data, file, dan konten yang Anda unggah ke TeamVora tetap menjadi milik Anda. Namun, Anda memberi kami lisensi terbatas di seluruh dunia untuk menyelenggarakan, menyalin, dan memproses data tersebut semata-mata untuk tujuan menyediakan layanan TeamVora kepada Anda.
            </p>
            <p>
              Perangkat lunak, desain UI, merek dagang, dan kode sumber TeamVora sepenuhnya adalah milik TeamVora Inc.
            </p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">4. Batasan Tanggung Jawab (Limitation of Liability)</h3>
            <p>
              TeamVora disediakan secara "sebagaimana adanya" (as is). Sejauh diizinkan oleh hukum, kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial (termasuk hilangnya data atau keuntungan bisnis) yang timbul akibat penggunaan atau ketidakmampuan menggunakan layanan kami.
            </p>

            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-[#ECECEC] mt-12">
              <h4 className="font-bold mb-2 text-[#111111]">Butuh penjelasan lebih lanjut?</h4>
              <p className="text-[15px]">Hubungi tim legal kami di <a href="mailto:legal@teamvora.com" className="text-[#111111] underline font-medium">legal@teamvora.com</a>.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
