"use client";

import { useState, use } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Users, Clock, CheckCircle2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format";
import { PageTitle } from "@/components/shared/page-title";

interface InvitationData {
  id: number;
  team: { name: string; slug: string };
  invited_by: { name: string; email: string };
  email: string;
  status: string;
  expires_at: string;
  is_registered?: boolean;
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const { user, token: authToken } = useAuthStore();
  const [accepting, setAccepting] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ["invitation", token],
    queryFn: async () => {
      const res = await api.get(`/invitations/${token}`);
      return (res.data.data || res.data) as InvitationData;
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (invitation && !invitation.is_registered) {
        if (!password || password.length < 8) {
          throw new Error("Password minimal 8 karakter");
        }
        if (password !== passwordConfirmation) {
          throw new Error("Konfirmasi password tidak cocok");
        }
      }

      setAccepting(true);
      const res = await api.post(`/invitations/${token}/accept`, {
        password,
        password_confirmation: passwordConfirmation,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Berhasil bergabung dengan tim!");
      
      const { user, token: currentAuthToken } = useAuthStore.getState();
      
      if (!currentAuthToken) {
        router.push("/login");
        return;
      }

      if (user?.role === "super_admin") router.push("/admin");
      else if (user?.role === "team_leader") router.push("/lead");
      else router.push("/member");
    },
    onError: (err: any) => {
      setAccepting(false);
      const msg = err?.message || err?.response?.data?.message || "Gagal menerima undangan";
      toast.error(msg);
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Undangan Tidak Valid</h1>
          <p className="text-muted-foreground mb-6">
            Undangan ini sudah kadaluarsa atau tidak valid. Silakan minta undangan baru dari admin tim.
          </p>
          <Link href="/">
            <Button variant="outline">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (invitation.status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sudah Diterima</h1>
          <p className="text-muted-foreground mb-6">
            Undangan ini sudah diterima sebelumnya.
          </p>
          <Link href="/login">
            <Button>Masuk ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <PageTitle title="Undangan Tim" />
      <div className="w-full max-w-md">
        {/* Background gradient */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute right-1/4 top-1/4 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="relative">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img src="/icon.png" alt="TeamVora Logo" className="mx-auto mb-4 h-12 w-12" />
            <h1 className="text-2xl font-semibold tracking-tight">Undangan Tim</h1>
          </div>

          {/* Invitation Card */}
          <div className="rounded-[1.5rem] bg-muted/30 p-1.5 ring-1 ring-border">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Anda diundang bergabung ke</p>
                  <h2 className="text-xl font-bold">{invitation.team.name}</h2>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diundang oleh</span>
                    <span className="font-medium">{invitation.invited_by.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{invitation.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Berlaku hingga</span>
                    <span className="font-medium">{formatDate(invitation.expires_at)}</span>
                  </div>
                </div>

                {!invitation.is_registered && (
                  <div className="space-y-4 text-left pt-2 pb-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Buat Password Baru</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={accepting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordConfirmation">Konfirmasi Password</Label>
                      <Input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Ketik ulang password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        disabled={accepting}
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => acceptMutation.mutate()}
                  disabled={accepting}
                >
                  {accepting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Terima Undangan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
