"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, FolderOpen } from "lucide-react";
import api from "@/lib/api";
import { Blog } from "@/types";
import { formatDate } from "@/lib/format";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [deleteItem, setDeleteItem] = useState<Blog | null>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await api.get("/blogs/manage");
      return res.data.data || res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success("Blog berhasil dihapus");
      setDeleteItem(null);
    },
    onError: () => toast.error("Gagal menghapus blog"),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (blog: Blog) =>
      api.put(`/blogs/${blog.id}`, {
        status: blog.status === "published" ? "draft" : "published",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Status blog berhasil diubah");
    },
    onError: () => toast.error("Gagal mengubah status blog"),
  });

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: Blog) => (
        <div>
          <p className="font-medium">{item.title}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
            {item.excerpt || item.slug}
          </p>
        </div>
      ),
    },
    {
      key: "author",
      header: "Penulis",
      render: (item: Blog) => item.author?.name || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Blog) => (
        <Badge variant={item.status === "published" ? "default" : "secondary"}>
          {item.status === "published" ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Tanggal",
      render: (item: Blog) => formatDate(item.created_at),
    },
    {
      key: "actions",
      header: "",
      render: (item: Blog) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => togglePublishMutation.mutate(item)}
            title={item.status === "published" ? "Unpublish" : "Publish"}
          >
            {item.status === "published" ? (
              <EyeOff className="h-4 w-4 text-orange-500" />
            ) : (
              <Eye className="h-4 w-4 text-green-500" />
            )}
          </Button>
          <Link
            href={`/admin/blogs/${item.slug}/edit`}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Button size="icon" variant="ghost" onClick={() => setDeleteItem(item)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Kelola Blog" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kelola Blog</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/blogs/categories"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            Kategori
          </Link>
          <Link
            href="/admin/blogs/create"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Blog
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={blogs || []}
        isLoading={isLoading}
        emptyMessage="Belum ada blog"
      />

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        title="Hapus Blog"
        description={`Hapus blog "${deleteItem?.title}"?`}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        confirmLabel="Hapus"
        variant="destructive"
      />
    </div>
  );
}
