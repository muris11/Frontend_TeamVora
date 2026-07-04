"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useRolePath() {
  const { user } = useAuthStore();
  const basePath = user?.role === "team_leader" ? "/lead" : "/member";
  return basePath;
}
