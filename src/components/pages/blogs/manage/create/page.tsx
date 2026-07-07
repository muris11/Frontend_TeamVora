"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Save, ImageIcon, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/shared/file-upload";
import { MediaPicker } from "@/components/shared/media-picker";
import { PageTitle } from "@/components/shared/page-title";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { SeoAnalyzerCard } from "@/components/shared/seo-analyzer";
import { slugify } from "@/lib/format";

export function BlogCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    published_at: "",
    category_id: "",
    tags: "",
    focus_keyword: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: [] as string[],
    canonical_url: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isSlugManual, setIsSlugManual] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data || [];
    },
  });

  useEffect(() => {
    if (!isSlugManual && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }));
    }
  }, [form.title, isSlugManual]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("status", form.status);
      if (form.slug) formData.append("slug", form.slug);
      if (form.published_at) formData.append("published_at", form.published_at);
      if (form.category_id) formData.append("category_id", form.category_id);
      if (form.tags) {
        const tagsArr = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
        if (tagsArr.length) formData.append("tags", JSON.stringify(tagsArr));
      }
      if (form.focus_keyword) formData.append("focus_keyword", form.focus_keyword);
      if (form.seo_title) formData.append("seo_title", form.seo_title);
      if (form.seo_description) formData.append("seo_description", form.seo_description);
      if (form.seo_keywords.length) formData.append("seo_keywords", JSON.stringify(form.seo_keywords));
      if (form.canonical_url) formData.append("canonical_url", form.canonical_url);
      if (file) formData.append("featured_image", file);
      else if (existingImageUrl) formData.append("featured_image", existingImageUrl);
      const res = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog berhasil dibuat.");
      router.push(`${basePath}/blogs/manage`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal membuat blog.");
    },
  });

  const seoValues = {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    content: form.content,
    featured_image: existingImageUrl || null,
    focus_keyword: form.focus_keyword || null,
    seo_title: form.seo_title || null,
    seo_description: form.seo_description || null,
    canonical_url: form.canonical_url || null,
  };

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Tulis Blog" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/blogs/manage`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tulis Blog Baru</h1>
          <p className="text-sm text-muted-foreground">Buat postingan blog baru.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Konten</CardTitle>
            <CardDescription>Tulis konten blog Anda di sini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Judul blog"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug URL</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                placeholder="slug-url-artikel"
              />
              <p className="text-xs text-muted-foreground">Auto-generate dari judul. Edit manual mematikan auto-sync.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                <select
                  id="category_id"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Pilih kategori</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="marketing, fintech, tips"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Ringkasan singkat blog"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <RichTextEditor
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              {form.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="published_at">Jadwal Publikasi</Label>
                  <Input 
                    id="published_at" 
                    type="datetime-local" 
                    value={form.published_at} 
                    onChange={(e) => setForm({ ...form, published_at: e.target.value })} 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Gambar Unggulan</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FileUpload
                      accept="image/*"
                      value={file}
                      onFileSelect={setFile}
                      onClear={() => { setFile(null); setExistingImageUrl(""); }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMediaPickerOpen(true)}
                    className="shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" /> Pilih
                  </Button>
                </div>
                {existingImageUrl && !file && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border">
                    <img src={existingImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setExistingImageUrl("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <SeoAnalyzerCard
            values={seoValues}
            onChange={(patch) => {
              const flat: Record<string, string> = {};
              for (const [k, v] of Object.entries(patch)) {
                flat[k] = v == null ? "" : String(v);
              }
              setForm((prev) => ({ ...prev, ...flat }));
            }}
          />

          <Button
            onClick={() => mutate()}
            disabled={!form.title || !form.content || isPending}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Menyimpan..." : "Simpan Blog"}
          </Button>
        </div>
      </div>

      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => setExistingImageUrl(url)}
        type="gallery"
      />
    </div>
  );
}
