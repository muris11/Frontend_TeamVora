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
import { PreviewFrame } from "@/components/shared/preview-frame";

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
  const queryClient = useQueryClient();
  const [termsContent, setTermsContent] = useState<TermsContent>({
    last_updated: new Date().toISOString().split('T')[0],
    contact_email: "support@teamvora.com",
    sections: []
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { marketing?: { terms_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.terms_content) {
      const parsed = safeJsonParse(settings.marketing.terms_content, null);
      if (parsed) {
        setTermsContent(parsed);
      } else {
        // Migration from old string format
        setTermsContent(prev => ({
            ...prev,
            sections: [{ title: "Syarat & Ketentuan", content: settings.marketing!.terms_content! }]
        }));
      }
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Syarat berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Syarat"),
  });

  const handleSave = () => {
    saveMutation.mutate({ terms_content: JSON.stringify(termsContent) });
  };

  const addSection = () => {
    setTermsContent({
      ...termsContent,
      sections: [...termsContent.sections, { title: "", content: "" }]
    });
  };

  const removeSection = (idx: number) => {
    setTermsContent({
      ...termsContent,
      sections: termsContent.sections.filter((_, i) => i !== idx)
    });
  };

  const updateSection = (idx: number, field: keyof TermsSection, value: string) => {
    setTermsContent({
      ...termsContent,
      sections: termsContent.sections.map((s, i) => i === idx ? { ...s, [field]: value } : s)
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
      <PageTitle title="Syarat & Ketentuan | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Syarat & Ketentuan</h1>
          <p className="text-muted-foreground">Edit konten halaman Syarat & Ketentuan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/syarat", "_blank")} className="rounded-xl">
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
                    value={termsContent.last_updated} 
                    onChange={(e) => setTermsContent({ ...termsContent, last_updated: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email Kontak</Label>
                  <Input 
                    type="email" 
                    value={termsContent.contact_email} 
                    onChange={(e) => setTermsContent({ ...termsContent, contact_email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Bagian Konten</CardTitle>
                <CardDescription>Konten halaman syarat & ketentuan.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addSection} className="rounded-lg">
                <Plus className="w-4 h-4 mr-1" /> Tambah
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {termsContent.sections.map((section, idx) => (
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
                      placeholder="Contoh: Penggunaan Layanan"
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
              {termsContent.sections.length === 0 && (
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
              <PreviewFrame url="/syarat" title="Syarat & Ketentuan" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
