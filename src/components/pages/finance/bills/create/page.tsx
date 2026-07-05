"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { User } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BillItem {
  user_id: string;
  amount: string;
}

export function BillsCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<BillItem[]>([]);

  const { data: membersResponse } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => api.get("/team-members").then((r) => r.data),
  });

  const members: User[] = membersResponse?.data ?? [];

  const addItem = () => {
    setItems([...items, { user_id: "", amount: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BillItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        title,
        total_amount: Number(totalAmount),
        due_date: dueDate,
      };
      if (description) payload.description = description;
      if (items.length > 0) {
        payload.items = items
          .filter((i) => i.user_id && i.amount)
          .map((i) => ({ user_id: Number(i.user_id), amount: Number(i.amount) }));
      }

      const res = await api.post("/split-bills", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tagihan berhasil dibuat");
      router.push(`${basePath}/finance/bills`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal menyimpan data");
    },
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Buat Tagihan" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/bills`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Tagihan Baru</h1>
          <p className="text-sm text-muted-foreground">
            Buat tagihan untuk dibagikan ke anggota
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

          {/* Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Item Tagihan</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-3 h-3 mr-1" />
                Tambah Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={item.user_id}
                  onChange={(e) => updateItem(index, "user_id", e.target.value)}
                  className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Pilih anggota</option>
                  {members.map((m) => (
                    <option key={m.id} value={String(m.id)}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  placeholder="Jumlah"
                  value={item.amount}
                  onChange={(e) => updateItem(index, "amount", e.target.value)}
                  min="0"
                  className="w-32"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="h-9 w-9 shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
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
