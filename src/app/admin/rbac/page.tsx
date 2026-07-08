"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Shield, ShieldCheck, UserCheck, CheckSquare, Square } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageTitle } from "@/components/shared/page-title";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface SpatiePermission {
  id: number;
  name: string;
}

interface SpatieRole {
  id: number;
  name: string;
  permissions: SpatiePermission[];
}

const permissionGroups = [
  {
    category: "Dashboard",
    permissions: [
      { name: "view_dashboard", label: "Lihat Dashboard", desc: "Akses masuk halaman dashboard utama" }
    ]
  },
  {
    category: "Buku Kas (Keuangan Tim)",
    permissions: [
      { name: "view_cash_book", label: "Lihat Buku Kas", desc: "Melihat laporan kas masuk/keluar tim" },
      { name: "write_cash_book", label: "Kelola Buku Kas", desc: "Tambah/edit/hapus transaksi kas" }
    ]
  },
  {
    category: "Split Bill (Patungan)",
    permissions: [
      { name: "view_split_bill", label: "Lihat Split Bill", desc: "Melihat daftar pembagian tagihan" },
      { name: "write_split_bill", label: "Buat/Kelola Split Bill", desc: "Membuat tagihan patungan baru" },
      { name: "pay_split_bill", label: "Bayar Split Bill", desc: "Mengunggah bukti bayar tagihan" },
      { name: "verify_split_bill", label: "Verifikasi Split Bill", desc: "Menyetujui/verifikasi pembayaran anggota" }
    ]
  },
  {
    category: "Tagihan Berulang",
    permissions: [
      { name: "view_recurring_bill", label: "Lihat Tagihan Berulang", desc: "Melihat daftar tagihan otomatis bulanan" },
      { name: "write_recurring_bill", label: "Kelola Tagihan Berulang", desc: "Membuat/menghentikan template tagihan berulang" }
    ]
  },
  {
    category: "Manajemen Tugas",
    permissions: [
      { name: "view_tasks", label: "Lihat Tugas", desc: "Akses papan kanban tugas" },
      { name: "write_tasks", label: "Buat/Kelola Tugas", desc: "Tambah/edit/hapus tugas dan reorder" },
      { name: "update_task_status", label: "Update Status Tugas", desc: "Pindahkan tugas antar kolom (todo, in_progress, done)" }
    ]
  },
  {
    category: "Log Harian (Daily Logs)",
    permissions: [
      { name: "view_daily_log", label: "Lihat Log Harian", desc: "Melihat riwayat log kerja tim" },
      { name: "write_daily_log", label: "Tulis Log Harian", desc: "Membuat/mengedit log harian pribadi" }
    ]
  },
  {
    category: "Media & File",
    permissions: [
      { name: "view_media", label: "Lihat Media", desc: "Melihat file/gambar tim" },
      { name: "write_media", label: "Upload/Hapus Media", desc: "Mengunggah file baru atau menghapusnya" }
    ]
  },
  {
    category: "Blog",
    permissions: [
      { name: "view_blog", label: "Lihat Blog", desc: "Membaca artikel publik & draf internal" },
      { name: "write_blog", label: "Tulis/Edit Blog", desc: "Menulis draf artikel blog baru" },
      { name: "manage_blog", label: "Publish/Hapus Blog", desc: "Menyetujui penerbitan atau menghapus artikel" }
    ]
  },
  {
    category: "Sistem & Administrasi",
    permissions: [
      { name: "manage_rbac", label: "Kelola Hak Akses (RBAC)", desc: "Akses mengubah matriks permission ini" },
      { name: "manage_teams", label: "Kelola Tim", desc: "CRUD profil tim dan organisasi" },
      { name: "manage_env", label: "Kelola Env Config", desc: "Konfigurasi variabel sistem (Super Admin)" },
      { name: "manage_email_templates", label: "Kelola Email Template", desc: "Pengaturan template surel" },
      { name: "manage_members", label: "Kelola Anggota", desc: "Menambah/mengeluarkan anggota dari tim" },
      { name: "manage_permissions", label: "Kelola Spatie Permissions", desc: "Sinkronisasi role/permission" }
    ]
  }
];

const roleLabels: Record<string, { label: string; icon: any; color: string }> = {
  super_admin: { label: "Superadmin", icon: ShieldCheck, color: "text-amber-500" },
  admin: { label: "Superadmin", icon: ShieldCheck, color: "text-amber-500" },
  team_leader: { label: "Lead", icon: Shield, color: "text-blue-500" },
  lead: { label: "Lead", icon: Shield, color: "text-blue-500" },
  member: { label: "Member", icon: UserCheck, color: "text-gray-500" }
};

export default function AdminRBACPage() {
  const queryClient = useQueryClient();
  const [selectedRoleName, setSelectedRoleName] = useState<string>("team_leader");
  const [activePermissions, setActivePermissions] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["rbac-config"],
    queryFn: async () => {
      const res = await api.get("/members");
      return res.data;
    }
  });

  const roles = (data?.roles || []) as SpatieRole[];
  const selectedRole = roles.find((r) => r.name === selectedRoleName);

  // Sync state with query data when role selection changes
  useEffect(() => {
    if (selectedRole) {
      const active: Record<string, boolean> = {};
      selectedRole.permissions.forEach((p) => {
        active[p.name] = true;
      });
      setActivePermissions(active);
    }
  }, [selectedRoleName, roles, selectedRole]);

  const updatePermissionsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedRole) return;
      const permissionsList = Object.keys(activePermissions).filter((k) => activePermissions[k]);
      return api.put(`/roles/${selectedRole.id}/permissions`, {
        permissions: permissionsList
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac-config"] });
      toast.success("Hak akses role berhasil diperbarui!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal memperbarui hak akses.");
    }
  });

  const handleToggle = (permName: string) => {
    setActivePermissions((prev) => ({
      ...prev,
      [permName]: !prev[permName]
    }));
  };

  const handleSelectAll = (permNames: string[], select: boolean) => {
    setActivePermissions((prev) => {
      const updated = { ...prev };
      permNames.forEach((n) => {
        updated[n] = select;
      });
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <PageTitle title="Manajemen Akses (RBAC)" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-48 col-span-1" />
          <Skeleton className="h-96 col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageTitle title="Hak Akses (RBAC)" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Hak Akses (RBAC)</h1>
          <p className="text-sm text-muted-foreground">
            Kelola izin dan wewenang (Spatie Permissions) untuk setiap role dalam platform.
          </p>
        </div>
        <Button 
          onClick={() => updatePermissionsMutation.mutate()} 
          disabled={updatePermissionsMutation.isPending}
          className="rounded-xl shadow"
        >
          <Save className="w-4 h-4 mr-2" />
          {updatePermissionsMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Left Side: Role Selectors */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Role Pengguna</p>
          <div className="flex flex-col gap-2">
            {Array.from(
              roles
                .filter(role => ['super_admin', 'admin', 'team_leader', 'lead', 'member'].includes(role.name.toLowerCase()))
                .reduce((map, role) => {
                  const key = role.name.toLowerCase();
                  const canonical = key === 'admin' ? 'super_admin' : key === 'lead' ? 'team_leader' : key;
                  if (!map.has(canonical)) map.set(canonical, role);
                  return map;
                }, new Map<string, typeof roles[0]>())
                .values()
            ).map((role) => {
              const info = roleLabels[role.name.toLowerCase()] || { label: role.name, icon: Shield, color: "text-gray-500" };
              const Icon = info.icon;
              const isSelected = role.name === selectedRoleName;

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleName(role.name)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    isSelected 
                      ? "bg-primary/5 border-primary text-primary font-semibold ring-1 ring-primary"
                      : "bg-card border-border hover:bg-muted/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${info.color}`} />
                  <div>
                    <span className="block text-sm leading-tight">{info.label}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {role.permissions.length} Hak Akses Aktif
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Permissions Matrix */}
        <div className="md:col-span-3 space-y-6">
          {permissionGroups.map((group) => {
            const allNames = group.permissions.map((p) => p.name);
            const isAllSelected = allNames.every((n) => activePermissions[n]);
            const isSomeSelected = allNames.some((n) => activePermissions[n]) && !isAllSelected;

            return (
              <Card key={group.category} className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/10 border-b border-border/20 py-3.5 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">{group.category}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    onClick={() => handleSelectAll(allNames, !isAllSelected)}
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </Button>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {group.permissions.map((p) => {
                    const isChecked = !!activePermissions[p.name];
                    return (
                      <div
                        key={p.name}
                        onClick={() => handleToggle(p.name)}
                        className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(p.name)}
                          className="mt-0.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{p.label}</span>
                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {p.name}
                            </code>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
