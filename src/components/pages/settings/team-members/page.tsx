"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, UserPlus, Trash2, Mail, Edit, UserCog, UserMinus, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { User } from "@/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTitle } from "@/components/shared/page-title";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

export function TeamMembersPage({ basePath }: { basePath: string }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<string>("member");

  const { data, isLoading } = useQuery({
    queryKey: ["team-members", user?.team_id],
    queryFn: async () => {
      if (!user?.team_id) return [];
      const res = await api.get(`/teams/${user.team_id}/members`);
      return res.data.data || [];
    },
    enabled: !!user?.team_id,
  });

  const members = (Array.isArray(data) ? data : []) as User[];

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.team_id) throw new Error("No team");
      const res = await api.post(`/teams/${user.team_id}/invitations`, { email: inviteEmail });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Undangan berhasil dikirim.");
      setInviteEmail("");
      setShowInvite(false);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal mengirim undangan.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!user?.team_id) throw new Error("No team");
      await api.delete(`/teams/${user.team_id}/members/${id}`);
    },
    onSuccess: () => {
      toast.success("Anggota berhasil dihapus.");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal menghapus anggota.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      if (!user?.team_id) throw new Error("No team");
      const res = await api.put(`/teams/${user.team_id}/members/${id}/update`, { role });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Peran anggota berhasil diperbarui.");
      setEditUser(null);
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal memperbarui peran anggota.");
    },
  });

  const isLeader = user?.role === "team_leader" || user?.role === "super_admin";

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Anggota Tim" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${basePath}/dashboard`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Anggota Tim</h1>
          <p className="text-sm text-muted-foreground">Kelola anggota dalam tim Anda.</p>
        </div>
        {isLeader && (
          <Button onClick={() => setShowInvite(!showInvite)}>
            <UserPlus className="w-4 h-4 mr-2" /> Undang
          </Button>
        )}
      </div>

      {showInvite && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Undang Anggota</CardTitle>
            <CardDescription>Masukkan email untuk mengundang anggota baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@contoh.com"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={() => inviteMutation.mutate()}
                  disabled={!inviteEmail || inviteMutation.isPending}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {inviteMutation.isPending ? "Mengirim..." : "Kirim Undangan"}
                </Button>
                <Button variant="outline" onClick={() => { setShowInvite(false); setInviteEmail(""); }}>
                  Batal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={[
          {
            key: "name",
            header: "Nama",
            render: (item: User) => (
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 rounded-full border border-border/50">
                  <AvatarImage src={item.avatar_url ?? undefined} alt={item.name} className="object-cover" />
                  <AvatarFallback className="bg-muted text-xs font-medium">
                    {item.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-2">
                    {item.name}
                    {item.id === user?.id && <Badge variant="secondary" className="text-[10px] h-4 px-1">Anda</Badge>}
                  </span>
                </div>
              </div>
            ),
          },
          { 
            key: "email", 
            header: "Email",
            render: (item: User) => <span className="text-muted-foreground">{item.email}</span>
          },
          {
            key: "role",
            header: "Peran",
            render: (item: User) => (
              item.role === "team_leader" ? (
                <div className="flex items-center text-primary text-sm font-medium">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  Team Leader
                </div>
              ) : item.role === "super_admin" ? (
                <div className="flex items-center text-orange-600 text-sm font-medium">
                  <UserCog className="w-4 h-4 mr-1.5" />
                  Superadmin
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                  <UserMinus className="w-4 h-4 mr-1.5" />
                  Member
                </div>
              )
            ),
          },
          {
            key: "created_at",
            header: "Bergabung",
            render: (item: User) => <span className="text-muted-foreground">{formatDate(item.created_at)}</span>,
          },
          ...(isLeader
            ? [
                {
                  key: "actions",
                  header: "",
                  render: (item: User) => (
                    item.id !== user?.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={(e: React.MouseEvent) => { 
                            e.stopPropagation(); 
                            setEditUser(item);
                            setEditRole(item.role);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e: React.MouseEvent) => { e.stopPropagation(); setDeleteId(item.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : null
                  ),
                },
              ]
            : []),
        ]}
        data={members}
        isLoading={isLoading}
        emptyMessage="Belum ada anggota tim"
      />

      {!isLoading && members.length === 0 && (
        <EmptyState
          title="Belum ada anggota"
          description="Undang anggota pertama untuk memulai kerja sama tim."
          action={
            isLeader ? (
              <Button onClick={() => setShowInvite(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> Undang Anggota
              </Button>
            ) : undefined
          }
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        title="Hapus Anggota"
        description="Apakah Anda yakin ingin menghapus anggota ini dari tim? Akses mereka ke dalam tim akan dicabut."
        onConfirm={() => deleteId && removeMutation.mutate(deleteId)}
        variant="destructive"
        confirmLabel="Hapus Anggota"
      />

      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Peran Anggota</DialogTitle>
            <DialogDescription>
              Ubah peran untuk <span className="font-semibold text-foreground">{editUser?.name}</span> ({editUser?.email}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Peran dalam Tim</Label>
              <Select value={editRole} onValueChange={(val) => setEditRole(val || "member")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">
                    <div className="flex items-center">
                      <UserMinus className="w-4 h-4 mr-2 text-muted-foreground" />
                      <div>
                        <div>Member</div>
                        <div className="text-xs text-muted-foreground">Hanya bisa melihat dan berkontribusi.</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="team_leader">
                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Team Leader</div>
                        <div className="text-xs text-muted-foreground">Akses penuh mengelola tim dan anggota.</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editRole === "team_leader" && editRole !== editUser?.role && (
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-md text-sm border border-amber-500/20">
                <strong>Peringatan:</strong> Memberikan akses Team Leader akan membuat pengguna ini bisa mengelola tim dan mengubah peran anggota lainnya.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Batal</Button>
            <Button 
              onClick={() => editUser && updateMutation.mutate({ id: editUser.id, role: editRole })}
              disabled={updateMutation.isPending || (editUser?.role === editRole)}
            >
              {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
