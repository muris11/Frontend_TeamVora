"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

export function SEOHead({ title, description, keywords, ogImage, ogUrl, canonical }: SEOProps) {
  useEffect(() => {
    let formattedTitle = title;
    if (title && !title.includes("TeamVora")) {
      formattedTitle = `${title} | TeamVora`;
    }

    if (formattedTitle) document.title = formattedTitle;

    const setMeta = (name: string, content: string) => {
      let el =
        document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    if (formattedTitle) setMeta("og:title", formattedTitle);
    if (description) setMeta("og:description", description);
    if (ogImage) setMeta("og:image", ogImage);
    if (ogUrl) setMeta("og:url", ogUrl);

    if (canonical) {
      let link = document.querySelector("link[rel=canonical]") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, keywords, ogImage, ogUrl, canonical]);

  return null;
}
