import { prompts } from '../../data/demoData';

export function AdminPromptsPage() {
  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>Prompt配置</h2>
          <p className="admin-page__subtitle">管理教学反馈、讲评总结与解释器版本</p>
        </div>
        <button type="button" className="admin-button admin-button--primary">创建Prompt</button>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>版本列表</h3>
              <p className="admin-panel__subtitle">当前启用与待优化的提示词能力清单</p>
            </div>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>场景</th>
                  <th>版本</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <div className="admin-table__title">{item.name}</div>
                      <div className="admin-table__sub">{item.scene === '学生端' ? '强调因果解释、错因归纳与补救建议' : '强调班级共性问题归纳与课堂讲评提示'}</div>
                    </td>
                    <td>{item.scene}</td>
                    <td>{item.version}</td>
                    <td>
                      <span className={`status-pill ${item.status === '启用' ? 'status-pill--live' : 'status-pill--draft'}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>发布策略</h3>
              <p className="admin-panel__subtitle">上线前默认执行一轮教学结果回归与人工抽检</p>
            </div>
          </div>

          <div className="admin-list">
            <div className="admin-list-card">
              <strong>学生端报告</strong>
              <p>校验结论结构、因果链路与建议语气，防止反馈过度模板化。</p>
            </div>
            <div className="admin-list-card">
              <strong>教师端讲评</strong>
              <p>聚焦共性错因、区域分布偏差和课堂讨论可用性。</p>
            </div>
            <div className="admin-list-card">
              <strong>回归检查</strong>
              <p>最近一周已完成 5 次回归测试，其中 2 个场景待继续优化。</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
