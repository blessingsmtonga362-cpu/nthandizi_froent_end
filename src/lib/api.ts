/**
 * Central API client.
 * Set NEXT_PUBLIC_API_URL in your .env.local to point at your backend,
 * e.g.  NEXT_PUBLIC_API_URL=http://localhost:8000/api
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ─── Token helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  role: "student" | "admin";
  firstName?: string;
  lastName?: string;
  registrationNumber?: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface Notification {
  id: string | number;
  type: "success" | "info" | "urgent" | "warning";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export interface ApplicationStatus {
  status: "draft" | "submitted" | "reviewing" | "approved" | "rejected";
  completedSteps: number;
  totalSteps: number;
  lastSaved: string | null;
  submittedAt: string | null;
}

export interface DashboardStats {
  totalApplications: number;
  approvedSupport: number;
  flaggedFiles: number;
  priorityQueue: PriorityStudent[];
}

export interface PriorityStudent {
  name: string;
  id: string;
  program: string;
  score: number;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST" }).catch(() => {});
  removeToken();
}

// ─── Student ──────────────────────────────────────────────────────────────────

export async function getApplicationStatus(): Promise<ApplicationStatus> {
  return request<ApplicationStatus>("/student/application/status");
}

export async function getStudentNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/student/notifications");
}

export async function markNotificationRead(id: string | number): Promise<void> {
  return request<void>(`/student/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  return request<void>("/student/notifications/read-all", { method: "PATCH" });
}

export async function clearAllNotifications(): Promise<void> {
  return request<void>("/student/notifications", { method: "DELETE" });
}

export async function submitApplication(payload: unknown): Promise<{ message: string }> {
  return request<{ message: string }>("/student/application/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveApplicationDraft(payload: unknown): Promise<void> {
  return request<void>("/student/application/draft", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>("/admin/dashboard/stats");
}

export async function getAdminNotifications(): Promise<Notification[]> {
  return request<Notification[]>("/admin/notifications");
}

export async function markAdminNotificationRead(id: string | number): Promise<void> {
  return request<void>(`/admin/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllAdminNotificationsRead(): Promise<void> {
  return request<void>("/admin/notifications/read-all", { method: "PATCH" });
}

export async function clearAllAdminNotifications(): Promise<void> {
  return request<void>("/admin/notifications", { method: "DELETE" });
}
