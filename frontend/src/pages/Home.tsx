import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

// 运营端暂未对外开放，隐藏入口但保留代码
const visibleRoleCards = roleCards.filter((c) => c.role !== 'admin');

function inferRoleFromPath(pathname: string | null): UserRole | null {
  if (!pathname) {
    return null;
  }

  if (pathname.startsWith('/student')) {
    return 'student';
  }

  if (pathname.startsWith('/teacher')) {
    return 'teacher';
  }

  if (pathname.startsWith('/admin')) {
    return 'admin';
  }

  return null;
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loginAsMockRole } = useAuth();
  const redirectPath = searchParams.get('redirect');
  const inferredRole = inferRoleFromPath(redirectPath);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    inferredRole === 'admin' ? 'student' : (inferredRole ?? 'student'),
  );

  useEffect(() => {
    const nextRole = inferRoleFromPath(redirectPath);
    if (!user && nextRole) {
      setSelectedRole(nextRole);
    }
  }, [redirectPath, user]);

  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  const handleAuthSuccess = (nextUser: AuthUser) => {
    if (redirectPath && canRoleAccessPath(redirectPath, nextUser.role)) {
      navigate(redirectPath, { replace: true });
      return;
    }

    navigate(getDefaultRouteForRole(nextUser.role), { replace: true });
  };

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    document.getElementById('home-auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnterMockRole = (role: UserRole) => {
    const nextUser = loginAsMockRole(role);
    handleAuthSuccess(nextUser);
  };

  return (
    <div className="home-page">
      {redirectPath && !user && (
        <section className="callout soft">
          你刚才访问的是 <strong>{redirectPath}</strong>，请先完成登录或注册，系统会在认证成功后自动跳转回对应页面。
        </section>
      )}

      {!user && (
        <div className="home-login-wrap">
          <section className="home-role-selector" aria-label="选择工作台身份">
            {visibleRoleCards.map((card) => (
              <button
                key={card.role}
                type="button"
                className={`home-role-option home-role-option--${card.role} ${selectedRole === card.role ? 'active' : ''}`}
                onClick={() => setSelectedRole(card.role)}
                aria-pressed={selectedRole === card.role}
              >
                <span className="home-role-option__eyebrow">{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <span>{card.description}</span>
                <span className="home-role-option__badge" aria-hidden="true">✓ 已选择</span>
              </button>
            ))}
          </section>

          <AuthPanel
            onSuccess={handleAuthSuccess}
            preferredRole={selectedRole}
            preferredRoleLabel={roleLabels[selectedRole]}
          />
        </div>
      )}
    </div>
  );
}
