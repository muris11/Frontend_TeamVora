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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface CareerBenefit {
  name: string;
  description: string;
}

interface CareerJob {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

interface CareersContent {
  benefits: CareerBenefit[];
  openings: CareerJob[];
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

export default function KarirPage() {
  const queryClient = useQueryClient();
  const [careersContent, setCareersContent] = useState<CareersContent>({ benefits: [], openings: [] });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { marketing?: { careers_content?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing?.careers_content) {
      setCareersContent(safeJsonParse(settings.marketing.careers_content, { benefits: [], openings: [] }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan Karir berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan Karir"),
  });

  const handleSave = () => {
    saveMutation.mutate({ careers_content: JSON.stringify(careersContent) });
  };

  const updateBenefit = (idx: number, field: keyof CareerBenefit, value: string) => {
    setCareersContent({ ...careersContent, benefits: careersContent.benefits.map((b, i) => (i === idx ? { ...b, [field]: value } : b)) });
  };
  const addBenefit = () => setCareersContent({ ...careersContent, benefits: [...careersContent.benefits, { name: "", description: "" }] });
  const removeBenefit = (idx: number) => setCareersContent({ ...careersContent, benefits: careersContent.benefits.filter((_, i) => i !== idx) });

  const updateJob = (idx: number, field: keyof CareerJob, value: string) => {
    setCareersContent({ ...careersContent, openings: careersContent.openings.map((j, i) => (i === idx ? { ...j, [field]: value } : j)) });
  };
  const addJob = () => setCareersContent({ ...careersContent, openings: [...careersContent.openings, { title: "", department: "", location: "", type: "Full-time", description: "" }] });
  const removeJob = (idx: number) => setCareersContent({ ...careersContent, openings: careersContent.openings.filter((_, i) => i !== idx) });

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
      <PageTitle title="Karir | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Karir</h1>
          <p className="text-muted-foreground">Edit konten halaman Karir.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open("/karir", "_blank")} className="rounded-xl">
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending} className="rounded-xl">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Benefit</CardTitle><CardDescription>Fasilitas yang ditawarkan ke karyawan.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addBenefit} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {careersContent.benefits.map((b, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Benefit #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeBenefit(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Nama</Label><Input value={b.name} onChange={(e) => updateBenefit(idx, "name", e.target.value)} /></div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><Textarea value={b.description} onChange={(e) => updateBenefit(idx, "description", e.target.value)} /></div>
              </div>
            ))}
            {careersContent.benefits.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada benefit.</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Posisi Terbuka</CardTitle><CardDescription>Lowongan kerja yang tersedia.</CardDescription></div>
            <Button variant="outline" size="sm" onClick={addJob} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {careersContent.openings.map((j, idx) => (
              <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Posisi #{idx + 1}</span>
                  <Button variant="ghost" size="icon-xs" onClick={() => removeJob(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Judul</Label><Input value={j.title} onChange={(e) => updateJob(idx, "title", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Departemen</Label><Input value={j.department} onChange={(e) => updateJob(idx, "department", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label className="text-xs">Lokasi</Label><Input value={j.location} onChange={(e) => updateJob(idx, "location", e.target.value)} /></div>
                  <div className="grid gap-2"><Label className="text-xs">Tipe</Label><Input value={j.type} onChange={(e) => updateJob(idx, "type", e.target.value)} placeholder="Full-time" /></div>
                </div>
                <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><Textarea value={j.description} onChange={(e) => updateJob(idx, "description", e.target.value)} /></div>
              </div>
            ))}
            {careersContent.openings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada posisi terbuka.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
