"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Apakah TeamVora aman digunakan untuk data sensitif perusahaan?",
    answer: "Sangat aman. Kami menggunakan enkripsi AES-256 tingkat bank (bank-grade encryption) baik untuk data yang tersimpan maupun yang sedang ditransmisikan. Server kami juga berada di data center tersertifikasi ISO 27001."
  },
  {
    question: "Apakah saya bisa mengundang anggota tim tanpa batas?",
    answer: "Batas anggota tim bergantung pada paket langganan Anda. Paket Starter gratis hingga 5 pengguna, Professional hingga 50 pengguna, dan Enterprise tidak memiliki batas pengguna."
  },
  {
    question: "Bagaimana cara kerja fitur absensinya?",
    answer: "Karyawan dapat melakukan check-in dan check-out melalui dashboard mereka, dan sistem akan mencatat waktu secara real-time. Anda juga dapat mengatur shift, toleransi keterlambatan, dan melihat laporan rekapitulasi secara otomatis."
  },
  {
    question: "Apakah TeamVora bisa diintegrasikan dengan aplikasi lain?",
    answer: "Ya, kami mendukung integrasi dengan Google Workspace, Slack untuk notifikasi tugas, dan memiliki API kustom (pada paket Enterprise) untuk sinkronisasi dengan sistem ERP atau HRIS internal Anda."
  },
  {
    question: "Apakah ada aplikasi mobile (Android/iOS)?",
    answer: "Saat ini platform kami dirancang agar sangat responsif saat diakses melalui browser mobile. Aplikasi native (Android & iOS) saat ini sedang dalam tahap pengembangan dan akan segera dirilis."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`border rounded-2xl overflow-hidden transition-colors ${
            openIndex === index 
              ? "border-primary/50 bg-primary/5" 
              : "border-border/50 bg-background/50 hover:bg-muted/30"
          }`}
        >
          <button
            className="w-full px-6 py-5 flex items-center justify-between text-left font-medium focus:outline-none"
            onClick={() => toggleAccordion(index)}
          >
            <span className="text-lg">{faq.question}</span>
            <ChevronDown 
              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                openIndex === index ? "rotate-180 text-primary" : ""
              }`} 
            />
          </button>
          
          <div 
            className={`transition-all duration-300 ease-in-out px-6 ${
              openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 py-0 opacity-0"
            }`}
          >
            <p className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
