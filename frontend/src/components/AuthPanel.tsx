import { useState, type FormEvent } from 'react';
import { useAuth, type AuthUser, type UserRole } from '../auth/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot';
type FeedbackTone = 'info' | 'success' | 'error';

interface AuthPanelProps {
  onSuccess?: (user: AuthUser) => void;
  preferredRole: UserRole;
  preferredRoleLabel: string;
}

interface FeedbackState {
  tone: FeedbackTone;
  message: string;
}

const roleLabels: Record<UserRole, string> = {
  student: '学生端',
  teacher: '教师端',
  admin: '运营端',
};

// 运营端暂未对外开放，Mock 面板中不显示
const visibleRoles = (Object.keys(roleLabels) as UserRole[]).filter((r) => r !== 'admin');

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '操作失败，请稍后重试。';
}

export function AuthPanel({ onSuccess, preferredRole, preferredRoleLabel }: AuthPanelProps) {
  const { user, logout, isRemoteMode, register, loginWithPassword, loginAsMockRole } = useAuth();
  const isStudent = preferredRole === 'student';
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [loginPasswordForm, setLoginPasswordForm] = useState({
    account: '',
    password: '',
  });
  const [registerForm, setRegisterForm] = useState({
    displayName: '',
    account: '',
    password: '',
    confirmPassword: '',
  });

  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerForm.displayName.trim().length < 2) {
      setFeedback({ tone: 'error', message: '请输入至少 2 个字的姓名或昵称。' });
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setFeedback({ tone: 'error', message: '两次输入的密码不一致。' });
      return;
    }

    try {
      const nextUser = await register({
        displayName: registerForm.displayName,
        role: preferredRole,
        account: registerForm.account,
        password: registerForm.password,
      });

      setFeedback({
        tone: 'success',
        message: '注册成功，已自动登录。',
      });
      onSuccess?.(nextUser);
    } catch (error) {
      setFeedback({ tone: 'error', message: getErrorMessage(error) });
    }
  };

  const submitLoginWithPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const nextUser = await loginWithPassword(loginPasswordForm);
      setFeedback({
        tone: 'success',
        message: '登录成功，正在进入对应工作台。',
      });
      onSuccess?.(nextUser);
    } catch (error) {
      setFeedback({ tone: 'error', message: getErrorMessage(error) });
    }
  };

  const enterMockRole = (role: UserRole) => {
    try {
      const nextUser = loginAsMockRole(role);
      setFeedback({
        tone: 'success',
        message: `已切换到 ${roleLabels[role]} 的 mock 演示账号。`,
      });
      onSuccess?.(nextUser);
    } catch (error) {
      setFeedback({ tone: 'error', message: getErrorMessage(error) });
    }
  };

  if (user) {
    return (
      <section id="home-auth" className="card auth-card auth-card--session">
        <div className="auth-card__header">
          <div>
            <div className="eyebrow">当前登录状态</div>
            <h3>已登录，可直接进入业务工作台</h3>
          </div>
          <span className="pill">{roleLabels[user.role]}</span>
        </div>
        <div className="auth-session-card__meta">
          <div>
            <span>账号</span>
            <strong>{user.account}</strong>
          </div>
          <div>
            <span>姓名</span>
            <strong>{user.displayName}</strong>
          </div>
          <div>
            <span>认证方式</span>
            <strong>{user.channel === 'phone' ? '手机号' : user.channel === 'email' ? '邮箱' : '学号'}</strong>
          </div>
        </div>
        <div className="callout soft auth-callout">
          {isRemoteMode
            ? '账号数据存储在服务端，退出浏览器后重新登录即可恢复。'
            : '当前演示版认证数据存储在浏览器本地，正式环境建议将账号和会话迁移到服务端。'}
        </div>
        <div className="auth-mock-panel auth-mock-panel--session">
          <div>
            <div className="eyebrow">Mock 快速切换</div>
            <p className="auth-mock-panel__text">不需要退出再注册，直接切到学生端、教师端、运营端的演示账号。</p>
          </div>
          <div className="auth-mock-actions">
            {visibleRoles.map((role) => (
              <button
                key={role}
                type="button"
                className={`button ${user.role === role ? 'primary' : ''}`}
                onClick={() => enterMockRole(role)}
              >
                {role === user.role ? `当前：${roleLabels[role]}` : `切换到${roleLabels[role]}`}
              </button>
            ))}
          </div>
        </div>
        <div className="hero__actions">
          <button type="button" className="button" onClick={logout}>退出登录</button>
        </div>
      </section>
    );
  }

  return (
    <section id="home-auth" className="card auth-card">
      <div className="auth-card__header">
        <div>
          <div className="eyebrow">统一认证入口</div>
          <h3>{isStudent ? `${preferredRoleLabel}账号登录` : `${preferredRoleLabel}账号登录 / 注册`}</h3>
        </div>
      </div>

      {authMode !== 'forgot' && (
        <div className="auth-tablist" role="tablist" aria-label="认证模式切换">
          <button
            type="button"
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            登录
          </button>
          {!isStudent && (
            <button
              type="button"
              className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => setAuthMode('register')}
            >
              注册
            </button>
          )}
        </div>
      )}

      {authMode === 'forgot' ? (
        <div className="callout soft auth-callout">
          <p>{isStudent ? '学生账号由任课老师统一分发，如需重置初始密码，请联系班级老师。' : '如需重置密码，请联系管理员。'}</p>
          <button type="button" className="button auth-submit-button" onClick={() => setAuthMode('login')}>
            返回登录
          </button>
        </div>
      ) : authMode === 'login' ? (
        <form className="stack-md" onSubmit={submitLoginWithPassword}>
          <label className="field">
            <span>{isStudent ? '学号' : '手机号或邮箱'}</span>
            <input
              value={loginPasswordForm.account}
              onChange={(event) => setLoginPasswordForm((current) => ({ ...current, account: event.target.value }))}
              placeholder={isStudent ? '请输入学号（如 S2024001）' : '请输入手机号或邮箱'}
              autoComplete="username"
            />
          </label>
          <label className="field">
            <span>密码</span>
            <input
              type="password"
              value={loginPasswordForm.password}
              onChange={(event) => setLoginPasswordForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </label>
          <div className="auth-switch-row">
            <button type="button" className="auth-switch-link" onClick={() => setAuthMode('forgot')}>
              忘记密码？
            </button>
          </div>
          <button type="submit" className="button primary auth-submit-button">立即登录</button>
        </form>
      ) : (
        <form className="stack-md" onSubmit={submitRegister}>
          <label className="field">
            <span>姓名或昵称</span>
            <input
              value={registerForm.displayName}
              onChange={(event) => setRegisterForm((current) => ({ ...current, displayName: event.target.value }))}
              placeholder="例如：张老师 / 张三"
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>手机号或邮箱</span>
            <input
              value={registerForm.account}
              onChange={(event) => setRegisterForm((current) => ({ ...current, account: event.target.value }))}
              placeholder="请输入手机号或邮箱"
              autoComplete="username"
            />
          </label>
          <div className="auth-grid">
            <label className="field">
              <span>密码</span>
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="至少 8 位密码"
                autoComplete="new-password"
              />
            </label>
            <label className="field">
              <span>确认密码</span>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) => setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                placeholder="再次输入密码"
                autoComplete="new-password"
              />
            </label>
          </div>
          <button type="submit" className="button primary auth-submit-button">完成注册</button>
        </form>
      )}

      {feedback && (
        <div className={`auth-feedback auth-feedback--${feedback.tone}`}>
          {feedback.message}
        </div>
      )}

      <details className="dev-quick-login">
        <summary>开发快捷入口</summary>
        <div className="dev-quick-login__actions">
          {(Object.keys(roleLabels) as UserRole[]).map((role) => (
            <button key={role} type="button" className="button" onClick={() => enterMockRole(role)}>
              {roleLabels[role]}
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}