"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LeadRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/lead/dashboard");
  }, [router]);
  return null;
}
