"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { PageTitle } from "@/components/shared/page-title";
import { FileUpload } from "@/components/shared/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function CashBookCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("category", title);
      formData.append("type", type);
      formData.append("amount", amount);
      formData.append("transaction_date", date);
      if (description) formData.append("description", description);
      if (file) formData.append("attachment", file);

      const res = await api.post("/cash-books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Catatan kas berhasil ditambahkan");
      router.push(`${basePath}/finance/cash-book`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal menyimpan data");
    },
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Tambah Kas" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/cash-book`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Kas Baru</h1>
          <p className="text-sm text-muted-foreground">
            Catat pemasukan atau pengeluaran kas
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
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
            <FileUpload
              value={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
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
