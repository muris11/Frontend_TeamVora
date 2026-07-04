"use client";

import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

const defaultBenefits: string[] = [];
const defaultJobs: any[] = [];

export default function KarirPage() {
  const { data: settings } = usePlatformSettings();

  let benefits = defaultBenefits;
  let jobs = defaultJobs;

  try {
    const raw = settings?.marketing?.careers_content;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.benefits?.length) {
        benefits = parsed.benefits.map((b: any) => ({
          name: b.name || typeof b === "string" ? b : "",
          description: b.description || "Kami menyediakan fasilitas terbaik agar Anda dapat fokus bekerja dengan nyaman.",
        }));
      }
      if (parsed?.openings?.length) {
        jobs = parsed.openings.map((j: any, i: number) => ({
          id: i + 1,
          title: j.title || "",
          department: j.department || "",
          location: j.location || "",
          type: j.type || "Full-time",
          description: j.description || "",
        }));
      }
    }
  } catch {}

  return (
    <main className="min-h-screen bg-background">
      <PageTitle title="Karir - TeamVora" />

      <section className="relative pt-32 pb-20 bg-primary/5 overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <Badge variant="outline" className="mb-4 bg-background px-3 py-1 rounded-full border-primary/20 text-primary">
            We are hiring!
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Bangun Masa Depan Produktivitas Bersama Kami
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Di TeamVora, kami percaya bahwa tim yang hebat membutuhkan alat bantu yang luar biasa. Bergabunglah dengan kami untuk menciptakan platform manajemen bisnis terkemuka.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <a href="#posisi-terbuka">Lihat Posisi Terbuka</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-background" asChild>
              <a href="#benefit">Kenapa TeamVora?</a>
            </Button>
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
        <section id="benefit" className="py-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Lingkungan Kerja yang Mendukung</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Kami peduli dengan kesejahteraan tim kami. Berikut adalah apa yang akan Anda dapatkan saat bergabung dengan TeamVora.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-muted/20 border border-border/50">
                  <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {jobs.length > 0 && (
        <section id="posisi-terbuka" className="py-20 bg-muted/20 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Posisi Terbuka</h2>
                <p className="text-muted-foreground text-lg">Temukan peran yang cocok untuk Anda dan mari berkembang bersama.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job: any) => (
                <Card key={job.id} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-md group">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4 flex-col md:flex-row">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{job.department}</Badge>
                          <Badge variant="outline" className="border-border/50 flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</Badge>
                          <Badge variant="outline" className="border-border/50 flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</Badge>
                        </div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">{job.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-foreground/80">{job.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`mailto:career@teamvora.coded.my.id?subject=Application for ${job.title}`}>
                        Lamar Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 border-t border-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-50" />
        <div className="container mx-auto px-6 text-center relative z-10 max-w-2xl">
          <Briefcase className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold tracking-tight mb-4">Tidak menemukan posisi yang pas?</h2>
          <p className="text-lg text-muted-foreground mb-8">Kirimkan CV dan portfolio Anda. Kami selalu terbuka untuk berbincang dengan talenta-talenta luar biasa!</p>
          <Button size="lg" variant="outline" className="rounded-full bg-background" asChild>
            <Link href="mailto:career@teamvora.coded.my.id">Kirim Inisiatif Lamaran</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
