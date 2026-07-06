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
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { getColorTheme } from "@/lib/colors";
import { PreviewFrame } from "@/components/shared/preview-frame";
import { MediaPicker } from "@/components/shared/media-picker";

interface Feature {
  title: string;
  description: string;
  icon: string;
  color?: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface NavLink {
  label: string;
  href: string;
}

interface Form {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_cta2_text: string;
  hero_cta2_link: string;
  hero_image_url: string;
  features_title: string;
  features: string;
  testimonials_title: string;
  testimonials: string;
  footer_text: string;
  nav_links: string;
  client_logos: string;
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

export default function LandingPage() {
  const queryClient = useQueryClient();
  const [activePicker, setActivePicker] = useState<"hero_image" | null>(null);
  const [form, setForm] = useState<Form>({
    hero_title: "",
    hero_subtitle: "",
    hero_cta_text: "",
    hero_cta_link: "/register",
    hero_cta2_text: "",
    hero_cta2_link: "",
    hero_image_url: "",
    features_title: "",
    features: "[]",
    testimonials_title: "",
    testimonials: "[]",
    footer_text: "",
    nav_links: "[]",
    client_logos: "[]",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/platform-settings");
      return res.data.data as { marketing?: Form; general?: { site_name?: string } };
    },
  });

  useEffect(() => {
    if (settings?.marketing) {
      setForm((prev) => ({ ...prev, ...settings.marketing }));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      api.put("/admin/platform-settings", { settings: data }),
    onSuccess: () => {
      toast.success("Pengaturan landing berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
    },
    onError: () => toast.error("Gagal menyimpan pengaturan landing"),
  });

  const handleSave = (fields: Record<string, string>) => {
    saveMutation.mutate(fields);
  };

  const features: Feature[] = useMemo(() => {
    const raw = safeJsonParse<Feature[]>(form.features, []);
    return raw.map(f => {
      let col = f.color || "blue";
      if (col.startsWith("text-")) col = col.replace("text-", "").replace("-500", "");
      return { ...f, color: col };
    });
  }, [form.features]);
  const testimonials: Testimonial[] = useMemo(() => safeJsonParse(form.testimonials, []), [form.testimonials]);
  const navLinks: NavLink[] = useMemo(() => safeJsonParse(form.nav_links, []), [form.nav_links]);
  const clientLogos: string[] = useMemo(() => safeJsonParse(form.client_logos, []), [form.client_logos]);

  const updateFeature = (idx: number, field: keyof Feature, value: string) => {
    const updated = features.map((f, i) => (i === idx ? { ...f, [field]: value } : f));
    setForm({ ...form, features: JSON.stringify(updated) });
  };
  const addFeature = () => setForm({ ...form, features: JSON.stringify([...features, { title: "", description: "", icon: "Zap", color: "blue" }]) });
  const removeFeature = (idx: number) => setForm({ ...form, features: JSON.stringify(features.filter((_, i) => i !== idx)) });

  const updateTestimonial = (idx: number, field: keyof Testimonial, value: string) => {
    const updated = testimonials.map((t, i) => (i === idx ? { ...t, [field]: value } : t));
    setForm({ ...form, testimonials: JSON.stringify(updated) });
  };
  const addTestimonial = () => setForm({ ...form, testimonials: JSON.stringify([...testimonials, { name: "", role: "", quote: "" }]) });
  const removeTestimonial = (idx: number) => setForm({ ...form, testimonials: JSON.stringify(testimonials.filter((_, i) => i !== idx)) });

  const updateNavLink = (idx: number, field: keyof NavLink, value: string) => {
    const updated = navLinks.map((l, i) => (i === idx ? { ...l, [field]: value } : l));
    setForm({ ...form, nav_links: JSON.stringify(updated) });
  };
  const addNavLink = () => setForm({ ...form, nav_links: JSON.stringify([...navLinks, { label: "", href: "/" }]) });
  const removeNavLink = (idx: number) => setForm({ ...form, nav_links: JSON.stringify(navLinks.filter((_, i) => i !== idx)) });

  const updateClientLogo = (idx: number, value: string) => {
    const updated = clientLogos.map((l, i) => (i === idx ? value : l));
    setForm({ ...form, client_logos: JSON.stringify(updated) });
  };
  const addClientLogo = () => setForm({ ...form, client_logos: JSON.stringify([...clientLogos, ""]) });
  const removeClientLogo = (idx: number) => setForm({ ...form, client_logos: JSON.stringify(clientLogos.filter((_, i) => i !== idx)) });

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
      <PageTitle title="Landing Page | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Landing Page</h1>
          <p className="text-muted-foreground">Edit konten halaman utama marketing.</p>
        </div>
        <Button variant="outline" onClick={() => window.open("/", "_blank")} className="rounded-xl">
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Bagian utama halaman marketing.</CardDescription>
                </div>
                <Button onClick={() => handleSave({ 
                  hero_title: form.hero_title, 
                  hero_subtitle: form.hero_subtitle, 
                  hero_cta_text: form.hero_cta_text, 
                  hero_cta_link: form.hero_cta_link,
                  hero_cta2_text: form.hero_cta2_text,
                  hero_cta2_link: form.hero_cta2_link,
                  hero_image_url: form.hero_image_url
                })} disabled={saveMutation.isPending} className="rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Judul Hero</Label>
                <Input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} placeholder="Manajemen Tim Modern" />
              </div>
              <div className="grid gap-2">
                <Label>Subtitle Hero</Label>
                <Textarea value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} placeholder="Platform kolaborasi untuk tim produktif..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Teks CTA 1</Label>
                  <Input value={form.hero_cta_text} onChange={(e) => setForm({ ...form, hero_cta_text: e.target.value })} placeholder="Mulai Gratis" />
                </div>
                <div className="grid gap-2">
                  <Label>Link CTA 1</Label>
                  <Input value={form.hero_cta_link} onChange={(e) => setForm({ ...form, hero_cta_link: e.target.value })} placeholder="/register" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Teks CTA 2</Label>
                  <Input value={form.hero_cta2_text} onChange={(e) => setForm({ ...form, hero_cta2_text: e.target.value })} placeholder="Hubungi Sales" />
                </div>
                <div className="grid gap-2">
                  <Label>Link CTA 2</Label>
                  <Input value={form.hero_cta2_link} onChange={(e) => setForm({ ...form, hero_cta2_link: e.target.value })} placeholder="/contact" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Gambar Hero</Label>
                <div className="flex gap-2">
                  <Input value={form.hero_image_url} onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })} placeholder="/hero_3d.png" />
                  <Button variant="outline" onClick={() => setActivePicker("hero_image")}>
                    Pilih Media
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fitur</CardTitle>
                <CardDescription>Daftar fitur yang ditampilkan.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addFeature} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
                <Button onClick={() => handleSave({ features_title: form.features_title, features: form.features })} disabled={saveMutation.isPending} className="rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Judul Section Fitur</Label>
                <Input value={form.features_title} onChange={(e) => setForm({ ...form, features_title: e.target.value })} placeholder="Mengapa Memilih Kami?" />
              </div>
              {features.map((f, idx) => (
                <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Fitur #{idx + 1}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => removeFeature(idx)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="text-xs">Judul</Label>
                      <Input value={f.title} onChange={(e) => updateFeature(idx, "title", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">Ikon</Label>
                      <IconPicker value={f.icon || "Zap"} onChange={(val) => updateFeature(idx, "icon", val)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label className="text-xs">Warna Tema</Label>
                      <ColorPicker value={f.color || "blue"} onChange={(val) => updateFeature(idx, "color", val)} />
                    </div>
                  </div>
                  <div className="grid gap-2"><Label className="text-xs">Deskripsi</Label><RichTextEditor value={f.description || ""} onChange={(val) => updateFeature(idx, "description", val)} /></div>
                </div>
              ))}
              {features.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada fitur.</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Testimoni</CardTitle>
                <CardDescription>Ulasan dari pengguna platform.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addTestimonial} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
                <Button onClick={() => handleSave({ testimonials_title: form.testimonials_title, testimonials: form.testimonials })} disabled={saveMutation.isPending} className="rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Judul Section Testimoni</Label>
                <Input value={form.testimonials_title} onChange={(e) => setForm({ ...form, testimonials_title: e.target.value })} placeholder="Apa Kata Mereka?" />
              </div>
              {testimonials.map((t, idx) => (
                <div key={idx} className="border rounded-xl p-4 space-y-3 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Testimoni #{idx + 1}</span>
                    <Button variant="ghost" size="icon-xs" onClick={() => removeTestimonial(idx)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2"><Label className="text-xs">Nama</Label><Input value={t.name} onChange={(e) => updateTestimonial(idx, "name", e.target.value)} /></div>
                    <div className="grid gap-2"><Label className="text-xs">Jabatan</Label><Input value={t.role} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} /></div>
                  </div>
                  <div className="grid gap-2"><Label className="text-xs">Ulasan</Label><Textarea value={t.quote} onChange={(e) => updateTestimonial(idx, "quote", e.target.value)} /></div>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada testimoni.</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Logo Klien</CardTitle>
                <CardDescription>Logo perusahaan yang mempercayai platform.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addClientLogo} className="rounded-lg"><Plus className="w-4 h-4 mr-1" />Tambah</Button>
                <Button onClick={() => handleSave({ client_logos: form.client_logos })} disabled={saveMutation.isPending} className="rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {clientLogos.map((logo, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input value={logo} onChange={(e) => updateClientLogo(idx, e.target.value)} placeholder="Nama Perusahaan (Teks/Logo)" className="flex-1" />
                  <Button variant="ghost" size="icon-xs" onClick={() => removeClientLogo(idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              ))}
              {clientLogos.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Belum ada logo klien.</p>}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle>Footer & Navigasi</CardTitle><CardDescription>Tautan navigasi dan teks footer.</CardDescription></div>
                <Button onClick={() => handleSave({ footer_text: form.footer_text, nav_links: form.nav_links })} disabled={saveMutation.isPending} className="rounded-xl">
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Teks Footer</Label>
                <Input value={form.footer_text} onChange={(e) => setForm({ ...form, footer_text: e.target.value })} placeholder="© 2026 TeamVora. All rights reserved." />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Link Navigasi</Label>
                  <Button variant="outline" size="sm" onClick={addNavLink} className="rounded-lg"><Plus className="w-3 h-3 mr-1" />Tambah</Button>
                </div>
                {navLinks.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={l.label} onChange={(e) => updateNavLink(idx, "label", e.target.value)} placeholder="Label" className="flex-1" />
                    <Input value={l.href} onChange={(e) => updateNavLink(idx, "href", e.target.value)} placeholder="/path" className="flex-1" />
                    <Button variant="ghost" size="icon-xs" onClick={() => removeNavLink(idx)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm sticky top-24">
            <CardHeader><CardTitle>Live Preview</CardTitle></CardHeader>
            <CardContent>
              <PreviewFrame url="/" title="Landing Page Preview" />
            </CardContent>
          </Card>
        </div>
      </div>

      <MediaPicker
        open={activePicker !== null}
        onOpenChange={(open) => !open && setActivePicker(null)}
        onSelect={(url) => {
          if (activePicker === "hero_image") {
            setForm({ ...form, hero_image_url: url });
          }
        }}
        type="gallery"
      />
    </div>
  );
}
