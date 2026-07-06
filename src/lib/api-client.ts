import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ImpersonateResponse,
  User,
  Team,
  CreateTeamRequest,
  UpdateTeamRequest,
  SwitchTeamRequest,
  InviteMemberRequest,
  TeamInvitation,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
  ReorderTasksRequest,
  TaskIndexResponse,
  SplitBill,
  CreateSplitBillRequest,
  UpdateSplitBillRequest,
  SplitBillIndexResponse,
  BillItem,
  VerifyBillItemRequest,
  RecurringBill,
  CreateRecurringBillRequest,
  UpdateRecurringBillRequest,
  RecurringBillShowResponse,
  RecurringBillHistoryResponse,
  CashBook,
  CreateCashBookRequest,
  UpdateCashBookRequest,
  CashBookIndexResponse,
  DailyLog,
  CreateDailyLogRequest,
  UpdateDailyLogRequest,
  DailyLogExportResponse,
  TeamMedia,
  UploadMediaRequest,
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  PaginatedResponse,
  MembersResponse,
  Role,
  Permission,
  UpdateMemberRoleRequest,
  UpdateMemberPermissionsRequest,
  UpdateRolePermissionsRequest,
  ContactMessage,
  StoreContactRequest,
  SettingsResponse,
  SettingsGroupResponse,
  UpdateSettingsRequest,
  UpdateSettingsGroupRequest,
  PlatformSettingsResponse,
  UpdatePlatformSettingsRequest,
  TestEmailRequest,
  SystemStatusResponse,
  DashboardStatsResponse,
  Notification,
  UpdateTeamMemberRequest,
  InvitationAcceptSuccess,
  InvitationAcceptNeedRegister,
  EmailSettingsResponse,
  UpdateEmailSettingsRequest,
  EmailPreviewResponse,
  EnvConfigResponse,
  UpdateEnvConfigRequest,
} from "@/types/api";

// ============================================================================
// Type-safe API Client
// Each method returns a typed AxiosPromise matching the backend response.
// ============================================================================

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/login", data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/register", data),

  logout: () =>
    api.post<{ message: string }>("/logout"),

  me: () =>
    api.get<User & { impersonator?: { id: number; name: string; email: string } }>("/me"),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<User>("/profile", data),

  updatePassword: (data: UpdatePasswordRequest) =>
    api.put<{ message: string }>("/password", data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<{ message: string }>("/forgot-password", data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<{ message: string }>("/reset-password", data),

  impersonate: (userId: number) =>
    api.post<ImpersonateResponse>(`/impersonate/${userId}`),

  stopImpersonation: () =>
    api.post<AuthResponse>("/stop-impersonation"),
};

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------

export const teamApi = {
  list: () =>
    api.get<Team[]>("/teams"),

  create: (data: CreateTeamRequest) =>
    api.post<Team>("/teams", data),

  get: (id: number) =>
    api.get<Team>(`/teams/${id}`),

  update: (id: number, data: UpdateTeamRequest) =>
    api.put<Team>(`/teams/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/teams/${id}`),

  members: (teamId: number) =>
    api.get<User[]>(`/teams/${teamId}/members`),

  invite: (teamId: number, data: InviteMemberRequest) =>
    api.post<User>(`/teams/${teamId}/invite`, data),

  removeMember: (teamId: number, userId: number) =>
    api.delete<{ message: string }>(`/teams/${teamId}/members/${userId}`),

  updateMember: (teamId: number, userId: number, data: UpdateTeamMemberRequest) =>
    api.put<User>(`/teams/${teamId}/members/${userId}/update`, data),

  switchTeam: (data: SwitchTeamRequest) =>
    api.post<{ message: string; team_id: number | null }>("/teams/switch", data),
};

// ---------------------------------------------------------------------------
// Team Invitations
// ---------------------------------------------------------------------------

export const teamInvitationApi = {
  send: (teamId: number, data: { email: string }) =>
    api.post<TeamInvitation>(`/teams/${teamId}/invitations`, data),

  list: (teamId: number) =>
    api.get<TeamInvitation[]>(`/teams/${teamId}/invitations`),

  accept: (token: string) =>
    api.get<InvitationAcceptSuccess | InvitationAcceptNeedRegister>(`/invitations/${token}/accept`),
};

// ---------------------------------------------------------------------------
// Members & Roles
// ---------------------------------------------------------------------------

export const memberApi = {
  list: () =>
    api.get<MembersResponse>("/members"),

  updateRole: (userId: number, data: UpdateMemberRoleRequest) =>
    api.put<User>(`/members/${userId}/role`, data),

  updatePermissions: (userId: number, data: UpdateMemberPermissionsRequest) =>
    api.put<User>(`/members/${userId}/permissions`, data),

  updateRolePermissions: (roleId: number, data: UpdateRolePermissionsRequest) =>
    api.put<{ message: string; role: Role }>(`/roles/${roleId}/permissions`, data),
};

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const taskApi = {
  list: () =>
    api.get<TaskIndexResponse>("/tasks"),

  create: (data: CreateTaskRequest) =>
    api.post<Task>("/tasks", data),

  get: (id: number) =>
    api.get<Task>(`/tasks/${id}`),

  update: (id: number, data: UpdateTaskRequest) =>
    api.put<Task>(`/tasks/${id}`, data),

  updateStatus: (id: number, data: UpdateTaskStatusRequest) =>
    api.patch<Task>(`/tasks/${id}/status`, data),

  reorder: (data: ReorderTasksRequest) =>
    api.patch<{ message: string }>("/tasks/reorder", data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/tasks/${id}`),
};

// ---------------------------------------------------------------------------
// Split Bills
// ---------------------------------------------------------------------------

export const splitBillApi = {
  list: (params?: { page?: number }) =>
    api.get<SplitBillIndexResponse>("/split-bills", { params }),

  create: (data: CreateSplitBillRequest) =>
    api.post<SplitBill>("/split-bills", data),

  get: (id: number) =>
    api.get<SplitBill>(`/split-bills/${id}`),

  update: (id: number, data: UpdateSplitBillRequest) =>
    api.put<SplitBill>(`/split-bills/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/split-bills/${id}`),
};

// ---------------------------------------------------------------------------
// Bill Items
// ---------------------------------------------------------------------------

export const billItemApi = {
  pay: (id: number, formData: FormData) =>
    api.post<BillItem>(`/bill-items/${id}/pay`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  verify: (id: number, data: VerifyBillItemRequest) =>
    api.put<BillItem>(`/bill-items/${id}/verify`, data),
};

// ---------------------------------------------------------------------------
// Recurring Bills
// ---------------------------------------------------------------------------

export const recurringBillApi = {
  list: (params?: { status?: string; frequency?: string; page?: number }) =>
    api.get<PaginatedResponse<RecurringBill>>("/recurring-bills", { params }),

  create: (data: CreateRecurringBillRequest) =>
    api.post<RecurringBill>("/recurring-bills", data),

  get: (id: number) =>
    api.get<RecurringBillShowResponse>(`/recurring-bills/${id}`),

  update: (id: number, data: UpdateRecurringBillRequest) =>
    api.put<RecurringBill>(`/recurring-bills/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/recurring-bills/${id}`),

  generate: (id: number) =>
    api.post<{ message: string }>(`/recurring-bills/${id}/generate`),

  history: (id: number) =>
    api.get<RecurringBillHistoryResponse>(`/recurring-bills/${id}/history`),

  toggleActive: (id: number) =>
    api.post<RecurringBill>(`/recurring-bills/${id}/toggle-active`),
};

// ---------------------------------------------------------------------------
// Cash Book
// ---------------------------------------------------------------------------

export const cashBookApi = {
  list: (params?: { page?: number }) =>
    api.get<CashBookIndexResponse>("/cash-books", { params }),

  create: (data: FormData) =>
    api.post<CashBook>("/cash-books", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  get: (id: number) =>
    api.get<CashBook>(`/cash-books/${id}`),

  update: (id: number, data: UpdateCashBookRequest) =>
    api.put<CashBook>(`/cash-books/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/cash-books/${id}`),

  history: (id: number) =>
    api.get<unknown[]>(`/cash-books/${id}/history`),
};

// ---------------------------------------------------------------------------
// Daily Logs
// ---------------------------------------------------------------------------

export const dailyLogApi = {
  list: (params?: { page?: number }) =>
    api.get<PaginatedResponse<DailyLog>>("/daily-logs", { params }),

  create: (data: FormData) =>
    api.post<DailyLog>("/daily-logs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  get: (id: number) =>
    api.get<DailyLog>(`/daily-logs/${id}`),

  update: (id: number, data: UpdateDailyLogRequest) =>
    api.put<DailyLog>(`/daily-logs/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/daily-logs/${id}`),

  exportData: () =>
    api.get<DailyLogExportResponse>("/daily-logs/export"),
};

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export const mediaApi = {
  documents: (params?: { page?: number }) =>
    api.get<PaginatedResponse<TeamMedia>>("/media/documents", { params }),

  gallery: (params?: { page?: number }) =>
    api.get<PaginatedResponse<TeamMedia>>("/media/gallery", { params }),

  upload: (data: FormData) =>
    api.post<TeamMedia>("/media", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/media/${id}`),
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export const blogApi = {
  publicList: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Blog>>("/blogs/public", { params }),

  getBySlug: (slug: string) =>
    api.get<Blog>(`/blogs/${slug}`),

  manage: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Blog>>("/blogs/manage", { params }),

  create: (data: CreateBlogRequest) =>
    api.post<Blog>("/blogs", data),

  update: (id: number, data: UpdateBlogRequest) =>
    api.put<Blog>(`/blogs/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/blogs/${id}`),
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactApi = {
  store: (data: StoreContactRequest) =>
    api.post<{ message: string; data: ContactMessage }>("/contact", data),

  list: (params?: { unread?: boolean; page?: number }) =>
    api.get<{ data: ContactMessage[] }>("/contact", { params }),

  markRead: (id: number) =>
    api.post<{ message: string }>(`/contact/${id}/read`),
};

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const settingApi = {
  list: () =>
    api.get<SettingsResponse>("/settings"),

  update: (data: UpdateSettingsRequest) =>
    api.post<{ message: string }>("/settings", data),

  getByGroup: (group: string) =>
    api.get<SettingsGroupResponse>(`/settings/${group}`),

  updateGroup: (group: string, data: UpdateSettingsGroupRequest) =>
    api.put<{ message: string }>(`/settings/${group}`, data),
};

// ---------------------------------------------------------------------------
// Admin Platform Settings
// ---------------------------------------------------------------------------

export const adminPlatformApi = {
  getSettings: () =>
    api.get<PlatformSettingsResponse>("/platform-settings"),

  updateSettings: (data: UpdatePlatformSettingsRequest) =>
    api.put<{ message: string }>("/admin/platform-settings", data),

  testEmail: (data: TestEmailRequest) =>
    api.post<{ message: string }>("/admin/platform-settings/test-email", data),

  getSystemStatus: () =>
    api.get<SystemStatusResponse>("/admin/system-status"),

  getEnvConfig: () =>
    api.get<EnvConfigResponse>("/admin/env-config"),

  updateEnvConfig: (data: UpdateEnvConfigRequest) =>
    api.put<{ message: string }>("/admin/env-config", data),
};

// ---------------------------------------------------------------------------
// Admin Platform Settings (public, no auth)
// ---------------------------------------------------------------------------

export const publicPlatformApi = {
  getSettings: () =>
    api.get<PlatformSettingsResponse>("/platform-settings"),
};

// ---------------------------------------------------------------------------
// Email Settings (Super Admin)
// ---------------------------------------------------------------------------

export const emailSettingsApi = {
  getSettings: () =>
    api.get<EmailSettingsResponse>("/email-settings"),

  updateSettings: (data: UpdateEmailSettingsRequest) =>
    api.post<{ message: string }>("/email-settings", data),

  getPreview: () =>
    api.get<EmailPreviewResponse>("/email-settings/preview"),

  getConfig: () =>
    api.get<SettingsResponse>("/email-config"),
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export const dashboardApi = {
  stats: () =>
    api.get<DashboardStatsResponse>("/dashboard/stats"),

  member: () =>
    api.get<unknown>("/dashboard/member"),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notificationApi = {
  list: (params?: { page?: number }) =>
    api.get<PaginatedResponse<Notification>>("/notifications", { params }),

  markRead: (id: string) =>
    api.post<{ message: string }>(`/notifications/${id}/read`),

  markAllRead: () =>
    api.post<{ message: string }>("/notifications/read-all"),
};
