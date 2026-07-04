"use client";

import { useAuthStore } from "@/stores/auth-store";

export function usePermission() {
  const { user } = useAuthStore();
  const permissions = user?.permissions || [];

  const can = (...required: string[]) => {
    return required.some((p) => permissions.includes(p));
  };

  return {
    can,
    isAdmin: user?.roles?.includes("Admin"),
    isTreasurer: user?.roles?.includes("Treasurer"),
    isLead: user?.roles?.includes("Lead"),
    isMember: user?.roles?.includes("Member"),
  };
}
