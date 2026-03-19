import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

type ThemeMode = 'dark' | 'light';
type AdminIconName = 'dashboard' | 'modules' | 'knowledge' | 'prompt' | 'settings' | 'users' | 'insights' | 'menu' | 'back' | 'theme' | 'logout';

const THEME_STORAGE_KEY = 'geo-teaching-app-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

interface NavItem {
  label: string;
  to: string;
  icon?: AdminIconName;
}

interface NavGroup {
  key: 'student' | 'teacher' | 'admin';
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    key: 'student',
    title: '学生端',
    items: [
      { label: '任务列表', to: '/student/tasks' },
      { label: '区位决策', to: '/student/decision' },
      { label: '分析报告', to: '/student/report' },
      { label: '对比报告', to: '/student/compare' },
      { label: '反向推荐', to: '/student/reverse' },
    ],
  },
  {
    key: 'teacher',
    title: '教师端',
    items: [
      { label: '任务管理', to: '/teacher/tasks' },
      { label: '发布任务', to: '/teacher/create' },
      { label: '作业批阅', to: '/teacher/review' },
      { label: '学情分析', to: '/teacher/analysis' },
      { label: '课堂演示', to: '/teacher/demo' },
    ],
  },
  {
    key: 'admin',
    title: '导航菜单',
    items: [
      { label: '仪表盘', to: '/admin/dashboard', icon: 'dashboard' },
      { label: '模块管理', to: '/admin/modules', icon: 'modules' },
      { label: '知识库', to: '/admin/knowledge', icon: 'knowledge' },
      { label: 'Prompt配置', to: '/admin/prompts', icon: 'prompt' },
      { label: '系统配置', to: '/admin/settings', icon: 'settings' },
      { label: '人员管理', to: '/admin/users', icon: 'users' },
      { label: '数据洞察', to: '/admin/insights', icon: 'insights' },
    ],
  },
];

function NavIcon({ name }: { name: AdminIconName }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="4" rx="1.5" />
          <rect x="14" y="10" width="7" height="11" rx="1.5" />
          <rect x="3" y="13" width="7" height="8" rx="1.5" />
        </svg>
      );
    case 'modules':
      return (
        <svg {...props}>
          <path d="m12 3 8 4.5v9L12 21 4 16.5v-9L12 3Z" />
          <path d="M12 12 4 7.5" />
          <path d="M12 12l8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );
    case 'knowledge':
      return (
        <svg {...props}>
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v17H7.5A2.5 2.5 0 0 0 5 22V5.5Z" />
          <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H18" />
          <path d="M9 8h7" />
          <path d="M9 12h7" />
        </svg>
      );
    case 'prompt':
      return (
        <svg {...props}>
          <path d="M8 8 4 12l4 4" />
          <path d="m16 8 4 4-4 4" />
          <path d="m13 5-2 14" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.07V21a2 2 0 1 1-4 0v-.11a1.7 1.7 0 0 0-.4-1.07 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.07-.4H2.9a2 2 0 1 1 0-4H3a1.7 1.7 0 0 0 1.07-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 0 1 7.1 3.44l.06.06A1.7 1.7 0 0 0 9 3.16a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.07V1.9a2 2 0 1 1 4 0V2a1.7 1.7 0 0 0 .4 1.07 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.32.47.68.6 1.08.09.28.14.57.14.86s-.05.58-.14.86c-.13.4-.35.76-.6 1.08Z" />
        </svg>
      );
    case 'users':
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="9.5" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'insights':
      return (
        <svg {...props}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-11" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="5" height="16" rx="1.5" />
          <path d="M12 7h9" />
          <path d="M12 12h9" />
          <path d="M12 17h9" />
        </svg>
      );
    case 'back':
      return (
        <svg {...props}>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
      );
    case 'theme':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
  }
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const activeSection = location.pathname.split('/')[1] as NavGroup['key'] | '';
  const isAdminSection = activeSection === 'admin';
  const visibleNavGroups = navGroups.filter((group) => group.key === activeSection);
  const [isAdminSidebarCollapsed, setIsAdminSidebarCollapsed] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!isAdminSection) {
      setIsAdminSidebarCollapsed(false);
    }
  }, [isAdminSection]);

  const toggleAdminSidebar = () => {
    setIsAdminSidebarCollapsed((current) => !current);
  };

  const toggleThemeMode = () => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  const nextThemeLabel = themeMode === 'dark' ? '浅色模式' : '深色模式';
  const nextThemeAriaLabel = themeMode === 'dark' ? '切换到浅色模式' : '切换到深色模式';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className={[
        'app-shell',
        isHomePage ? 'app-shell--home' : '',
        isAdminSection ? 'app-shell--admin' : '',
        isAdminSection && isAdminSidebarCollapsed ? 'app-shell--admin-collapsed' : '',
      ].filter(Boolean).join(' ')}
    >
      {!isHomePage && (
        <aside className={['sidebar', isAdminSection ? 'sidebar--admin' : '', isAdminSidebarCollapsed ? 'sidebar--collapsed' : ''].filter(Boolean).join(' ')}>
          {isAdminSection ? (
            <>
              <Link to="/admin/modules" className="brand brand--admin">
                <span className="brand__mark">AI</span>
                <div className="brand__copy">
                  <strong>AI地理教学</strong>
                  <p>运营管理控制台</p>
                </div>
              </Link>
              <button
                type="button"
                className="sidebar-toggle sidebar-toggle--edge"
                onClick={toggleAdminSidebar}
                aria-label={isAdminSidebarCollapsed ? '展开运营侧边栏' : '收起运营侧边栏'}
                title={isAdminSidebarCollapsed ? '展开运营侧边栏' : '收起运营侧边栏'}
              >
                <NavIcon name="menu" />
              </button>
            </>
          ) : (
            <div className="brand">
              <span className="brand__badge">Geo</span>
              <div>
                <strong>工业区位选择教学应用</strong>
                <p>学生端 / 教师端 / 运营端 · 演示版本</p>
              </div>
            </div>
          )}
          {visibleNavGroups.map((group) => (
            <section key={group.key} className={['nav-group', isAdminSection ? 'nav-group--admin' : ''].filter(Boolean).join(' ')}>
              <h4>{group.title}</h4>
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-link__content">
                    {item.icon && (
                      <span className="nav-link__icon">
                        <NavIcon name={item.icon} />
                      </span>
                    )}
                    <span className="nav-link__label">{item.label}</span>
                  </span>
                </NavLink>
              ))}
            </section>
          ))}
          <div className="sidebar__footer">
            <Link to="/" className="nav-link sidebar-return-link">
              <span className="nav-link__content">
                <span className="nav-link__icon">
                  <NavIcon name="back" />
                </span>
                <span className="nav-link__label">返回首页</span>
              </span>
            </Link>
          </div>
        </aside>
      )}
      <main className={['content', isHomePage ? 'content--home' : '', isAdminSection ? 'content--admin' : ''].filter(Boolean).join(' ')}>
        {isAdminSection ? (
          <header className="topbar topbar--admin">
            <button
              type="button"
              className="admin-toolbar-button"
              onClick={toggleAdminSidebar}
              aria-label={isAdminSidebarCollapsed ? '展开运营侧边栏' : '收起运营侧边栏'}
            >
              <NavIcon name="menu" />
            </button>
            <div className="topbar__meta topbar__meta--admin">
              <span className="pill pill--admin">运营后台</span>
              {user && <span className="pill pill--admin">{user.displayName}</span>}
              <button type="button" className="theme-toggle-button" onClick={toggleThemeMode} aria-label={nextThemeAriaLabel} title={nextThemeAriaLabel}>
                <span className="theme-toggle-button__icon">
                  <NavIcon name="theme" />
                </span>
                <span>{nextThemeLabel}</span>
              </button>
              {user && (
                <button type="button" className="topbar-action-button" onClick={handleLogout}>
                  <span className="theme-toggle-button__icon">
                    <NavIcon name="logout" />
                  </span>
                  <span>退出登录</span>
                </button>
              )}
            </div>
          </header>
        ) : (
          <header className="topbar">
            <div>
              <div className="eyebrow">当前验证场景</div>
              <h1>高中地理「工业区位选择」</h1>
            </div>
            <div className="topbar__meta">
              <span className="pill">示例数据</span>
              {!isHomePage && <span className="pill">{location.pathname}</span>}
              {user && <span className="pill">{user.displayName}</span>}
              <button type="button" className="theme-toggle-button" onClick={toggleThemeMode} aria-label={nextThemeAriaLabel} title={nextThemeAriaLabel}>
                <span className="theme-toggle-button__icon">
                  <NavIcon name="theme" />
                </span>
                <span>{nextThemeLabel}</span>
              </button>
              {user && (
                <button type="button" className="topbar-action-button" onClick={handleLogout}>
                  <span className="theme-toggle-button__icon">
                    <NavIcon name="logout" />
                  </span>
                  <span>退出登录</span>
                </button>
              )}
            </div>
          </header>
        )}
        <Outlet />
      </main>
    </div>
  );
}
