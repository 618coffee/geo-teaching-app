const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

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
