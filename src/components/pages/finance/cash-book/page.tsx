"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowDownRight, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { CashBook } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function CashBookPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["cash-book", typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("type", typeFilter);
      const res = await api.get(`/cash-books?${params.toString()}`);
      return res.data.data ?? res.data;
    },
  });

  const items = (data ?? []) as CashBook[];

  const columns = [
    {
      key: "title",
      header: "Judul",
      render: (item: CashBook) => (
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: "type",
      header: "Tipe",
      render: (item: CashBook) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            item.type === "in"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {item.type === "in" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {item.type === "in" ? "Masuk" : "Keluar"}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Jumlah",
      render: (item: CashBook) => (
        <span className="font-medium">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: "date",
      header: "Tanggal",
      render: (item: CashBook) => formatDate(item.date),
    },
    {
      key: "creator",
      header: "Dibuat Oleh",
      render: (item: CashBook) => item.created_by?.name ?? "-",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Kas" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kas Tim</h1>
          <p className="text-sm text-muted-foreground">
            Catat pemasukan dan pengeluaran kas tim
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href={`${basePath}/finance/cash-book/create`}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Baru
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v ?? "")}
        >
          <option value="all">Semua Tipe</option>
          <option value="in">Masuk</option>
          <option value="out">Keluar</option>
        </Select>
      </div>

      {items.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada catatan kas"
          description="Tambahkan catatan pemasukan atau pengeluaran pertama Anda."
          action={
            <Button asChild size="sm">
              <Link href={`${basePath}/finance/cash-book/create`}>
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
            router.push(`${basePath}/finance/cash-book/${item.id}/edit`)
          }
        />
      )}
    </div>
  );
}
