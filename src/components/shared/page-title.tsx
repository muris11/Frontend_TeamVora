"use client";

import { useEffect } from "react";

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    const formattedTitle = title.includes("TeamVora") ? title : `${title} | TeamVora`;
    document.title = formattedTitle;
  }, [title]);

  return null;
}
