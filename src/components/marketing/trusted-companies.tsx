"use client";

import { motion } from "motion/react";

const companies = [
  "Gojek", "Tokopedia", "Traveloka", "Ruangguru", "Halodoc", 
  "Bukalapak", "Blibli", "Telkomsel", "Shopee", "OVO", "Dana"
];

export function TrustedCompanies() {
  return (
    <section className="py-12 border-b border-[#ECECEC] bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <p className="text-center text-[14px] text-[#999999] mb-8 font-medium uppercase tracking-widest">
          Dipercaya oleh perusahaan inovatif
        </p>
        
        {/* Infinite Scroll Marquee */}
        <div className="relative flex overflow-x-hidden">
          {/* Masking gradients */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <motion.div 
            className="flex whitespace-nowrap gap-16 items-center px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* Double the array for seamless looping */}
            {[...companies, ...companies].map((name, i) => (
              <div 
                key={i} 
                className="text-xl md:text-2xl font-bold text-[#666666] tracking-tighter opacity-70 grayscale transition-opacity hover:opacity-100 cursor-default"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
