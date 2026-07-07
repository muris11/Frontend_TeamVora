"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTitle } from "@/components/shared/page-title";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data.data || res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (selectedCategory) {
        return api.put(`/categories/${selectedCategory.id}`, { name });
      } else {
        return api.post("/categories", { name });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(selectedCategory ? "Kategori diperbarui" : "Kategori dibuat");
      setIsDialogOpen(false);
      setName("");
      setSelectedCategory(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Kategori berhasil dihapus");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menghapus kategori");
    },
  });

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setName(category.name);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setName("");
    setIsDialogOpen(true);
  };

  const columns = [
    {
      key: "name",
      header: "Nama Kategori",
      render: (item: Category) => <span className="font-semibold">{item.name}</span>,
    },
    {
      key: "slug",
      header: "Slug",
      render: (item: Category) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{item.slug}</code>,
    },
    {
      key: "actions",
      header: "",
      render: (item: Category) => (
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
            <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setCategoryToDelete(item);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageTitle title="Kelola Kategori" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Kategori Blog</h1>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories || []}
        isLoading={isLoading}
        emptyMessage="Belum ada kategori"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</DialogTitle>
            <DialogDescription>
              Masukkan nama kategori blog. Slug akan digenerate otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-name">Nama Kategori</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kategori..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => saveMutation.mutate()} disabled={!name.trim() || saveMutation.isPending}>
              {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Hapus Kategori"
        description={`Hapus kategori "${categoryToDelete?.name}"? Artikel dengan kategori ini akan diset tanpa kategori.`}
        onConfirm={() => categoryToDelete && deleteMutation.mutate(categoryToDelete.id)}
        confirmLabel="Hapus"
        variant="destructive"
      />
    </div>
  );
}
