// ============================================================================
// TeamVora API Types
// Auto-generated from Backend Laravel Resources & Controllers
// ============================================================================

// ---------------------------------------------------------------------------
// Base / Pagination
// ---------------------------------------------------------------------------

export type ApiResponse<T> = T;

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PaginatedWithExtra<T, Extra extends Record<string, unknown> = Record<string, never>> extends PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

// ---------------------------------------------------------------------------
// Core Resources (mirrors Backend/app/Http/Resources/*)
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: "super_admin" | "team_leader" | "member";
  team_id: number | null;
  team?: Team;
  roles?: string[];
  permissions?: string[];
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  leader?: Pick<User, "id" | "name" | "email">;
  members_count?: number;
  logo_url?: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
}

export interface TeamMedia {
  id: number;
  user?: Pick<User, "id" | "name">;
  type: "document" | "gallery";
  name: string;
  /** Backend resource key — full CDN URL */
  file_path: string | null;
  /** Legacy alias — same value as file_path, used by frontend components */
  file_url?: string | null;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface TeamInvitation {
  id: number;
  team_id: number;
  invited_by: number;
  email: string;
  token?: string;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  is_expired: boolean;
  inviter?: Pick<User, "id" | "name" | "email">;
  team?: Team;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assignee?: Pick<User, "id" | "name" | "avatar_url">;
  creator?: Pick<User, "id" | "name">;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  due_date: string | null;
  created_at: string;
}

export interface BillItem {
  id: number;
  split_bill_id: number;
  user?: Pick<User, "id" | "name">;
  amount: number;
  status: "unpaid" | "pending_verification" | "paid";
  proof_url: string | null;
  verified_by?: Pick<User, "id" | "name">;
  verified_at: string | null;
  reminder_sent_at: string | null;
  created_at: string;
}

export interface SplitBill {
  id: number;
  title: string;
  description: string | null;
  total_amount: number;
  due_date: string;
  status: string;
  creator?: Pick<User, "id" | "name">;
  items?: BillItem[];
  parent_recurring_bill_id: number | null;
  created_at: string;
}

export interface RecurringBill {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom_days";
  interval_days: number | null;
  due_day: number | null;
  status: string;
  start_date: string;
  end_date: string | null;
  assignee_ids: number[] | null;
  notify_days_before_due: number | null;
  next_generation_at: string | null;
  creator?: Pick<User, "id" | "name">;
  generations_count?: number;
  created_at: string;
}

export interface RecurringBillGeneration {
  id: number;
  recurring_bill_id: number;
  split_bill?: SplitBill;
  generated_at: string;
  created_at: string;
}

export interface CashBook {
  id: number;
  title: string;
  description: string | null;
  type: "in" | "out";
  amount: number;
  date: string;
  attachment_url: string | null;
  created_by?: Pick<User, "id" | "name">;
  created_at: string;
}

export interface DailyLog {
  id: number;
  user?: Pick<User, "id" | "name">;
  title: string;
  log_date: string;
  content: string;
  attachment_url: string | null;
  created_at: string;
}

export interface Blog {
  id: number;
  team_id: number | null;
  author_id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  featured_image: string | null;
  published_at: string | null;
  author?: Pick<User, "id" | "name" | "avatar_url">;
  team?: Team;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  group: string;
}

// Laravel notification structure — frontend reads data.* as top-level
export interface Notification {
  id: string;
  type: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

// Flat notification shape used by header components
// (notification classes may serialize title/message into data or top-level)
export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ImpersonateResponse {
  user: User;
  token: string;
  impersonator: {
    id: number;
    name: string;
    email: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  team_name?: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

export interface CreateTeamRequest {
  name: string;
  description?: string;
  leader_id: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  leader_id?: number;
}

export interface SwitchTeamRequest {
  team_id: number | null;
}

export interface InviteMemberRequest {
  user_id: number;
}

// ---------------------------------------------------------------------------
// Member / Role
// ---------------------------------------------------------------------------

export interface Role {
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface MembersResponse {
  users: User[];
  roles: Role[];
  permissions: string[];
}

export interface UpdateMemberRoleRequest {
  role: string;
}

export interface UpdateMemberPermissionsRequest {
  permissions: string[];
}

export interface UpdateRolePermissionsRequest {
  permissions: string[];
}

// ---------------------------------------------------------------------------
// Task
// ---------------------------------------------------------------------------

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assignee_id?: number;
  priority: "low" | "medium" | "high";
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignee_id?: number;
  priority?: "low" | "medium" | "high";
  due_date?: string;
}

export interface UpdateTaskStatusRequest {
  status: "todo" | "in_progress" | "done";
}

// Task index returns tasks + users list
export interface TaskIndexResponse {
  data: Task[];
  users: Pick<User, "id" | "name">[];
}

// ---------------------------------------------------------------------------
// Split Bill
// ---------------------------------------------------------------------------

export interface CreateSplitBillRequest {
  title: string;
  total_amount: number;
  due_date: string;
  items: { user_id: number; amount: number }[];
}

export interface UpdateSplitBillRequest {
  title?: string;
  total_amount?: number;
  due_date?: string;
  description?: string;
}

// SplitBill index returns bills + users list
export interface SplitBillIndexResponse extends PaginatedResponse<SplitBill> {
  users: Pick<User, "id" | "name">[];
}

// ---------------------------------------------------------------------------
// Bill Item
// ---------------------------------------------------------------------------

export interface PayBillItemRequest {
  proof_file: File;
}

export interface VerifyBillItemRequest {
  status: "paid" | "unpaid";
}

// ---------------------------------------------------------------------------
// Recurring Bill
// ---------------------------------------------------------------------------

export interface CreateRecurringBillRequest {
  title: string;
  description?: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom_days";
  interval_days?: number;
  due_day?: number;
  start_date: string;
  end_date?: string;
  assignee_ids?: number[];
  notify_days_before_due?: number;
}

export interface UpdateRecurringBillRequest {
  title: string;
  description?: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom_days";
  interval_days?: number;
  due_day?: number;
  start_date: string;
  end_date?: string;
  assignee_ids?: number[];
  notify_days_before_due?: number;
}

// RecurringBill show returns bill + paginated generations
export interface RecurringBillShowResponse extends RecurringBill {
  generations: PaginatedResponse<RecurringBillGeneration>;
}

// RecurringBill history
export interface RecurringBillHistoryResponse {
  bill: Pick<RecurringBill, "id" | "title" | "amount" | "frequency">;
  generations: PaginatedResponse<RecurringBillGeneration>;
}

// ---------------------------------------------------------------------------
// Cash Book
// ---------------------------------------------------------------------------

export interface CreateCashBookRequest {
  type: "in" | "out";
  amount: number;
  category: string;
  description?: string;
  transaction_date: string;
  attachment?: File;
}

export interface UpdateCashBookRequest {
  type?: "in" | "out";
  amount?: number;
  category?: string;
  description?: string;
  transaction_date?: string;
}

// CashBook index returns paginated + summary
export interface CashBookIndexResponse extends PaginatedResponse<CashBook> {
  summary: {
    total_in: number;
    total_out: number;
    balance: number;
  };
}

export interface CashBookHistory {
  id: number;
  causer_type: string;
  causer_id: number;
  description: string;
  properties: Record<string, unknown>;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Daily Log
// ---------------------------------------------------------------------------

export interface CreateDailyLogRequest {
  title: string;
  content: string;
  log_date: string;
  attachment?: File;
}

export interface UpdateDailyLogRequest {
  title: string;
  content: string;
}

// Daily log export
export interface DailyLogExportResponse {
  user: Pick<User, "name" | "email">;
  logs: DailyLog[];
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface UploadMediaRequest {
  name: string;
  type: "document" | "gallery";
  file: File;
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export interface CreateBlogRequest {
  title: string;
  excerpt?: string;
  content: string;
  status?: "draft" | "published";
  featured_image?: string;
  published_at?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  status?: "draft" | "published";
  featured_image?: string;
  published_at?: string;
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export interface StoreContactRequest {
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  message: string;
}

export interface StoreContactResponse {
  message: string;
  data: ContactMessage;
}

export interface ContactIndexResponse extends PaginatedResponse<ContactMessage> {}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SettingsResponse {
  data: Record<string, string>;
}

export interface SettingsGroupResponse {
  data: Record<string, string>;
}

export interface UpdateSettingsRequest {
  settings: Record<string, string>;
}

export interface UpdateSettingsGroupRequest {
  settings: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Platform Settings (Admin)
// ---------------------------------------------------------------------------

export interface PlatformSettingsResponse {
  data: Record<string, Record<string, string>>;
}

export interface UpdatePlatformSettingsRequest {
  settings: Record<string, string>;
}

export interface TestEmailRequest {
  email: string;
}

export interface SystemStatusResponse {
  data: {
    php_version: string;
    laravel_version: string;
    db_status: "connected" | "disconnected";
    storage_status: "available" | "unavailable";
    cache_status: "active" | "inactive" | "unavailable";
    environment: string;
    debug_mode: boolean;
    app_name: string;
    app_url: string;
    disk_usage: {
      total: string;
      used: string;
      free: string;
      percentage: number;
    };
  };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export interface DashboardStatsResponse {
  finance: {
    balance: number;
    monthly_expense: number;
    total_in: number;
    total_out: number;
  };
  unpaid_bills: BillItem[];
  active_tasks: Task[];
}

export interface MemberDashboard {
  tasks: Task[];
  recent_activity: Record<string, unknown>[];
}

// ---------------------------------------------------------------------------
// Team Invitation (public accept)
// ---------------------------------------------------------------------------

export interface InvitationAcceptSuccess {
  message: string;
  team: Team;
}

export interface InvitationAcceptNeedRegister {
  message: string;
  email: string;
  team_id: number;
  token: string;
}

// ---------------------------------------------------------------------------
// Member controller (team leader update)
// ---------------------------------------------------------------------------

export interface UpdateTeamMemberRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: "member" | "team_leader";
}

// ---------------------------------------------------------------------------
// Email Settings (Super Admin)
// ---------------------------------------------------------------------------

export interface EmailSettingsResponse {
  data: Record<string, string>;
}

export interface UpdateEmailSettingsRequest {
  settings: Record<string, string>;
}

export interface EmailPreviewResponse {
  data: string;
}

// ---------------------------------------------------------------------------
// Env Config (Super Admin)
// ---------------------------------------------------------------------------

export interface EnvConfigResponse {
  data: Record<string, string>;
}

export interface UpdateEnvConfigRequest {
  settings: Record<string, string>;
}

// ---------------------------------------------------------------------------
// SSE
// ---------------------------------------------------------------------------

export interface SSEEvent {
  event: string;
  data: Record<string, unknown>;
}
