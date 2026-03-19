import { useEffect, useState, type FormEvent } from 'react';
import { useAuth, type AuthUser, type UserRole } from '../auth/AuthContext';

type AuthMode = 'login' | 'register';
type LoginMode = 'password' | 'code';
type FeedbackTone = 'info' | 'success' | 'error';

interface AuthPanelProps {
  onSuccess?: (user: AuthUser) => void;
}

interface FeedbackState {
  tone: FeedbackTone;
  message: string;
}

const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: 'student', label: '学生端' },
  { value: 'teacher', label: '教师端' },
  { value: 'admin', label: '运营端' },
];

const roleLabels: Record<UserRole, string> = {
  student: '学生端',
  teacher: '教师端',
  admin: '运营端',
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return '操作失败，请稍后重试。';
}

export function AuthPanel({ onSuccess }: AuthPanelProps) {
  const { user, logout, sendVerificationCode, register, loginWithPassword, loginWithCode, detectChannel } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [registerCountdown, setRegisterCountdown] = useState(0);
  const [loginCountdown, setLoginCountdown] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [loginPasswordForm, setLoginPasswordForm] = useState({
    account: '',
    password: '',
  });
  const [loginCodeForm, setLoginCodeForm] = useState({
    account: '',
    code: '',
  });
  const [registerForm, setRegisterForm] = useState({
    displayName: '',
    role: 'student' as UserRole,
    account: '',
    code: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (registerCountdown <= 0 && loginCountdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRegisterCountdown((current) => Math.max(0, current - 1));
      setLoginCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loginCountdown, registerCountdown]);

  const requestCode = (account: string, scope: 'register' | 'login') => {
    const channel = detectChannel(account);
    if (!channel) {
      setFeedback({
        tone: 'error',
        message: '请输入有效的中国大陆手机号或邮箱地址，再获取验证码。',
      });
      return;
    }

    try {
      const result = sendVerificationCode(account);
      const targetLabel = result.channel === 'phone' ? '短信' : '邮件';

      setFeedback({
        tone: 'info',
        message: `${targetLabel}验证码已生成，演示环境验证码为 ${result.code}，5 分钟内有效。生产环境请接入真实短信或邮件网关。`,
      });

      if (scope === 'register') {
        setRegisterCountdown(60);
      } else {
        setLoginCountdown(60);
      }
    } catch (error) {
      setFeedback({ tone: 'error', message: getErrorMessage(error) });
    }
  };

  const submitRegister = (event: FormEvent<HTMLFormElement>) => {
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
      const nextUser = register({
        displayName: registerForm.displayName,
        role: registerForm.role,
        account: registerForm.account,
        code: registerForm.code,
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

  const submitLoginWithPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const nextUser = loginWithPassword(loginPasswordForm);
      setFeedback({
        tone: 'success',
        message: '登录成功，正在进入对应工作台。',
      });
      onSuccess?.(nextUser);
    } catch (error) {
      setFeedback({ tone: 'error', message: getErrorMessage(error) });
    }
  };

  const submitLoginWithCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const nextUser = loginWithCode(loginCodeForm);
      setFeedback({
        tone: 'success',
        message: '登录成功，正在进入对应工作台。',
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
            <strong>{user.channel === 'phone' ? '手机号' : '邮箱'}</strong>
          </div>
        </div>
        <div className="callout soft auth-callout">
          当前演示版认证数据存储在浏览器本地，正式环境建议将验证码、账号和会话迁移到服务端，并接入国内短信/邮件服务。
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
          <h3>手机号 / 邮箱注册登录</h3>
        </div>
        <span className="pill">验证码注册</span>
      </div>

      <div className="auth-tablist" role="tablist" aria-label="认证模式切换">
        <button
          type="button"
          className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => setAuthMode('login')}
        >
          登录
        </button>
        <button
          type="button"
          className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => setAuthMode('register')}
        >
          注册
        </button>
      </div>

      {authMode === 'login' ? (
        <>
          <div className="auth-subtabs" role="tablist" aria-label="登录方式切换">
            <button
              type="button"
              className={`auth-subtab ${loginMode === 'password' ? 'active' : ''}`}
              onClick={() => setLoginMode('password')}
            >
              密码登录
            </button>
            <button
              type="button"
              className={`auth-subtab ${loginMode === 'code' ? 'active' : ''}`}
              onClick={() => setLoginMode('code')}
            >
              验证码登录
            </button>
          </div>

          {loginMode === 'password' ? (
            <form className="stack-md" onSubmit={submitLoginWithPassword}>
              <label className="field">
                <span>手机号或邮箱</span>
                <input
                  value={loginPasswordForm.account}
                  onChange={(event) => setLoginPasswordForm((current) => ({ ...current, account: event.target.value }))}
                  placeholder="请输入手机号或邮箱"
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
              <button type="submit" className="button primary auth-submit-button">立即登录</button>
            </form>
          ) : (
            <form className="stack-md" onSubmit={submitLoginWithCode}>
              <label className="field">
                <span>手机号或邮箱</span>
                <input
                  value={loginCodeForm.account}
                  onChange={(event) => setLoginCodeForm((current) => ({ ...current, account: event.target.value }))}
                  placeholder="请输入手机号或邮箱"
                  autoComplete="username"
                />
              </label>
              <div className="auth-code-row">
                <label className="field auth-code-row__field">
                  <span>验证码</span>
                  <input
                    value={loginCodeForm.code}
                    onChange={(event) => setLoginCodeForm((current) => ({ ...current, code: event.target.value }))}
                    placeholder="6位验证码"
                    inputMode="numeric"
                  />
                </label>
                <button
                  type="button"
                  className="button auth-code-button"
                  onClick={() => requestCode(loginCodeForm.account, 'login')}
                  disabled={loginCountdown > 0}
                >
                  {loginCountdown > 0 ? `${loginCountdown}s 后重发` : '获取验证码'}
                </button>
              </div>
              <button type="submit" className="button primary auth-submit-button">验证码登录</button>
            </form>
          )}
        </>
      ) : (
        <form className="stack-md" onSubmit={submitRegister}>
          <div className="auth-grid">
            <label className="field">
              <span>姓名或昵称</span>
              <input
                value={registerForm.displayName}
                onChange={(event) => setRegisterForm((current) => ({ ...current, displayName: event.target.value }))}
                placeholder="例如：高一（3）班 王同学"
                autoComplete="name"
              />
            </label>
            <label className="field">
              <span>注册身份</span>
              <select
                value={registerForm.role}
                onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value as UserRole }))}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="field">
            <span>手机号或邮箱</span>
            <input
              value={registerForm.account}
              onChange={(event) => setRegisterForm((current) => ({ ...current, account: event.target.value }))}
              placeholder="请输入手机号或邮箱"
              autoComplete="username"
            />
          </label>
          <div className="auth-code-row">
            <label className="field auth-code-row__field">
              <span>验证码</span>
              <input
                value={registerForm.code}
                onChange={(event) => setRegisterForm((current) => ({ ...current, code: event.target.value }))}
                placeholder="6位验证码"
                inputMode="numeric"
              />
            </label>
            <button
              type="button"
              className="button auth-code-button"
              onClick={() => requestCode(registerForm.account, 'register')}
              disabled={registerCountdown > 0}
            >
              {registerCountdown > 0 ? `${registerCountdown}s 后重发` : '获取验证码'}
            </button>
          </div>
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
    </section>
  );
}