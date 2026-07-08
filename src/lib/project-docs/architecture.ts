import { ProjectDocPage } from "./types";

export const architecturePages: ProjectDocPage[] = [
{
    id: "architecture/system-landscape",
    slug: ["architecture", "system-landscape"],
    category: "architecture",
    title: "System Landscape",
    summary:
      "Peta besar TeamVora: workspace utama, peran aplikasi, batas antara docs pengguna vs docs internal, dan bagaimana request bergerak dari frontend ke backend.",
    audience: ["Super Admin", "Developer", "QA", "PM"],
    overallStatus: "Verified",
    statusNote:
      "Struktur repo, layout aplikasi, dan pemisahan area admin/lead/member terlihat jelas dari route, package manifest, dan folder workspace yang ada saat ini.",
    facts: [
      { label: "Workspace", value: "Backend, Frontend, docs, docs-teamvora" },
      { label: "Backend Stack", value: "Laravel 13 API backend" },
      { label: "Frontend Stack", value: "Next.js 16 App Router" },
      { label: "Internal Docs Home", value: "/admin/project-docs" },
    ],
    responsibilities: [
      "Menjelaskan batas antara backend API, frontend aplikasi utama, docs internal, dan docs pengguna.",
      "Menetapkan bahwa docs internal dipakai oleh superadmin dan tim internal, sedangkan docs-teamvora dipakai pengguna akhir.",
      "Menjelaskan permukaan aplikasi publik, auth, admin, lead, dan member sebelum pembaca masuk ke modul yang lebih spesifik.",
    ],
    keyFiles: [
      {
        path: "Backend/composer.json",
        note: "Mendefinisikan stack backend Laravel, Sanctum, Spatie Permission, dan activity log.",
        status: "Verified",
      },
      {
        path: "Backend/bootstrap/app.php",
        note: "Mendaftarkan routing API, console, channels, serta alias middleware permission/role.",
        status: "Verified",
      },
      {
        path: "Frontend/package.json",
        note: "Mendefinisikan stack frontend Next.js, React Query, Zustand, Tailwind, Echo, dan komponen UI.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/layout.tsx",
        note: "Root app frontend: font, query provider, toaster, dan metadata global.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/admin/layout.tsx",
        note: "Gerbang area superadmin dan integrasi AuthProvider + AdminLayout.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/layout/admin-sidebar.tsx",
        note: "Menunjukkan scope menu superadmin, termasuk docs internal.",
        status: "Verified",
      },
      {
        path: "docs-teamvora/README.md",
        note: "Menandai keberadaan workspace docs terpisah untuk end-user, bukan docs internal project.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Permukaan sistem TeamVora",
        status: "Verified",
        steps: [
          "Pengguna publik masuk lewat route marketing seperti /, /fitur, /blog, /panduan, /kontak, dan halaman legal.",
          "Pengguna terautentikasi masuk lewat flow auth di frontend, lalu diarahkan ke /admin, /lead, atau /member berdasarkan role.",
          "Frontend memanggil backend Laravel melalui API HTTP eksternal, bukan melalui Next route handlers.",
          "Docs internal hidup di area superadmin agar tetap dekat dengan konteks operasional platform.",
        ],
      },
      {
        title: "Batas dokumentasi",
        status: "Verified",
        steps: [
          "Docs pengguna menjelaskan cara memakai produk dari perspektif member/team leader/end-user.",
          "Docs project internal menjelaskan arsitektur, database, konfigurasi, integrasi, dan cara mengubah sistem dengan aman.",
          "Kedua permukaan docs sengaja dipisah supaya bahasa, detail, dan sensitivitas informasinya tidak bercampur.",
        ],
      },
    ],
    dependencies: [
      "Backend Laravel 13 API di workspace Backend.",
      "Frontend Next.js App Router di workspace Frontend.",
      "Role model super_admin, team_leader, member.",
      "Docs pengguna terpisah di workspace docs-teamvora.",
    ],
    sensitiveAreas: [
      {
        title: "Campur aduk docs internal dan docs pengguna",
        detail:
          "Jika arsitektur, env, atau operasi platform dibawa ke docs pengguna, informasi akan menjadi terlalu teknis atau sensitif untuk audiens luar.",
        status: "Verified",
      },
      {
        title: "Asumsi bahwa repo hanya punya satu aplikasi",
        detail:
          "TeamVora sebenarnya memiliki backend, frontend utama, dan docs end-user sebagai permukaan yang berbeda dengan kebutuhan dokumentasi berbeda.",
        status: "Verified",
      },
      {
        title: "Menganggap semua area produk sudah data-driven",
        detail:
          "Sebagian marketing/public surface masih tampak statis, sehingga docs harus membedakan yang benar-benar runtime-driven dan yang masih hardcoded.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Saat menambah modul baru, tentukan dulu apakah modul itu milik backend, frontend, operasi platform, atau docs pengguna.",
      "Jangan menempatkan internal handbook di docs-teamvora; tempatkan di area superadmin dan tautkan dari sidebar admin bila relevan.",
      "Jika mengubah permukaan role, verifikasi layout, redirect auth, menu sidebar, dan endpoint backend yang menjadi dependensi.",
    ],
    validationChecklist: [
      "Pastikan route /admin/project-docs tetap hanya muncul di area superadmin.",
      "Pastikan sidebar admin masih menampilkan link terpisah untuk docs internal dan docs pengguna.",
      "Verifikasi bahwa perubahan dokumentasi tidak mengganggu route marketing atau docs-teamvora.",
    ],
    affectedSurfaces: [
      "Frontend/src/app/(marketing)",
      "Frontend/src/app/(auth)",
      "Frontend/src/app/admin",
      "Frontend/src/app/lead",
      "Frontend/src/app/member",
      "docs-teamvora",
    ],
    relatedPageIds: [
      "architecture/integrations-realtime",
      "frontend/routes-role-surfaces",
      "operations/superadmin-handbook",
      "reference/architecture-decisions",
    ],
  },
{
    id: "architecture/integrations-realtime",
    slug: ["architecture", "integrations-realtime"],
    category: "architecture",
    title: "Integrations & Realtime",
    summary:
      "Dokumentasi integrasi lintas sistem: database runtime, storage R2, email SMTP, SSE, Echo/Pusher, scheduler, dan area yang perlu verifikasi lanjutan.",
    audience: ["Developer", "Super Admin", "DevOps/Operator"],
    overallStatus: "Partial",
    statusNote:
      "Sebagian integrasi terlihat jelas dari config dan file kode, tetapi aktivasi broadcaster realtime penuh masih parsial karena runtime backend saat ini memakai broadcaster log.",
    facts: [
      { label: "Database Runtime", value: "PostgreSQL (pgsql)" },
      { label: "Storage Runtime", value: "Cloudflare R2" },
      { label: "Mail Runtime", value: "SMTP" },
      { label: "Broadcast Runtime", value: "log (bukan provider realtime network)" },
    ],
    responsibilities: [
      "Menjelaskan layanan eksternal dan semi-eksternal yang dipakai TeamVora saat runtime.",
      "Membedakan integrasi yang benar-benar aktif dari integrasi yang hanya tersedia sebagai dependency atau opsi config.",
      "Menandai area partial seperti Echo/Pusher atau push setup yang butuh validasi deployment lebih lanjut.",
    ],
    keyFiles: [
      {
        path: "Backend/config/database.php",
        note: "Daftar driver DB yang didukung dan konfigurasi Redis.",
        status: "Verified",
      },
      {
        path: "Backend/config/filesystems.php",
        note: "Menjelaskan disk local/public/s3/r2 dan menunjukkan R2 sebagai disk S3-compatible.",
        status: "Verified",
      },
      {
        path: "Backend/config/mail.php",
        note: "Menjelaskan mailer yang tersedia dan struktur pengiriman email.",
        status: "Verified",
      },
      {
        path: "Backend/config/broadcasting.php",
        note: "Config broadcaster backend saat ini hanya menyediakan log dan null.",
        status: "Verified",
      },
      {
        path: "Backend/routes/console.php",
        note: "Mendaftarkan recurring bill generation, reminder bill items, dan cleanup chat messages.",
        status: "Verified",
      },
      {
        path: "Frontend/src/hooks/use-sse.ts",
        note: "Hook SSE frontend yang menyambung ke /api/events/stream menggunakan token query string.",
        status: "Verified",
      },
      {
        path: "Frontend/src/lib/echo.ts",
        note: "Inisialisasi Echo/Pusher dari sisi frontend memakai env NEXT_PUBLIC_PUSHER_*.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/push-notification-setup.tsx",
        note: "Hook-up push notification frontend; perlu audit lanjutan bila mau dipakai sebagai source of truth deployment.",
        status: "Partial",
      },
    ],
    flows: [
      {
        title: "Upload file ke R2",
        status: "Verified",
        steps: [
          "Frontend mengirim FormData ke backend untuk avatar, team logo, media, attachment, featured image, atau file support.",
          "Backend menghapus Content-Type manual pada axios request frontend agar boundary multipart ditetapkan browser.",
          "Backend menyimpan file ke disk r2 melalui storage backend dan mengembalikan URL/path yang dipakai frontend.",
        ],
      },
      {
        title: "Realtime dan sinkronisasi event",
        status: "Partial",
        steps: [
          "Frontend membuka SSE ke /api/events/stream?token=... untuk connected, notification, team_updated, heartbeat, dan admin_stats.",
          "Frontend juga memiliki client Echo/Pusher untuk auth channel broadcast chat.",
          "Backend memiliki event MessageSent dan channel conversation.{id}, tetapi config broadcaster backend runtime saat ini masih log, sehingga realtime network penuh perlu diverifikasi ulang.",
        ],
      },
    ],
    dependencies: [
      "PostgreSQL untuk data operasional runtime.",
      "Cloudflare R2 melalui disk r2 backend.",
      "SMTP mailer untuk invitation, reset password, dan test email platform.",
      "Laravel scheduler untuk recurring finance dan cleanup chat retention.",
      "Env NEXT_PUBLIC_API_URL dan NEXT_PUBLIC_PUSHER_* di frontend.",
    ],
    sensitiveAreas: [
      {
        title: "SSE token di query string",
        detail:
          "Token SSE dibawa sebagai query parameter sehingga perlu perhatian ekstra pada logging, browser history, dan reverse proxy.",
        status: "Verified",
      },
      {
        title: "Mismatch broadcaster",
        detail:
          "Frontend siap untuk Pusher/Echo, tetapi backend config broadcaster yang terbaca saat ini masih log/null, sehingga perilaku realtime produksi tidak boleh diasumsikan tanpa validasi deployment.",
        status: "Verified",
      },
      {
        title: "Push notification setup",
        detail:
          "Konfigurasi push notification frontend perlu diaudit lagi bila akan dijadikan dokumentasi operasional final, karena implementasi deployment tidak sepenuhnya diverifikasi di audit ini.",
        status: "Partial",
      },
      {
        title: "Cleanup chat retention",
        detail:
          "Chat message dan lampiran yang lebih tua dari 7 hari dibersihkan scheduler, sehingga jangan menganggap chat storage sebagai arsip jangka panjang.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Sebelum mengubah provider realtime, cek kedua sisi: backend broadcaster config dan frontend Echo/SSE consumer.",
      "Jika mengubah storage file, audit semua controller upload dan semua komponen yang mengonsumsi URL/file_path.",
      "Jika mengubah email runtime, uji test-email admin, invitation flow, dan forgot/reset password setelah perubahan.",
    ],
    validationChecklist: [
      "Uji upload media, avatar, dan blog image setelah perubahan storage.",
      "Uji SSE untuk notification/admin_stats bila menyentuh endpoint stream atau auth.",
      "Uji invitation email, forgot password, dan test email dari admin setelah menyentuh mail config.",
    ],
    affectedSurfaces: [
      "Backend/config/filesystems.php",
      "Backend/config/mail.php",
      "Backend/config/broadcasting.php",
      "Backend/routes/console.php",
      "Frontend/src/hooks/use-sse.ts",
      "Frontend/src/lib/echo.ts",
    ],
    relatedPageIds: [
      "backend/config-integrations",
      "backend/jobs-realtime-storage",
      "operations/media-storage",
      "operations/email-notifications-support",
    ],
  }
];