"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shared/page-title";
import { GoogleLoginButton } from "@/components/shared/google-login-button";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post("/login", data);
      const { user, token } = res.data;
      setAuth(user, token);
      toast.success("Login berhasil");
      if (user.role === "super_admin") router.push("/admin");
      else if (user.role === "team_leader") router.push("/lead");
      else router.push("/member");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login gagal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <PageTitle title="Login" />
      <div className="flex flex-col space-y-2 text-center md:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Selamat datang kembali</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email dan password Anda untuk masuk ke akun TeamVora
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@contoh.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Lupa password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                Masuk
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Atau lanjutkan dengan</span>
        </div>
      </div>

      <GoogleLoginButton />

      <div className="text-center text-sm text-muted-foreground mt-6">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
