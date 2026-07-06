"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import { DailyLog } from "@/types";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Download } from "lucide-react";

export function DailyLogPage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.set("start_date", startDate);
  if (endDate) queryParams.set("end_date", endDate);
  const queryString = queryParams.toString();

  const { data: response, isLoading } = useQuery({
    queryKey: ["daily-logs", startDate, endDate],
    queryFn: () => api.get(`/daily-logs?${queryString}`).then((r) => r.data),
  });

  const logs = response?.data ?? [];

  return (
    <div className="space-y-6">
      <PageTitle title="Daily Log" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Log Harian</h1>
          <p className="text-sm text-muted-foreground">Catat dan pantau aktivitas harian tim.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="rounded-xl">
            <Link href={`${api.defaults.baseURL}/daily-logs/export?${queryString}`} target="_blank">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href={`${basePath}/productivity/daily-log/create`}>
              <Plus className="w-4 h-4 mr-2" />
              Catat Log Baru
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Dari Tanggal</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[200px]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Sampai Tanggal</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      {logs.length === 0 && !isLoading ? (
        <EmptyState
          title="Belum ada log harian"
          description="Ayo mulai catat aktivitas harianmu sekarang."
          icon={<FileText className="w-12 h-12" />}
          action={
            <Button onClick={() => router.push(`${basePath}/productivity/daily-log/create`)}>
              Catat Log
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {logs.map((log: DailyLog) => (
            <Card key={log.id} className="cursor-pointer hover:border-primary/50 transition-colors flex flex-col" onClick={() => router.push(`${basePath}/productivity/daily-log/${log.id}`)}>
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={log.user?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">{log.user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-semibold">{log.user?.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{formatDate(log.log_date || log.created_at)}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <h4 className="font-semibold text-lg mb-2 line-clamp-1">{log.title}</h4>
                <div className="text-sm text-muted-foreground line-clamp-3 prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: log.content.replace(/<[^>]*>?/gm, ' ') }}>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
