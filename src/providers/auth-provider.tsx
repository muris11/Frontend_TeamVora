"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import api from "@/lib/api";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, setAuth, setImpersonator, logout, setLoading, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

    if (!token && !isPublicPath) {
      router.push("/login");
      setLoading(false);
      return;
    }

    if (token && !user) {
      api
        .get("/me")
        .then((res) => {
          const userData = res.data.data || res.data;
          const impersonatorData = res.data.impersonator || null;
          setAuth(userData, token);
          if (impersonatorData) {
            setImpersonator(impersonatorData);
          }
          // Redirect super_admin to admin panel
          if (userData.role === "super_admin" && !pathname.startsWith("/admin")) {
            router.push("/admin");
          }
        })
        .catch(() => {
          logout();
          if (!isPublicPath) router.push("/login");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user, pathname, router, setAuth, logout, setLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
