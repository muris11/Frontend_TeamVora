"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "@/providers/auth-provider";
import { AppLayout } from "@/components/layout/app-layout";
import { PushNotificationSetup } from "@/components/push-notification-setup";
import { useAuthStore } from "@/stores/auth-store";

export default function LeadLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "super_admin") router.replace("/admin");
      else if (user.role === "member") router.replace("/member");
    }
  }, [user, isLoading, router]);

  if (!isLoading && user && user.role !== "team_leader") return null;

  return (
    <AuthProvider>
      <PushNotificationSetup />
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}
