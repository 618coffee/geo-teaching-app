import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  apiRegister,
  apiLoginWithPassword,
  apiLogout,
  type ApiAuthUser,
  ApiError,
} from './api';

export type UserRole = 'student' | 'teacher' | 'admin';
export type AuthChannel = 'phone' | 'email' | 'username' | 'student_id';

export interface AuthUser {
  id: string;
  account: string;
  channel: AuthChannel;
  role: UserRole;
  displayName: string;
  createdAt: string;
}

interface StoredAuthUser extends AuthUser {
  password: string;
}

interface RegisterInput {
  account: string;
  password: string;
  displayName: string;
  role: UserRole;
}

interface LoginWithPasswordInput {
  account: string;
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isRemoteMode: boolean;
  mockUsers: AuthUser[];
  register: (input: RegisterInput) => Promise<AuthUser>;
  loginWithPassword: (input: LoginWithPasswordInput) => Promise<AuthUser>;
  loginAsMockRole: (role: UserRole) => AuthUser;
  updateProfile: (input: { displayName: string }) => void;
  logout: () => void;
  detectChannel: (value: string) => AuthChannel | null;
}

const SESSION_STORAGE_KEY = 'geo-teaching-app-auth-session';
const TOKEN_STORAGE_KEY = 'geo-teaching-app-access-token';
const USERS_STORAGE_KEY = 'geo-teaching-app-auth-users';

/**
 * Auth mode: 'remote' calls backend API, 'local' uses browser localStorage mock.
 * Default is remote. Set VITE_AUTH_MODE=local for pure frontend development.
 */
const AUTH_MODE: 'remote' | 'local' = (import.meta.env.VITE_AUTH_MODE === 'local') ? 'local' : 'remote';

const phonePattern = /^1[3-9]\d{9}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const defaultRouteByRole: Record<UserRole, string> = {
  student: '/student/tasks',
  teacher: '/teacher/tasks',
  admin: '/admin/modules',
};

const rolePrefixByRole: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  admin: '/admin',
};

const MOCK_AUTH_PASSWORD = 'demo123456';

const MOCK_USERS: StoredAuthUser[] = [
  {
    id: 'mock-student',
    account: 'S2024001',
    channel: 'student_id',
    role: 'student',
    displayName: '演示学生',
    password: MOCK_AUTH_PASSWORD,
    createdAt: '2026-03-19T00:00:00.000Z',
  },
  {
    id: 'mock-teacher',
    account: 'teacher@demo.local',
    channel: 'email',
    role: 'teacher',
    displayName: '演示教师',
    password: MOCK_AUTH_PASSWORD,
    createdAt: '2026-03-19T00:00:00.000Z',
  },
  {
    id: 'mock-admin',
    account: 'admin@demo.local',
    channel: 'email',
    role: 'admin',
    displayName: '演示运营',
    password: MOCK_AUTH_PASSWORD,
    createdAt: '2026-03-19T00:00:00.000Z',
  },
];

const MOCK_USER_ACCOUNTS = new Set(MOCK_USERS.map((user) => user.account));

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Helpers: localStorage ──

function readStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key: string, value: unknown) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStoredValue(key: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(key);
}

function normalizeAccount(account: string) {
  return account.trim().toLowerCase();
}

export function detectAuthChannel(value: string): AuthChannel {
  const normalizedValue = value.trim();

  if (phonePattern.test(normalizedValue)) {
    return 'phone';
  }

  if (emailPattern.test(normalizedValue)) {
    return 'email';
  }

  return 'username';
}

export function getDefaultRouteForRole(role: UserRole) {
  return defaultRouteByRole[role];
}

export function canRoleAccessPath(pathname: string, role: UserRole) {
  return pathname.startsWith(rolePrefixByRole[role]);
}

function sanitizeUser(user: StoredAuthUser): AuthUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

// ── Helpers: local (mock) storage ──

function readUsers() {
  const storedUsers = readStoredJson<StoredAuthUser[]>(USERS_STORAGE_KEY, []);
  const mergedUsers = new Map<string, StoredAuthUser>();

  for (const entry of [...storedUsers, ...MOCK_USERS]) {
    if (!mergedUsers.has(entry.account)) {
      mergedUsers.set(entry.account, entry);
    }
  }

  return Array.from(mergedUsers.values());
}

function writeUsers(users: StoredAuthUser[]) {
  writeStoredJson(
    USERS_STORAGE_KEY,
    users.filter((user) => !MOCK_USER_ACCOUNTS.has(user.account)),
  );
}

function readSessionUser() {
  return readStoredJson<AuthUser | null>(SESSION_STORAGE_KEY, null);
}

function writeSessionUser(user: AuthUser) {
  writeStoredJson(SESSION_STORAGE_KEY, user);
}

function getMockUserByRole(role: UserRole) {
  const nextUser = MOCK_USERS.find((item) => item.role === role);
  if (!nextUser) {
    throw new Error('未找到对应的演示账号。');
  }

  return nextUser;
}

// ── Helpers: convert backend API user to local AuthUser ──

const channelMap: Record<string, AuthChannel> = { PHONE: 'phone', EMAIL: 'email', USERNAME: 'username', phone: 'phone', email: 'email', username: 'username' };
const roleMap: Record<string, UserRole> = { STUDENT: 'student', TEACHER: 'teacher', ADMIN: 'admin', student: 'student', teacher: 'teacher', admin: 'admin' };
const roleToApi: Record<UserRole, 'STUDENT' | 'TEACHER' | 'ADMIN'> = { student: 'STUDENT', teacher: 'TEACHER', admin: 'ADMIN' };

function apiUserToAuthUser(apiUser: ApiAuthUser): AuthUser {
  return {
    id: apiUser.id,
    account: apiUser.account,
    channel: channelMap[apiUser.channel] ?? 'email',
    role: roleMap[apiUser.role] ?? 'student',
    displayName: apiUser.displayName,
    createdAt: apiUser.createdAt,
  };
}

function wrapApiError(e: unknown): never {
  if (e instanceof ApiError) {
    throw new Error(e.message);
  }
  if (e instanceof Error) {
    throw e;
  }
  throw new Error('操作失败，请稍后重试。');
}

// ── Provider ──

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSessionUser);
  const mockUsers = MOCK_USERS.map(sanitizeUser);
  const isRemoteMode = AUTH_MODE === 'remote';

  // ── Register ──

  const register = async (input: RegisterInput): Promise<AuthUser> => {
    if (isRemoteMode) {
      try {
        const res = await apiRegister({
          account: input.account,
          password: input.password,
          displayName: input.displayName,
          role: roleToApi[input.role],
        });
        window.localStorage.setItem(TOKEN_STORAGE_KEY, res.accessToken);
        const authUser = apiUserToAuthUser(res.user);
        writeSessionUser(authUser);
        setUser(authUser);
        return authUser;
      } catch (e) {
        wrapApiError(e);
      }
    }

    // local mode
    const normalizedAccount = normalizeAccount(input.account);
    const channel = detectAuthChannel(normalizedAccount);

    if (input.password.trim().length < 8) {
      throw new Error('密码至少需要 8 位。');
    }

    const users = readUsers();
    const existingUser = users.find((item) => item.account === normalizedAccount);
    if (existingUser) {
      throw new Error('该账号已注册，请直接登录。');
    }

    const nextUser: StoredAuthUser = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      account: normalizedAccount,
      channel,
      role: input.role,
      displayName: input.displayName.trim(),
      password: input.password,
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [nextUser, ...users];
    writeUsers(nextUsers);

    const safeUser = sanitizeUser(nextUser);
    writeSessionUser(safeUser);
    setUser(safeUser);

    return safeUser;
  };

  // ── Login with password ──

  const loginWithPassword = async (input: LoginWithPasswordInput): Promise<AuthUser> => {
    if (isRemoteMode) {
      try {
        const res = await apiLoginWithPassword(input.account, input.password);
        window.localStorage.setItem(TOKEN_STORAGE_KEY, res.accessToken);
        const authUser = apiUserToAuthUser(res.user);
        writeSessionUser(authUser);
        setUser(authUser);
        return authUser;
      } catch (e) {
        wrapApiError(e);
      }
    }

    // local mode
    const normalizedAccount = normalizeAccount(input.account);
    const existingUser = readUsers().find((item) => item.account === normalizedAccount);

    if (!existingUser || existingUser.password !== input.password) {
      throw new Error('账号或密码不正确。');
    }

    const safeUser = sanitizeUser(existingUser);
    writeSessionUser(safeUser);
    setUser(safeUser);

    return safeUser;
  };

  // ── Mock quick-login (always local, available in any mode) ──

  const loginAsMockRole = (role: UserRole) => {
    const safeUser = sanitizeUser(getMockUserByRole(role));
    writeSessionUser(safeUser);
    setUser(safeUser);

    return safeUser;
  };

  // ── Update profile ──

  const updateProfile = (input: { displayName: string }) => {
    if (!user) return;
    const users = readUsers();
    const updatedUsers = users.map((u) =>
      u.account === user.account ? { ...u, displayName: input.displayName.trim() } : u,
    );
    writeUsers(updatedUsers);
    const updatedUser = { ...user, displayName: input.displayName.trim() };
    writeSessionUser(updatedUser);
    setUser(updatedUser);
  };

  // ── Logout ──

  const logout = () => {
    if (isRemoteMode) {
      apiLogout().catch(() => {});
      removeStoredValue(TOKEN_STORAGE_KEY);
    }
    removeStoredValue(SESSION_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isRemoteMode,
        mockUsers,
        register,
        loginWithPassword,
        loginAsMockRole,
        updateProfile,
        logout,
        detectChannel: detectAuthChannel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用。');
  }

  return context;
}
