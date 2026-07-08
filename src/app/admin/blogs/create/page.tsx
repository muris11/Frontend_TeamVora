"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import api from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { MediaPicker } from "@/components/shared/media-picker";
import { SeoAnalyzerCard } from "@/components/shared/seo-analyzer";
import type { SeoInput } from "@/lib/seo";
import { slugify } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPreview } from "@/components/blog/blog-preview";
import { useQuery } from "@tanstack/react-query";

const blogSchema = z.object({
  title: z.string().min(2, "Judul minimal 2 karakter"),
  slug: z.string().min(1, "Slug URL wajib diisi"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  status: z.enum(["draft", "published", "scheduled"]),
  featured_image: z.any().optional(),
  published_at: z.string().optional(),
  category_id: z.string().optional(),
  tags: z.string().optional(),
  focus_keyword: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
  canonical_url: z.string().optional(),
});

type BlogForm = z.infer<typeof blogSchema>;

export default function AdminBlogCreatePage() {
  const router = useRouter();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data || [];
    },
  });

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      featured_image: "",
      published_at: "",
      category_id: "",
      tags: "",
      focus_keyword: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: [],
      canonical_url: "",
    },
  });

  const titleVal = form.watch("title");
  useEffect(() => {
    if (!isSlugManual && titleVal) {
      form.setValue("slug", slugify(titleVal));
    }
  }, [titleVal, isSlugManual, form]);

  const createMutation = useMutation({
    mutationFn: async (data: BlogForm) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "seo_keywords" && Array.isArray(value)) {
          if (value.length) formData.append(key, JSON.stringify(value));
          return;
        }
        if (key === "tags" && typeof value === "string") {
          const tagsArr = value.split(",").map((t) => t.trim()).filter(Boolean);
          if (tagsArr.length) formData.append(key, JSON.stringify(tagsArr));
          return;
        }
        formData.append(key, value as string | Blob);
      });
      return api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Blog berhasil dibuat");
      router.push("/admin/blogs");
    },
    onError: () => toast.error("Gagal membuat blog"),
  });

  const featuredRaw = form.watch("featured_image");
  const seoValues: SeoInput = {
    title: form.watch("title"),
    slug: form.watch("slug"),
    excerpt: form.watch("excerpt"),
    content: form.watch("content"),
    featured_image: typeof featuredRaw === "string" ? featuredRaw : null,
    focus_keyword: form.watch("focus_keyword"),
    seo_title: form.watch("seo_title"),
    seo_description: form.watch("seo_description"),
    canonical_url: form.watch("canonical_url"),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <PageTitle title="Buat Blog" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Buat Blog Baru</h1>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => createMutation.mutate(d))}
              className="grid gap-6 lg:grid-cols-3"
            >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Konten Blog</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <Input placeholder="Judul blog" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="slug-url-artikel" 
                          {...field} 
                          onChange={(e) => {
                            setIsSlugManual(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Auto-generate dari judul. Edit manual akan mematikan auto-sync.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((cat: any) => (
                              <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag (pisahkan dengan koma)</FormLabel>
                        <FormControl>
                          <Input placeholder="marketing, fintech, tips" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Ringkasan singkat blog..." rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konten</FormLabel>
                      <FormControl>
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {typeof value === "string" && value ? (
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                              <img src={value} alt="Featured" className="w-full h-full object-cover" />
                            </div>
                          ) : value instanceof File ? (
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                              <img src={URL.createObjectURL(value)} alt="Featured" className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <div className="flex gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) onChange(file);
                              }}
                              className="flex-1"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsMediaPickerOpen(true)}
                              className="px-3"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("status") === "scheduled" && (
                  <FormField
                    control={form.control}
                    name="published_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jadwal Publikasi</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} value={field.value ? String(field.value) : ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <div className="pt-2 border-t space-y-2">
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Link href="/admin/blogs" className="block w-full">
                    <Button type="button" variant="outline" className="w-full">
                      Batal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <SeoAnalyzerCard
              values={seoValues}
              onChange={(patch) => {
                (Object.keys(patch) as (keyof SeoInput)[]).forEach((k) => {
                  form.setValue(k as keyof BlogForm, patch[k] as never, { shouldDirty: true });
                });
              }}
            />
          </div>
        </form>
        </Form>
        </TabsContent>

        <TabsContent value="preview">
          <BlogPreview
            title={form.watch("title")}
            category={categories?.find((c: any) => String(c.id) === form.watch("category_id"))?.name || ""}
            content={form.watch("content")}
            coverUrl={typeof featuredRaw === "string" ? featuredRaw : featuredRaw instanceof File ? URL.createObjectURL(featuredRaw) : ""}
            authorName="Admin TeamVora"
          />
        </TabsContent>
      </Tabs>

      <MediaPicker
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(url) => form.setValue("featured_image", url, { shouldDirty: true })}
        type="gallery"
      />
    </div>
  );
}
