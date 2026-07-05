"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { SplitBill } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

export function BillsPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["bills", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      const res = await api.get(`/split-bills?${params.toString()}`);
      return res.data.data ?? res.data;
    },
  });

  const items = (data ?? []) as SplitBill[];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: SplitBill) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "total_amount",
      header: "Total",
      render: (item: SplitBill) => (
        <span className="font-medium">{formatCurrency(item.total_amount)}</span>
      ),
    },
    {
      key: "due_date",
      header: "Jatuh Tempo",
      render: (item: SplitBill) => formatDate(item.due_date),
    },
    {
      key: "status",
      header: "Status",
      render: (item: SplitBill) => <StatusBadge status={item.status} />,
    },
    {
      key: "creator",
      header: "Dibuat Oleh",
      render: (item: SplitBill) => item.creator?.name ?? "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Split Bill" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Split Bill</h1>
          <p className="text-sm text-muted-foreground">
            Kelola tagihan dan pembagian biaya
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href={`${basePath}/finance/bills/create`}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Baru
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Semua Status</option>
          <option value="unpaid">Belum Bayar</option>
          <option value="pending_verification">Verifikasi</option>
          <option value="paid">Lunas</option>
        </select>
      </div>

      {items.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada tagihan"
          description="Buat tagihan pertama untuk membagi biaya."
          action={
            <Button asChild size="sm">
              <Link href={`${basePath}/finance/bills/create`}>
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
          onRowClick={(item) =>
            router.push(`${basePath}/finance/bills/${item.id}`)
          }
        />
      )}
    </div>
  );
}
