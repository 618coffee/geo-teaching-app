const API_BASE = import.meta.env.VITE_API_BASE ?? '';

interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
}

interface ApiErrorBody {
  success: false;
  error: { code: string; message: string };
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = window.localStorage.getItem('geo-teaching-app-access-token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      // ignore parse error
    }

    throw new ApiError(
      res.status,
      body?.error?.code ?? 'UNKNOWN',
      body?.error?.message ?? `请求失败 (${res.status})`,
    );
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const json = (await res.json()) as ApiSuccessResponse<T>;
  return json.data;
}

// ── Auth API types ──

export interface ApiAuthUser {
  id: string;
  account: string;
  channel: 'PHONE' | 'EMAIL';
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  displayName: string;
  createdAt: string;
}

export interface ApiAuthResult {
  accessToken: string;
  user: ApiAuthUser;
}

export interface ApiAuthUserEnvelope {
  user: ApiAuthUser;
}

// ── Auth API calls ──

export function apiRegister(data: {
  account: string;
  password: string;
  displayName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}) {
  return request<ApiAuthResult>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiLoginWithPassword(account: string, password: string) {
  return request<ApiAuthResult>('/api/v1/auth/login/password', {
    method: 'POST',
    body: JSON.stringify({ account, password }),
  });
}

export function apiGetMe() {
  return request<ApiAuthUserEnvelope>('/api/v1/auth/me');
}

export function apiLogout() {
  return request<void>('/api/v1/auth/logout', { method: 'POST' });
}

// ── Class API types ──

export interface ApiClassItem {
  id: string;
  name: string;
  students: number;
  teacher: string;
  status: string;
  createdAt: string;
}

// ── Class API calls ──

export function apiListClasses() {
  return request<ApiClassItem[]>('/api/v1/classes');
}

export function apiCreateClass(data: { name: string; teacherName?: string }) {
  return request<ApiClassItem>('/api/v1/classes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiDeleteClass(id: string) {
  return request<void>(`/api/v1/classes/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function apiUpdateClass(id: string, data: { name: string; teacherName?: string }) {
  return request<ApiClassItem>(`/api/v1/classes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Student API types ──

export interface ApiStudentItem {
  id: string;
  name: string;
  className: string;
  classId: string;
  studentId: string;
  status: string;
  createdAt: string;
}

// ── Student API calls ──

export function apiListStudents(classId?: string) {
  const query = classId ? `?classId=${encodeURIComponent(classId)}` : '';
  return request<ApiStudentItem[]>(`/api/v1/students${query}`);
}

export function apiCreateStudent(data: {
  classId: string;
  studentNumber: string;
  name: string;
  password?: string;
}) {
  return request<ApiStudentItem>('/api/v1/students', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function apiDeleteStudent(id: string) {
  return request<void>(`/api/v1/students/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function apiUpdateStudent(id: string, data: { name: string; classId: string; status?: string }) {
  return request<ApiStudentItem>(`/api/v1/students/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── Profile API ──

export function apiUpdateProfile(data: { displayName: string }) {
  return request<ApiAuthUser>('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface TeachingClassesData {
  classIds: string[];
}

export function apiGetTeachingClasses() {
  return request<TeachingClassesData>('/api/v1/profile/teaching-classes');
}

export function apiSetTeachingClasses(classIds: string[]) {
  return request<TeachingClassesData>('/api/v1/profile/teaching-classes', {
    method: 'PUT',
    body: JSON.stringify({ classIds }),
  });
}
