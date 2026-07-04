"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Save, User } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageTitle } from "@/components/shared/page-title";

export function ProfilePage({ basePath }: { basePath: string }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.put("/profile", form);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui.");
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil.");
    },
  });

  return (
    <div className="space-y-6 pb-10">
      <PageTitle title="Profil" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={basePath}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-sm text-muted-foreground">Kelola informasi profil Anda.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar Card */}
        <Card className="border-border/50">
          <CardContent className="p-6 flex flex-col items-center text-center">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <h2 className="mt-4 text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {user?.role === "team_leader" ? "Team Leader" : user?.role === "super_admin" ? "Super Admin" : "Member"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profil</CardTitle>
            <CardDescription>Perbarui informasi profil Anda di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Nomor telepon"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                Batal
              </Button>
              <Button onClick={() => mutate()} disabled={isPending}>
                <Save className="w-4 h-4 mr-2" />
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
