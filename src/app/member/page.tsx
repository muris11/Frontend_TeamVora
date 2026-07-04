"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MemberRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/member/dashboard");
  }, [router]);
  return null;
}
