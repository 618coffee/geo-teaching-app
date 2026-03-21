import { useEffect, useState, type FormEvent } from 'react';
import { useAuth, type AuthUser, type UserRole } from '../auth/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot';
type LoginMode = 'password' | 'code';
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
  const { user, logout, sendVerificationCode, register, loginWithPassword, loginWithCode, loginAsMockRole, resetPassword, detectChannel } = useAuth();
  const isStudent = preferredRole === 'student';
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginMode, setLoginMode] = useState<LoginMode>('password');
  const [registerCountdown, setRegisterCountdown] = useState(0);
  const [loginCountdown, setLoginCountdown] = useState(0);
  const [forgotCountdown, setForgotCountdown] = useState(0);
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
    account: '',
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [forgotForm, setForgotForm] = useState({
    account: '',
    code: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (registerCountdown <= 0 && loginCountdown <= 0 && forgotCountdown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRegisterCountdown((current) => Math.max(0, current - 1));
      setLoginCountdown((current) => Math.max(0, current - 1));
      setForgotCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loginCountdown, registerCountdown, forgotCountdown]);

  const requestCode = (account: string, scope: 'register' | 'login' | 'forgot') => {
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
      } else if (scope === 'login') {
        setLoginCountdown(60);
      } else {
        setForgotCountdown(60);
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
        role: preferredRole,
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

  const submitForgotPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (forgotForm.password !== forgotForm.confirmPassword) {
      setFeedback({ tone: 'error', message: '两次输入的密码不一致。' });
      return;
    }

    try {
      resetPassword({ account: forgotForm.account, code: forgotForm.code, newPassword: forgotForm.password });
      setFeedback({ tone: 'success', message: '密码已重置，请使用新密码登录。' });
      setForgotForm({ account: '', code: '', password: '', confirmPassword: '' });
      setAuthMode('login');
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
          当前演示版认证数据存储在浏览器本地，正式环境建议将验证码、账号和会话迁移到服务端，并接入国内短信/邮件服务。
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
        isStudent ? (
          <div className="callout soft auth-callout">
            <p>学生账号由任课老师统一分发，如需重置初始密码，请联系班级老师。</p>
            <button type="button" className="button auth-submit-button" onClick={() => setAuthMode('login')}>
              返回登录
            </button>
          </div>
        ) : (
          <form className="stack-md" onSubmit={submitForgotPassword}>
            <label className="field">
              <span>手机号或邮箱</span>
              <input
                value={forgotForm.account}
                onChange={(event) => setForgotForm((current) => ({ ...current, account: event.target.value }))}
                placeholder="请输入注册时用的手机号或邮箱"
                autoComplete="username"
              />
            </label>
            <div className="auth-code-row">
              <label className="field auth-code-row__field">
                <span>验证码</span>
                <input
                  value={forgotForm.code}
                  onChange={(event) => setForgotForm((current) => ({ ...current, code: event.target.value }))}
                  placeholder="6位验证码"
                  inputMode="numeric"
                />
              </label>
              <button
                type="button"
                className="button auth-code-button"
                onClick={() => requestCode(forgotForm.account, 'forgot')}
                disabled={forgotCountdown > 0}
              >
                {forgotCountdown > 0 ? `${forgotCountdown}s 后重发` : '获取验证码'}
              </button>
            </div>
            <div className="auth-grid">
              <label className="field">
                <span>新密码</span>
                <input
                  type="password"
                  value={forgotForm.password}
                  onChange={(event) => setForgotForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="至少 8 位新密码"
                  autoComplete="new-password"
                />
              </label>
              <label className="field">
                <span>确认新密码</span>
                <input
                  type="password"
                  value={forgotForm.confirmPassword}
                  onChange={(event) => setForgotForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                  placeholder="再次输入新密码"
                  autoComplete="new-password"
                />
              </label>
            </div>
            <div className="auth-switch-row">
              <button type="button" className="auth-switch-link" onClick={() => setAuthMode('login')}>
                返回登录
              </button>
            </div>
            <button type="submit" className="button primary auth-submit-button">重置密码</button>
          </form>
        )
      ) : authMode === 'login' ? (
        isStudent ? (
          <form className="stack-md" onSubmit={submitLoginWithPassword}>
            <label className="field">
              <span>学号</span>
              <input
                value={loginPasswordForm.account}
                onChange={(event) => setLoginPasswordForm((current) => ({ ...current, account: event.target.value }))}
                placeholder="请输入学号（如 S2024001）"
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
          <>
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
                <div className="auth-switch-row">
                  <span className="auth-switch-row__label">当前使用密码登录</span>
                  <button type="button" className="auth-switch-link" onClick={() => setLoginMode('code')}>
                    改用验证码登录
                  </button>
                  <button type="button" className="auth-switch-link" onClick={() => setAuthMode('forgot')}>
                    忘记密码？
                  </button>
                </div>
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
                <div className="auth-switch-row">
                  <span className="auth-switch-row__label">当前使用验证码登录</span>
                  <button type="button" className="auth-switch-link" onClick={() => setLoginMode('password')}>
                    改用密码登录
                  </button>
                  <button type="button" className="auth-switch-link" onClick={() => setAuthMode('forgot')}>
                    忘记密码？
                  </button>
                </div>
                <button type="submit" className="button primary auth-submit-button">验证码登录</button>
              </form>
            )}
          </>
        )
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