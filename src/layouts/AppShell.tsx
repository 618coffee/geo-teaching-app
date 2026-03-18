import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const navGroups = [
  {
    title: '学生端',
    items: [
      ['任务列表', '/student/tasks'],
      ['区位决策', '/student/decision'],
      ['分析报告', '/student/report'],
      ['对比报告', '/student/compare'],
      ['反向推荐', '/student/reverse'],
    ],
  },
  {
    title: '教师端',
    items: [
      ['任务管理', '/teacher/tasks'],
      ['发布任务', '/teacher/create'],
      ['作业批阅', '/teacher/review'],
      ['学情分析', '/teacher/analysis'],
      ['课堂演示', '/teacher/demo'],
    ],
  },
  {
    title: '运营端',
    items: [
      ['模块管理', '/admin/modules'],
      ['人员管理', '/admin/users'],
      ['Prompt 配置', '/admin/prompts'],
    ],
  },
];

export function AppShell() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand__badge">Geo</span>
          <div>
            <strong>工业区位选择教学应用</strong>
            <p>学生端 / 教师端 / 运营端 · Mock MVP</p>
          </div>
        </Link>
        {navGroups.map((group) => (
          <section key={group.title} className="nav-group">
            <h4>{group.title}</h4>
            {group.items.map(([label, to]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {label}
              </NavLink>
            ))}
          </section>
        ))}
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <div className="eyebrow">当前验证场景</div>
            <h1>高中地理「工业区位选择」</h1>
          </div>
          <div className="topbar__meta">
            <span className="pill">Mock Data</span>
            <span className="pill">{location.pathname}</span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
