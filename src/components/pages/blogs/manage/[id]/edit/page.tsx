"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, ImageIcon, X } from "lucide-react";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogEditPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
  });
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [showDelete, setShowDelete] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await api.get(`/blogs/${id}`);
      return res.data.data || res.data;
    },
  });

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        status: blog.status || "draft",
      });
      if (blog.featured_image) {
        setExistingImage(blog.featured_image);
      }
    }
  }, [blog]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content);
      formData.append("status", form.status);
      if (file) formData.append("featured_image", file);
      const res = await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Blog berhasil diperbarui.");
      router.push(`${basePath}/blogs/manage`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal memperbarui blog.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/blogs/${id}`);
    },
    onSuccess: () => {
      toast.success("Blog berhasil dihapus.");
      router.push(`${basePath}/blogs/manage`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal menghapus blog.");
    },
  });

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Edit Blog" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/blogs/manage`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-sm text-muted-foreground">Perbarui postingan blog.</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Hapus
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle>Konten</CardTitle>
              <CardDescription>Edit konten blog Anda.</CardDescription>
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
                  {existingImage && !file && (
                    <div className="mb-2 relative">
                      <img
                        src={existingImage}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => setExistingImage("")}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FileUpload
                        accept="image/*"
                        value={file}
                        onFileSelect={setFile}
                        onClear={() => setFile(null)}
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
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => updateMutation.mutate()}
              disabled={!form.title || !form.content || updateMutation.isPending}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Hapus Blog"
        description="Apakah Anda yakin ingin menghapus blog ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => deleteMutation.mutate()}
        variant="destructive"
        confirmLabel="Hapus"
      />

      <MediaPicker
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={(url) => setExistingImage(url)}
        type="gallery"
      />
    </div>
  );
}
