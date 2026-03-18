import { prompts } from '../../data/mock';

export function AdminPromptsPage() {
  return (
    <div className="stack-lg">
      <section className="grid-3">
        <article className="card stat"><span>启用 Prompt</span><strong>16</strong></article>
        <article className="card stat"><span>本周回归测试</span><strong>5</strong></article>
        <article className="card stat"><span>待优化场景</span><strong>2</strong></article>
      </section>

      <section className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">运营端 · Prompt 配置</div>
            <h3>教学反馈能力版本管理</h3>
          </div>
          <button className="button primary">创建 Prompt</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>场景</th>
              <th>状态</th>
              <th>版本</th>
              <th>策略说明</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.scene}</td>
                <td><span className={`tag ${item.status === '启用' ? 'success' : 'warning'}`}>{item.status}</span></td>
                <td>{item.version}</td>
                <td>{item.scene === '学生端' ? '强调因果解释、错因归纳与可执行建议' : '强调班级共性问题总结与课堂讲评提示'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
