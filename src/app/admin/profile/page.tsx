"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Lock } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTitle } from "@/components/shared/page-title";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  current_password: z.string().min(1, "Password lama wajib diisi"),
  password: z.string().min(8, "Password baru minimal 8 karakter"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Password tidak cocok",
  path: ["password_confirmation"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileForm) => api.put("/profile", data),
    onSuccess: (res) => {
      const updated = res.data.data || res.data;
      if (token) setAuth(updated, token);
      toast.success("Profil berhasil diperbarui");
    },
    onError: () => toast.error("Gagal memperbarui profil"),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: PasswordForm) => api.put("/password", data),
    onSuccess: () => {
      toast.success("Password berhasil diubah");
      passwordForm.reset();
    },
    onError: () => toast.error("Gagal mengubah password"),
  });

  return (
    <div className="space-y-6">
      <PageTitle title="Profile" />
      <h1 className="text-2xl font-bold">Profil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui informasi profil Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit((d) => updateProfileMutation.mutate(d))} className="space-y-4 max-w-md">
              <FormField control={profileForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={profileForm.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={profileForm.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Telepon</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>Perbarui password akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit((d) => updatePasswordMutation.mutate(d))} className="space-y-4 max-w-md">
              <FormField control={passwordForm.control} name="current_password" render={({ field }) => (
                <FormItem><FormLabel>Password Lama</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={passwordForm.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password Baru</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={passwordForm.control} name="password_confirmation" render={({ field }) => (
                <FormItem><FormLabel>Konfirmasi Password Baru</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={updatePasswordMutation.isPending}>
                <Lock className="mr-2 h-4 w-4" />
                {updatePasswordMutation.isPending ? "Mengubah..." : "Ubah Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
