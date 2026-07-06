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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PreviewFrame } from "@/components/shared/preview-frame";

interface AboutStat {
  value: string;
  label: string;
  icon: string;
}

interface AboutValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutTeam {
  name: string;
  role: string;
  initials: string;
}

interface AboutContent {
  stats: AboutStat[];
  values: AboutValue[];
  team: AboutTeam[];
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

export default function TentangPage() {
  const queryClient = useQueryClient();
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    stats: [],
    values: [],
    team: [],
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { general?: { site_name?: string }; marketing?: { about_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.about_content) {
      setAboutContent(safeJsonParse(settings.marketing.about_content, { stats: [], values: [], team: [] }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Tentang berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Tentang"),
  });

  const handleSave = () => {
    saveMutation.mutate({ about_content: JSON.stringify(aboutContent) });
  };

  const updateStat = (idx: number, field: keyof AboutStat, value: string) => {
    setAboutContent({ ...aboutContent, stats: aboutContent.stats.map((s, i) => (i === idx ? { ...s, [field]: value } : s)) });
  };
  const addStat = () => setAboutContent({ ...aboutContent, stats: [...aboutContent.stats, { value: "", label: "", icon: "Users" }] });
  const removeStat = (idx: number) => setAboutContent({ ...aboutContent, stats: aboutContent.stats.filter((_, i) => i !== idx) });

  const updateValue = (idx: number, field: keyof AboutValue, value: string) => {
    setAboutContent({ ...aboutContent, values: aboutContent.values.map((v, i) => (i === idx ? { ...v, [field]: value } : v)) });
  };
  const addValue = () => setAboutContent({ ...aboutContent, values: [...aboutContent.values, { title: "", description: "", icon: "Target" }] });
  const removeValue = (idx: number) => setAboutContent({ ...aboutContent, values: aboutContent.values.filter((_, i) => i !== idx) });

  const updateTeam = (idx: number, field: keyof AboutTeam, value: string) => {
    setAboutContent({ ...aboutContent, team: aboutContent.team.map((t, i) => (i === idx ? { ...t, [field]: value } : t)) });
  };
  const addTeam = () => setAboutContent({ ...aboutContent, team: [...aboutContent.team, { name: "", role: "", initials: "" }] });
  const removeTeam = (idx: number) => setAboutContent({ ...aboutContent, team: aboutContent.team.filter((_, i) => i !== idx) });

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
      <PageTitle title="Tentang | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tentang</h1>
          <p className="text-muted-foreground">Edit konten halaman Tentang kami.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/tentang", "_blank")} className="rounded-xl">
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
            <div><CardTitle>Statistik</CardTitle><CardDescription>Angka-angka penting yang ditampilkan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addStat} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {aboutContent.stats.map((s, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Stat #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeStat(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Nilai</Label><Input value={s.value} onChange={(e) => updateStat(idx, "value", e.target.value)} placeholder="10K+" /></div>
                  <div className="grid gap-2"><Label className="text-xs">Label</Label><Input value={s.label} onChange={(e) => updateStat(idx, "label", e.target.value)} placeholder="Tim Aktif" /></div>
                  <div className="grid gap-2"><Label className="text-xs">Ikon</Label><IconPicker value={s.icon} onChange={(val) => updateStat(idx, "icon", val)} /></div>
                </div>
              </div>
            ))}
            {aboutContent.stats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada statistik.</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Nilai Inti</CardTitle><CardDescription>Prinsip perusahaan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addValue} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {aboutContent.values.map((v, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Nilai #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeValue(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Judul</Label><Input value={v.title} onChange={(e) => updateValue(idx, "title", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Ikon</Label><IconPicker value={v.icon} onChange={(val) => updateValue(idx, "icon", val)} /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><Textarea value={v.description} onChange={(e) => updateValue(idx, "description", e.target.value)} /></div>
              </div>
            ))}
            {aboutContent.values.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada nilai inti.</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Tim</CardTitle><CardDescription>Anggota tim yang ditampilkan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addTeam} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {aboutContent.team.map((t, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Anggota #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeTeam(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Nama</Label><Input value={t.name} onChange={(e) => updateTeam(idx, "name", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Jabatan</Label><Input value={t.role} onChange={(e) => updateTeam(idx, "role", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Inisial</Label><Input value={t.initials} onChange={(e) => updateTeam(idx, "initials", e.target.value)} placeholder="AS" /></div>
                </div>
              </div>
            ))}
            {aboutContent.team.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada anggota tim.</p>}
          </CardContent>
        </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <PreviewFrame url="/tentang" title="Tentang" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
