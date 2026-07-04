"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/auth-provider";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuthStore } from "@/stores/auth-store";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "super_admin") router.replace("/admin");
      else if (user.role === "team_leader") router.replace("/lead");
    }
  }, [user, isLoading, router]);

  if (!isLoading && user && user.role !== "member") return null;

  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}
