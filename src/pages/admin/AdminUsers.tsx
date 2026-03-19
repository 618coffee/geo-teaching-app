const users = [
  { name: '王老师', role: '教师', org: '实验中学', status: '启用', note: '负责高一地理课堂' },
  { name: '李老师', role: '教师', org: '南山中学', status: '启用', note: '负责公开课演示' },
  { name: '教学产品组', role: '运营', org: '平台侧', status: '启用', note: '维护模块与案例库' },
  { name: 'AI 平台组', role: '运营', org: '平台侧', status: '测试中', note: '维护 Prompt 与评估规则' },
  { name: '教研支持组', role: '运营', org: '平台侧', status: '启用', note: '跟进课程模板和知识点配置' },
];

export function AdminUsersPage() {
  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>人员管理</h2>
          <p className="admin-page__subtitle">查看教师与运营角色分工，维护权限边界</p>
        </div>
        <button type="button" className="admin-button admin-button--primary">添加人员</button>
      </section>

      <section className="admin-metric-grid admin-metric-grid--three">
        <article className="admin-metric">
          <span>启用账号</span>
          <strong>18</strong>
          <p>教师与平台成员均可见</p>
        </article>
        <article className="admin-metric">
          <span>待分配权限</span>
          <strong>3</strong>
          <p>新成员待确认组织与角色</p>
        </article>
        <article className="admin-metric">
          <span>本周调整</span>
          <strong>6</strong>
          <p>包含角色变更和组织迁移</p>
        </article>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>成员列表</h3>
              <p className="admin-panel__subtitle">当前运营与教师成员的职责分布</p>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
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
                    <td className="admin-table__title">{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.org}</td>
                    <td>
                      <span className={`status-pill ${user.status === '启用' ? 'status-pill--live' : 'status-pill--draft'}`}>{user.status}</span>
                    </td>
                    <td>{user.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>权限分组</h3>
              <p className="admin-panel__subtitle">用于控制模块发布、Prompt审批与数据查看范围</p>
            </div>
          </div>

          <div className="admin-list">
            <div className="admin-list-card">
              <strong>教学产品组</strong>
              <p>负责模块启停、知识点模板和课程入口配置。</p>
            </div>
            <div className="admin-list-card">
              <strong>AI 平台组</strong>
              <p>维护 Prompt 版本、回归结果与解释质量规则。</p>
            </div>
            <div className="admin-list-card">
              <strong>教师账号</strong>
              <p>默认仅查看自身班级任务、学情分析和课堂演示数据。</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
