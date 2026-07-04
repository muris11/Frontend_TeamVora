"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface PlatformSettings {
  general: {
    site_name: string;
    tagline: string;
    favicon_url: string;
    logo_url: string;
  };
  contact: {
    contact_email: string;
    support_email: string;
    phone: string;
    address: string;
    office_hours: string;
  };
  social: {
    twitter_url: string;
    linkedin_url: string;
  };
  seo: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
  };
  marketing?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_cta_text?: string;
    hero_cta_link?: string;
    features_title?: string;
    features?: string;
    testimonials_title?: string;
    testimonials?: string;
    footer_text?: string;
    nav_links?: string;
    about_content?: string;
    features_content?: string;
    guide_content?: string;
    help_content?: string;
    careers_content?: string;
    privacy_content?: string;
    terms_content?: string;
  };
}

export function usePlatformSettings() {
  return useQuery<PlatformSettings>({
    queryKey: ["platform-settings"],
    queryFn: async () => {
      const res = await api.get("/platform-settings");
      return res.data.data || res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
