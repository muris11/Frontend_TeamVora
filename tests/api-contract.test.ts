/**
 * API Contract Tests — TeamVora
 *
 * Validates that frontend TypeScript types match backend API responses.
 * Run with: npx vitest run tests/api-contract.test.ts
 * Or manually: npx tsx tests/api-contract.test.ts
 *
 * Requires .env.local with NEXT_PUBLIC_API_URL and valid auth token.
 */

import { describe, test, expect, beforeAll } from "vitest";
import api from "@/lib/api";
import type {
  User,
  Team,
  AuthResponse,
  ImpersonateResponse,
  Task,
  TaskIndexResponse,
  TeamMedia,
  SplitBill,
  SplitBillIndexResponse,
  BillItem,
  RecurringBill,
  RecurringBillShowResponse,
  RecurringBillHistoryResponse,
  CashBook,
  CashBookIndexResponse,
  DailyLog,
  DailyLogExportResponse,
  Blog,
  ContactMessage,
  Setting,
  MembersResponse,
  Role,
  DashboardStatsResponse,
  TeamInvitation,
  PlatformSettingsResponse,
  SystemStatusResponse,
  EnvConfigResponse,
  Notification,
  PaginatedResponse,
  ApiResponse,
} from "@/types/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function assertType<T>(_value: T): void {}

function assertUser(u: unknown, label = "user"): User {
  const obj = u as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(typeof obj.id).toBe("number");
  expect(obj).toHaveProperty("name");
  expect(typeof obj.name).toBe("string");
  expect(obj).toHaveProperty("email");
  expect(typeof obj.email).toBe("string");
  expect(obj).toHaveProperty("phone");
  expect(obj).toHaveProperty("avatar_url");
  expect(obj).toHaveProperty("role");
  expect(["super_admin", "team_leader", "member"]).toContain(obj.role);
  expect(obj).toHaveProperty("team_id");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as User;
}

function assertTeam(t: unknown, label = "team"): Team {
  const obj = t as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(typeof obj.id).toBe("number");
  expect(obj).toHaveProperty("name");
  expect(obj).toHaveProperty("slug");
  expect(obj).toHaveProperty("description");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as Team;
}

function assertTask(t: unknown): Task {
  const obj = t as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("priority");
  expect(["low", "medium", "high"]).toContain(obj.priority);
  expect(obj).toHaveProperty("status");
  expect(["todo", "in_progress", "done"]).toContain(obj.status);
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as Task;
}

function assertBillItem(b: unknown): BillItem {
  const obj = b as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("split_bill_id");
  expect(obj).toHaveProperty("amount");
  expect(typeof obj.amount).toBe("number");
  expect(obj).toHaveProperty("status");
  expect(["unpaid", "pending_verification", "paid"]).toContain(obj.status);
  expect(obj).toHaveProperty("proof_url");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as BillItem;
}

function assertSplitBill(b: unknown): SplitBill {
  const obj = b as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("total_amount");
  expect(typeof obj.total_amount).toBe("number");
  expect(obj).toHaveProperty("due_date");
  expect(obj).toHaveProperty("status");
  expect(obj).toHaveProperty("created_at");
  if (obj.items) {
    expect(Array.isArray(obj.items)).toBe(true);
    (obj.items as unknown[]).forEach(assertBillItem);
  }
  return obj as unknown as SplitBill;
}

function assertCashBook(c: unknown): CashBook {
  const obj = c as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("type");
  expect(["in", "out"]).toContain(obj.type);
  expect(obj).toHaveProperty("amount");
  expect(typeof obj.amount).toBe("number");
  expect(obj).toHaveProperty("date");
  expect(obj).toHaveProperty("attachment_url");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as CashBook;
}

function assertDailyLog(l: unknown): DailyLog {
  const obj = l as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("log_date");
  expect(obj).toHaveProperty("content");
  expect(obj).toHaveProperty("attachment_url");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as DailyLog;
}

function assertBlog(b: unknown): Blog {
  const obj = b as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("slug");
  expect(obj).toHaveProperty("content");
  expect(obj).toHaveProperty("status");
  expect(["draft", "published"]).toContain(obj.status);
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as Blog;
}

function assertRecurringBill(r: unknown): RecurringBill {
  const obj = r as Record<string, unknown>;
  expect(obj).toHaveProperty("id");
  expect(obj).toHaveProperty("title");
  expect(obj).toHaveProperty("amount");
  expect(typeof obj.amount).toBe("number");
  expect(obj).toHaveProperty("frequency");
  expect(["daily", "weekly", "monthly", "quarterly", "yearly", "custom_days"]).toContain(obj.frequency);
  expect(obj).toHaveProperty("status");
  expect(obj).toHaveProperty("start_date");
  expect(obj).toHaveProperty("created_at");
  return obj as unknown as RecurringBill;
}

// ---------------------------------------------------------------------------
// Test suites
// ---------------------------------------------------------------------------

let AUTH_TOKEN = "";

beforeAll(() => {
  // Set token via env or localStorage fallback
  AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || "";
  if (AUTH_TOKEN) {
    api.defaults.headers.common.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
});

describe("API Contract: Auth", () => {
  test("POST /login returns AuthResponse shape", async () => {
    const res = await api.post("/login", {
      email: process.env.TEST_EMAIL || "test@test.com",
      password: process.env.TEST_PASSWORD || "password",
    });
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("user");
    expect(data).toHaveProperty("token");
    expect(typeof data.token).toBe("string");

    assertUser(data.user);
  });

  test("POST /me returns User shape", async () => {
    const res = await api.get("/me");
    assertUser(res.data);
  });

  test("PUT /profile returns updated User shape", async () => {
    const res = await api.put("/profile", {
      name: "Test User",
      email: process.env.TEST_EMAIL || "test@test.com",
    });
    assertUser(res.data);
  });

  test("PUT /password returns message", async () => {
    // This test is skipped by default — uncomment to test with real password
    // const res = await api.put("/password", {
    //   current_password: "password",
    //   password: "newpassword123",
    //   password_confirmation: "newpassword123",
    // });
    // expect(res.data).toHaveProperty("message");
  });

  test("POST /logout returns message", async () => {
    const res = await api.post("/logout");
    expect(res.data).toHaveProperty("message");
    expect(typeof res.data.message).toBe("string");
  });
});

describe("API Contract: Teams", () => {
  test("GET /teams returns array of Team", async () => {
    const res = await api.get("/teams");
    const data = res.data as unknown[];
    expect(Array.isArray(data)).toBe(true);
    data.forEach((item) => assertTeam(item));
  });

  test("GET /teams/{id} returns Team shape", async () => {
    const list = await api.get("/teams");
    const teams = list.data as unknown[];
    if (teams.length === 0) return;

    const teamId = (teams[0] as Record<string, unknown>).id;
    const res = await api.get(`/teams/${teamId}`);
    assertTeam(res.data);
  });

  test("GET /teams/{id}/members returns array of User", async () => {
    const list = await api.get("/teams");
    const teams = list.data as unknown[];
    if (teams.length === 0) return;

    const teamId = (teams[0] as Record<string, unknown>).id;
    const res = await api.get(`/teams/${teamId}/members`);
    const members = res.data as unknown[];
    expect(Array.isArray(members)).toBe(true);
    members.forEach((m) => assertUser(m, "member"));
  });

  test("GET /teams/{id}/invitations returns array of TeamInvitation", async () => {
    const list = await api.get("/teams");
    const teams = list.data as unknown[];
    if (teams.length === 0) return;

    const teamId = (teams[0] as Record<string, unknown>).id;
    const res = await api.get(`/teams/${teamId}/invitations`);
    const invitations = res.data as unknown[];
    expect(Array.isArray(invitations)).toBe(true);
    invitations.forEach((inv) => {
      const obj = inv as Record<string, unknown>;
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("email");
      expect(obj).toHaveProperty("status");
      expect(obj).toHaveProperty("expires_at");
      expect(obj).toHaveProperty("is_expired");
    });
  });
});

describe("API Contract: Tasks", () => {
  test("GET /tasks returns TaskIndexResponse shape", async () => {
    const res = await api.get("/tasks");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data).toHaveProperty("users");
    expect(Array.isArray(data.users)).toBe(true);

    (data.data as unknown[]).forEach(assertTask);
    (data.users as unknown[]).forEach((u) => {
      const obj = u as Record<string, unknown>;
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("name");
    });
  });

  test("GET /tasks/{id} returns Task shape", async () => {
    const list = await api.get("/tasks");
    const tasks = (list.data as Record<string, unknown>).data as unknown[];
    if (tasks.length === 0) return;

    const taskId = (tasks[0] as Record<string, unknown>).id;
    const res = await api.get(`/tasks/${taskId}`);
    assertTask(res.data);
  });
});

describe("API Contract: Media", () => {
  test("GET /media/documents returns paginated TeamMedia", async () => {
    const res = await api.get("/media/documents");
    const data = res.data as Record<string, unknown>;

    // Could be paginated or direct array
    const items = Array.isArray(data) ? data : (data.data as unknown[]) || [];
    items.forEach((m) => {
      const obj = m as Record<string, unknown>;
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("type");
      expect(["document", "gallery"]).toContain(obj.type);
      expect(obj).toHaveProperty("name");
      expect(obj).toHaveProperty("file_path");
      expect(obj).toHaveProperty("size");
      expect(typeof obj.size).toBe("number");
      expect(obj).toHaveProperty("mime_type");
      expect(obj).toHaveProperty("created_at");
    });
  });

  test("GET /media/gallery returns paginated TeamMedia", async () => {
    const res = await api.get("/media/gallery");
    const data = res.data as Record<string, unknown>;
    const items = Array.isArray(data) ? data : (data.data as unknown[]) || [];
    expect(Array.isArray(items)).toBe(true);
  });
});

describe("API Contract: Contact", () => {
  test("POST /contact returns ContactMessage shape", async () => {
    const res = await api.post("/contact", {
      first_name: "Test",
      last_name: "User",
      email: "contract-test@example.com",
      message: "This is a contract test message with enough length.",
    });
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("message");
    expect(data).toHaveProperty("data");
    const msg = data.data as Record<string, unknown>;
    expect(msg).toHaveProperty("id");
    expect(msg).toHaveProperty("first_name");
    expect(msg).toHaveProperty("last_name");
    expect(msg).toHaveProperty("email");
    expect(msg).toHaveProperty("message");
    expect(msg).toHaveProperty("is_read");
    expect(typeof msg.is_read).toBe("boolean");
    expect(msg).toHaveProperty("created_at");
  });
});

describe("API Contract: Settings", () => {
  test("GET /settings returns SettingsResponse shape", async () => {
    const res = await api.get("/settings");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(typeof data.data).toBe("object");
  });

  test("GET /settings/{group} returns SettingsResponse shape", async () => {
    const res = await api.get("/settings/general");
    const data = res.data as Record<string, unknown>;
    expect(data).toHaveProperty("data");
    expect(typeof data.data).toBe("object");
  });

  test("POST /settings returns message", async () => {
    const res = await api.post("/settings", {
      settings: { test_key: "test_value" },
    });
    expect(res.data).toHaveProperty("message");
  });
});

describe("API Contract: Cash Book", () => {
  test("GET /cash-books returns CashBookIndexResponse shape", async () => {
    const res = await api.get("/cash-books");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data).toHaveProperty("summary");
    const summary = data.summary as Record<string, unknown>;
    expect(summary).toHaveProperty("total_in");
    expect(typeof summary.total_in).toBe("number");
    expect(summary).toHaveProperty("total_out");
    expect(typeof summary.total_out).toBe("number");
    expect(summary).toHaveProperty("balance");
    expect(typeof summary.balance).toBe("number");

    (data.data as unknown[]).forEach(assertCashBook);
  });
});

describe("API Contract: Split Bills", () => {
  test("GET /split-bills returns SplitBillIndexResponse shape", async () => {
    const res = await api.get("/split-bills");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);
    expect(data).toHaveProperty("users");
    expect(Array.isArray(data.users)).toBe(true);

    (data.data as unknown[]).forEach(assertSplitBill);
  });
});

describe("API Contract: Recurring Bills", () => {
  test("GET /recurring-bills returns paginated RecurringBill", async () => {
    const res = await api.get("/recurring-bills");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);

    (data.data as unknown[]).forEach(assertRecurringBill);
  });
});

describe("API Contract: Daily Logs", () => {
  test("GET /daily-logs returns paginated DailyLog", async () => {
    const res = await api.get("/daily-logs");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);

    (data.data as unknown[]).forEach(assertDailyLog);
  });

  test("GET /daily-logs/export returns DailyLogExportResponse shape", async () => {
    const res = await api.get("/daily-logs/export");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("user");
    const user = data.user as Record<string, unknown>;
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");

    expect(data).toHaveProperty("logs");
    expect(Array.isArray(data.logs)).toBe(true);
    (data.logs as unknown[]).forEach(assertDailyLog);
  });
});

describe("API Contract: Blogs", () => {
  test("GET /blogs/public returns array of published Blog", async () => {
    const res = await api.get("/blogs/public");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);

    (data.data as unknown[]).forEach(assertBlog);
  });

  test("GET /blogs/manage returns paginated Blog", async () => {
    const res = await api.get("/blogs/manage");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);

    (data.data as unknown[]).forEach(assertBlog);
  });
});

describe("API Contract: Members", () => {
  test("GET /members returns MembersResponse shape", async () => {
    const res = await api.get("/members");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("users");
    expect(Array.isArray(data.users)).toBe(true);
    (data.users as unknown[]).forEach((u) => assertUser(u, "member"));

    expect(data).toHaveProperty("roles");
    expect(Array.isArray(data.roles)).toBe(true);
    (data.roles as unknown[]).forEach((r) => {
      const obj = r as Record<string, unknown>;
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("name");
      expect(obj).toHaveProperty("permissions");
      expect(Array.isArray(obj.permissions)).toBe(true);
    });

    expect(data).toHaveProperty("permissions");
    expect(Array.isArray(data.permissions)).toBe(true);
  });
});

describe("API Contract: Dashboard", () => {
  test("GET /dashboard/stats returns DashboardStatsResponse shape", async () => {
    const res = await api.get("/dashboard/stats");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("finance");
    const finance = data.finance as Record<string, unknown>;
    expect(finance).toHaveProperty("balance");
    expect(typeof finance.balance).toBe("number");
    expect(finance).toHaveProperty("monthly_expense");
    expect(typeof finance.monthly_expense).toBe("number");
    expect(finance).toHaveProperty("total_in");
    expect(typeof finance.total_in).toBe("number");
    expect(finance).toHaveProperty("total_out");
    expect(typeof finance.total_out).toBe("number");

    expect(data).toHaveProperty("unpaid_bills");
    expect(Array.isArray(data.unpaid_bills)).toBe(true);

    expect(data).toHaveProperty("active_tasks");
    expect(Array.isArray(data.active_tasks)).toBe(true);
    (data.active_tasks as unknown[]).forEach(assertTask);
  });
});

describe("API Contract: Notifications", () => {
  test("GET /notifications returns paginated notifications", async () => {
    const res = await api.get("/notifications");
    const data = res.data as Record<string, unknown>;

    expect(data).toHaveProperty("data");
    expect(Array.isArray(data.data)).toBe(true);

    (data.data as unknown[]).forEach((n) => {
      const obj = n as Record<string, unknown>;
      expect(obj).toHaveProperty("id");
      expect(obj).toHaveProperty("type");
      expect(obj).toHaveProperty("data");
      expect(obj).toHaveProperty("created_at");
    });
  });
});

describe("API Contract: Platform Settings (public)", () => {
  test("GET /platform-settings returns PlatformSettingsResponse shape", async () => {
    const res = await api.get("/platform-settings");
    const data = res.data as Record<string, unknown>;
    expect(data).toHaveProperty("data");
    expect(typeof data.data).toBe("object");
  });
});
