"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/shared/page-title";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { MediaPicker } from "@/components/shared/media-picker";
import { SeoAnalyzerCard } from "@/components/shared/seo-analyzer";
import type { SeoInput } from "@/lib/seo";
import { slugify } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPreview } from "@/components/blog/blog-preview";

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

export default function AdminBlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const blogSlug = params.slug as string;
  const queryClient = useQueryClient();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSlugManual, setIsSlugManual] = useState(true); // default to true on edit pages so we don't overwrite on load

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data || [];
    },
  });

  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ["admin-blog", blogSlug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${blogSlug}`);
      return res.data.data || res.data;
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

  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        status: blog.status || "draft",
        featured_image: blog.featured_image || "",
        published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : "",
        category_id: blog.category_id ? String(blog.category_id) : "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
        focus_keyword: blog.focus_keyword || "",
        seo_title: blog.seo_title || "",
        seo_description: blog.seo_description || "",
        seo_keywords: Array.isArray(blog.seo_keywords) ? blog.seo_keywords : [],
        canonical_url: blog.canonical_url || "",
      });
    }
  }, [blog, form]);

  const updateMutation = useMutation({
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
      formData.append('_method', 'PUT');
      return api.post(`/blogs/${blogSlug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Blog berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      router.push("/admin/blogs");
    },
    onError: () => toast.error("Gagal memperbarui blog"),
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

  if (blogLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <PageTitle title="Edit Blog" />
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Edit Blog" />
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Blog</h1>
      </div>

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konten Blog</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))}
                  className="space-y-4"
                  id="blog-form"
                >
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
                        <FormLabel>Excerpt / Ringkasan</FormLabel>
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
                        <FormLabel>Konten Utama</FormLabel>
                        <FormControl>
                          <RichTextEditor value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            {field.value && typeof field.value === "string" ? (
                              <div className="relative aspect-video rounded-md overflow-hidden border">
                                <img src={field.value} alt="Featured" className="w-full h-full object-cover" />
                              </div>
                            ) : field.value && field.value instanceof File ? (
                              <div className="relative aspect-video rounded-md overflow-hidden border">
                                <img src={URL.createObjectURL(field.value)} alt="Featured" className="w-full h-full object-cover" />
                              </div>
                            ) : null}
                            <div className="flex gap-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                  }
                                }}
                                className="flex-1"
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
                        <FormLabel>Status Publikasi</FormLabel>
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
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button type="submit" form="blog-form" className="w-full" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                    <Link href="/admin/blogs" className="block w-full">
                      <Button type="button" variant="outline" className="w-full">
                        Batal
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
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
      </div>
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
        onSelect={(url) => {
          form.setValue("featured_image", url, { shouldValidate: true, shouldDirty: true });
        }}
        type="gallery"
      />
    </div>
  );
}
