export type SeoStatus = "good" | "yellow" | "red" | "na";

export interface SeoCheck {
  id: string;
  label: string;
  status: SeoStatus;
  message: string;
  weight: number;
}

export interface SeoInput {
  focus_keyword?: string | null;
  title?: string;
  slug?: string;
  excerpt?: string;
  seo_title?: string | null;
  seo_description?: string | null;
  content?: string;
  featured_image?: string | null;
  canonical_url?: string | null;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be",
  "di", "dan", "yang", "ini", "itu", "untuk", "dari", "dengan", "pada", "ke",
]);

export function stripHtml(html: string): string {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html.replace(/<[^>]*>/g, " ");
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function readingTimeMinutes(html: string): number {
  const words = countWords(stripHtml(html));
  return Math.max(1, Math.ceil(words / 200));
}

export function keywordDensity(html: string, keyword: string): number {
  if (!keyword.trim()) return 0;
  const text = stripHtml(html).toLowerCase();
  const k = keyword.toLowerCase().trim();
  if (!text || !k) return 0;
  const total = countWords(text);
  if (total === 0) return 0;
  const re = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
  const matches = text.match(re);
  return ((matches?.length || 0) / total) * 100;
}

interface DomStats {
  internalLinks: number;
  externalLinks: number;
  images: number;
  h2Count: number;
  h3Count: number;
  hasFirstParagraphKeyword: boolean;
  hasSubheadingKeyword: boolean;
}

function parseDom(html: string): DomStats {
  const stats: DomStats = {
    internalLinks: 0,
    externalLinks: 0,
    images: 0,
    h2Count: 0,
    h3Count: 0,
    hasFirstParagraphKeyword: false,
    hasSubheadingKeyword: false,
  };
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return stats;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = Array.from(doc.querySelectorAll("a[href]"));
  for (const a of anchors) {
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    try {
      const url = new URL(href, window.location.origin);
      if (url.host === window.location.host) stats.internalLinks++;
      else stats.externalLinks++;
    } catch {
      stats.externalLinks++;
    }
  }
  stats.images = doc.querySelectorAll("img").length;
  stats.h2Count = doc.querySelectorAll("h2").length;
  stats.h3Count = doc.querySelectorAll("h3").length;
  return stats;
}

interface DomainRefs {
  internalHost: string;
}

function hasKeywordInSubheading(html: string, keyword: string): boolean {
  if (typeof window === "undefined" || !keyword.trim()) return false;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const k = keyword.toLowerCase();
  const heads = Array.from(doc.querySelectorAll("h2, h3"));
  return heads.some((h) => (h.textContent || "").toLowerCase().includes(k));
}

function firstParagraphHasKeyword(html: string, keyword: string): boolean {
  if (typeof window === "undefined" || !keyword.trim()) return false;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const p = doc.querySelector("p");
  return !!p && (p.textContent || "").toLowerCase().includes(keyword.toLowerCase());
}

function titleHasKeyword(title: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  return title.toLowerCase().includes(keyword.toLowerCase());
}

function slugHasKeyword(slug: string, keyword: string): boolean {
  if (!keyword.trim() || !slug) return false;
  const slugWords = slug.toLowerCase().split(/[-_]+/).filter((w) => w && !STOP_WORDS.has(w));
  const kWords = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  return kWords.every((kw) => slugWords.some((sw) => sw.includes(kw) || kw.includes(sw)));
}

function checkLength(value: number, goodMin: number, goodMax: number, yellowMin: number, yellowMax: number): SeoStatus {
  if (value >= goodMin && value <= goodMax) return "good";
  if (value >= yellowMin && value <= yellowMax) return "yellow";
  return "red";
}

export function analyzeSeo(input: SeoInput, _refs: DomainRefs = { internalHost: "" }): { score: number; checks: SeoCheck[] } {
  const k = (input.focus_keyword || "").trim();
  const title = input.title || "";
  const slug = input.slug || "";
  const content = input.content || "";
  const seoTitle = input.seo_title || "";
  const seoDesc = input.seo_description || "";
  const featured = input.featured_image;
  const canonical = input.canonical_url;
  const wordCount = countWords(stripHtml(content));
  const dom = parseDom(content);
  const density = keywordDensity(content, k);
  const hasFpKw = firstParagraphHasKeyword(content, k);
  const hasShKw = hasKeywordInSubheading(content, k);

  const checks: SeoCheck[] = [
    {
      id: "word_count",
      label: "Panjang konten",
      status: wordCount === 0
        ? "red"
        : wordCount < 300
          ? "red"
          : wordCount < 600
            ? "yellow"
            : wordCount > 2500
              ? "yellow"
              : "good",
      message: wordCount === 0
        ? "Belum ada konten."
        : `${wordCount} kata. ${wordCount < 600 ? "Tambah hingga minimal 600 kata." : wordCount > 2500 ? "Cukup panjang, pertimbangkan pemangkasan." : "Ideal."}`,
      weight: 1,
    },
    {
      id: "title_length",
      label: "Panjang judul",
      status: checkLength(title.length, 40, 60, 30, 70),
      message: `${title.length} karakter. Target 40-60 untuk SERP.`,
      weight: 1,
    },
    {
      id: "title_keyword",
      label: "Focus keyword di judul",
      status: !k ? "na" : titleHasKeyword(title, k) ? "good" : "red",
      message: !k ? "Tetapkan focus keyword dulu." : titleHasKeyword(title, k) ? "Focus keyword ada di judul." : "Tambahkan focus keyword di judul.",
      weight: 1.5,
    },
    {
      id: "slug_keyword",
      label: "Focus keyword di slug",
      status: !k ? "na" : !slug ? "red" : slugHasKeyword(slug, k) ? "good" : "yellow",
      message: !k ? "Tetapkan focus keyword dulu." : !slug ? "Slug kosong." : slugHasKeyword(slug, k) ? "Slug memuat keyword." : "Sertakan keyword di slug URL.",
      weight: 1,
    },
    {
      id: "slug_length",
      label: "Panjang slug",
      status: !slug ? "red" : slug.length <= 60 ? "good" : slug.length <= 75 ? "yellow" : "red",
      message: !slug ? "Slug kosong." : `${slug.length} karakter. Ideal <=60.`,
      weight: 0.5,
    },
    {
      id: "seo_description",
      label: "Meta description (SEO)",
      status: !seoDesc
        ? "red"
        : checkLength(seoDesc.length, 120, 155, 100, 160),
      message: !seoDesc
        ? "Isi meta description khusus untuk SERP."
        : `${seoDesc.length} karakter. Target 120-155.`,
      weight: 1.2,
    },
    {
      id: "seo_description_keyword",
      label: "Focus keyword di meta description",
      status: !k ? "na" : !seoDesc ? "red" : seoDesc.toLowerCase().includes(k.toLowerCase()) ? "good" : "yellow",
      message: !k ? "Tetapkan focus keyword dulu." : !seoDesc ? "Belum ada meta description." : seoDesc.toLowerCase().includes(k.toLowerCase()) ? "Keyword muncul di meta description." : "Sertakan keyword di meta description.",
      weight: 1,
    },
    {
      id: "seo_title",
      label: "SEO title (SERP)",
      status: !seoTitle
        ? "yellow"
        : checkLength(seoTitle.length, 40, 60, 30, 70),
      message: !seoTitle
        ? "Opsional. Akan fallback ke judul."
        : `${seoTitle.length} karakter. Target 40-60.`,
      weight: 0.8,
    },
    {
      id: "first_para_keyword",
      label: "Focus keyword di paragraf pertama",
      status: !k ? "na" : hasFpKw ? "good" : "red",
      message: !k ? "Tetapkan focus keyword dulu." : hasFpKw ? "Keyword ada di paragraf awal." : "Sisipkan keyword di paragraf pertama.",
      weight: 1.2,
    },
    {
      id: "subheading_keyword",
      label: "Focus keyword di sub-heading",
      status: !k ? "na" : hasShKw ? "good" : "yellow",
      message: !k ? "Tetapkan focus keyword dulu." : hasShKw ? "Keyword muncul di sub-heading." : "Tambahkan keyword di salah satu H2/H3.",
      weight: 0.8,
    },
    {
      id: "keyword_density",
      label: "Kepadatan keyword",
      status: !k
        ? "na"
        : density === 0
          ? "red"
          : density >= 0.5 && density <= 2.5
            ? "good"
            : (density >= 0.3 && density <= 3.5)
              ? "yellow"
              : "red",
      message: !k
        ? "Tetapkan focus keyword dulu."
        : density === 0
          ? "Keyword tidak ditemukan di konten."
          : `${density.toFixed(2)}%. Target 0.5%-2.5%.`,
      weight: 1,
    },
    {
      id: "subheadings",
      label: "Struktur sub-heading",
      status: dom.h2Count + dom.h3Count >= 2 ? "good" : dom.h2Count + dom.h3Count === 1 ? "yellow" : "red",
      message: `${dom.h2Count} H2, ${dom.h3Count} H3. Minimal 2 sub-heading.`,
      weight: 0.8,
    },
    {
      id: "featured_image",
      label: "Featured image",
      status: featured ? "good" : "red",
      message: featured ? "Featured image terpasang." : "Tambahkan featured image.",
      weight: 1,
    },
    {
      id: "og_image",
      label: "OG image (share)",
      status: "na",
      message: "Akan menggunakan featured image sebagai fallback.",
      weight: 0,
    },
    {
      id: "internal_links",
      label: "Internal link",
      status: dom.internalLinks >= 1 ? "good" : "yellow",
      message: dom.internalLinks >= 1 ? `${dom.internalLinks} internal link.` : "Tambahkan minimal 1 internal link.",
      weight: 0.8,
    },
    {
      id: "external_links",
      label: "External link (sumber)",
      status: dom.externalLinks >= 1 ? "good" : "yellow",
      message: dom.externalLinks >= 1 ? `${dom.externalLinks} external link.` : "Tambahkan minimal 1 link ke sumber eksternal.",
      weight: 0.8,
    },
    {
      id: "body_images",
      label: "Gambar di body",
      status: dom.images >= 1 ? "good" : "yellow",
      message: dom.images >= 1 ? `${dom.images} gambar.` : "Tambahkan minimal 1 gambar di konten.",
      weight: 0.6,
    },
    {
      id: "canonical",
      label: "Canonical URL",
      status: !canonical ? "na" : /^https?:\/\//.test(canonical) ? "good" : "red",
      message: !canonical
        ? "Opsional. Untuk syndicated content."
        : /^https?:\/\//.test(canonical)
          ? "Canonical URL valid."
          : "Gunakan URL lengkap (https://...).",
      weight: 0,
    },
  ];

  const totalWeight = checks.reduce((acc, c) => acc + c.weight, 0);
  const earned = checks.reduce((acc, c) => {
    if (c.status === "na" || c.weight === 0) return acc;
    if (c.status === "good") return acc + c.weight;
    if (c.status === "yellow") return acc + c.weight * 0.5;
    return acc;
  }, 0);
  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  return { score, checks };
}

export function seoScoreTone(score: number): "good" | "yellow" | "red" {
  if (score >= 70) return "good";
  if (score >= 40) return "yellow";
  return "red";
}
