"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { User } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function RecurringBillsCreatePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [intervalDays, setIntervalDays] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);
  const [notifyDaysBefore, setNotifyDaysBefore] = useState("");

  const { data: members } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await api.get("/team/members");
      return (res.data.data ?? res.data) as User[];
    },
  });

  const toggleAssignee = (id: number) => {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        title,
        amount: Number(amount),
        frequency,
        start_date: startDate,
      };
      if (description) payload.description = description;
      if (intervalDays) payload.interval_days = Number(intervalDays);
      if (dueDay) payload.due_day = Number(dueDay);
      if (endDate) payload.end_date = endDate;
      if (assigneeIds.length > 0) payload.assignee_ids = assigneeIds;
      if (notifyDaysBefore) payload.notify_days_before_due = Number(notifyDaysBefore);

      const res = await api.post("/recurring-bills", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tagihan berulang berhasil dibuat");
      router.push(`${basePath}/finance/recurring-bills`);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Gagal menyimpan data");
    },
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Buat Tagihan Berulang" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/finance/recurring-bills`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tagihan Berulang Baru</h1>
          <p className="text-sm text-muted-foreground">
            Buat tagihan yang akan otomatis dibuat secara berkala
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
              placeholder="Contoh: Tagihan internet bulanan"
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
            <Label>Frekuensi *</Label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="weekly">Mingguan</option>
              <option value="biweekly">2 Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Interval Hari</Label>
            <Input
              type="number"
              placeholder="Opsional"
              value={intervalDays}
              onChange={(e) => setIntervalDays(e.target.value)}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Hari Jatuh Tempo</Label>
            <Input
              type="number"
              placeholder="Contoh: 15"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              min="1"
              max="31"
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Mulai *</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Akhir</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Notifikasi Sebelum Jatuh Tempo (hari)</Label>
            <Input
              type="number"
              placeholder="Contoh: 3"
              value={notifyDaysBefore}
              onChange={(e) => setNotifyDaysBefore(e.target.value)}
              min="0"
            />
          </div>

          {/* Assignees */}
          {members && members.length > 0 && (
            <div className="space-y-2">
              <Label>Anggota yang Ditugaskan</Label>
              <div className="grid grid-cols-2 gap-2">
                {members.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={assigneeIds.includes(member.id)}
                      onChange={() => toggleAssignee(member.id)}
                      className="rounded"
                    />
                    {member.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={`${basePath}/finance/recurring-bills`}>Batal</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
