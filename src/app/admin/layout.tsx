"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/auth-provider";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user && user.role !== "super_admin") {
      if (user.role === "team_leader") router.replace("/lead");
      else router.replace("/member");
    }
  }, [user, isLoading, router]);

  if (!isLoading && user && user.role !== "super_admin") {
    return null;
  }

  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
