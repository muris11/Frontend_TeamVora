// Re-export all API types as the canonical source
export * from "./api";

// Legacy re-exports for backward compatibility
// All types now live in api.ts — import from there for new code
import type {
  User,
  Team,
  PaginatedResponse,
  CashBook,
  SplitBill,
  BillItem,
  RecurringBill,
  Task,
  DailyLog,
  TeamMedia,
  DashboardStatsResponse,
  Blog,
  TeamInvitation,
  Notification,
} from "./api";

export type {
  User,
  Team,
  PaginatedResponse,
  CashBook,
  SplitBill,
  BillItem,
  RecurringBill,
  Task,
  DailyLog,
  TeamMedia,
  DashboardStatsResponse as DashboardStats,
  Blog,
  TeamInvitation,
  Notification,
};
