const users = [
  { name: '王老师', role: '教师', org: '实验中学', status: '启用', note: '负责高一地理课堂' },
  { name: '李老师', role: '教师', org: '南山中学', status: '启用', note: '负责公开课演示' },
  { name: '教学产品组', role: '运营', org: '平台侧', status: '启用', note: '维护模块与案例库' },
  { name: 'AI 平台组', role: '运营', org: '平台侧', status: '测试中', note: '维护 Prompt 与评估规则' },
];

export function AdminUsersPage() {
  return (
    <div className="stack-lg">
      <section className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">运营端 · 人员管理</div>
            <h3>角色与权限视图</h3>
          </div>
          <button className="button primary">添加人员</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>姓名 / 组织</th>
              <th>角色</th>
              <th>归属</th>
              <th>状态</th>
              <th>职责</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.org}</td>
                <td><span className={`tag ${user.status === '启用' ? 'success' : 'warning'}`}>{user.status}</span></td>
                <td>{user.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
