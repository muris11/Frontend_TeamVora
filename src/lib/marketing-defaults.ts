export interface MarketingSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'pricing' | 'faq' | 'stats' | 'team' | 'text' | 'contact';
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  bgColor?: string;
  textColor?: string;
  order: number;
  items?: any[]; // Reusable array for features, testimonials, etc.
}

export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface MarketingPageData {
  enabled: boolean;
  seo: PageSeo;
  sections: MarketingSection[];
}

export const defaultMarketingPages: Record<string, MarketingPageData> = {
  landing: {
    enabled: true,
    seo: {
      title: "TeamVora - Platform Manajemen Tim Terbaik",
      description: "Kolaborasi lebih cerdas dan produktif bersama TeamVora.",
      keywords: "team management, kolaborasi, produktivitas",
      ogImage: ""
    },
    sections: [
      {
        id: "hero-1",
        type: "hero",
        title: "Tingkatkan Produktivitas Tim Anda",
        subtitle: "Platform manajemen tim all-in-one untuk kolaborasi yang lebih cerdas.",
        content: "Mulai Sekarang,Pelajari Lebih Lanjut", // Used for CTA buttons
        imageUrl: "/hero-illustration.svg",
        bgColor: "#ffffff",
        textColor: "#0f172a",
        order: 1
      },
      {
        id: "features-1",
        type: "features",
        title: "Fitur Unggulan",
        subtitle: "Semua yang Anda butuhkan untuk mengelola tim.",
        order: 2,
        items: [
          { title: "Manajemen Tugas", description: "Atur tugas dengan mudah", icon: "CheckSquare" },
          { title: "Kolaborasi Real-time", description: "Chat dan diskusi", icon: "MessageCircle" }
        ]
      }
    ]
  },
  tentang: {
    enabled: true,
    seo: {
      title: "Tentang Kami - TeamVora",
      description: "Pelajari lebih lanjut tentang misi dan visi TeamVora.",
      keywords: "tentang teamvora, visi, misi",
      ogImage: ""
    },
    sections: [
      {
        id: "text-1",
        type: "text",
        title: "Misi Kami",
        content: "Memberdayakan tim di seluruh dunia untuk bekerja lebih cerdas.",
        order: 1
      }
    ]
  },
  fitur: { enabled: true, seo: { title: "Fitur", description: "", keywords: "", ogImage: "" }, sections: [] },
  bantuan: { enabled: true, seo: { title: "Pusat Bantuan", description: "", keywords: "", ogImage: "" }, sections: [] },
  privasi: { enabled: true, seo: { title: "Kebijakan Privasi", description: "", keywords: "", ogImage: "" }, sections: [] },
  syarat: { enabled: true, seo: { title: "Syarat & Ketentuan", description: "", keywords: "", ogImage: "" }, sections: [] },
  kontak: { enabled: true, seo: { title: "Hubungi Kami", description: "", keywords: "", ogImage: "" }, sections: [] },
  changelog: { enabled: true, seo: { title: "Changelog", description: "", keywords: "", ogImage: "" }, sections: [] },
  integrasi: { enabled: true, seo: { title: "Integrasi", description: "", keywords: "", ogImage: "" }, sections: [] },
  keamanan: { enabled: true, seo: { title: "Keamanan", description: "", keywords: "", ogImage: "" }, sections: [] }
};
