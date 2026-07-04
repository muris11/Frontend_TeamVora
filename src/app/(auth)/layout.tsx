import Link from "next/link";
import { Users } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Users className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">TeamVora</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block overflow-hidden">
        {/* Dynamic decorative background */}
        <div className="absolute inset-0 bg-zinc-950">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-blue-600/20 blur-[100px]" />
        </div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        
        {/* Branding text/quote */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-zinc-50">
          <div className="space-y-6 max-w-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
              <Users className="size-6 text-white" />
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Platform Kolaborasi & Manajemen Tim Terbaik.
            </h2>
            <p className="text-zinc-400 text-lg">
              Tingkatkan produktivitas tim Anda dengan fitur manajemen proyek, absensi, dan komunikasi yang terintegrasi di satu tempat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
