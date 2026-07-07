"use client";

import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/shared/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Server,
  Database,
  HardDrive,
  Info,
  RefreshCw,
} from "lucide-react";
import api from "@/lib/api";

interface SystemStatus {
  php_version: string;
  laravel_version: string;
  db_status: string;
  storage_status: string;
  cache_status: string;
  environment: string;
  debug_mode: boolean;
  app_name: string;
  app_url: string;
  disk_usage: {
    total: string;
    used: string;
    free: string;
    percentage: number;
  };
}

export default function SystemStatusPage() {
  const {
    data: status,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => {
      const res = await api.get("/admin/system-status");
      return res.data.data as SystemStatus;
    },
  });

  const statusItems = [
    {
      label: "Versi PHP",
      value: status?.php_version ?? "-",
      icon: Server,
      ok: true,
    },
    {
      label: "Versi Laravel",
      value: status?.laravel_version ?? "-",
      icon: Info,
      ok: true,
    },
    {
      label: "Status Database",
      value: status?.db_status ?? "-",
      icon: Database,
      ok: status?.db_status?.toLowerCase().includes("connected"),
    },
    {
      label: "Status Penyimpanan",
      value: status?.storage_status ?? "-",
      icon: HardDrive,
      ok: status?.storage_status?.toLowerCase().includes("available"),
    },
    {
      label: "Status Cache",
      value: status?.cache_status ?? "-",
      icon: Info,
      ok: status?.cache_status?.toLowerCase().includes("active"),
    },
    {
      label: "Lingkungan",
      value: status?.environment ?? "-",
      icon: Globe,
      ok: true,
    },
    {
      label: "Debug Mode",
      value: status?.debug_mode ? "Aktif" : "Nonaktif",
      icon: Info,
      ok: !status?.debug_mode,
    },
    {
      label: "Nama Aplikasi",
      value: status?.app_name ?? "-",
      icon: Info,
      ok: true,
    },
    {
      label: "URL Aplikasi",
      value: status?.app_url ?? "-",
      icon: Globe,
      ok: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Status Sistem | TeamVora Admin" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status Sistem</h1>
          <p className="text-muted-foreground">
            Informasi teknis dan status infrastruktur platform.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-xl hover:bg-muted/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Info */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server
            </CardTitle>
            <CardDescription>Informasi versi dan lingkungan server.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-muted/30"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {statusItems.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground font-mono">
                        {item.value}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.ok ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Aplikasi
            </CardTitle>
            <CardDescription>Informasi aplikasi dan konfigurasi.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-muted/30"
                  >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {statusItems.slice(4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground font-mono">
                        {item.value}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.ok ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disk Usage */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Penggunaan Disk
          </CardTitle>
          <CardDescription>Kapasitas penyimpanan server.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-20 w-full rounded-xl" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Terpakai</span>
                <span className="font-mono font-medium">
                  {status?.disk_usage?.used ?? "-"} /{" "}
                  {status?.disk_usage?.total ?? "-"}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (status?.disk_usage?.percentage ?? 0) > 80
                      ? "bg-red-500"
                      : (status?.disk_usage?.percentage ?? 0) > 60
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${status?.disk_usage?.percentage ?? 0}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {status?.disk_usage?.percentage ?? 0}% terpakai
                </span>
                <span>
                  {status?.disk_usage?.free ?? "-"} tersisa
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
