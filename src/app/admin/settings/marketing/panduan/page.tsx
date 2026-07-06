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
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PreviewFrame } from "@/components/shared/preview-frame";

interface GuideCategory {
  title: string;
  icon: string;
  description: string;
  articles: string[];
}

interface GuideFaq {
  question: string;
  answer: string;
}

interface GuideContent {
  categories: GuideCategory[];
  faqs: GuideFaq[];
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

export default function PanduanPage() {
  const queryClient = useQueryClient();
  const [guideContent, setGuideContent] = useState<GuideContent>({ categories: [], faqs: [] });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { general?: { site_name?: string }; marketing?: { guide_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.guide_content) {
      setGuideContent(safeJsonParse(settings.marketing.guide_content, { categories: [], faqs: [] }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Panduan berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Panduan"),
  });

  const handleSave = () => {
    saveMutation.mutate({ guide_content: JSON.stringify(guideContent) });
  };

  const updateCategory = (idx: number, field: keyof GuideCategory, value: any) => {
    setGuideContent({ ...guideContent, categories: guideContent.categories.map((c, i) => (i === idx ? { ...c, [field]: value } : c)) });
  };
  const addCategory = () => setGuideContent({ ...guideContent, categories: [...guideContent.categories, { title: "", icon: "Book", description: "", articles: [] }] });
  const removeCategory = (idx: number) => setGuideContent({ ...guideContent, categories: guideContent.categories.filter((_, i) => i !== idx) });

  const addArticle = (catIdx: number) => {
    setGuideContent({ ...guideContent, categories: guideContent.categories.map((c, i) => (i === catIdx ? { ...c, articles: [...c.articles, ""] } : c)) });
  };
  const updateArticle = (catIdx: number, artIdx: number, value: string) => {
    setGuideContent({ ...guideContent, categories: guideContent.categories.map((c, i) => (i === catIdx ? { ...c, articles: c.articles.map((a, j) => (j === artIdx ? value : a)) } : c)) });
  };
  const removeArticle = (catIdx: number, artIdx: number) => {
    setGuideContent({ ...guideContent, categories: guideContent.categories.map((c, i) => (i === catIdx ? { ...c, articles: c.articles.filter((_, j) => j !== artIdx) } : c)) });
  };

  const updateFaq = (idx: number, field: keyof GuideFaq, value: string) => {
    setGuideContent({ ...guideContent, faqs: guideContent.faqs.map((f, i) => (i === idx ? { ...f, [field]: value } : f)) });
  };
  const addFaq = () => setGuideContent({ ...guideContent, faqs: [...guideContent.faqs, { question: "", answer: "" }] });
  const removeFaq = (idx: number) => setGuideContent({ ...guideContent, faqs: guideContent.faqs.filter((_, i) => i !== idx) });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Panduan | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panduan</h1>
          <p className="text-muted-foreground">Edit konten halaman Panduan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/panduan", "_blank")} className="rounded-xl">
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
            <div><CardTitle>Kategori Panduan</CardTitle><CardDescription>Kategori artikel panduan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addCategory} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {guideContent.categories.map((c, catIdx) => (
              <div key={catIdx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Kategori #{catIdx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeCategory(catIdx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Judul</Label><Input value={c.title} onChange={(e) => updateCategory(catIdx, "title", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Ikon</Label><IconPicker value={c.icon} onChange={(val) => updateCategory(catIdx, "icon", val)} /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><RichTextEditor value={c.description || ""} onChange={(val) => updateCategory(catIdx, "description", val)} /></div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label className="text-xs">Artikel</Label><Button variant="outline" size="sm" onClick={() => addArticle(catIdx)} className="rounded-lg h-7"><Plus className="w-3 h-3 mr-1" />Tambah</Button></div>
                  {c.articles.map((a, ai) => (
                    <div key={ai} className="flex items-center gap-2">
                      <Input value={a} onChange={(e) => updateArticle(catIdx, ai, e.target.value)} className="flex-1" />
                      <Button variant="ghost" size="icon-xs" onClick={() => removeArticle(catIdx, ai)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {guideContent.categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada kategori.</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>FAQ</CardTitle><CardDescription>Pertanyaan yang sering diajukan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addFaq} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {guideContent.faqs.map((f, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">FAQ #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeFaq(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Pertanyaan</Label><Input value={f.question} onChange={(e) => updateFaq(idx, "question", e.target.value)} /></div>
                <div className="grid gap-2"><Label className="text-xs">Jawaban</Label><Textarea value={f.answer} onChange={(e) => updateFaq(idx, "answer", e.target.value)} /></div>
              </div>
            ))}
            {guideContent.faqs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada FAQ.</p>}
          </CardContent>
        </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <PreviewFrame url="/panduan" title="Panduan" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
