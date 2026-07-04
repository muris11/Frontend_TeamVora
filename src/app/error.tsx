"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Home, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl w-full px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-2xl mb-8 shadow-sm">
            <AlertOctagon className="w-8 h-8 text-destructive" />
          </div>
        </motion.div>

        <motion.h1
          className="text-8xl md:text-9xl font-bold tracking-tighter mb-4 text-destructive"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        >
          500
        </motion.h1>

        <motion.h2
          className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Terjadi Kesalahan Internal Server
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Maaf, sistem kami mengalami kendala teknis (Something went wrong). Tim kami telah diberitahu dan sedang berusaha memperbaiki hal ini secepatnya.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            size="lg" 
            className="rounded-xl px-8 w-full sm:w-auto group flex items-center justify-center gap-2"
            onClick={reset}
          >
            <RefreshCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span>Coba Lagi (Refresh)</span>
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="rounded-xl px-8 w-full group flex items-center justify-center gap-2">
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
