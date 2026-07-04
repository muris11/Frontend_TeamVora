"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import api from "@/lib/api";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";

export function MembersPage({ basePath }: { basePath: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const res = await api.get("/team-members");
      return res.data.data || res.data;
    },
  });

  const members = (Array.isArray(data) ? data : []) as User[];

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Anggota" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={basePath}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Anggota Tim</h1>
          <p className="text-sm text-muted-foreground">Lihat semua anggota dalam tim Anda.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          title="Belum ada anggota"
          description="Tim ini belum memiliki anggota."
          icon={<Users className="h-12 w-12" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Card key={member.id} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold border-2 border-border">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{member.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge
                        status={
                          member.role === "team_leader"
                            ? "active"
                            : member.role === "super_admin"
                              ? "high"
                              : "inactive"
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(member.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
