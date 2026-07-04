export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: "super_admin" | "team_leader" | "member";
  team_id?: number;
  team?: Team;
  roles?: string[];
  permissions?: string[];
  created_at: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  description?: string;
  leader?: User;
  members_count?: number;
  settings?: Record<string, unknown>;
  created_at: string;
}

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
    prev?: string;
    next?: string;
  };
}

export interface CashBook {
  id: string;
  title: string;
  description?: string;
  type: "in" | "out";
  amount: number;
  date: string;
  attachment_url?: string;
  created_by?: User;
  created_at: string;
}

export interface SplitBill {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  due_date: string;
  status: string;
  creator?: User;
  items?: BillItem[];
  parent_recurring_bill_id?: string;
  created_at: string;
}

export interface BillItem {
  id: string;
  split_bill_id: string;
  user?: User;
  amount: number;
  status: "unpaid" | "pending_verification" | "paid";
  proof_url?: string;
  verified_by?: User;
  verified_at?: string;
  created_at: string;
}

export interface RecurringBill {
  id: string;
  title: string;
  description?: string;
  amount: number;
  frequency: string;
  interval_days?: number;
  due_day?: number;
  status: string;
  start_date: string;
  end_date?: string;
  assignee_ids?: number[];
  notify_days_before_due?: number;
  next_generation_at?: string;
  creator?: User;
  generations_count?: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: User;
  creator?: User;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  due_date?: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user?: User;
  title: string;
  log_date: string;
  content: string;
  attachment_url?: string;
  created_at: string;
}

export interface TeamMedia {
  id: string;
  user?: User;
  type: "document" | "gallery";
  name: string;
  file_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export interface DashboardStats {
  finance: {
    balance: number;
    monthly_expense: number;
    total_in: number;
    total_out: number;
  };
  unpaid_bills: BillItem[];
  active_tasks: Task[];
}

export interface Blog {
  id: number;
  team_id?: number;
  author_id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: "draft" | "published";
  featured_image?: string;
  published_at?: string;
  author?: User;
  created_at: string;
}

export interface TeamInvitation {
  id: number;
  team_id: number;
  invited_by: number;
  email: string;
  token: string;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  created_at: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  read_at?: string;
  created_at: string;
}
