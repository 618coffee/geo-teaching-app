import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin';
export type AuthChannel = 'phone' | 'email';

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

interface VerificationCodeRecord {
  account: string;
  channel: AuthChannel;
  code: string;
  expiresAt: number;
}

interface RegisterInput {
  account: string;
  code: string;
  password: string;
  displayName: string;
  role: UserRole;
}

interface LoginWithPasswordInput {
  account: string;
  password: string;
}

interface LoginWithCodeInput {
  account: string;
  code: string;
}

interface SendVerificationCodeResult {
  channel: AuthChannel;
  code: string;
  expiresInSeconds: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  sendVerificationCode: (account: string) => SendVerificationCodeResult;
  register: (input: RegisterInput) => AuthUser;
  loginWithPassword: (input: LoginWithPasswordInput) => AuthUser;
  loginWithCode: (input: LoginWithCodeInput) => AuthUser;
  logout: () => void;
  detectChannel: (value: string) => AuthChannel | null;
}

const SESSION_STORAGE_KEY = 'geo-teaching-app-auth-session';
const USERS_STORAGE_KEY = 'geo-teaching-app-auth-users';
const CODES_STORAGE_KEY = 'geo-teaching-app-auth-codes';
const CODE_EXPIRES_IN_SECONDS = 300;

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

const AuthContext = createContext<AuthContextValue | null>(null);

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

export function detectAuthChannel(value: string): AuthChannel | null {
  const normalizedValue = value.trim();

  if (phonePattern.test(normalizedValue)) {
    return 'phone';
  }

  if (emailPattern.test(normalizedValue)) {
    return 'email';
  }

  return null;
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

function readUsers() {
  return readStoredJson<StoredAuthUser[]>(USERS_STORAGE_KEY, []);
}

function writeUsers(users: StoredAuthUser[]) {
  writeStoredJson(USERS_STORAGE_KEY, users);
}

function readSessionUser() {
  return readStoredJson<AuthUser | null>(SESSION_STORAGE_KEY, null);
}

function writeSessionUser(user: AuthUser) {
  writeStoredJson(SESSION_STORAGE_KEY, user);
}

function cleanExpiredCodes(records: Record<string, VerificationCodeRecord>) {
  const now = Date.now();
  let didMutate = false;
  const nextRecords = { ...records };

  for (const [account, record] of Object.entries(records)) {
    if (record.expiresAt <= now) {
      delete nextRecords[account];
      didMutate = true;
    }
  }

  if (didMutate) {
    writeStoredJson(CODES_STORAGE_KEY, nextRecords);
  }

  return nextRecords;
}

function readCodes() {
  return cleanExpiredCodes(readStoredJson<Record<string, VerificationCodeRecord>>(CODES_STORAGE_KEY, {}));
}

function writeCodes(records: Record<string, VerificationCodeRecord>) {
  writeStoredJson(CODES_STORAGE_KEY, records);
}

function generateVerificationCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function verifyCode(account: string, code: string) {
  const normalizedAccount = normalizeAccount(account);
  const records = readCodes();
  const record = records[normalizedAccount];

  if (!record) {
    throw new Error('请先获取验证码，或验证码已过期。');
  }

  if (record.code !== code.trim()) {
    throw new Error('验证码不正确，请重新输入。');
  }

  delete records[normalizedAccount];
  writeCodes(records);

  return record.channel;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSessionUser);

  const sendVerificationCode = (account: string): SendVerificationCodeResult => {
    const channel = detectAuthChannel(account);
    if (!channel) {
      throw new Error('请输入有效的中国大陆手机号或邮箱地址。');
    }

    const normalizedAccount = normalizeAccount(account);
    const code = generateVerificationCode();
    const records = readCodes();

    records[normalizedAccount] = {
      account: normalizedAccount,
      channel,
      code,
      expiresAt: Date.now() + CODE_EXPIRES_IN_SECONDS * 1000,
    };

    writeCodes(records);

    return {
      channel,
      code,
      expiresInSeconds: CODE_EXPIRES_IN_SECONDS,
    };
  };

  const register = (input: RegisterInput) => {
    const normalizedAccount = normalizeAccount(input.account);
    const channel = detectAuthChannel(normalizedAccount);
    if (!channel) {
      throw new Error('请输入有效的中国大陆手机号或邮箱地址。');
    }

    if (input.password.trim().length < 8) {
      throw new Error('密码至少需要 8 位。');
    }

    const users = readUsers();
    const existingUser = users.find((item) => item.account === normalizedAccount);
    if (existingUser) {
      throw new Error('该手机号或邮箱已注册，请直接登录。');
    }

    verifyCode(normalizedAccount, input.code);

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

  const loginWithPassword = (input: LoginWithPasswordInput) => {
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

  const loginWithCode = (input: LoginWithCodeInput) => {
    const normalizedAccount = normalizeAccount(input.account);
    const existingUser = readUsers().find((item) => item.account === normalizedAccount);

    if (!existingUser) {
      throw new Error('账号不存在，请先完成注册。');
    }

    verifyCode(normalizedAccount, input.code);

    const safeUser = sanitizeUser(existingUser);
    writeSessionUser(safeUser);
    setUser(safeUser);

    return safeUser;
  };

  const logout = () => {
    removeStoredValue(SESSION_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        sendVerificationCode,
        register,
        loginWithPassword,
        loginWithCode,
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