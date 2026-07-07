import { SEOHead } from "@/components/shared/seo-head";

export default function PrivasiPage() {
  return (
    <>
      <SEOHead title="Kebijakan Privasi - TeamVora" description="Dokumen kebijakan privasi dan perlindungan data." />
      
      <main className="bg-white min-h-screen text-[#111111] overflow-hidden font-sans pt-32 pb-20">
        <section className="container mx-auto px-6 max-w-[800px]">
          <h1 className="text-[48px] font-[800] leading-[1.1] tracking-[-0.02em] mb-4">Kebijakan Privasi</h1>
          <p className="text-[16px] text-[#666666] mb-12">Pembaruan Terakhir: 15 Oktober 2026</p>

          <div className="prose prose-lg prose-neutral max-w-none text-[#444444] leading-relaxed">
            <p>
              Di TeamVora, kami sangat menjaga privasi dan keamanan data Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.
            </p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">1. Informasi yang Kami Kumpulkan</h3>
            <p>
              Kami hanya mengumpulkan informasi yang diperlukan untuk memberikan layanan terbaik kepada Anda:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Informasi Akun:</strong> Nama, alamat email, dan kata sandi (dienkripsi) saat Anda mendaftar.</li>
              <li><strong>Data Konten:</strong> Tugas, komentar, proyek, dan file yang Anda unggah ke platform.</li>
              <li><strong>Data Penggunaan:</strong> Interaksi Anda dengan aplikasi (log akses, tipe perangkat, dan alamat IP untuk tujuan keamanan).</li>
            </ul>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">2. Bagaimana Kami Menggunakan Informasi Anda</h3>
            <p>Informasi yang terkumpul digunakan murni untuk operasional aplikasi:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Menyediakan, memelihara, dan meningkatkan fungsi aplikasi.</li>
              <li>Mendeteksi dan mencegah aktivitas penipuan atau akses tidak sah.</li>
              <li>Mengirimkan notifikasi transaksional (seperti reset password atau update sistem penting).</li>
            </ul>
            <p><strong>Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga untuk tujuan periklanan.</strong></p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">3. Penyimpanan dan Perlindungan Data</h3>
            <p>
              Seluruh data pelanggan kami disimpan di pusat data tersertifikasi (AWS/GCP) dengan enkripsi <strong>AES-256</strong> (data at rest) dan <strong>TLS 1.3</strong> (data in transit). Akses ke infrastruktur data dibatasi hanya untuk engineer senior dengan otentikasi multi-faktor (MFA) yang ketat.
            </p>

            <h3 className="text-[24px] font-[700] text-[#111111] mt-12 mb-4">4. Hak Anda (Kepatuhan GDPR)</h3>
            <p>Anda memiliki kendali penuh atas data Anda. Kapan saja, Anda berhak untuk:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Meminta salinan penuh dari semua data yang kami simpan tentang Anda.</li>
              <li>Memperbarui atau mengoreksi informasi yang salah.</li>
              <li>Meminta penghapusan permanen akun dan seluruh data terkait (Right to be Forgotten).</li>
            </ul>

            <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-[#ECECEC] mt-12">
              <h4 className="font-bold mb-2 text-[#111111]">Punya pertanyaan tentang privasi?</h4>
              <p className="text-[15px]">Hubungi Data Protection Officer kami di <a href="mailto:privacy@teamvora.com" className="text-[#111111] underline font-medium">privacy@teamvora.com</a>.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
