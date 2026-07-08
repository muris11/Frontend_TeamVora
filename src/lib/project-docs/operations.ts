import { ProjectDocPage } from "./types";

export const operationsPages: ProjectDocPage[] = [
{
    id: "operations/superadmin-handbook",
    slug: ["operations", "superadmin-handbook"],
    category: "operations",
    title: "Superadmin Handbook",
    summary:
      "Panduan internal untuk memahami tugas superadmin, area menu, prioritas operasional, dan urutan pemeriksaan saat terjadi perubahan atau insiden pada platform.",
    audience: ["Super Admin", "Operator Internal", "Support"],
    overallStatus: "Verified",
    statusNote:
      "Sidebar admin, halaman admin, dan backend admin endpoints menunjukkan dengan cukup jelas tanggung jawab operasional superadmin di TeamVora saat ini.",
    facts: [
      { label: "Primary Surface", value: "/admin" },
      { label: "Core Duties", value: "teams, users, RBAC, content, settings, env, email, status, tickets" },
      { label: "Internal Docs", value: "/admin/project-docs" },
      { label: "Most Sensitive Area", value: "RBAC, env, email config, settings, destructive team ops" },
    ],
    responsibilities: [
      "Menjadi ringkasan tanggung jawab harian superadmin terhadap platform TeamVora.",
      "Membantu operator menelusuri area admin yang tepat saat ingin mengelola tim, user, content, settings, atau support.",
      "Menandai area berisiko tinggi yang tidak boleh diubah tanpa validasi.",
    ],
    keyFiles: [
      {
        path: "Frontend/src/components/layout/admin-sidebar.tsx",
        note: "Peta menu dan cakupan area kerja superadmin.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/page.tsx", note: "Dashboard admin dan statistik platform.", status: "Verified" },
      {
        path: "Frontend/src/app/admin/users/page.tsx",
        note: "Manajemen user dan impersonation dari sisi UI admin.",
        status: "Verified",
      },
      {
        path: "Frontend/src/app/admin/teams/page.tsx",
        note: "Manajemen tim dari sisi superadmin.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/rbac/page.tsx", note: "Matrix role/permission UI admin.", status: "Verified" },
      { path: "Frontend/src/app/admin/settings/page.tsx", note: "Pengaturan umum platform.", status: "Verified" },
      {
        path: "Frontend/src/app/admin/env-config/page.tsx",
        note: "Konfigurasi env dari sisi admin.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/email/page.tsx", note: "Email settings/config area admin.", status: "Verified" },
    ],
    flows: [
      {
        title: "Checklist operasional harian",
        status: "Verified",
        steps: [
          "Pantau dashboard admin untuk statistik umum dan aktivitas terbaru.",
          "Kelola teams/users/RBAC saat ada onboarding, perubahan struktur, atau investigasi access issue.",
          "Gunakan tickets/contact/admin stats/status system untuk menangani issue support atau health platform.",
        ],
      },
      {
        title: "Saat ada perubahan global",
        status: "Verified",
        steps: [
          "Tentukan apakah perubahan menyentuh settings database, env runtime, email, storage, permission, atau content publik.",
          "Lakukan perubahan pada permukaan admin yang tepat.",
          "Sesudah itu, verifikasi dampak ke admin, lead, member, dan marketing/public surfaces bila relevan.",
        ],
      },
    ],
    dependencies: [
      "Admin sidebar/navigation.",
      "Admin endpoints backend (stats, platform settings, env, email, tickets).",
      "Auth & impersonation flow.",
      "Storage/mail/realtime/platform settings runtime.",
    ],
    sensitiveAreas: [
      {
        title: "RBAC",
        detail:
          "Kesalahan di role/permission dapat membuka atau menutup banyak fitur sekaligus di seluruh role surfaces.",
        status: "Verified",
      },
      {
        title: "Team deletion and user management",
        detail:
          "Operasi destruktif pada team atau user dapat menghapus data domain dan file terkait, bukan sekadar record tunggal.",
        status: "Verified",
      },
      {
        title: "Env/email/settings",
        detail:
          "Ketiga area ini berdampak global ke seluruh platform dan harus selalu divalidasi ulang setelah perubahan.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Sebelum menyentuh area sensitif, tentukan terlebih dahulu rollback plan dan permukaan yang akan terdampak.",
      "Gunakan docs internal ini sebagai checklist impact area, bukan hanya sebagai deskripsi sistem.",
      "Jika ragu, ubah satu concern saja per sesi: RBAC, settings, email, env, storage, atau content.",
    ],
    validationChecklist: [
      "Verifikasi login/akses minimal satu user per role setelah perubahan RBAC atau identity ops.",
      "Verifikasi settings public/admin bila menyentuh branding atau platform settings.",
      "Verifikasi ticketing/support flow jika menyentuh email/status/support modules.",
    ],
    affectedSurfaces: [
      "Frontend/src/app/admin/**/*",
      "Backend/app/Http/Controllers/Api/Admin*",
      "Backend/app/Http/Controllers/Api/MemberController.php",
      "Backend/app/Http/Controllers/Api/TeamController.php",
    ],
    relatedPageIds: [
      "operations/settings-environment",
      "operations/media-storage",
      "operations/email-notifications-support",
      "backend/auth-rbac",
    ],
  },
{
    id: "operations/settings-environment",
    slug: ["operations", "settings-environment"],
    category: "operations",
    title: "Settings & Environment",
    summary:
      "Panduan internal untuk membedakan settings database, pengaturan marketing/public, dan konfigurasi environment runtime yang dikelola dari area admin.",
    audience: ["Super Admin", "Operator", "Backend Developer"],
    overallStatus: "Verified",
    statusNote:
      "Admin settings screens, usePlatformSettings hook, backend settings controllers, dan admin env endpoints cukup jelas untuk memetakan boundary settings vs env runtime.",
    facts: [
      { label: "Settings Data Layer", value: "settings table + group column" },
      { label: "Public Read API", value: "/api/platform-settings" },
      { label: "Admin Write Surface", value: "/admin/settings, /admin/settings/marketing, /admin/env-config" },
      { label: "Environment Scope", value: "DB, storage, mail, queue, cache, session, integration credentials" },
    ],
    responsibilities: [
      "Membedakan apa yang disimpan sebagai settings database vs apa yang harus tetap berada di env runtime.",
      "Membantu superadmin tahu lokasi yang tepat saat ingin mengubah branding, SEO, maintenance, atau konfigurasi sistem.",
      "Menandai area di mana admin UI tersedia tetapi parity konsumsi frontend publik/internal masih perlu perhatian.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/SettingController.php",
        note: "Settings generic grouped endpoints.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
        note: "Admin platform settings/test email/system status.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminEnvController.php",
        note: "Read/write env config API.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/settings/page.tsx", note: "UI pengaturan umum platform.", status: "Verified" },
      {
        path: "Frontend/src/app/admin/settings/marketing/**/*",
        note: "UI editor/settings untuk permukaan marketing/public pages.",
        status: "Verified",
      },
      {
        path: "Frontend/src/hooks/use-platform-settings.ts",
        note: "Hook frontend untuk membaca platform settings publik dari backend.",
        status: "Verified",
      },
      {
        path: "Frontend/src/components/marketing-navbar.tsx",
        note: "Contoh consumer setting publik seperti site_name/logo_url/nav_links.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Platform settings consumption",
        status: "Verified",
        steps: [
          "Backend menyajikan public platform settings melalui /api/platform-settings.",
          "Frontend memakai usePlatformSettings untuk mengambil data seperti site_name, logo_url, contact, social, SEO, dan sebagian marketing content.",
          "Sebagian UI publik/admin memanfaatkan settings ini, tetapi parity penuh semua halaman marketing tetap perlu dilihat per halaman.",
        ],
      },
      {
        title: "Environment editing",
        status: "Verified",
        steps: [
          "Superadmin dapat membaca dan menulis env config dari admin env screen.",
          "Perubahan env memengaruhi runtime backend lebih dalam daripada settings database biasa.",
        ],
      },
    ],
    dependencies: [
      "settings dan email_settings tables.",
      "Admin settings UI.",
      "Backend platform settings and env controllers.",
      "Public consumers seperti navbar/footer/settings-driven components.",
    ],
    sensitiveAreas: [
      {
        title: "Generic settings openness",
        detail: "Settings endpoints yang tidak cukup dibatasi role dapat menjadi area risiko jika dipakai sembarangan.",
        status: "Verified",
      },
      {
        title: "Marketing editor parity",
        detail:
          "Keberadaan UI editor di admin tidak selalu berarti semua page publik sudah sepenuhnya consume content tersebut.",
        status: "Partial",
      },
      {
        title: "Env editing sangat global",
        detail:
          "Perubahan env dapat memutus koneksi DB, mail, storage, queue, atau behavior runtime lain secara langsung.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Tentukan dulu apakah kebutuhan Anda adalah settings database atau env runtime. Jangan pilih env bila settings tabel sudah cukup.",
      "Jika mengubah marketing/public settings, cek halaman publik yang benar-benar membaca hook usePlatformSettings.",
      "Jika mengubah env, lakukan satu perubahan kecil lalu verifikasi system status dan fitur yang bergantung padanya.",
    ],
    validationChecklist: [
      "Uji GET /platform-settings dari frontend consumer terkait.",
      "Buka navbar/footer/admin sidebar setelah perubahan branding/site_name/logo.",
      "Uji admin system status dan alur yang paling terdampak setelah perubahan env.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/SettingController.php",
      "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
      "Backend/app/Http/Controllers/Api/AdminEnvController.php",
      "Frontend/src/app/admin/settings/**/*",
      "Frontend/src/hooks/use-platform-settings.ts",
      "Frontend/src/components/marketing-navbar.tsx",
      "Frontend/src/components/marketing-footer.tsx",
    ],
    relatedPageIds: [
      "backend/config-integrations",
      "frontend/theme-design-system",
      "operations/superadmin-handbook",
      "architecture/system-landscape",
    ],
  },
{
    id: "operations/media-storage",
    slug: ["operations", "media-storage"],
    category: "operations",
    title: "Media & Storage Operations",
    summary:
      "Panduan operasional untuk upload, asset lifecycle, storage R2, media gallery/documents, dan hal-hal yang perlu dicek saat file management berubah.",
    audience: ["Super Admin", "Operator", "Backend Developer"],
    overallStatus: "Verified",
    statusNote:
      "Backend filesystems config, R2 service, media controllers, dan admin/media screens memberikan gambaran cukup jelas tentang operasi media saat ini.",
    facts: [
      { label: "Storage Runtime", value: "Cloudflare R2" },
      {
        label: "Asset Types",
        value: "avatar, logo, media gallery, documents, blog images, ticket attachments, chat attachments",
      },
      { label: "Media Domain Table", value: "team_media" },
      { label: "Cleanup", value: "chat attachments older than 7 days can be removed by scheduler" },
    ],
    responsibilities: [
      "Menjelaskan aset apa saja yang masuk ke storage dan flow hidup-matinya.",
      "Membantu operator memeriksa masalah upload, broken URL, missing file, atau orphan objects.",
      "Menjadi panduan perubahan storage disk/path/URL agar tidak memutus frontend consumer.",
    ],
    keyFiles: [
      { path: "Backend/config/filesystems.php", note: "Definisi disk r2 dan storage defaults.", status: "Verified" },
      { path: "Backend/app/Services/R2Service.php", note: "Service penyimpanan file ke R2.", status: "Verified" },
      {
        path: "Backend/app/Http/Controllers/Api/MediaController.php",
        note: "Dokumen/gallery CRUD.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/TeamController.php",
        note: "Upload team logo dan destructive team cleanup.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AuthController.php",
        note: "Upload avatar profile.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/media/page.tsx", note: "Admin media surface.", status: "Verified" },
      {
        path: "Frontend/src/components/shared/media-picker.tsx",
        note: "Media picker reusable untuk beberapa screen admin/content.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Upload and consume asset",
        status: "Verified",
        steps: [
          "Frontend mengirim FormData untuk upload file.",
          "Backend menyimpan file ke R2 dan mencatat metadata/path yang diperlukan.",
          "Frontend kemudian mengonsumsi URL/path itu sebagai avatar, logo, gallery item, dokumen, featured image, atau attachment.",
        ],
      },
      {
        title: "Cleanup and deletion",
        status: "Partial",
        steps: [
          "Sebagian flow penghapusan file membersihkan object R2 dengan path yang dinormalisasi terlebih dahulu.",
          "Ada juga flow yang berpotensi menghapus langsung berdasarkan field path tanpa sanitasi/normalisasi yang sama persis.",
          "Karena itu, orphan file risk harus selalu dipertimbangkan saat menyentuh media deletion.",
        ],
      },
    ],
    dependencies: [
      "R2 disk configuration.",
      "MediaController, TeamController, AuthController, BlogController, TicketController, ChatController.",
      "Media picker dan screen frontend yang menampilkan asset.",
    ],
    sensitiveAreas: [
      {
        title: "Broken path / broken URL mismatch",
        detail:
          "Field file_path dan URL consumer harus tetap kompatibel, jika tidak frontend akan menampilkan asset rusak walau file ada.",
        status: "Verified",
      },
      {
        title: "Orphan file risk",
        detail:
          "Perbedaan kecil dalam cara menghapus object R2 dapat meninggalkan file yatim yang tidak lagi direferensikan database.",
        status: "Partial",
      },
      {
        title: "Team deletion cascade",
        detail:
          "Menghapus tim dapat menghapus banyak asset tim sekaligus; ini bukan operasi yang boleh dilakukan tanpa verifikasi ulang.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Saat mengubah storage semantics, audit upload, display, update, delete, dan cleanup scheduler, bukan hanya satu endpoint.",
      "Jangan ubah naming/path strategy tanpa memeriksa consumer frontend dan cleanup code.",
      "Jika ada broken asset issue, cek tiga hal: metadata di DB, object existence di R2, dan consumer URL di frontend.",
    ],
    validationChecklist: [
      "Tes upload + view + delete untuk avatar, team logo, gallery/documents, dan minimal satu attachment domain lain bila tersentuh.",
      "Pastikan object benar-benar terhapus dari storage saat record dihapus, bila itu intended behavior.",
      "Tes media picker setelah mengubah format metadata atau URL.",
    ],
    affectedSurfaces: [
      "Backend/config/filesystems.php",
      "Backend/app/Services/R2Service.php",
      "Backend/app/Http/Controllers/Api/*Controller.php (file upload/delete consumers)",
      "Frontend/src/app/admin/media/page.tsx",
      "Frontend/src/components/shared/media-picker.tsx",
    ],
    relatedPageIds: [
      "architecture/integrations-realtime",
      "backend/jobs-realtime-storage",
      "database/content-media-support",
      "operations/settings-environment",
    ],
  },
{
    id: "operations/email-notifications-support",
    slug: ["operations", "email-notifications-support"],
    category: "operations",
    title: "Email, Notifications & Support",
    summary:
      "Panduan operasional untuk mail flow, notification flow, contact inbox, support tickets, dan area admin yang harus dicek saat komunikasi sistem bermasalah.",
    audience: ["Super Admin", "Support Engineer", "Backend Developer"],
    overallStatus: "Verified",
    statusNote:
      "Mail config, email settings/template controllers, notifications endpoints, contact messages, dan tickets cukup jelas untuk membangun handbook operasional dasar yang akurat.",
    facts: [
      { label: "Mail Runtime", value: "SMTP" },
      { label: "Support Inbound", value: "contact_messages + tickets" },
      { label: "Notification Storage", value: "notifications table" },
      { label: "Admin UI", value: "/admin/email, /admin/tickets" },
    ],
    responsibilities: [
      "Menjelaskan flow komunikasi sistem keluar (email) dan masuk (contact/tickets).",
      "Menjelaskan di mana superadmin memeriksa jika invitation, reset password, notifikasi, atau support channel bermasalah.",
      "Menandai hubungan antara email config/template, backend mailer, dan frontend notification surfaces.",
    ],
    keyFiles: [
      { path: "Backend/config/mail.php", note: "Mailer configuration dan from address.", status: "Verified" },
      {
        path: "Backend/app/Http/Controllers/Api/EmailConfigController.php",
        note: "Expose email config ke area admin.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/EmailTemplateController.php",
        note: "Email settings, preview, dan template-related admin endpoints.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/NotificationController.php",
        note: "Database notifications list/read/read-all.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/ContactController.php",
        note: "Pesan kontak publik dan inbox admin.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/TicketController.php",
        note: "Ticketing untuk lead.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminTicketController.php",
        note: "Ticket management untuk superadmin.",
        status: "Verified",
      },
      { path: "Frontend/src/app/admin/email/page.tsx", note: "Surface email admin.", status: "Verified" },
    ],
    flows: [
      {
        title: "Outbound email",
        status: "Verified",
        steps: [
          "Forgot/reset password, invitation, dan test email bergantung pada mail runtime dan config yang benar.",
          "Email settings/template layer membantu branding atau preview komunikasi yang dikirim dari platform.",
        ],
      },
      {
        title: "Inbound support and notifications",
        status: "Verified",
        steps: [
          "Pesan dari contact form publik masuk ke contact_messages dan dapat dikelola admin.",
          "Ticket dari internal role mengalir melalui ticketing area lead/admin.",
          "NotificationController menyediakan daftar notifikasi user dan aksi mark read/read-all untuk frontend.",
        ],
      },
    ],
    dependencies: [
      "SMTP mail runtime.",
      "Email settings/template data layer.",
      "Notifications table.",
      "Admin email and ticket screens.",
      "Frontend notification dropdowns/header.",
    ],
    sensitiveAreas: [
      {
        title: "Email config exposure",
        detail:
          "Email config endpoint bersifat sensitif dan tidak boleh diperlakukan seperti pengaturan biasa tanpa akses kontrol yang ketat.",
        status: "Verified",
      },
      {
        title: "Support visibility",
        detail:
          "Contact inbox dan ticket status adalah permukaan operasional yang dapat memengaruhi SLA dan pengalaman support bila salah dikelola.",
        status: "Verified",
      },
      {
        title: "Notification source ambiguity",
        detail:
          "Sebagian notifikasi datang dari backend DB notifications, sementara update real-time juga dapat datang dari SSE; troubleshooting harus memeriksa keduanya.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Jika menyentuh email flow, uji minimal forgot/reset, invitation, dan test email.",
      "Jika menyentuh notifications, uji list, mark read, read-all, dan event delivery bila terkait realtime.",
      "Jika menyentuh support workflows, audit contact admin page dan admin tickets page bersama backend status transitions.",
    ],
    validationChecklist: [
      "Test email dari admin berhasil.",
      "Forgot password dan invitation email terkirim/terproses sesuai.",
      "Notification dropdown/header masih menerima dan me-render item dengan benar.",
      "Ticket create/update status flow tetap bekerja.",
    ],
    affectedSurfaces: [
      "Backend/config/mail.php",
      "Backend/app/Http/Controllers/Api/EmailConfigController.php",
      "Backend/app/Http/Controllers/Api/EmailTemplateController.php",
      "Backend/app/Http/Controllers/Api/NotificationController.php",
      "Backend/app/Http/Controllers/Api/ContactController.php",
      "Backend/app/Http/Controllers/Api/TicketController.php",
      "Frontend/src/app/admin/email/page.tsx",
      "Frontend/src/app/admin/tickets/page.tsx",
    ],
    relatedPageIds: [
      "backend/config-integrations",
      "architecture/integrations-realtime",
      "operations/superadmin-handbook",
      "database/content-media-support",
    ],
  }
];