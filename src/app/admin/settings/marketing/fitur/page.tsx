"use client";

import { useEffect, useState, useMemo } from "react";
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
import { ColorPicker } from "@/components/ui/color-picker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PreviewFrame } from "@/components/shared/preview-frame";

interface FeatureSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  points: string[];
}

interface FeaturesContent {
  sections: FeatureSection[];
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

export default function FiturPage() {
  const queryClient = useQueryClient();
  const [featuresContent, setFeaturesContent] = useState<FeaturesContent>({ sections: [] });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { general?: { site_name?: string }; marketing?: { features_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.features_content) {
      const parsed = safeJsonParse<FeaturesContent>(settings.marketing.features_content, { sections: [] });
      const sections = Array.isArray(parsed?.sections) ? parsed.sections : [];
      const cleaned = {
        sections: sections.map((s: any) => {
          let col = s.color || "blue";
          if (col.startsWith("text-")) col = col.replace("text-", "").replace("-500", "");
          return { ...s, color: col };
        })
      };
      setFeaturesContent(cleaned);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Fitur berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Fitur"),
  });

  const handleSave = () => {
    saveMutation.mutate({ features_content: JSON.stringify(featuresContent) });
  };

  const updateSection = (idx: number, field: keyof FeatureSection, value: any) => {
    setFeaturesContent({ ...featuresContent, sections: featuresContent.sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s)) });
  };
  const addSection = () => setFeaturesContent({ ...featuresContent, sections: [...featuresContent.sections, { id: "", title: "", description: "", icon: "Zap", color: "blue", points: [] }] });
  const removeSection = (idx: number) => setFeaturesContent({ ...featuresContent, sections: featuresContent.sections.filter((_, i) => i !== idx) });

  const addPoint = (sectionIdx: number) => {
    setFeaturesContent({ ...featuresContent, sections: featuresContent.sections.map((s, i) => (i === sectionIdx ? { ...s, points: [...s.points, ""] } : s)) });
  };
  const updatePoint = (sectionIdx: number, pointIdx: number, value: string) => {
    setFeaturesContent({ ...featuresContent, sections: featuresContent.sections.map((s, i) => (i === sectionIdx ? { ...s, points: s.points.map((p, j) => (j === pointIdx ? value : p)) } : s)) });
  };
  const removePoint = (sectionIdx: number, pointIdx: number) => {
    setFeaturesContent({ ...featuresContent, sections: featuresContent.sections.map((s, i) => (i === sectionIdx ? { ...s, points: s.points.filter((_, j) => j !== pointIdx) } : s)) });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Fitur | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fitur</h1>
          <p className="text-muted-foreground">Edit konten halaman Fitur.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/fitur", "_blank")} className="rounded-xl">
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
            <div><CardTitle>Section Fitur</CardTitle><CardDescription>Semua section detail fitur di halaman /fitur.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addSection} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah Section</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {featuresContent.sections.map((s, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Section #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeSection(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">ID</Label><Input value={s.id} onChange={(e) => updateSection(idx, "id", e.target.value)} placeholder="absensi" /></div>
                  <div className="grid gap-2"><Label className="text-xs">Judul</Label><Input value={s.title} onChange={(e) => updateSection(idx, "title", e.target.value)} /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><Textarea value={s.description} onChange={(e) => updateSection(idx, "description", e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Ikon</Label><IconPicker value={s.icon} onChange={(val) => updateSection(idx, "icon", val)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Warna Tema</Label><ColorPicker value={s.color} onChange={(val) => updateSection(idx, "color", val)} /></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label className="text-xs">Poin Fitur</Label><Button variant="outline" size="sm" onClick={() => addPoint(idx)} className="rounded-lg h-7"><Plus className="w-3 h-3 mr-1" />Tambah</Button></div>
                  {s.points.map((p, pi) => (
                    <div key={pi} className="flex items-center gap-2">
                      <Input value={p} onChange={(e) => updatePoint(idx, pi, e.target.value)} className="flex-1" />
                      <Button variant="ghost" size="icon-xs" onClick={() => removePoint(idx, pi)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {featuresContent.sections.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada section fitur.</p>}
          </CardContent>
        </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <PreviewFrame url="/" title="Fitur" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
