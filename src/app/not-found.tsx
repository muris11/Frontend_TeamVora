"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl w-full px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-muted rounded-2xl mb-8 shadow-sm">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          className="text-8xl md:text-9xl font-bold tracking-tighter mb-4 text-foreground"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Halaman tidak ditemukan
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Maaf, rute yang Anda tuju sepertinya sudah dipindahkan, dihapus, atau
          memang tidak pernah ada di server kami.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" className="rounded-xl px-8 w-full group flex items-center justify-center gap-2">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="rounded-xl px-8 w-full sm:w-auto group flex items-center justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Sebelumnya</span>
          </Button>
        </motion.div>

        {/* Quick Links Section */}
        <motion.div
          className="mt-16 pt-8 border-t border-border w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Tautan Cepat:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tentang" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Tentang Kami
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/blog" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/kontak" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Kontak
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
