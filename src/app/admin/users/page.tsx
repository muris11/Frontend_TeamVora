"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import api from "@/lib/api";
import { User, Team } from "@/types";
import { formatDate } from "@/lib/format";
import { DataTable } from "@/components/shared/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTitle } from "@/components/shared/page-title";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  team_leader: "Team Leader",
  member: "Member",
};

const roleBadgeColors: Record<string, string> = {
  super_admin: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  team_leader: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  member: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterTeam, setFilterTeam] = useState<string>("all");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/members");
      return res.data.users || res.data.data || [];
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const res = await api.get("/teams");
      return res.data.data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      api.put(`/members/${userId}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role berhasil diubah");
    },
    onError: () => toast.error("Gagal mengubah role"),
  });

  const impersonateMutation = useMutation({
    mutationFn: (userId: number) => api.post(`/impersonate/${userId}`),
    onSuccess: (res) => {
      const { user, token, impersonator } = res.data;
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        useAuthStore.getState().setOriginalToken(currentToken);
      }
      setAuth(user, token, impersonator);
      toast.success(`Masuk sebagai ${user.name}`);
      if (user.role === "super_admin") router.push("/admin");
      else if (user.role === "team_leader") router.push("/lead");
      else router.push("/member");
    },
    onError: () => toast.error("Gagal masuk sebagai user ini"),
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u: User) => {
      const matchRole = filterRole === "all" || u.role === filterRole;
      const matchTeam = filterTeam === "all" || String(u.team_id) === filterTeam;
      return matchRole && matchTeam;
    });
  }, [users, filterRole, filterTeam]);

  const columns = [
    {
      key: "name",
      header: "User",
      render: (item: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.avatar_url ?? undefined} alt={item.name} />
            <AvatarFallback>{item.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item: User) => (
        <Badge variant="secondary" className={roleBadgeColors[item.role] || ""}>
          {roleLabels[item.role] || item.role}
        </Badge>
      ),
    },
    {
      key: "team",
      header: "Tim",
      render: (item: User) => item.team?.name || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "created_at",
      header: "Bergabung",
      render: (item: User) => formatDate(item.created_at),
    },
    {
      key: "actions",
      header: "",
      render: (item: User) => (
        <div className="flex justify-end gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => impersonateMutation.mutate(item.id)}
            disabled={impersonateMutation.isPending}
          >
            <LogIn className="mr-1 h-3 w-3" />
            Impersonate
          </Button>
          <Select
            onValueChange={(val) => {
              const v = String(val);
              if (v) updateRoleMutation.mutate({ userId: item.id, role: v });
            }}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Ubah Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="team_leader">Team Leader</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Kelola User" />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola User</h1>
          <p className="text-sm text-muted-foreground">Kelola seluruh user dalam platform dan ubah peran mereka.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterRole} onValueChange={(val) => setFilterRole(val || "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="team_leader">Team Leader</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTeam} onValueChange={(val) => setFilterTeam(val || "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Tim" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tim</SelectItem>
              {(teams || []).map((t: Team) => (
                <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers || []}
        isLoading={isLoading}
        emptyMessage="Belum ada user"
      />
    </div>
  );
}
