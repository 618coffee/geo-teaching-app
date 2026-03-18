import { caseLibrary, modules } from '../../data/mock';

export function AdminModulesPage() {
  return (
    <div className="stack-lg">
      <section className="grid-3">
        <article className="card stat"><span>已上线模块</span><strong>12</strong></article>
        <article className="card stat"><span>本周新增配置</span><strong>8</strong></article>
        <article className="card stat"><span>待审核版本</span><strong>3</strong></article>
      </section>

      <section className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">运营端 · 模块管理</div>
            <h3>教学模块列表</h3>
          </div>
          <button className="button primary">创建模块</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>模块名称</th>
              <th>编码</th>
              <th>状态</th>
              <th>负责人</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((item) => (
              <tr key={item.code}>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td><span className={`tag ${item.status === '启用' ? 'success' : 'warning'}`}>{item.status}</span></td>
                <td>{item.owner}</td>
                <td>{item.name === '工业区位选择' ? '当前黑客松验证主题' : '支撑跨知识点扩展与平台化运营'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <div className="eyebrow">案例库快照</div>
        <h3>可复用教学案例</h3>
        <table className="table">
          <thead>
            <tr>
              <th>案例名称</th>
              <th>年级</th>
              <th>工厂类型</th>
              <th>地图模式</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {caseLibrary.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>{item.grade}</td>
                <td>{item.type}</td>
                <td>{item.mode}</td>
                <td><span className={`tag ${item.status === '启用' ? 'success' : 'warning'}`}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
