"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { CashBook } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CashBookEditPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data: cashBook, isLoading } = useQuery({
    queryKey: ["cash-book", id],
    queryFn: async () => {
      const res = await api.get(`/cash-books/${id}`);
      return (res.data.data ?? res.data) as CashBook;
    },
  });

  useEffect(() => {
    if (cashBook) {
      setTitle(cashBook.title);
      setType(cashBook.type);
      setAmount(String(cashBook.amount));
      setDate(cashBook.date?.split("T")[0] ?? "");
      setDescription(cashBook.description ?? "");
    }
  }, [cashBook]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("category", title);
      formData.append("type", type);
      formData.append("amount", amount);
      formData.append("transaction_date", date);
      if (description) formData.append("description", description);
      if (file) formData.append("attachment", file);
      formData.append("_method", "PUT");

      const res = await api.post(`/cash-books/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Data kas berhasil diupdate");
      router.push(`${basePath}/finance/cash-books`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal mengupdate data");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/cash-books/${id}`);
    },
    onSuccess: () => {
      toast.success("Data kas berhasil dihapus");
      router.push(`${basePath}/finance/cash-books`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal menghapus data");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="space-y-4 max-w-xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Edit Kas" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/cash-book`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Kas</h1>
          <p className="text-sm text-muted-foreground">
            Perbarui catatan kas
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm("Yakin ingin menghapus data ini?")) {
              deleteMutation.mutate();
            }
          }}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Hapus
        </Button>
      </div>

      <div className="max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Judul *</Label>
            <Input
              placeholder="Contoh: Kas masuk dari sponsor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipe *</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "in" | "out")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="in">Masuk</option>
              <option value="out">Keluar</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Jumlah *</Label>
            <Input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal *</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Keterangan</Label>
            <Textarea
              placeholder="Deskripsi singkat..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Lampiran</Label>
            {cashBook?.attachment_url && !file && (
              <div className="text-sm text-muted-foreground mb-2">
                Lampiran saat ini:{" "}
                <a
                  href={cashBook.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Lihat file
                </a>
              </div>
            )}
            <FileUpload
              value={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`${basePath}/finance/cash-book`}>Batal</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
