import { BookOpen, Database, FolderKanban, Layers3, Server, Wrench } from "lucide-react";
import { ProjectDocCategory } from "./types";

export const projectDocCategories: ProjectDocCategory[] = [
  {
    slug: "architecture",
    title: "Architecture",
    description: "Peta sistem tingkat tinggi, batas antara workspace, dan integrasi penting yang membentuk TeamVora.",
    icon: Layers3,
    pageIds: ["architecture/system-landscape", "architecture/integrations-realtime"],
  },
  {
    slug: "backend",
    title: "Backend",
    description:
      "Dokumentasi Laravel API, auth, RBAC, config, integrasi backend, scheduler, storage, dan realtime backend.",
    icon: Server,
    pageIds: [
      "backend/overview",
      "backend/api-surface",
      "backend/auth-rbac",
      "backend/config-integrations",
      "backend/jobs-realtime-storage",
    ],
  },
  {
    slug: "frontend",
    title: "Frontend",
    description:
      "Dokumentasi Next.js App Router, role surfaces, providers, stores, API layer, theme system, dan motion UI.",
    icon: FolderKanban,
    pageIds: [
      "frontend/overview",
      "frontend/routes-role-surfaces",
      "frontend/providers-stores-api",
      "frontend/theme-design-system",
      "frontend/motion-interactions",
    ],
  },
  {
    slug: "database",
    title: "Database",
    description:
      "Peta database runtime, relasi schema, dan dokumentasi domain per tabel: users, teams, finance, productivity, content, media, support.",
    icon: Database,
    pageIds: [
      "database/overview",
      "database/schema-map",
      "database/users-teams",
      "database/finance",
      "database/productivity",
      "database/content-media-support",
    ],
  },
  {
    slug: "operations",
    title: "Operations",
    description:
      "Panduan kerja superadmin, pengaturan sensitif, storage/media, email, notifikasi, dan support workflow.",
    icon: Wrench,
    pageIds: [
      "operations/superadmin-handbook",
      "operations/settings-environment",
      "operations/media-storage",
      "operations/email-notifications-support",
    ],
  },
  {
    slug: "reference",
    title: "Reference",
    description:
      "Bahasa bersama dan keputusan arsitektur yang perlu diingat saat mengubah sistem atau memperluas dokumentasi.",
    icon: BookOpen,
    pageIds: ["reference/glossary", "reference/architecture-decisions"],
  },
];