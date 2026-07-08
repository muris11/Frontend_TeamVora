import { ProjectDocPage } from "./types";

export const frontendPages: ProjectDocPage[] = [
{
    id: "frontend/overview",
    slug: ["frontend", "overview"],
    category: "frontend",
    title: "Frontend Overview",
    summary:
      "Ringkasan frontend TeamVora: Next.js App Router, pembagian route group, shell role-based, provider global, dan layer UI reusable yang menopang aplikasi.",
    audience: ["Frontend Developer", "Designer", "QA"],
    overallStatus: "Verified",
    statusNote:
      "Root layout, package stack, route groups, dan role shell terlihat jelas di workspace Frontend yang terbaca saat audit.",
    facts: [
      { label: "Framework", value: "Next.js 16 + React 19 + TypeScript" },
      { label: "Routing", value: "App Router" },
      { label: "Global Provider", value: "QueryProvider + AppToaster" },
      { label: "Role Shell", value: "admin, lead, member" },
    ],
    responsibilities: [
      "Menjadi shell aplikasi publik, auth, dan dashboard internal untuk semua role.",
      "Menjembatani API backend lewat axios/React Query dan menyajikan UI role-based yang berbeda untuk admin, lead, dan member.",
      "Menyediakan layer komponen reusable yang dipakai lintas modul.",
    ],
    keyFiles: [
      { path: "Frontend/package.json", note: "Manifest dependency frontend.", status: "Verified" },
      { path: "Frontend/src/app/layout.tsx", note: "Root layout dan font/provider global.", status: "Verified" },
      { path: "Frontend/src/app/(marketing)/layout.tsx", note: "Shell marketing/public pages.", status: "Verified" },
      {
        path: "Frontend/src/app/(auth)/layout.tsx",
        note: "Shell halaman login/register/forgot/reset.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/layout.tsx", note: "Shell area superadmin.", status: "Verified" },
      { path: "Frontend/src/app/lead/layout.tsx", note: "Shell role team leader.", status: "Verified" },
      { path: "Frontend/src/app/member/layout.tsx", note: "Shell role member.", status: "Verified" },
      {
        path: "Frontend/src/components/layout",
        note: "Komponen header/sidebar/layout untuk admin dan app role surfaces.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Dari root ke role surfaces",
        status: "Verified",
        steps: [
          "Root layout memuat font Geist, QueryProvider, dan toaster global.",
          "Auth flow menentukan role user dan mengarahkan ke /admin, /lead, atau /member.",
          "Setiap role memiliki layout terpisah dan shell navigasi sendiri.",
        ],
      },
      {
        title: "Public vs internal frontend",
        status: "Verified",
        steps: [
          "(marketing) menangani halaman publik dan brand presence.",
          "(auth) menangani login/register/recovery.",
          "admin/lead/member menangani aplikasi internal yang memanggil backend protected endpoints.",
        ],
      },
    ],
    dependencies: [
      "Next.js App Router.",
      "React Query untuk data fetching.",
      "Zustand untuk auth state.",
      "Axios base client ke backend Laravel.",
      "Shared UI layer di src/components/ui.",
    ],
    sensitiveAreas: [
      {
        title: "Role shell memegang navigasi inti",
        detail: "Perubahan kecil pada layout, sidebar, atau redirect role bisa memutus banyak flow pengguna sekaligus.",
        status: "Verified",
      },
      {
        title: "Marketing dan admin settings belum sepenuhnya parity",
        detail:
          "Sebagian panel editor/settings admin tampak lebih kaya daripada halaman publik yang benar-benar mengonsumsi setting tersebut.",
        status: "Partial",
      },
      {
        title: "Tidak ada server-side middleware route guard yang terverifikasi",
        detail:
          "Proteksi route frontend tampak dilakukan di client-side layouts/providers, jadi perubahan auth UX harus diaudit hati-hati.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Mulai perubahan dari surface tertentu: marketing, auth, admin, lead, atau member. Hindari menyentuh semua sekaligus bila tidak perlu.",
      "Jika mengubah shell role, cek header/sidebar/layout pada semua role terkait.",
      "Jika mengubah fetch data global, cek React Query provider, auth provider, dan axios interceptors.",
    ],
    validationChecklist: [
      "Tes login lalu redirect untuk tiap role.",
      "Buka minimal satu halaman utama di admin, lead, dan member setelah perubahan layout/shared component.",
      "Verifikasi marketing pages dan auth pages bila menyentuh root layout atau global CSS.",
    ],
    affectedSurfaces: [
      "Frontend/src/app/**/*",
      "Frontend/src/components/layout/*",
      "Frontend/src/providers/*",
      "Frontend/src/stores/*",
      "Frontend/src/lib/api.ts",
    ],
    relatedPageIds: [
      "frontend/routes-role-surfaces",
      "frontend/providers-stores-api",
      "frontend/theme-design-system",
      "operations/superadmin-handbook",
    ],
  },
{
    id: "frontend/routes-role-surfaces",
    slug: ["frontend", "routes-role-surfaces"],
    category: "frontend",
    title: "Routes & Role Surfaces",
    summary:
      "Dokumentasi struktur route frontend per permukaan: marketing, auth, admin, lead, member, serta peta halaman penting di masing-masing area.",
    audience: ["Frontend Developer", "QA", "Support"],
    overallStatus: "Verified",
    statusNote: "Struktur route dan folder App Router dapat diverifikasi langsung dari file tree Frontend/src/app.",
    facts: [
      { label: "Public Groups", value: "(marketing), (auth)" },
      { label: "Internal Groups", value: "admin, lead, member" },
      { label: "Base Redirects", value: "/lead -> /lead/dashboard, /member -> /member/dashboard" },
      { label: "Docs Internal", value: "/admin/project-docs/*" },
    ],
    responsibilities: [
      "Menjadi peta route cepat untuk developer, QA, atau support yang perlu menemukan halaman tertentu.",
      "Menjelaskan pembagian route berdasarkan audiens dan role.",
      "Menandai perbedaan hak akses antara admin, lead, dan member dari sudut pandang navigasi frontend.",
    ],
    keyFiles: [
      {
        path: "Frontend/src/app/(marketing)",
        note: "Kumpulan route publik seperti fitur, harga, blog, panduan, bantuan, privasi, syarat.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/(auth)",
        note: "Route login, register, forgot-password, reset-password.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/admin",
        note: "Surface superadmin untuk platform management dan docs internal.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/lead",
        note: "Surface team leader untuk finance/productivity/team operations.",
        status: "Verified",
      },
      { path: "Frontend/src/app/member", note: "Surface member untuk aktivitas harian tim.", status: "Verified" },
      {
        path: "Frontend/src/components/layout/admin-sidebar.tsx",
        note: "Menu navigasi superadmin.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/layout/sidebar.tsx",
        note: "Menu navigasi lead/member berbasis role dan permission.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Marketing/auth/internal split",
        status: "Verified",
        steps: [
          "Marketing route memuat brand/public information dan beberapa konten statis.",
          "Auth route menjadi pintu masuk user ke sistem.",
          "Internal route terbagi berdasarkan role: /admin, /lead, /member.",
        ],
      },
      {
        title: "Lead vs member surface",
        status: "Verified",
        steps: [
          "Lead memiliki akses tambahan ke pengelolaan blog, anggota tim, profile tim, dan ticketing support.",
          "Member fokus pada dashboard, chat, finance, productivity, media, dan profile pribadi.",
          "Sidebar lead/member juga difilter oleh permission tertentu untuk modul finance/productivity/media.",
        ],
      },
    ],
    dependencies: [
      "App Router folder structure.",
      "AuthProvider dan auth-store untuk redirect role.",
      "Sidebar components untuk menu yang tampil.",
      "Backend endpoints yang dipanggil masing-masing page.",
    ],
    sensitiveAreas: [
      {
        title: "Route exception di admin",
        detail:
          "Admin layout memiliki pengecualian khusus untuk /admin/media saat mengecek role, sehingga perubahan di area ini harus dilakukan dengan sadar dan terdokumentasi.",
        status: "Verified",
      },
      {
        title: "Permission-filtered sidebar",
        detail:
          "Perubahan permission backend dapat membuat menu lead/member hilang atau muncul tanpa perubahan file route itu sendiri.",
        status: "Verified",
      },
      {
        title: "Route tree dan content parity",
        detail:
          "Keberadaan route editor admin tidak selalu berarti halaman publik yang bersangkutan sudah benar-benar consume datanya.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Saat menambah halaman baru, tentukan dulu surface yang tepat: marketing, auth, admin, lead, atau member.",
      "Jika menambah feature untuk lead/member, tambahkan juga dokumentasi permission yang dibutuhkan bila sidebar memfilter access.",
      "Jangan mengandalkan hanya route existence; verifikasi juga sidebar, redirect, dan backend API consumer-nya.",
    ],
    validationChecklist: [
      "Klik semua menu utama di sidebar role yang relevan setelah perubahan route/menu.",
      "Pastikan redirect root /lead dan /member tetap menuju dashboard.",
      "Tes satu user lead dan satu user member untuk memastikan permission-filtered menu tetap benar.",
    ],
    affectedSurfaces: [
      "Frontend/src/app/(marketing)/**/*",
      "Frontend/src/app/(auth)/**/*",
      "Frontend/src/app/admin/**/*",
      "Frontend/src/app/lead/**/*",
      "Frontend/src/app/member/**/*",
      "Frontend/src/components/layout/*",
    ],
    relatedPageIds: [
      "frontend/providers-stores-api",
      "backend/api-surface",
      "operations/superadmin-handbook",
      "database/users-teams",
    ],
  },
{
    id: "frontend/providers-stores-api",
    slug: ["frontend", "providers-stores-api"],
    category: "frontend",
    title: "Providers, Stores & API Layer",
    summary:
      "Dokumentasi provider global, auth store, axios client, React Query, SSE hook, dan bagaimana frontend berkomunikasi dengan backend Laravel.",
    audience: ["Frontend Developer", "Full-stack Developer"],
    overallStatus: "Verified",
    statusNote:
      "Provider global, auth-store, axios instance, dan SSE client dapat diverifikasi langsung dari file frontend yang dibaca.",
    facts: [
      { label: "Global Query Client", value: "staleTime 60s, retry 1" },
      { label: "Auth State", value: "Zustand + localStorage token" },
      { label: "API Base", value: "NEXT_PUBLIC_API_URL || http://localhost:8000/api" },
      { label: "401 Handling", value: "clear token + redirect /login" },
    ],
    responsibilities: [
      "Menjelaskan state auth frontend dan bagaimana token dipersist.",
      "Menjelaskan pola fetch/mutation utama yang dipakai screen frontend.",
      "Menjelaskan hubungan antara axios, React Query, SSE, dan Echo/Pusher consumer.",
    ],
    keyFiles: [
      {
        path: "Frontend/src/providers/query-provider.tsx",
        note: "QueryClientProvider global dan default options queries.",
        status: "Verified",
      },
      {
        path: "Frontend/src/providers/auth-provider.tsx",
        note: "Bootstrap auth state, call /me, redirect login, dan handling load state.",
        status: "Verified",
      },
      {
        path: "Frontend/src/stores/auth-store.ts",
        note: "Token, user, impersonator, originalToken, loading state.",
        status: "Verified",
      },
      {
        path: "Frontend/src/lib/api.ts",
        note: "Axios instance utama yang dipakai screen-screen frontend.",
        status: "Verified",
      },
      {
        path: "Frontend/src/lib/api-client.ts",
        note: "Wrapper typed API tersedia tetapi tampak belum menjadi abstraction utama yang dipakai layar.",
        status: "Verified",
      },
      {
        path: "Frontend/src/hooks/use-sse.ts",
        note: "SSE client dengan reconnect exponential backoff.",
        status: "Verified",
      },
      { path: "Frontend/src/lib/echo.ts", note: "Echo client untuk channel auth Pusher.", status: "Verified" },
    ],
    flows: [
      {
        title: "Auth bootstrap",
        status: "Verified",
        steps: [
          "Token dibaca dari localStorage ke Zustand store saat bootstrap client.",
          "Jika token ada tapi user belum ada, AuthProvider memanggil /me ke backend.",
          "Bila /me gagal atau 401, frontend menghapus token dan mendorong user ke /login.",
        ],
      },
      {
        title: "API consumption pattern",
        status: "Verified",
        steps: [
          "Mayoritas layar frontend memanggil backend langsung lewat import api dari src/lib/api.ts.",
          "Typed wrapper di api-client.ts tersedia, tetapi consumer utamanya belum tampak menjadi pola dominan.",
          "SSE dan Echo menjadi jalur data near real-time yang terpisah dari React Query polling atau refetch biasa.",
        ],
      },
    ],
    dependencies: [
      "Zustand auth-store.",
      "localStorage browser.",
      "React Query provider.",
      "Backend endpoint /me dan protected APIs.",
      "NEXT_PUBLIC_API_URL dan NEXT_PUBLIC_PUSHER_*.",
    ],
    sensitiveAreas: [
      {
        title: "Token di localStorage",
        detail:
          "Token auth frontend dipersist di localStorage sehingga security review harus memperhatikan XSS risk dan logout flow.",
        status: "Verified",
      },
      {
        title: "401 interceptor sangat global",
        detail: "Perubahan kecil di axios interceptor dapat memutus hampir seluruh experience login/protected request.",
        status: "Verified",
      },
      {
        title: "SSE typed events masih longgar",
        detail:
          "useSSE memakai data:any untuk payload event, jadi perubahan event shape backend perlu diaudit manual di consumer frontend.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah auth bootstrap, uji login normal, refresh halaman, impersonation, dan logout.",
      "Jika memperkenalkan typed API client sebagai pola utama, migrasikan consumer secara bertahap dan dokumentasikan perubahan kontrak.",
      "Jika mengubah SSE/Echo setup, uji admin stats, notifications, dan chat flow secara terpisah.",
    ],
    validationChecklist: [
      "Refresh browser setelah login untuk memastikan token persistence tetap bekerja.",
      "Tes 401 path dengan token invalid/expired.",
      "Tes event SSE yang dipakai dashboard admin atau notification dropdown.",
    ],
    affectedSurfaces: [
      "Frontend/src/providers/query-provider.tsx",
      "Frontend/src/providers/auth-provider.tsx",
      "Frontend/src/stores/auth-store.ts",
      "Frontend/src/lib/api.ts",
      "Frontend/src/lib/api-client.ts",
      "Frontend/src/hooks/use-sse.ts",
      "Frontend/src/lib/echo.ts",
    ],
    relatedPageIds: [
      "backend/auth-rbac",
      "frontend/routes-role-surfaces",
      "architecture/integrations-realtime",
      "operations/email-notifications-support",
    ],
  },
{
    id: "frontend/theme-design-system",
    slug: ["frontend", "theme-design-system"],
    category: "frontend",
    title: "Theme & Design System",
    summary:
      "Dokumentasi sistem visual frontend: global CSS variables, OKLCH color tokens, shadcn-style configuration, font, radius, sidebar tokens, dan komponen UI reusable.",
    audience: ["Frontend Developer", "Designer"],
    overallStatus: "Verified",
    statusNote:
      "Token tema global, components.json, font setup, dan library UI reusable dapat diverifikasi langsung dari source frontend.",
    facts: [
      { label: "Design Basis", value: "shadcn/ui style new-york" },
      { label: "Base Color", value: "slate" },
      { label: "Token Format", value: "CSS variables + OKLCH" },
      { label: "Font", value: "Geist + Geist Mono" },
    ],
    responsibilities: [
      "Menjelaskan fondasi visual yang dipakai seluruh aplikasi frontend.",
      "Membantu tim memahami mana token global, mana utility helper, dan mana komponen reusable.",
      "Menjadi panduan saat ingin memperluas tema, brand, atau primitive UI secara konsisten.",
    ],
    keyFiles: [
      {
        path: "Frontend/src/app/globals.css",
        note: "Sumber utama token warna, radius, sidebar, chart, button sizing, dan dark token base.",
        status: "Verified",
      },
      {
        path: "Frontend/components.json",
        note: "Konfigurasi shadcn-style UI, aliases, baseColor, dan CSS variables mode.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/layout.tsx",
        note: "Pemasangan font Geist dan Geist Mono ke CSS variables body.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/ui",
        note: "Library komponen reusable seperti button, card, form, dialog, sidebar, tabs, accordion, dsb.",
        status: "Verified",
      },
      {
        path: "Frontend/src/lib/colors.ts",
        note: "Palette helper untuk semantic color themes di UI tertentu.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/ui/sidebar.tsx",
        note: "Primitive sidebar dengan cookie persistence dan shortcut keyboard.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Theme token layering",
        status: "Verified",
        steps: [
          "globals.css mendefinisikan token dasar untuk light dan dark via CSS variables.",
          "@theme inline memetakan token itu ke color/radius variables yang dipakai utility classes.",
          "Komponen UI di src/components/ui memakai token ini melalui className, CVA, dan cn helper.",
        ],
      },
      {
        title: "Brand-driven surfaces",
        status: "Partial",
        steps: [
          "Sidebar admin dan app sidebar membaca site_name/logo_url dari platform settings.",
          "Sebagian marketing surface tetap tampak memakai styling dan konten statis tertentu, sehingga tidak semua presentasi visual sepenuhnya dikendalikan settings platform.",
        ],
      },
    ],
    dependencies: [
      "Tailwind CSS v4.",
      "tailwindcss-animate.",
      "shadcn-style component primitives.",
      "Font Geist dari next/font/google.",
    ],
    sensitiveAreas: [
      {
        title: "Global CSS token changes bersifat luas",
        detail:
          "Mengubah primary, border, radius, atau sidebar tokens akan memengaruhi hampir semua permukaan UI sekaligus.",
        status: "Verified",
      },
      {
        title: "Dark mode runtime belum sepenuhnya dibuktikan aktif",
        detail:
          "Token .dark tersedia, tetapi pemasangan runtime ThemeProvider global belum terbaca di root layout saat audit ini.",
        status: "Partial",
      },
      {
        title: "Button sizing tokens digunakan lintas UI",
        detail:
          "Perubahan ukuran default button dapat mengubah density dan layout banyak halaman tanpa perubahan component-level code lain.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Mulai perubahan tema dari token global, lalu cek komponen reusable paling umum seperti button, card, input, sidebar, badge, tabs.",
      "Jika menambah token baru, dokumentasikan apakah token itu global, semantic helper, atau hanya utility lokal.",
      "Jangan mengubah dark token dengan asumsi dark mode aktif penuh tanpa memverifikasi runtime provider atau switch mechanism.",
    ],
    validationChecklist: [
      "Buka admin, lead/member, auth, dan beberapa marketing page setelah mengubah globals.css.",
      "Tes komponen UI utama: button, card, form, dialog, sidebar, badge, tabs, accordion.",
      "Jika menyentuh dark mode, verifikasi ada/tidaknya theme switching nyata di runtime terlebih dahulu.",
    ],
    affectedSurfaces: [
      "Frontend/src/app/globals.css",
      "Frontend/components.json",
      "Frontend/src/components/ui/*",
      "Frontend/src/components/layout/*",
      "Frontend/src/lib/colors.ts",
    ],
    relatedPageIds: [
      "frontend/motion-interactions",
      "frontend/overview",
      "operations/settings-environment",
      "reference/glossary",
    ],
  },
{
    id: "frontend/motion-interactions",
    slug: ["frontend", "motion-interactions"],
    category: "frontend",
    title: "Motion & Interaction",
    summary:
      "Dokumentasi token motion, penggunaan animasi di frontend, dan status adopsi antara token terpusat vs animasi lokal per halaman/komponen.",
    audience: ["Frontend Developer", "Designer"],
    overallStatus: "Partial",
    statusNote:
      "Token motion terpusat memang ada di src/lib/motion-tokens.ts, tetapi tingkat adopsinya di seluruh permukaan UI belum sepenuhnya seragam dan perlu diverifikasi per halaman penting.",
    facts: [
      { label: "Motion Library", value: "motion/react + framer-motion" },
      { label: "Token File", value: "src/lib/motion-tokens.ts" },
      { label: "Viewport Token", value: "once=true, margin=-10%" },
      { label: "Interaction Scale", value: "hover 1.02, press 0.98" },
    ],
    responsibilities: [
      "Menjelaskan token motion terpusat yang sudah ada.",
      "Membantu tim membedakan animasi yang telah ditokenisasi vs animasi yang masih hardcoded lokal.",
      "Menjadi referensi saat ingin menstandarkan motion lintas landing/admin/app UI.",
    ],
    keyFiles: [
      {
        path: "Frontend/src/lib/motion-tokens.ts",
        note: "Token spring, duration, stagger, viewport, dan interaction scale.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/marketing/hero-section.tsx",
        note: "Contoh pemakaian motion pada marketing/landing surfaces; audit lokal tetap diperlukan bila ingin standardisasi penuh.",
        status: "Partial",
      },
      { path: "Frontend/src/app/error.tsx", note: "Menggunakan framer-motion di error UI.", status: "Verified" },
      {
        path: "Frontend/src/app/not-found.tsx",
        note: "Menggunakan framer-motion di not-found UI.",
        status: "Verified",
      },
      {
        path: "Frontend/package.json",
        note: "Memuat dependency motion dan framer-motion yang sama-sama tersedia di repo.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Motion token availability",
        status: "Verified",
        steps: [
          "Token motion disediakan di src/lib/motion-tokens.ts.",
          "Token mencakup spring presets, duration presets, stagger, viewport, dan scale interactions.",
          "File ini menunjukkan niat untuk standardisasi motion lintas UI.",
        ],
      },
      {
        title: "Motion adoption reality",
        status: "Partial",
        steps: [
          "Sebagian animasi menggunakan token atau abstraction motion tersendiri.",
          "Sebagian animasi lain masih berpotensi hardcoded lokal pada marketing sections atau special pages.",
          "Karena itu docs harus jujur bahwa standardisasi motion belum tentu menyeluruh di semua halaman.",
        ],
      },
    ],
    dependencies: ["motion/react.", "framer-motion.", "Global theme tokens untuk transform/scale context UI."],
    sensitiveAreas: [
      {
        title: "Dua library motion tersedia",
        detail:
          "Kehadiran motion/react dan framer-motion sekaligus dapat membuat style animasi tidak konsisten bila tidak ada aturan penggunaan yang jelas.",
        status: "Verified",
      },
      {
        title: "Adopsi token belum seragam",
        detail: "Jangan mengasumsikan semua easing/duration di aplikasi sudah ditarik dari motion-tokens.ts.",
        status: "Partial",
      },
      {
        title: "Animasi marketing vs app shell",
        detail:
          "Surface marketing dan internal app bisa punya karakter motion yang berbeda, sehingga standardisasi harus mempertimbangkan konteks UX masing-masing.",
        status: "Inferred",
      },
    ],
    safeChangeGuide: [
      "Jika ingin standardisasi motion, mulai dari komponen yang paling banyak digunakan atau surface yang paling terlihat.",
      "Dokumentasikan kapan memakai token global dan kapan local variants masih diperbolehkan.",
      "Tes performa dan readability UI setelah mengubah spring/duration defaults.",
    ],
    validationChecklist: [
      "Tes marketing hero/sections yang memakai motion.",
      "Tes error/not-found screens jika menyentuh framer-motion usage.",
      "Verifikasi tidak ada regressions interaksi hover/press pada komponen utama.",
    ],
    affectedSurfaces: [
      "Frontend/src/lib/motion-tokens.ts",
      "Frontend/src/components/marketing/*",
      "Frontend/src/app/error.tsx",
      "Frontend/src/app/not-found.tsx",
    ],
    relatedPageIds: [
      "frontend/theme-design-system",
      "frontend/overview",
      "architecture/system-landscape",
      "reference/architecture-decisions",
    ],
  }
];