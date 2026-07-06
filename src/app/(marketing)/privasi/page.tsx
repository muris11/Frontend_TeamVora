"use client";

import { motion } from "motion/react";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PageTitle } from "@/components/shared/page-title";

interface PrivacySection {
  title: string;
  content: string;
}

interface PrivacyContent {
  last_updated: string;
  contact_email: string;
  sections: PrivacySection[];
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

export default function PrivasiPage() {
  const { data: settings } = usePlatformSettings();

  let content: PrivacyContent = {
    last_updated: "2026-07-04",
    contact_email: "",
    sections: []
  };

  if (settings?.marketing?.privacy_content) {
    const parsed = safeJsonParse(settings.marketing.privacy_content, null);
    if (parsed) {
      content = parsed;
    } else {
      content.sections = [
        { title: "Kebijakan Privasi", content: settings.marketing.privacy_content }
      ];
    }
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <PageTitle title="Kebijakan Privasi - TeamVora" />

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">Kebijakan Privasi</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: {content.last_updated || "3 Juli 2026"}</p>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12 bg-card p-8 md:p-12 rounded-3xl border border-border/50 shadow-sm"
        >
          {content.sections.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Konten kebijakan privasi sedang diperbarui.
            </div>
          ) : (
            content.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {section.title && (
                  <h2 className="text-2xl font-bold tracking-tight">{section.title}</h2>
                )}
                <div
                  className="prose prose-slate dark:prose-invert max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))
          )}

          {content.contact_email && (
            <div className="pt-8 border-t border-border/50">
              <h3 className="text-xl font-bold mb-4">Hubungi Kami</h3>
              <p className="text-muted-foreground">
                Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami di:{" "}
                <a href={`mailto:${content.contact_email}`} className="text-primary hover:underline font-semibold">
                  {content.contact_email}
                </a>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
