import { ProjectDocPage } from "./types";

export const backendPages: ProjectDocPage[] = [
{
    id: "backend/overview",
    slug: ["backend", "overview"],
    category: "backend",
    title: "Backend Overview",
    summary:
      "Ringkasan backend TeamVora: Laravel 13 API-first, struktur folder penting, model domain, dan bagaimana backend menjadi pusat logika bisnis lintas role.",
    audience: ["Backend Developer", "Full-stack Developer", "Super Admin"],
    overallStatus: "Verified",
    statusNote:
      "Struktur folder backend, manifest dependency, bootstrap app, routes, dan model domain terbaca jelas dari source repository saat ini.",
    facts: [
      { label: "Runtime", value: "PHP 8.3 + Laravel 13.18" },
      { label: "API Entry", value: "Backend/routes/api.php" },
      { label: "Primary Auth", value: "Sanctum personal access token" },
      { label: "Primary Domain", value: "Teams, Finance, Productivity, Media, Blog, Support" },
    ],
    responsibilities: [
      "Menyediakan seluruh API utama untuk auth, teams, finance, productivity, media, chat, CMS, dan support.",
      "Menjadi pusat resource, request validation, service layer tertentu, dan orchestrasi operasi platform seperti env/email settings.",
      "Menjaga pemisahan role dan permission untuk super_admin, team_leader, dan member di layer backend.",
    ],
    keyFiles: [
      { path: "Backend/composer.json", note: "Stack backend dan dependensi inti backend.", status: "Verified" },
      {
        path: "Backend/bootstrap/app.php",
        note: "Routing API/console/channels dan alias middleware role/permission.",
        status: "Verified",
      },
      { path: "Backend/routes/api.php", note: "Semua endpoint API utama TeamVora.", status: "Verified" },
      { path: "Backend/app/Models", note: "Kumpulan model domain inti aplikasi.", status: "Verified" },
      {
        path: "Backend/app/Http/Controllers/Api",
        note: "Controller API per modul bisnis dan admin.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources",
        note: "Resource API yang menjadi kontrak data ke frontend.",
        status: "Verified",
      },
      {
        path: "Backend/app/Services/RecurringBillService.php",
        note: "Service khusus recurring bill yang menunjukkan adanya domain logic terpisah dari controller untuk bagian finance tertentu.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Request frontend ke backend",
        status: "Verified",
        steps: [
          "Frontend memanggil endpoint backend memakai axios ke base URL NEXT_PUBLIC_API_URL.",
          "Route API Laravel menentukan apakah endpoint publik atau protected via auth:sanctum.",
          "Controller melakukan validasi, authorization, query/filtering, dan mengembalikan response/resource yang dipakai frontend.",
        ],
      },
      {
        title: "Peran backend dalam aplikasi",
        status: "Verified",
        steps: [
          "Backend menjadi sumber kebenaran data untuk teams, user, cash book, split bill, task, daily log, media, blog, dan ticket.",
          "Backend juga memegang concern sensitif seperti settings platform, env config, dan email config/template.",
        ],
      },
    ],
    dependencies: [
      "Laravel Sanctum.",
      "Spatie Permission dan Activitylog.",
      "PostgreSQL runtime.",
      "Cloudflare R2 untuk file.",
      "SMTP untuk pengiriman email.",
    ],
    sensitiveAreas: [
      {
        title: "Backend memegang area operasional sensitif",
        detail:
          "Admin env, platform settings, email config/template, dan ticketing semuanya berada di backend yang sama sehingga perubahan kecil bisa berdampak global.",
        status: "Verified",
      },
      {
        title: "Tenant isolation tidak terpusat",
        detail:
          "Pemisahan data antar tim tampak dilakukan manual di controller, bukan melalui global scope tenancy yang seragam.",
        status: "Verified",
      },
      {
        title: "Role efektif memakai dua lapis representasi",
        detail:
          "Role user tampak hidup sebagai users.role dan juga sebagai Spatie roles/permissions, sehingga sinkronisasi role perlu diperhatikan saat mengubah workflow user/team.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Mulai audit perubahan dari route -> controller -> model/resource -> frontend consumer.",
      "Jika mengubah payload response, audit src/types/api.ts dan screen frontend yang memakai data tersebut.",
      "Jika mengubah perilaku lintas tim, cek semua filter team_id dan endpoint object-level authorization yang relevan.",
    ],
    validationChecklist: [
      "Jalankan endpoint utama yang terpengaruh dengan token role yang tepat.",
      "Cek resource output terhadap src/types/api.ts atau consumer frontend terkait.",
      "Uji minimal satu alur admin, satu alur lead, dan satu alur member bila perubahan menyentuh role-sensitive data.",
    ],
    affectedSurfaces: [
      "Backend/routes/api.php",
      "Backend/app/Http/Controllers/Api",
      "Backend/app/Models",
      "Frontend/src/lib/api.ts",
      "Frontend/src/types/api.ts",
    ],
    relatedPageIds: ["backend/api-surface", "backend/auth-rbac", "database/overview", "operations/superadmin-handbook"],
  },
{
    id: "backend/api-surface",
    slug: ["backend", "api-surface"],
    category: "backend",
    title: "API Surface",
    summary:
      "Peta endpoint backend yang paling penting untuk superadmin dan tim pengembang: auth, team management, finance, productivity, content, support, chat, dan admin ops.",
    audience: ["Backend Developer", "Frontend Developer", "QA"],
    overallStatus: "Verified",
    statusNote: "Kelompok endpoint dapat dilacak langsung dari Backend/routes/api.php dan controller API per modul.",
    facts: [
      { label: "Route File", value: "Backend/routes/api.php" },
      { label: "Public Endpoints", value: "Auth, blogs public, invitations, contact, platform-settings" },
      { label: "Protected Endpoints", value: "Sebagian besar modul bisnis memakai auth:sanctum" },
      { label: "Admin-only Areas", value: "platform settings, env, email config, admin tickets, admin stats" },
    ],
    responsibilities: [
      "Membantu pembaca memahami area endpoint tanpa harus membaca routes/api.php dari atas ke bawah setiap kali.",
      "Menjelaskan mana endpoint yang publik, protected, atau superadmin-only.",
      "Menjadi peta penghubung antara halaman frontend dan controller backend terkait.",
    ],
    keyFiles: [
      {
        path: "Backend/routes/api.php",
        note: "File sumber kebenaran utama untuk daftar endpoint API.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AuthController.php",
        note: "Login, register, me, update profile, avatar, password, forgot/reset password, impersonation.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/TeamController.php",
        note: "CRUD team, members, invite, switch team, upload logo, update settings.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/MemberController.php",
        note: "Kelola member, role, permission, dan update hak akses.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/CashBookController.php",
        note: "Kas masuk/keluar dan history cash book.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/SplitBillController.php",
        note: "Split bill lifecycle untuk tim.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/TaskController.php",
        note: "Task board, status patch, reorder, CRUD task.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
        note: "Platform settings, test email, system status.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Kelompok endpoint utama",
        status: "Verified",
        steps: [
          "Auth/profile: login, register, forgot/reset, me, profile, password, avatar, impersonation.",
          "Teams/members: teams, team-members shortcut, invite, remove member, roles/permissions.",
          "Finance: cash-books, split-bills, bill-items pay/verify, recurring-bills.",
          "Productivity & collaboration: dashboard, tasks, daily-logs, media, notifications, chat.",
          "Admin ops: platform settings, email settings, email config, env config, stats, tickets.",
        ],
      },
      {
        title: "Route sensitivity",
        status: "Verified",
        steps: [
          "Beberapa endpoint admin dibungkus middleware custom CheckRole:super_admin.",
          "Sebagian generic settings route hanya berada di bawah auth:sanctum tanpa gate role eksplisit, sehingga perlu dianggap sensitif.",
        ],
      },
    ],
    dependencies: [
      "auth:sanctum group untuk endpoint protected.",
      "CheckRole middleware untuk admin-only clusters.",
      "Frontend screens di /admin, /lead, dan /member yang memanggil endpoint ini lewat axios.",
    ],
    sensitiveAreas: [
      {
        title: "Generic settings endpoints",
        detail:
          "Route /api/settings dan /api/settings/{group} tampak tersedia untuk semua user terautentikasi, sehingga perubahan di area ini harus dilihat sebagai area berisiko tinggi.",
        status: "Verified",
      },
      {
        title: "Object-level authorization tidak selalu seragam",
        detail:
          "Beberapa controller perlu dicek ulang untuk memastikan akses object per team/user selalu diverifikasi secara konsisten.",
        status: "Verified",
      },
      {
        title: "Route admin dan route umum hidup dalam file yang sama",
        detail:
          "Saat mengubah route groups, mudah sekali secara tak sengaja memperluas atau mempersempit akses yang salah.",
        status: "Inferred",
      },
    ],
    safeChangeGuide: [
      "Pisahkan dulu apakah perubahan menyentuh endpoint publik, protected, atau admin-only.",
      "Jangan menambah endpoint baru tanpa memikirkan guard auth, guard role, dan dampaknya ke frontend role surfaces.",
      "Jika mengubah nama field atau status enum, audit resource output, types frontend, dan layar consumer secara bersamaan.",
    ],
    validationChecklist: [
      "Tes endpoint dengan token super_admin, team_leader, dan member bila relevan.",
      "Tes access denial untuk role yang tidak berhak.",
      "Pastikan consumer frontend yang relevan masih render tanpa error setelah kontrak response berubah.",
    ],
    affectedSurfaces: [
      "Backend/routes/api.php",
      "Backend/app/Http/Controllers/Api/*",
      "Frontend/src/app/admin/**/*",
      "Frontend/src/app/lead/**/*",
      "Frontend/src/app/member/**/*",
    ],
    relatedPageIds: [
      "backend/auth-rbac",
      "database/finance",
      "database/productivity",
      "operations/settings-environment",
    ],
  },
{
    id: "backend/auth-rbac",
    slug: ["backend", "auth-rbac"],
    category: "backend",
    title: "Auth & RBAC",
    summary:
      "Cara backend mengelola token login, role, permission, impersonation, dan batas akses untuk superadmin, team leader, dan member.",
    audience: ["Backend Developer", "Security Reviewer", "Super Admin"],
    overallStatus: "Verified",
    statusNote:
      "Konfigurasi auth, Sanctum, permission package, role seeder, dan flow login/impersonation tampak jelas di source yang dibaca.",
    facts: [
      { label: "Token Model", value: "Sanctum personal access tokens" },
      { label: "Role Strings", value: "super_admin, team_leader, member" },
      { label: "Permission Layer", value: "Spatie Laravel Permission" },
      { label: "Impersonation", value: "Supported via AuthController" },
    ],
    responsibilities: [
      "Menjelaskan bagaimana auth API bekerja dari login sampai token dipakai frontend.",
      "Menjelaskan dual-layer role model: users.role dan Spatie roles/permissions.",
      "Menandai area sensitif seperti impersonation, permission sync, dan mismatch role state.",
    ],
    keyFiles: [
      { path: "Backend/config/auth.php", note: "Guard, provider user, dan password reset config.", status: "Verified" },
      {
        path: "Backend/config/sanctum.php",
        note: "Stateful domains, token expiration, dan personal access token behavior.",
        status: "Verified",
      },
      {
        path: "Backend/config/permission.php",
        note: "Spatie permission config, termasuk teams=false dan cache key permission.",
        status: "Verified",
      },
      {
        path: "Backend/app/Models/User.php",
        note: "User model memakai HasApiTokens dan HasRoles serta relasi role/team/permissions.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AuthController.php",
        note: "Flow login, register, me, avatar, password, forgot/reset, impersonation.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Middleware/CheckRole.php",
        note: "Middleware custom untuk pembatasan role tertentu.",
        status: "Verified",
      },
      {
        path: "Backend/database/seeders/RoleSeeder.php",
        note: "Mendefinisikan role utama dan permission awal aplikasi.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Login hingga route role-based",
        status: "Verified",
        steps: [
          "User login atau register lewat endpoint AuthController.",
          "Backend mengembalikan token Sanctum dan payload user lengkap.",
          "Frontend menyimpan token, memanggil /me, lalu redirect ke /admin, /lead, atau /member sesuai role.",
        ],
      },
      {
        title: "Impersonation",
        status: "Verified",
        steps: [
          "Superadmin dapat memanggil impersonate/{userId} untuk masuk sebagai user lain.",
          "Frontend menyimpan originalToken agar bisa stop impersonation dan kembali ke identitas awal.",
          "Flow ini sangat sensitif dan harus diaudit setiap kali role/auth layer disentuh.",
        ],
      },
    ],
    dependencies: [
      "Sanctum token table dan middleware auth:sanctum.",
      "Spatie roles/permissions dan cache permission.",
      "Frontend auth-store dan AuthProvider untuk token persistence dan redirect.",
    ],
    sensitiveAreas: [
      {
        title: "Dual role source",
        detail:
          "Role tampak hidup baik di kolom users.role maupun di Spatie roles, sehingga ada potensi drift bila salah satunya diperbarui tanpa sinkronisasi yang benar.",
        status: "Verified",
      },
      {
        title: "Impersonation state",
        detail:
          "Kesalahan kecil di originalToken, stop impersonation, atau payload /me bisa mengunci superadmin di sesi user lain atau membuat auditing membingungkan.",
        status: "Verified",
      },
      {
        title: "Client-side route guard",
        detail:
          "Frontend melakukan proteksi route secara client-side, jadi backend auth tetap harus dianggap sumber kebenaran utama untuk data sensitif.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah role atau permission, audit backend seeders/controllers dan frontend guard/menu secara bersamaan.",
      "Jangan mengubah payload /me tanpa memeriksa AuthProvider dan auth-store di frontend.",
      "Tambahkan test atau langkah verifikasi manual khusus untuk impersonation setelah mengubah auth flow.",
    ],
    validationChecklist: [
      "Login sebagai tiap role dan pastikan redirect tujuan sesuai.",
      "Uji /me setelah login normal dan setelah impersonation.",
      "Uji update role/permission dan verifikasi menu lead/member berubah sesuai hak akses.",
    ],
    affectedSurfaces: [
      "Backend/config/auth.php",
      "Backend/config/sanctum.php",
      "Backend/config/permission.php",
      "Backend/app/Http/Controllers/Api/AuthController.php",
      "Frontend/src/stores/auth-store.ts",
      "Frontend/src/providers/auth-provider.tsx",
    ],
    relatedPageIds: [
      "frontend/providers-stores-api",
      "frontend/routes-role-surfaces",
      "operations/superadmin-handbook",
      "reference/glossary",
    ],
  },
{
    id: "backend/config-integrations",
    slug: ["backend", "config-integrations"],
    category: "backend",
    title: "Config & Integrations",
    summary:
      "Dokumentasi konfigurasi backend yang paling berdampak: database, filesystems, mail, queue, cache, session, services, dan platform config APIs.",
    audience: ["Backend Developer", "Operator", "Super Admin"],
    overallStatus: "Verified",
    statusNote:
      "Config files backend dapat dibaca langsung, dan audit tambahan menunjukkan runtime aktif saat ini memakai PostgreSQL, R2, SMTP, database queue, database cache/session, dan broadcaster log.",
    facts: [
      { label: "DB Runtime", value: "pgsql" },
      { label: "Filesystem Runtime", value: "r2" },
      { label: "Mail Runtime", value: "smtp" },
      { label: "Queue Runtime", value: "database" },
    ],
    responsibilities: [
      "Menjadi peta untuk semua config backend yang memengaruhi perilaku global platform.",
      "Membedakan antara konfigurasi yang env-driven, yang dikelola lewat API admin, dan yang masih code-driven.",
      "Membantu operator memahami mengapa perubahan di settings, env, atau email config sangat sensitif.",
    ],
    keyFiles: [
      { path: "Backend/config/database.php", note: "DB connection support dan Redis config.", status: "Verified" },
      {
        path: "Backend/config/filesystems.php",
        note: "Disk local/public/s3/r2 serta symbolic links storage.",
        status: "Verified",
      },
      { path: "Backend/config/mail.php", note: "Mailer support dan global from address.", status: "Verified" },
      { path: "Backend/config/queue.php", note: "Queue connection dan failed job backend.", status: "Verified" },
      {
        path: "Backend/config/cache.php",
        note: "Cache runtime yang saat ini terverifikasi menggunakan database cache.",
        status: "Verified",
      },
      {
        path: "Backend/config/session.php",
        note: "Session storage runtime yang saat ini juga database-based.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
        note: "Platform settings, test email, system status.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminEnvController.php",
        note: "Baca/tulis env dari area admin.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Konfigurasi env dan runtime",
        status: "Verified",
        steps: [
          "Sebagian besar runtime backend tetap env-driven melalui config/*.php.",
          "Superadmin memiliki API untuk membaca/menulis env config, sehingga perubahan dari panel admin dapat berdampak langsung ke runtime setelah cache/config dibersihkan.",
        ],
      },
      {
        title: "Platform settings vs code config",
        status: "Verified",
        steps: [
          "Settings platform seperti branding, regional, marketing, dan beberapa SEO/public content disimpan di tabel settings dan dikelola lewat endpoint admin.",
          "Config sistem seperti DB, storage, mailer, queue, cache, session, dan service credentials tetap berada di level env/config backend.",
        ],
      },
    ],
    dependencies: [
      "Environment variables backend.",
      "Admin controllers untuk settings, env, email config/template.",
      "Frontend admin screens pada /admin/settings, /admin/env-config, dan /admin/email.",
    ],
    sensitiveAreas: [
      {
        title: "Admin env editing",
        detail: "Superadmin bisa menulis .env via API; ini salah satu area paling sensitif di seluruh platform.",
        status: "Verified",
      },
      {
        title: "Email config exposure",
        detail:
          "Endpoint email-config perlu dianggap sensitif karena membuka data konfigurasi mail kepada area admin tanpa dokumentasi masking penuh.",
        status: "Verified",
      },
      {
        title: "Runtime secrets",
        detail:
          "Docs internal ini sengaja hanya mendokumentasikan struktur config dan dependensinya, bukan nilai secret runtime aktual.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Pisahkan perubahan code config, perubahan env runtime, dan perubahan settings database; jangan mencampur semuanya dalam satu langkah tanpa rollback plan.",
      "Setelah mengubah env/config penting, cek efeknya ke upload file, test email, login, dan status sistem.",
      "Jika menambah setting baru, dokumentasikan apakah setting tersebut code-driven, env-driven, atau disimpan di tabel settings.",
    ],
    validationChecklist: [
      "Verifikasi admin system status setelah perubahan env/config.",
      "Uji upload file, test email, dan endpoint admin yang terkait.",
      "Pastikan frontend admin tetap bisa membaca platform settings setelah perubahan.",
    ],
    affectedSurfaces: [
      "Backend/config/*.php",
      "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
      "Backend/app/Http/Controllers/Api/AdminEnvController.php",
      "Frontend/src/app/admin/settings/**/*",
      "Frontend/src/app/admin/env-config/page.tsx",
      "Frontend/src/app/admin/email/page.tsx",
    ],
    relatedPageIds: [
      "operations/settings-environment",
      "operations/email-notifications-support",
      "architecture/integrations-realtime",
      "database/overview",
    ],
  },
{
    id: "backend/jobs-realtime-storage",
    slug: ["backend", "jobs-realtime-storage"],
    category: "backend",
    title: "Jobs, Realtime & Storage",
    summary:
      "Bagaimana backend menjalankan pekerjaan terjadwal, event realtime, cleanup, dan integrasi storage file lintas modul.",
    audience: ["Backend Developer", "Operator", "Support Engineer"],
    overallStatus: "Partial",
    statusNote:
      "Scheduler dan storage flow terlihat jelas di source, tetapi broadcaster network realtime penuh masih parsial karena config backend yang terbaca tidak mengarah ke provider realtime aktif.",
    facts: [
      { label: "Scheduled Finance", value: "02:00 recurring bill, 07:00 reminder" },
      { label: "Chat Cleanup", value: "03:00 delete messages older than 7 days" },
      { label: "Storage Disk", value: "r2" },
      { label: "Broadcast Runtime", value: "log" },
    ],
    responsibilities: [
      "Menjelaskan scheduler yang memengaruhi finance dan retention data chat.",
      "Menjelaskan bagaimana backend menyimpan dan membersihkan file dari disk R2.",
      "Membantu membedakan SSE, broadcast event, dan push layer di arsitektur TeamVora.",
    ],
    keyFiles: [
      {
        path: "Backend/routes/console.php",
        note: "Mendaftarkan recurring generation, reminder bills, dan cleanup chat attachments/messages.",
        status: "Verified",
      },
      {
        path: "Backend/app/Console/Commands/GenerateRecurringBills.php",
        note: "Command generate split bill dari recurring bill.",
        status: "Verified",
      },
      {
        path: "Backend/app/Console/Commands/RemindBillItems.php",
        note: "Command reminder item bill yang belum dibayar/diverifikasi.",
        status: "Verified",
      },
      { path: "Backend/app/Events/MessageSent.php", note: "Event chat realtime di backend.", status: "Verified" },
      {
        path: "Backend/app/Http/Controllers/Api/SseController.php",
        note: "SSE stream backend untuk notification/admin stats/team updates.",
        status: "Verified",
      },
      {
        path: "Backend/app/Services/R2Service.php",
        note: "Service penyimpanan/pengelolaan file di R2 yang dipakai lintas controller.",
        status: "Verified",
      },
      {
        path: "Backend/config/filesystems.php",
        note: "Disk R2 sebagai penyimpanan default runtime.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Recurring finance automation",
        status: "Verified",
        steps: [
          "Scheduler memanggil GenerateRecurringBills setiap hari pukul 02:00.",
          "Scheduler memanggil RemindBillItems setiap hari pukul 07:00.",
          "Data finance yang dihasilkan akan terlihat di modul recurring bills dan split bills tim.",
        ],
      },
      {
        title: "Chat retention cleanup",
        status: "Verified",
        steps: [
          "Scheduler harian pukul 03:00 mencari message yang lebih tua dari 7 hari.",
          "Bila message punya media_id atau attachment_path, backend menghapus object terkait dari R2 terlebih dahulu.",
          "Setelah file dibersihkan, message dihapus dari database.",
        ],
      },
    ],
    dependencies: [
      "Queue/database jobs bila ada workload async tambahan.",
      "Disk r2 untuk attachment dan media.",
      "SSE stream dan Echo/Pusher consumer di frontend.",
    ],
    sensitiveAreas: [
      {
        title: "Retention cleanup bersifat destruktif",
        detail: "Chat dan attachment lebih tua dari 7 hari akan dibersihkan, jadi ini bukan storage arsip permanen.",
        status: "Verified",
      },
      {
        title: "Broadcast implementation mismatch",
        detail:
          "Event MessageSent dan Echo frontend ada, tetapi runtime broadcaster backend yang terbaca masih log; status realtime chat penuh harus dianggap partial.",
        status: "Verified",
      },
      {
        title: "File deletion consistency",
        detail:
          "Penghapusan file R2 harus konsisten antara upload/update/delete flow. Beberapa path deletion perlu perhatian agar tidak meninggalkan orphan objects.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah retention chat, dokumentasikan dampaknya ke storage, support, dan ekspektasi pengguna.",
      "Jika mengubah scheduler finance, uji recurring bill generation dan reminder secara eksplisit.",
      "Jangan ubah nama atau bentuk storage path tanpa mengaudit semua consumer URL/path di frontend dan cleanup flow di backend.",
    ],
    validationChecklist: [
      "Simulasikan generate recurring bill dan cek split bill hasilnya.",
      "Verifikasi reminder_sent_at atau perubahan status bill items bila menyentuh reminder flow.",
      "Tes upload + delete attachment/media untuk memastikan object R2 tidak orphan.",
    ],
    affectedSurfaces: [
      "Backend/routes/console.php",
      "Backend/app/Console/Commands/*",
      "Backend/app/Events/MessageSent.php",
      "Backend/app/Http/Controllers/Api/SseController.php",
      "Frontend/src/hooks/use-sse.ts",
      "Frontend/src/lib/echo.ts",
    ],
    relatedPageIds: [
      "architecture/integrations-realtime",
      "operations/media-storage",
      "database/finance",
      "database/content-media-support",
    ],
  },
{
    id: "backend/api-auth-profile",
    slug: ["backend", "api-auth-profile"],
    category: "backend",
    title: "API Cluster: Auth & Profile",
    summary: "Dokumentasi granular endpoint auth, profile, password reset, avatar upload, dan impersonation admin.",
    audience: ["Backend Developer", "Frontend Developer", "Security Reviewer"],
    overallStatus: "Verified",
    statusNote:
      "Cluster ini terverifikasi dari routes/api.php dan AuthController. Ada request/resource terkait, tetapi sebagian validasi masih inline di controller.",
    facts: [
      { label: "Public Endpoints", value: "login, register, forgot-password, reset-password" },
      { label: "Protected Endpoints", value: "me, profile, avatar, password, logout" },
      { label: "Sensitive Feature", value: "impersonation" },
      { label: "Primary Controller", value: "Backend/app/Http/Controllers/Api/AuthController.php" },
    ],
    responsibilities: [
      "Menjelaskan lifecycle auth dari login hingga token dipakai di frontend.",
      "Menjadi referensi untuk profile update, avatar upload, password change, dan impersonation flow.",
    ],
    keyFiles: [
      {
        path: "Backend/routes/api.php",
        note: "Mendaftarkan semua route auth/profile dan menempatkan impersonation di dalam grup auth yang sensitif.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AuthController.php",
        note: "Sumber kebenaran utama untuk login/register/me/profile/password/avatar/impersonation.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources/UserResource.php",
        note: "Membentuk payload user yang dikonsumsi frontend setelah login atau /me.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Requests/Auth/LoginRequest.php",
        note: "Ada FormRequest untuk login, tetapi tampak belum menjadi jalur utama yang dipakai controller saat ini.",
        status: "Partial",
      },
    ],
    flows: [
      {
        title: "Auth lifecycle",
        status: "Verified",
        steps: [
          "User login atau register lalu backend mengembalikan token Sanctum dan payload user/resource.",
          "Frontend menyimpan token dan memanggil /me untuk bootstrap sesi client-side.",
          "Profile, avatar, dan password management berjalan di cluster endpoint yang sama.",
        ],
      },
      {
        title: "Impersonation lifecycle",
        status: "Verified",
        steps: [
          "Superadmin memanggil impersonate/{userId} untuk mendapatkan sesi sebagai user lain.",
          "Frontend menyimpan originalToken agar stop-impersonation dapat mengembalikan sesi asli.",
          "GET /api/me akan menyertakan metadata impersonator selama sesi impersonation aktif.",
        ],
      },
    ],
    dependencies: [
      "Sanctum personal access tokens.",
      "UserResource payload yang dipakai frontend auth-store/AuthProvider.",
      "R2 upload flow untuk avatar profile.",
    ],
    sensitiveAreas: [
      {
        title: "Impersonation",
        detail:
          "Flow ini sangat sensitif karena menghasilkan token sesi sebagai user lain dan harus selalu diuji setelah perubahan auth/state management.",
        status: "Verified",
      },
      {
        title: "Inline validation drift",
        detail:
          "Beberapa FormRequest ada di repo, tetapi controller masih banyak memakai validasi inline sehingga perubahan rules mudah menyebar tanpa satu sumber kebenaran tunggal.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah payload auth atau /me, audit juga frontend auth-store, AuthProvider, dan redirect role-based.",
      "Pisahkan perubahan login/reset/password/avatar dari perubahan impersonation bila tidak benar-benar satu concern.",
    ],
    validationChecklist: [
      "Tes login/register/logout normal.",
      "Tes forgot/reset password.",
      "Tes update profile/avatar/password.",
      "Tes impersonation start/stop.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/AuthController.php",
      "Backend/app/Http/Resources/UserResource.php",
      "Frontend/src/stores/auth-store.ts",
      "Frontend/src/providers/auth-provider.tsx",
      "Frontend/src/app/(auth)/**/*",
    ],
    relatedPageIds: ["backend/auth-rbac", "frontend/providers-stores-api", "database/table-users"],
  },
{
    id: "backend/api-teams-members",
    slug: ["backend", "api-teams-members"],
    category: "backend",
    title: "API Cluster: Teams, Members & Invitations",
    summary: "Endpoint granular untuk registry tim, membership, invitation flow, role/permission admin, dan destructive team operations.",
    audience: ["Backend Developer", "Super Admin", "QA"],
    overallStatus: "Verified",
    statusNote:
      "Cluster ini jelas di route dan controller, tetapi ada beberapa area object/team scope yang perlu tetap dianggap sensitif di docs internal.",
    facts: [
      { label: "Main Controllers", value: "TeamController, MemberController, TeamInvitationController" },
      { label: "Public Invite Endpoints", value: "GET/POST /api/invitations/{token}" },
      { label: "Sensitive Operation", value: "DELETE /api/teams/{team}" },
      { label: "RBAC Mutation", value: "members/{user}/role, members/{user}/permissions, roles/{role}/permissions" },
    ],
    responsibilities: [
      "Menjelaskan semua operasi tim dan anggota dari perspektif registry platform dan team tenancy.",
      "Menjadi referensi untuk invitation accept flow, role assignment, dan update membership lifecycle.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/TeamController.php",
        note: "CRUD team, members, invite, switch team, logo upload, dan destructive team cleanup.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/MemberController.php",
        note: "Admin user/member management serta mutasi role/permission.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/TeamInvitationController.php",
        note: "Invitation show/send/list/accept flow.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources/TeamResource.php",
        note: "Payload team yang dipakai admin, lead, dan auth flow.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Team management lifecycle",
        status: "Verified",
        steps: [
          "Superadmin membuat, mengubah, atau menghapus tim dari area registry platform.",
          "Lead/superadmin dapat melihat anggota dan melakukan operasi membership sesuai role/permission yang dimiliki.",
          "Team deletion bersifat destruktif karena menghapus data domain lain dan asset terkait.",
        ],
      },
      {
        title: "Invitation lifecycle",
        status: "Verified",
        steps: [
          "Invitation disimpan dengan token, email, status, dan expiry.",
          "Endpoint publik show/accept dipakai untuk onboarding anggota ke dalam tim.",
          "Role assignment dan team membership kemudian memengaruhi access surface frontend.",
        ],
      },
    ],
    dependencies: [
      "User, Team, TeamInvitation, Role, Permission models.",
      "Frontend admin users/teams screens.",
      "Lead/member sidebar yang memfilter access berdasarkan role/permission.",
    ],
    sensitiveAreas: [
      {
        title: "Destructive cascade on team delete",
        detail:
          "DELETE /api/teams/{team} dapat menghapus banyak data domain dan file R2 lintas modul sehingga harus dianggap operasi high-risk.",
        status: "Verified",
      },
      {
        title: "Scope enforcement",
        detail:
          "Sebagian operasi team/member perlu perhatian ekstra pada team ownership/object-level authorization, terutama saat path team atau user diketahui langsung.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah membership logic, audit invitation flow, team switch, dan frontend menus bersamaan.",
      "Jangan mengubah destructive team cleanup tanpa memetakan ulang semua model/file yang ikut terhapus.",
    ],
    validationChecklist: [
      "Tes create/update/delete team.",
      "Tes member add/remove/update.",
      "Tes invitation send/show/accept.",
      "Tes update role/permission.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/TeamController.php",
      "Backend/app/Http/Controllers/Api/MemberController.php",
      "Backend/app/Http/Controllers/Api/TeamInvitationController.php",
      "Frontend/src/app/admin/teams/**/*",
      "Frontend/src/app/admin/users/**/*",
    ],
    relatedPageIds: ["backend/auth-rbac", "database/table-teams", "database/table-team-invitations"],
  },
{
    id: "backend/api-finance",
    slug: ["backend", "api-finance"],
    category: "backend",
    title: "API Cluster: Finance",
    summary: "Endpoint granular finance untuk cash books, split bills, bill item payment/verification, dan recurring bills.",
    audience: ["Backend Developer", "QA", "Team Ops"],
    overallStatus: "Verified",
    statusNote:
      "Finance cluster jelas di route/controller/resources. Beberapa scope check dan pengisian team_id hasil generation tetap perlu ditandai sebagai area sensitif.",
    facts: [
      { label: "Controllers", value: "CashBookController, SplitBillController, BillItemController, RecurringBillController" },
      { label: "Protected By", value: "auth:sanctum + permission/role logic di controller" },
      { label: "Scheduler Link", value: "Recurring generation & bill reminders" },
      { label: "Storage Link", value: "Proof/attachment upload via R2" },
    ],
    responsibilities: [
      "Menjelaskan endpoint finance yang menopang lead/member screens dan recurring automation.",
      "Menjadi referensi untuk payment proof, verification flow, dan generated split bills.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/CashBookController.php",
        note: "Kas masuk/keluar, attachment, history, dan activity log.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/SplitBillController.php",
        note: "Split bill header lifecycle dan filtering list berdasarkan role.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/BillItemController.php",
        note: "Pay/verify flow untuk tiap porsi tagihan user.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/RecurringBillController.php",
        note: "CRUD recurring bills, manual generation, history, dan active toggle.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Manual finance flow",
        status: "Verified",
        steps: [
          "Cash book dipakai untuk arus kas masuk/keluar tim.",
          "Split bill dibuat lalu bill_items dibagikan ke user terkait.",
          "User membayar dengan proof, lalu verifier mengubah status bill item sesuai hasil verifikasi.",
        ],
      },
      {
        title: "Recurring finance flow",
        status: "Verified",
        steps: [
          "Recurring bill bertindak sebagai template periodik.",
          "Generate manual atau scheduler membentuk split bill baru dan generation history.",
          "Hasil generation kemudian mengalir ke split bill screens dan reminder flow.",
        ],
      },
    ],
    dependencies: [
      "RecurringBillService dan scheduler commands.",
      "CashBook/SplitBill/BillItem/RecurringBill resources.",
      "Lead/member finance pages dan src/types/api.ts.",
    ],
    sensitiveAreas: [
      {
        title: "Object-level scope",
        detail:
          "Sebagian show/update/delete/verify endpoints perlu tetap dianggap sensitif karena scope ke team/object tidak selalu tampak seragam di semua controller.",
        status: "Partial",
      },
      {
        title: "Generated team linkage",
        detail:
          "Generated split bills dari recurring flow perlu perhatian khusus terkait pengisian context tim agar reporting dan filter tetap akurat.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Pisahkan perubahan cash_books dari split_bills/recurring bila tidak harus satu scope.",
      "Setiap perubahan status bill item atau recurring generation harus diuji dari backend dan frontend sekaligus.",
    ],
    validationChecklist: [
      "Tes cash book CRUD.",
      "Tes split bill CRUD.",
      "Tes bill item pay/verify.",
      "Tes recurring bill CRUD + generate/history.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/CashBookController.php",
      "Backend/app/Http/Controllers/Api/SplitBillController.php",
      "Backend/app/Http/Controllers/Api/BillItemController.php",
      "Backend/app/Http/Controllers/Api/RecurringBillController.php",
      "Frontend/src/app/lead/finance/**/*",
      "Frontend/src/app/member/finance/**/*",
    ],
    relatedPageIds: ["database/table-cash-books", "database/table-split-bills", "database/table-recurring-bills"],
  },
{
    id: "backend/api-productivity",
    slug: ["backend", "api-productivity"],
    category: "backend",
    title: "API Cluster: Productivity",
    summary: "Endpoint granular untuk task management, task status/reorder, daily logs, dan export data harian.",
    audience: ["Backend Developer", "Frontend Developer", "QA"],
    overallStatus: "Verified",
    statusNote:
      "Task dan daily log cluster terverifikasi jelas di route/controller. Beberapa ownership/team scope tetap layak ditandai untuk audit lanjutan.",
    facts: [
      { label: "Controllers", value: "TaskController, DailyLogController" },
      { label: "Special Endpoints", value: "tasks/{task}/status, tasks/reorder, daily-logs/export" },
      { label: "Domain Tables", value: "tasks, daily_logs" },
      { label: "Frontend Consumers", value: "lead/member productivity pages" },
    ],
    responsibilities: [
      "Menjelaskan API yang menopang kanban/task board dan laporan harian user.",
      "Menjadi referensi untuk task status transitions, ordering, dan export flow daily logs.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/TaskController.php",
        note: "Task list, CRUD, status patch, reorder, dan deletion rules.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/DailyLogController.php",
        note: "Daily log CRUD, export, attachment handling, dan ownership rules.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources/TaskResource.php",
        note: "Task payload yang dipakai frontend.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources/DailyLogResource.php",
        note: "Daily log payload yang dipakai frontend.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Task lifecycle",
        status: "Verified",
        steps: [
          "Task dibuat dengan assignee, creator, priority, status, due_date, dan position.",
          "Status task dapat diubah secara patch dan urutan dapat diubah melalui endpoint reorder.",
          "Frontend board/list kemudian mengonsumsi payload hasil resource task.",
        ],
      },
      {
        title: "Daily log lifecycle",
        status: "Verified",
        steps: [
          "User membuat daily log dengan title, date, content, dan optional attachment.",
          "Owner dapat update atau delete dengan batasan tertentu.",
          "Export endpoint menghasilkan keluaran untuk kebutuhan pelaporan/arsip user.",
        ],
      },
    ],
    dependencies: [
      "TaskResource dan DailyLogResource.",
      "R2 attachment flow untuk daily logs.",
      "Lead/member productivity frontend pages.",
    ],
    sensitiveAreas: [
      {
        title: "Scope and ownership",
        detail:
          "Beberapa endpoint task/daily log tetap perlu diaudit dari sisi team scope dan ownership check agar tidak ada akses object lintas user/team yang tidak diinginkan.",
        status: "Partial",
      },
      {
        title: "Task reorder",
        detail:
          "Perubahan di endpoint reorder dapat merusak board ordering dan UX lintas user bila position handling berubah.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Jika mengubah task status atau reorder, uji juga komponen board/list frontend.",
      "Jika mengubah daily log export, pastikan output tetap cocok untuk use case pelaporan internal.",
    ],
    validationChecklist: [
      "Tes task CRUD.",
      "Tes status patch dan reorder.",
      "Tes daily log CRUD.",
      "Tes daily log export.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/TaskController.php",
      "Backend/app/Http/Controllers/Api/DailyLogController.php",
      "Frontend/src/app/lead/productivity/**/*",
      "Frontend/src/app/member/productivity/**/*",
    ],
    relatedPageIds: ["database/table-tasks", "database/table-daily-logs", "database/productivity"],
  },
{
    id: "backend/api-content-media",
    slug: ["backend", "api-content-media"],
    category: "backend",
    title: "API Cluster: Content & Media",
    summary: "Endpoint granular untuk blog publik, blog management, category management, dan media library/documents/gallery.",
    audience: ["Backend Developer", "Frontend Developer", "Content Admin"],
    overallStatus: "Partial",
    statusNote:
      "Mayoritas cluster terverifikasi, tetapi categories route terlihat tidak sepenuhnya sinkron dengan method controller yang ada saat audit ini.",
    facts: [
      { label: "Public Content", value: "blogs/public, blogs/{slug}" },
      { label: "Admin/Lead Content", value: "blogs/manage, blogs CRUD, categories CRUD" },
      { label: "Media Endpoints", value: "media, media/documents, media/gallery" },
      { label: "Primary Controllers", value: "BlogController, CategoryController, MediaController" },
    ],
    responsibilities: [
      "Menjelaskan backend surface untuk content publishing dan media asset management.",
      "Menjadi referensi untuk blog SEO payload, category operations, dan upload file dokumen/galeri.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/BlogController.php",
        note: "Public blog listing/detail dan manage/store/update/destroy blog.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/CategoryController.php",
        note: "Category CRUD. Route show perlu perhatian karena method controller tampak tidak sepenuhnya sinkron.",
        status: "Partial",
      },
      {
        path: "Backend/app/Http/Controllers/Api/MediaController.php",
        note: "Media list by type, upload, update, delete.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Resources/BlogResource.php",
        note: "Payload blog ke frontend publik/internal.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Content publishing",
        status: "Verified",
        steps: [
          "Blog publik diambil melalui blogs/public dan blogs/{slug}.",
          "Author/team leader/superadmin mengelola konten melalui blogs/manage dan blog CRUD endpoints.",
          "SEO fields, category, tags, dan images mengalir bersama payload blog ke frontend.",
        ],
      },
      {
        title: "Media lifecycle",
        status: "Verified",
        steps: [
          "Media diunggah sebagai document atau gallery ke R2 dan direkam di team_media.",
          "List media dapat difilter ke documents atau gallery.",
          "Update dan delete media harus tetap menjaga sinkronisasi file_path dengan object storage.",
        ],
      },
    ],
    dependencies: [
      "Blogs, categories, team_media tables.",
      "R2 file storage.",
      "Frontend admin/lead blog pages dan admin/media page.",
    ],
    sensitiveAreas: [
      {
        title: "Category route parity",
        detail:
          "Route GET /api/categories/{category} terlihat ada, tetapi method show tidak tampak lengkap di controller yang diaudit, sehingga docs harus menandainya sebagai area partial.",
        status: "Partial",
      },
      {
        title: "Public content exposure",
        detail:
          "Public blog endpoints mengekspos content/SEO metadata, jadi perubahan resource harus dianggap berdampak langsung ke permukaan publik.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Pisahkan perubahan public blog resource dari perubahan admin blog editor bila memungkinkan.",
      "Setelah mengubah media semantics, tes juga preview/render URL di frontend consumer.",
    ],
    validationChecklist: [
      "Tes public blog list/detail.",
      "Tes blog create/update/delete.",
      "Tes category CRUD.",
      "Tes media upload/list/update/delete.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/BlogController.php",
      "Backend/app/Http/Controllers/Api/CategoryController.php",
      "Backend/app/Http/Controllers/Api/MediaController.php",
      "Frontend/src/app/admin/blogs/**/*",
      "Frontend/src/app/admin/media/page.tsx",
    ],
    relatedPageIds: ["database/table-blogs", "database/table-categories", "database/table-team-media"],
  },
{
    id: "backend/api-support-admin-ops",
    slug: ["backend", "api-support-admin-ops"],
    category: "backend",
    title: "API Cluster: Support & Admin Ops",
    summary: "Endpoint granular untuk contact intake, tickets, platform settings, email config/template, system status, stats, dan env operations.",
    audience: ["Super Admin", "Backend Developer", "Support Engineer"],
    overallStatus: "Verified",
    statusNote:
      "Cluster support/admin ops jelas di route dan controller. Beberapa endpoint sangat sensitif karena menyentuh env, email config, atau global settings platform.",
    facts: [
      { label: "Public Endpoints", value: "contact, platform-settings" },
      { label: "Admin-only Controllers", value: "AdminPlatformController, AdminEnvController, AdminTicketController, EmailTemplateController, EmailConfigController" },
      { label: "Lead Support", value: "lead/tickets" },
      { label: "Highest Risk", value: "settings, env, email-config" },
    ],
    responsibilities: [
      "Menjelaskan support ingress dan permukaan admin ops yang paling sensitif di seluruh backend.",
      "Menjadi referensi untuk contact triage, ticket lifecycle, platform settings, email settings, dan env editing.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/SettingController.php",
        note: "Generic settings endpoints yang perlu dicatat sensitif karena gate role-nya tidak setegas area admin lain.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
        note: "Admin platform settings, system status, test email.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/AdminEnvController.php",
        note: "Read/write env config dari admin panel.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/EmailConfigController.php",
        note: "Expose mail-related config ke admin UI.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Support ingress",
        status: "Verified",
        steps: [
          "Publik mengirim contact message melalui POST /api/contact.",
          "Lead membuat support ticket melalui lead/tickets.",
          "Superadmin membaca contact inbox dan memproses ticket melalui admin endpoints.",
        ],
      },
      {
        title: "Admin ops flow",
        status: "Verified",
        steps: [
          "Platform settings dibaca secara publik melalui /api/platform-settings dan diubah melalui admin endpoints.",
          "Env config dan email config/template mengubah perilaku runtime lintas seluruh platform.",
          "Admin stats dan system status memberi observability tingkat platform.",
        ],
      },
    ],
    dependencies: [
      "ContactMessage, Ticket, Setting, EmailSetting tables.",
      "Admin frontend pages untuk settings/email/env/tickets.",
      "Mail runtime dan environment configuration backend.",
    ],
    sensitiveAreas: [
      {
        title: "Global settings write access",
        detail:
          "Generic settings endpoints tampak terlalu luas aksesnya jika hanya dilindungi auth biasa, sehingga harus selalu diperlakukan sebagai area audit khusus.",
        status: "Verified",
      },
      {
        title: "Env and mail config exposure",
        detail:
          "Admin env dan email-config dapat membuka atau mengubah runtime-wide values, sehingga perubahan di sini harus sangat terkendali.",
        status: "Verified",
      },
    ],
    safeChangeGuide: [
      "Jangan gabungkan perubahan env/email/settings dengan perubahan domain bisnis biasa dalam satu sesi kecil tanpa checklist impact.",
      "Setelah mengubah support/admin ops endpoints, uji admin UI dan alur publik/lead yang bergantung padanya.",
    ],
    validationChecklist: [
      "Tes contact form.",
      "Tes lead ticket create/show.",
      "Tes admin ticket status update.",
      "Tes platform settings read/write, system status, env, dan email actions.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/SettingController.php",
      "Backend/app/Http/Controllers/Api/AdminPlatformController.php",
      "Backend/app/Http/Controllers/Api/AdminEnvController.php",
      "Backend/app/Http/Controllers/Api/EmailConfigController.php",
      "Frontend/src/app/admin/settings/**/*",
      "Frontend/src/app/admin/tickets/page.tsx",
      "Frontend/src/app/admin/email/page.tsx",
      "Frontend/src/app/admin/env-config/page.tsx",
    ],
    relatedPageIds: ["operations/settings-environment", "operations/email-notifications-support", "database/table-settings"],
  },
{
    id: "backend/api-realtime-chat",
    slug: ["backend", "api-realtime-chat"],
    category: "backend",
    title: "API Cluster: Realtime, Chat & Notifications",
    summary: "Endpoint granular untuk notifications, conversation discovery, message sending, broadcast auth, dan SSE event stream.",
    audience: ["Backend Developer", "Frontend Developer", "Support Engineer"],
    overallStatus: "Verified",
    statusNote:
      "Notifications, chat routes, SSE controller, dan channel auth dapat diverifikasi jelas. Ada area sensitif pada query-token SSE dan team membership checks untuk DM flow.",
    facts: [
      { label: "Notification Endpoints", value: "notifications, notifications/{id}/read, notifications/read-all" },
      { label: "Chat Endpoints", value: "teams/{team}/conversations, start-dm, conversations/{conversation}/messages" },
      { label: "Realtime Endpoint", value: "GET /api/events/stream" },
      { label: "Broadcast Channel", value: "conversation.{id}" },
    ],
    responsibilities: [
      "Menjelaskan bagaimana inbox notifications, chat conversations, messages, dan SSE stream saling melengkapi.",
      "Menjadi referensi untuk debugging realtime updates, notification delivery, dan chat membership behavior.",
    ],
    keyFiles: [
      {
        path: "Backend/app/Http/Controllers/Api/NotificationController.php",
        note: "List/read/read-all notifications berbasis notifiable user.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/ChatController.php",
        note: "Conversation discovery, DM creation, message retrieval, message sending, attachment handling.",
        status: "Verified",
      },
      {
        path: "Backend/app/Http/Controllers/Api/SseController.php",
        note: "SSE stream dengan token query string, heartbeat, notification/admin stats events.",
        status: "Verified",
      },
      {
        path: "Backend/routes/channels.php",
        note: "Broadcast auth channel untuk conversation participants.",
        status: "Verified",
      },
    ],
    flows: [
      {
        title: "Notification lifecycle",
        status: "Verified",
        steps: [
          "Backend menyimpan DB notifications untuk user terkait.",
          "Frontend membaca daftar notifikasi dan menandai read/read-all melalui NotificationController.",
          "Sebagian update juga dapat didorong melalui SSE stream.",
        ],
      },
      {
        title: "Chat & realtime lifecycle",
        status: "Verified",
        steps: [
          "ChatController mengelola daftar conversation, DM creation, message history, dan send message.",
          "MessageSent event dan channel auth mendukung pola realtime chat.",
          "SSE menjadi jalur event tambahan untuk notification/admin stats/team updates.",
        ],
      },
    ],
    dependencies: [
      "Conversation, ConversationParticipant, Message, TeamMedia, Notification domain.",
      "Frontend chat interface, useSSE hook, dan Echo client.",
      "Cache/locks untuk SSE active users logic.",
    ],
    sensitiveAreas: [
      {
        title: "SSE query token",
        detail:
          "Token SSE dikirim lewat query string dan CORS stream sangat longgar, sehingga area ini harus selalu disebut sebagai security-sensitive.",
        status: "Verified",
      },
      {
        title: "DM membership checks",
        detail:
          "Flow start-dm perlu terus diaudit untuk memastikan caller dan target memang berada pada konteks team yang benar.",
        status: "Partial",
      },
    ],
    safeChangeGuide: [
      "Jika menyentuh chat atau SSE, uji keduanya secara terpisah karena keduanya melayani use case realtime yang berbeda.",
      "Jangan mengubah payload notification/event tanpa mengaudit consumer frontend yang parsing JSON event tersebut.",
    ],
    validationChecklist: [
      "Tes notifications list/read/read-all.",
      "Tes conversation list dan start-dm.",
      "Tes send/get messages termasuk attachment.",
      "Tes SSE connect dan event reception.",
    ],
    affectedSurfaces: [
      "Backend/app/Http/Controllers/Api/NotificationController.php",
      "Backend/app/Http/Controllers/Api/ChatController.php",
      "Backend/app/Http/Controllers/Api/SseController.php",
      "Backend/routes/channels.php",
      "Frontend/src/components/chat/**/*",
      "Frontend/src/hooks/use-sse.ts",
      "Frontend/src/lib/echo.ts",
    ],
    relatedPageIds: ["architecture/integrations-realtime", "database/table-conversations", "database/table-notifications"],
  }
];