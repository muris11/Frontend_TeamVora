"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, ExternalLink, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

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
  const queryClient = useQueryClient();
  const [privacyContent, setPrivacyContent] = useState<PrivacyContent>({
    last_updated: new Date().toISOString().split('T')[0],
    contact_email: "privacy@teamvora.com",
    sections: []
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { marketing?: { privacy_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.privacy_content) {
      const parsed = safeJsonParse(settings.marketing.privacy_content, null);
      if (parsed) {
        setPrivacyContent(parsed);
      } else {
        // Migration from old string format
        setPrivacyContent(prev => ({
            ...prev,
            sections: [{ title: "Kebijakan Privasi", content: settings.marketing!.privacy_content! }]
        }));
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Privasi berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Privasi"),
  });

  const handleSave = () => {
    saveMutation.mutate({ privacy_content: JSON.stringify(privacyContent) });
  };

  const addSection = () => {
    setPrivacyContent({
      ...privacyContent,
      sections: [...privacyContent.sections, { title: "", content: "" }]
    });
  };

  const removeSection = (idx: number) => {
    setPrivacyContent({
      ...privacyContent,
      sections: privacyContent.sections.filter((_, i) => i !== idx)
    });
  };

  const updateSection = (idx: number, field: keyof PrivacySection, value: string) => {
    setPrivacyContent({
      ...privacyContent,
      sections: privacyContent.sections.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Kebijakan Privasi | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kebijakan Privasi</h1>
          <p className="text-muted-foreground">Edit konten halaman Kebijakan Privasi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/privasi", "_blank")} className="rounded-xl">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="rounded-xl">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>Detail kontak dan tanggal pembaruan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Terakhir Diperbarui</Label>
                  <Input 
                    type="date" 
                    value={privacyContent.last_updated} 
                    onChange={(e) => setPrivacyContent({ ...privacyContent, last_updated: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email Kontak</Label>
                  <Input 
                    type="email" 
                    value={privacyContent.contact_email} 
                    onChange={(e) => setPrivacyContent({ ...privacyContent, contact_email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bagian Konten</CardTitle>
                <CardDescription>Konten halaman kebijakan privasi.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addSection} className="rounded-lg">
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {privacyContent.sections.map((section, idx) => (
                <div key={idx} className="border rounded-xl p-4 space-y-4 bg-muted/10">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Bagian #{idx + 1}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => removeSection(idx)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Label>Judul Bagian</Label>
                    <Input 
                      value={section.title} 
                      onChange={(e) => updateSection(idx, "title", e.target.value)} 
                      placeholder="Contoh: Informasi yang Kami Kumpulkan"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Konten</Label>
                    <RichTextEditor
                      value={section.content}
                      onChange={(val) => updateSection(idx, "content", val)}
                      placeholder="Tuliskan konten di sini..."
                    />
                  </div>
                </div>
              ))}
              {privacyContent.sections.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Belum ada bagian konten.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-xl overflow-hidden bg-background">
                <div className="px-6 py-8 border-b border-border/50 text-center bg-muted/10">
                  <h1 className="text-2xl font-bold tracking-tight mb-2">Kebijakan Privasi</h1>
                  <p className="text-xs text-muted-foreground">Terakhir diperbarui: {privacyContent.last_updated || "..."}</p>
                </div>
                <div className="px-6 py-6 space-y-8">
                  {privacyContent.sections.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center">Belum ada konten...</p>
                  ) : (
                    privacyContent.sections.map((section, idx) => (
                      <div key={idx}>
                        <h2 className="text-lg font-bold mb-3">{section.title || `Bagian ${idx + 1}`}</h2>
                        <div 
                          className="prose dark:prose-invert max-w-none prose-sm" 
                          dangerouslySetInnerHTML={{ __html: section.content || "<p class='text-muted-foreground'>Isi konten...</p>" }} 
                        />
                      </div>
                    ))
                  )}
                  {privacyContent.contact_email && (
                    <div className="mt-8 pt-6 border-t border-border/50 text-sm">
                      Jika Anda memiliki pertanyaan, hubungi kami di <a href={`mailto:${privacyContent.contact_email}`} className="text-primary hover:underline">{privacyContent.contact_email}</a>.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
