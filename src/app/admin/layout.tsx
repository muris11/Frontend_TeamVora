"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider } from "@/providers/auth-provider";
import { AdminLayout } from "@/components/layout/admin-layout";
import { PushNotificationSetup } from "@/components/push-notification-setup";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuthStore();

  const isMediaPage = pathname?.startsWith("/admin/media");

  useEffect(() => {
    if (!isLoading && user && user.role !== "super_admin" && !isMediaPage) {
      if (user.role === "team_leader") router.replace("/lead");
      else router.replace("/member");
    }
  }, [user, isLoading, router, isMediaPage]);

  if (!isLoading && user && user.role !== "super_admin" && !isMediaPage) {
    return null;
  }

  return (
    <AuthProvider>
      <PushNotificationSetup />
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
