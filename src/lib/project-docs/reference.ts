import { ProjectDocPage } from "./types";

export const referencePages: ProjectDocPage[] = [
{
    id: "reference/glossary",
    slug: ["reference", "glossary"],
    category: "reference",
    title: "Glossary",
    summary:
      "Bahasa bersama untuk tim internal TeamVora agar istilah docs, issue, review, dan operasi platform tetap konsisten.",
    audience: ["Semua Tim Internal"],
    overallStatus: "Verified",
    statusNote:
      "Glosarium ini diturunkan dari struktur codebase, role model, dan keputusan dokumentasi yang sudah disepakati selama sesi ini.",
    facts: [
      { label: "Primary Source", value: "TeamVora/CONTEXT.md" },
      { label: "Focus", value: "Istilah project-specific, bukan jargon generik pemrograman" },
      { label: "Docs Separation", value: "Docs Pengguna vs Dokumentasi Project" },
      { label: "Status Vocabulary", value: "Verified, Inferred, Partial, Needs verification" },
    ],
    responsibilities: [
      "Menyamakan istilah yang dipakai lintas developer, QA, support, dan superadmin.",
      "Mencegah istilah docs internal bercampur dengan istilah docs pengguna.",
      "Menjadi referensi saat menulis halaman docs baru, issue, atau PR yang menyentuh domain penting TeamVora.",
    ],
    keyFiles: [
      {
        path: "CONTEXT.md",
        note: "Sumber glosarium internal proyek yang diperbarui selama sesi ini.",
        status: "Verified",
      },
      {
        path: "Frontend/src/lib/project-docs.ts",
        note: "Data docs internal yang memakai bahasa dan status vocabulary yang sama.",
        status: "Verified",
      },
      {
        path: "Backend/app/Models",
        note: "Sumber istilah domain bisnis seperti Team, SplitBill, DailyLog, TeamInvitation, Ticket, TeamMedia.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Cara memakai glossary",
        status: "Verified",
        steps: [
          "Gunakan istilah project-specific yang ada di CONTEXT.md ketika menulis issue, docs, atau komentar desain.",
          "Jika ada istilah baru yang tampaknya penting dan spesifik untuk TeamVora, tambahkan ke CONTEXT.md sebelum istilah itu menyebar secara liar.",
          "Jika istilah bertabrakan dengan implementasi aktual di codebase, prioritaskan klarifikasi sebelum dokumentasi diperluas.",
        ],
      },
    ],
    dependencies: [
      "CONTEXT.md di root project.",
      "Page-page docs internal lain.",
      "Model/backend/frontend domain terminology.",
    ],
    sensitiveAreas: [
      {
        title: "Dokumentasi Project vs Docs Pengguna",
        detail: "Kedua istilah ini sengaja dibedakan dan tidak boleh dipakai saling menggantikan.",
        status: "Verified",
      },
      {
        title: "Role labels",
        detail:
          "Super Admin, Team Leader, dan Member harus dipakai konsisten karena berhubungan langsung dengan route surface, permission, dan operasi sistem.",
        status: "Verified",
      },
      {
        title: "Status labels",
        detail:
          "Verified/Inferred/Partial/Needs verification adalah vocabulary dokumentasi internal, bukan status bisnis domain aplikasi.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Tambah istilah baru hanya jika benar-benar project-specific dan punya arti yang stabil.",
      "Jangan masukkan jargon umum pemrograman ke glossary kecuali punya makna khusus di TeamVora.",
      "Jika istilah di codebase dan istilah docs tidak sejalan, selesaikan konflik bahasa itu lebih dulu.",
    ],
    validationChecklist: [
      "Pastikan istilah baru benar-benar punya arti khusus untuk TeamVora.",
      "Perbarui CONTEXT.md saat istilah baru disepakati.",
      "Sinkronkan wording docs terkait bila ada istilah yang diganti.",
    ],
    affectedSurfaces: ["CONTEXT.md", "Frontend/src/lib/project-docs.ts", "docs/adr/*.md"],
    relatedPageIds: [
      "reference/architecture-decisions",
      "architecture/system-landscape",
      "backend/auth-rbac",
      "operations/superadmin-handbook",
    ],
  },
{
    id: "reference/architecture-decisions",
    slug: ["reference", "architecture-decisions"],
    category: "reference",
    title: "Architecture Decisions",
    summary:
      "Catatan keputusan arsitektural yang sengaja direkam supaya tim berikutnya memahami mengapa bentuk dokumentasi dan batasannya dibuat seperti sekarang.",
    audience: ["Developer", "Tech Lead", "Super Admin"],
    overallStatus: "Verified",
    statusNote:
      "Saat ini repo sudah memiliki ADR 0001 yang merekam pemisahan docs internal project dari docs pengguna dan alasan membangun docs internal di area superadmin.",
    facts: [
      { label: "ADR Directory", value: "docs/adr" },
      { label: "Current ADR", value: "0001-separate-internal-project-docs-from-user-docs" },
      { label: "Decision Scope", value: "Documentation architecture" },
      { label: "When to Add ADR", value: "Hard to reverse, surprising, and trade-off driven" },
    ],
    responsibilities: [
      "Menjadi indeks keputusan arsitektural yang perlu diingat saat sistem dan docs berkembang.",
      "Mengingatkan tim kapan ADR layak dibuat dan kapan tidak perlu.",
      "Menjaga konteks mengapa docs internal dipisah dari docs pengguna dan ditempatkan di superadmin.",
    ],
    keyFiles: [
      {
        path: "docs/adr/0001-separate-internal-project-docs-from-user-docs.md",
        note: "ADR pertama yang merekam pemisahan docs internal vs docs pengguna.",
        status: "Verified",
      },
      {
        path: "CONTEXT.md",
        note: "Bahasa dan scope docs yang mendukung keputusan arsitektur dokumentasi.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/admin/project-docs/**/*",
        note: "Implementasi docs internal di area superadmin.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Kapan menambah ADR",
        status: "Verified",
        steps: [
          "Keputusan harus sulit dibalik, cukup mengejutkan bila tidak dijelaskan, dan lahir dari trade-off nyata.",
          "Jika salah satu syarat itu tidak ada, lebih baik dokumentasikan di docs biasa atau CONTEXT.md saja.",
        ],
      },
    ],
    dependencies: ["docs/adr directory.", "Root CONTEXT.md.", "Internal docs hub di /admin/project-docs."],
    sensitiveAreas: [
      {
        title: "ADR inflation",
        detail: "Terlalu banyak ADR untuk keputusan kecil justru membuat konteks penting tenggelam dan sulit dicari.",
        status: "Inferred",
      },
      {
        title: "Missing context for surprising choices",
        detail:
          "Jika keputusan besar seperti boundary docs, auth strategy, atau integration lock-in tidak direkam, engineer berikutnya cenderung mencoba 'membetulkan' sesuatu yang sebenarnya disengaja.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Saat menemukan keputusan yang besar dan sulit dibalik, pertimbangkan ADR baru di docs/adr.",
      "Gunakan judul ADR yang singkat dan langsung menyebut keputusan utamanya.",
      "Tautkan ADR dari docs internal bila keputusan itu penting untuk memahami module/page tertentu.",
    ],
    validationChecklist: [
      "Pastikan ADR baru memang memenuhi syarat hard-to-reverse + surprising + trade-off.",
      "Pastikan nomor file ADR berurutan.",
      "Sinkronkan docs internal dan CONTEXT.md bila ADR baru mempengaruhi vocabulary atau boundary sistem.",
    ],
    affectedSurfaces: ["docs/adr/*", "CONTEXT.md", "Frontend/src/app/admin/project-docs/**/*"],
    relatedPageIds: [
      "reference/glossary",
      "architecture/system-landscape",
      "frontend/motion-interactions",
      "database/overview",
    ],
  }
];