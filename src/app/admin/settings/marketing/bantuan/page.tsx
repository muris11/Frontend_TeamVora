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
import { IconPicker } from "@/components/ui/icon-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PreviewFrame } from "@/components/shared/preview-frame";

interface HelpArticle {
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
}

interface HelpContent {
  articles: HelpArticle[];
  popular_articles: string[];
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

export default function BantuanPage() {
  const queryClient = useQueryClient();
  const [helpContent, setHelpContent] = useState<HelpContent>({ articles: [], popular_articles: [] });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { general?: { site_name?: string }; marketing?: { help_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.help_content) {
      setHelpContent(safeJsonParse(settings.marketing.help_content, { articles: [], popular_articles: [] }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Bantuan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Bantuan"),
  });

  const handleSave = () => {
    saveMutation.mutate({ help_content: JSON.stringify(helpContent) });
  };

  const updateArticle = (idx: number, field: keyof HelpArticle, value: string) => {
    setHelpContent({ ...helpContent, articles: helpContent.articles.map((a, i) => (i === idx ? { ...a, [field]: value } : a)) });
  };
  const addArticle = () => setHelpContent({ ...helpContent, articles: [...helpContent.articles, { title: "", description: "", icon: "Mail", action: "", link: "" }] });
  const removeArticle = (idx: number) => setHelpContent({ ...helpContent, articles: helpContent.articles.filter((_, i) => i !== idx) });

  const addPopularArticle = () => setHelpContent({ ...helpContent, popular_articles: [...helpContent.popular_articles, ""] });
  const updatePopularArticle = (idx: number, value: string) => setHelpContent({ ...helpContent, popular_articles: helpContent.popular_articles.map((a, i) => i === idx ? value : a) });
  const removePopularArticle = (idx: number) => setHelpContent({ ...helpContent, popular_articles: helpContent.popular_articles.filter((_, i) => i !== idx) });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Bantuan | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bantuan</h1>
          <p className="text-muted-foreground">Edit konten halaman Bantuan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/bantuan", "_blank")} className="rounded-xl">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Channel Dukungan</CardTitle><CardDescription>Saluran bantuan di halaman /bantuan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addArticle} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {helpContent.articles.map((a, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Channel #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeArticle(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Judul</Label><Input value={a.title} onChange={(e) => updateArticle(idx, "title", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Ikon</Label><IconPicker value={a.icon} onChange={(val) => updateArticle(idx, "icon", val)} /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><Textarea value={a.description} onChange={(e) => updateArticle(idx, "description", e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Teks Aksi</Label><Input value={a.action} onChange={(e) => updateArticle(idx, "action", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Link</Label><Input value={a.link} onChange={(e) => updateArticle(idx, "link", e.target.value)} /></div>
                </div>
              </div>
            ))}
            {helpContent.articles.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada channel dukungan.</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Artikel Populer</CardTitle><CardDescription>Daftar artikel populer (teks/judul).</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addPopularArticle} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {helpContent.popular_articles.map((article, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input value={article} onChange={(e) => updatePopularArticle(idx, e.target.value)} className="flex-1" placeholder="Misal: Cara mengganti password" />
                <Button variant="ghost" size="icon-xs" onClick={() => removePopularArticle(idx)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            {helpContent.popular_articles.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada artikel populer.</p>}
          </CardContent>
        </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <PreviewFrame url="/bantuan" title="Bantuan" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
