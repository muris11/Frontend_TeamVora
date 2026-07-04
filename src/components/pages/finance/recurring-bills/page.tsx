"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Repeat } from "lucide-react";
import api from "@/lib/api";
import { RecurringBill } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

const frequencyLabels: Record<string, string> = {
  weekly: "Mingguan",
  biweekly: "2 Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
};

export function RecurringBillsPage({ basePath }: { basePath: string }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["recurring-bills"],
    queryFn: async () => {
      const res = await api.get("/recurring-bills");
      return res.data.data ?? res.data;
    },
  });

  const items = (data ?? []) as RecurringBill[];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: RecurringBill) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "amount",
      header: "Jumlah",
      render: (item: RecurringBill) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "frequency",
      header: "Frekuensi",
      render: (item: RecurringBill) =>
        frequencyLabels[item.frequency] ?? item.frequency,
    },
    {
      key: "status",
      header: "Status",
      render: (item: RecurringBill) => <StatusBadge status={item.status} />,
    },
    {
      key: "next_generation_at",
      header: "Generasi Berikutnya",
      render: (item: RecurringBill) =>
        item.next_generation_at ? formatDate(item.next_generation_at) : "-",
    },
    {
      key: "creator",
      header: "Dibuat Oleh",
      render: (item: RecurringBill) => item.creator?.name ?? "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Tagihan Berulang" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tagihan Berulang</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tagihan yang otomatis dibuat secara berkala
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href={`${basePath}/finance/recurring-bills/create`}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Baru
          </Link>
        </Button>
      </div>

      {items.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada tagihan berulang"
          description="Buat tagihan berulang untuk pengelolaan otomatis."
          icon={<Repeat className="h-12 w-12" />}
          action={
            <Button asChild size="sm">
              <Link href={`${basePath}/finance/recurring-bills/create`}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Baru
              </Link>
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
