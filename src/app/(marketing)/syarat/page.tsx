"use client";

import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

interface TermsSection {
  title: string;
  content: string;
}

interface TermsContent {
  last_updated: string;
  contact_email: string;
  sections: TermsSection[];
}

function safeJsonParse<T>(str: string | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function SyaratPage() {
  const { data: settings } = usePlatformSettings();

  let content: TermsContent = {
    last_updated: "2026-07-04",
    contact_email: "",
    sections: []
  };

  if (settings?.marketing?.terms_content) {
    const parsed = safeJsonParse(settings.marketing.terms_content, null);
    if (parsed) {
      content = parsed;
    } else {
      // Legacy fallback
      content.sections = [
        { title: "Syarat & Ketentuan", content: settings.marketing.terms_content }
      ];
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <PageTitle title="Syarat & Ketentuan - TeamVora" />

      <section className="pt-32 pb-20 border-b border-border/50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Syarat & Ketentuan</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: {content.last_updated || "3 Juli 2026"}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          {content.sections.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Konten syarat dan ketentuan sedang diperbarui.
            </div>
          ) : (
            content.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {section.title && (
                  <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
                )}
                <div
                  className="prose prose-slate dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))
          )}

          {content.contact_email && (
            <div className="mt-12 pt-8 border-t border-border/50">
              <h3 className="text-xl font-semibold mb-4">Hubungi Kami</h3>
              <p className="text-muted-foreground">
                Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami di:{" "}
                <a href={`mailto:${content.contact_email}`} className="text-primary hover:underline font-medium">
                  {content.contact_email}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
