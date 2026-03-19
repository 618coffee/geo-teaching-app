import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { canRoleAccessPath, getDefaultRouteForRole, useAuth, type AuthUser, type UserRole } from '../auth/AuthContext';
import { AuthPanel } from '../components/AuthPanel';

const roleCards: Array<{
  role: UserRole;
  eyebrow: string;
  title: string;
  description: string;
  to: string;
  className: string;
}> = [
  {
    role: 'student',
    eyebrow: '学习入口',
    title: '学生端',
    description: '任务列表、地图选址、分析报告、方案对比、反向推荐。',
    to: '/student/tasks',
    className: 'home-role-card home-role-card--student',
  },
  {
    role: 'teacher',
    eyebrow: '教学入口',
    title: '教师端',
    description: '任务管理、发布任务、作业批阅、学情分析、课堂演示。',
    to: '/teacher/tasks',
    className: 'home-role-card home-role-card--teacher',
  },
  {
    role: 'admin',
    eyebrow: '管理入口',
    title: '运营端',
    description: '模块管理、人员管理、Prompt 配置，支撑后续平台化扩展。',
    to: '/admin/modules',
    className: 'home-role-card home-role-card--admin',
  },
];

const roleLabels: Record<UserRole, string> = {
  student: '学生端',
  teacher: '教师端',
  admin: '运营端',
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const redirectPath = searchParams.get('redirect');

  const handleAuthSuccess = (nextUser: AuthUser) => {
    if (redirectPath && canRoleAccessPath(redirectPath, nextUser.role)) {
      navigate(redirectPath, { replace: true });
      return;
    }

    navigate(getDefaultRouteForRole(nextUser.role), { replace: true });
  };

  const scrollToAuthPanel = () => {
    document.getElementById('home-auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="stack-lg">
      <section className="home-hero-grid">
        <section className="hero card home-hero-card">
          <div className="hero__content">
            <div>
              <div className="eyebrow">认证与角色入口</div>
              <h2>先完成统一登录注册，再按角色进入教学场景</h2>
            </div>
            <p className="hero__intro">
              首页现在承担统一认证入口，支持手机号或邮箱注册、验证码校验、密码登录和验证码登录，并对学生端、教师端、运营端启用对应的角色访问控制。
            </p>
          </div>
          <ul className="hero__feature-list">
            <li>
              <strong>手机号 / 邮箱双入口</strong>
              面向国内用户保留手机号优先习惯，同时兼容邮箱注册与登录。
            </li>
            <li>
              <strong>验证码注册闭环</strong>
              演示版直接在界面展示验证码，正式环境可替换为短信和邮件网关。
            </li>
            <li>
              <strong>按角色拦截业务页</strong>
              未登录或角色不匹配时，自动回到首页认证区，避免越权访问。
            </li>
          </ul>
          <div className="hero__actions">
            <span className="pill">验证码注册</span>
            <span className="pill">密码 / 验证码登录</span>
            <span className="pill">角色路由守卫</span>
          </div>
        </section>

        <AuthPanel onSuccess={handleAuthSuccess} />
      </section>

      {redirectPath && !user && (
        <section className="callout soft">
          你刚才访问的是 <strong>{redirectPath}</strong>，请先完成登录或注册，系统会在认证成功后自动跳转回对应页面。
        </section>
      )}

      {user && (
        <section className="card home-session-card">
          <div className="home-session-card__meta">
            <div className="eyebrow">当前会话</div>
            <h3>已登录为 {user.displayName}</h3>
            <p>
              当前账号归属 <strong>{roleLabels[user.role]}</strong>，可以直接进入对应工作台；其他角色入口会保持受限。
            </p>
          </div>
          <Link className="button primary" to={getDefaultRouteForRole(user.role)}>进入我的工作台</Link>
        </section>
      )}

      <section className="grid-3 home-role-grid">
        {roleCards.map((card) => (
          <article key={card.role} className={`card ${card.className}`}>
            <div className="home-role-card__content">
              <div className="eyebrow">{card.eyebrow}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
            {user?.role === card.role ? (
              <Link className="button home-role-card__button" to={card.to}>进入{card.title}</Link>
            ) : user ? (
              <button type="button" className="button home-role-card__button button-disabled">
                当前账号属于{roleLabels[user.role]}
              </button>
            ) : (
              <button type="button" className="button home-role-card__button" onClick={scrollToAuthPanel}>
                登录后进入
              </button>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
