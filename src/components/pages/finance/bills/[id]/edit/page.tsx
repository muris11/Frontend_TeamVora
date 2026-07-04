"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { SplitBill } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function BillsEditPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { data: bill, isLoading } = useQuery({
    queryKey: ["bill", id],
    queryFn: async () => {
      const res = await api.get(`/bills/${id}`);
      return (res.data.data ?? res.data) as SplitBill;
    },
  });

  useEffect(() => {
    if (bill) {
      setTitle(bill.title);
      setDescription(bill.description ?? "");
      setTotalAmount(String(bill.total_amount));
      setDueDate(bill.due_date?.split("T")[0] ?? "");
    }
  }, [bill]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put(`/bills/${id}`, {
        title,
        description,
        total_amount: Number(totalAmount),
        due_date: dueDate,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tagihan berhasil diupdate");
      router.push(`${basePath}/finance/bills`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal mengupdate data");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/bills/${id}`);
    },
    onSuccess: () => {
      toast.success("Tagihan berhasil dihapus");
      router.push(`${basePath}/finance/bills`);
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Edit Tagihan" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/bills`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Tagihan</h1>
          <p className="text-sm text-muted-foreground">
            Perbarui data tagihan
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm("Yakin ingin menghapus tagihan ini?")) {
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
              placeholder="Contoh: Tagihan bulanan internet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <Label>Total *</Label>
            <Input
              type="number"
              placeholder="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Jatuh Tempo *</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`${basePath}/finance/bills`}>Batal</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
