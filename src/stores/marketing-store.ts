import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultMarketingPages, MarketingPageData } from "@/lib/marketing-defaults";

interface MarketingState {
  pages: Record<string, MarketingPageData>;
  getPage: (slug: string) => MarketingPageData;
  updatePage: (slug: string, data: Partial<MarketingPageData>) => void;
  resetPage: (slug: string) => void;
}

export const useMarketingStore = create<MarketingState>()(
  persist(
    (set, get) => ({
      pages: { ...defaultMarketingPages },
      
      getPage: (slug: string) => {
        const state = get();
        return state.pages[slug] || defaultMarketingPages[slug] || { enabled: false, seo: { title: "", description: "", keywords: "", ogImage: "" }, sections: [] };
      },
      
      updatePage: (slug: string, data: Partial<MarketingPageData>) => {
        set((state) => ({
          pages: {
            ...state.pages,
            [slug]: {
              ...(state.pages[slug] || defaultMarketingPages[slug]),
              ...data,
            },
          },
        }));
      },
      
      resetPage: (slug: string) => {
        set((state) => ({
          pages: {
            ...state.pages,
            [slug]: { ...defaultMarketingPages[slug] },
          },
        }));
      },
    }),
    {
      name: "teamvora-marketing-storage",
    }
  )
);
