"use client";

import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

const defaultContent = "";

export default function SyaratPage() {
  const { data: settings } = usePlatformSettings();

  let content = defaultContent;
  try {
    const raw = settings?.marketing?.terms_content;
    if (raw && raw.trim()) {
      content = raw;
    }
  } catch {}

  return (
    <main className="min-h-screen bg-background">
      <PageTitle title="Syarat & Ketentuan - TeamVora" />

      <section className="pt-32 pb-20 border-b border-border/50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Syarat & Ketentuan</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: 3 Juli 2026</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
    </main>
  );
}
