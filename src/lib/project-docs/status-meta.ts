import { ProjectDocStatus } from "./types";

export const projectDocStatusMeta: Record<ProjectDocStatus, { label: string; className: string; description: string }> =
  {
    Verified: {
      label: "Verified",
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      description: "Terlihat jelas di file, route, config, migration, atau struktur codebase yang terbaca.",
    },
    Inferred: {
      label: "Inferred",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
      description: "Disimpulkan dari struktur kode atau hubungan antarmodul, tetapi tidak selalu dinyatakan eksplisit.",
    },
    Partial: {
      label: "Partial",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      description:
        "Ada implementasi atau petunjuk yang nyata, tetapi belum sepenuhnya konsisten atau belum sepenuhnya terverifikasi.",
    },
    "Needs verification": {
      label: "Needs verification",
      className: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
      description: "Area ini perlu validasi lanjutan sebelum dianggap final sebagai sumber kebenaran operasional.",
    },
  };