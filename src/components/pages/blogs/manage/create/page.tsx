"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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

export function BlogCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
  });
  const [file, setFile] = useState<File | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("status", form.status);
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
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Tulis konten blog di sini..."
                rows={12}
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
                </select>
              </div>
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
