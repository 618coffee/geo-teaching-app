export function TeacherKnowledgePage() {
  const knowledgePoints = [
    { name: '工业区位', module: '人文地理', pointCount: 12, lastUpdated: '2026-03-10' },
    { name: '农业区位', module: '人文地理', pointCount: 10, lastUpdated: '2026-03-08' },
    { name: '人口与城市', module: '人文地理', pointCount: 15, lastUpdated: '2026-03-12' },
    { name: '交通运输', module: '人文地理', pointCount: 8, lastUpdated: '2026-03-05' },
    { name: '资源开发', module: '人文地理', pointCount: 9, lastUpdated: '2026-03-01' },
    { name: '区域发展', module: '人文地理', pointCount: 11, lastUpdated: '2026-03-15' },
  ];

  return (
    <div className="card">
      <div className="row-between">
        <div>
          <div className="eyebrow">教师端 · 知识点管理</div>
          <h3>知识点库</h3>
        </div>
        <button className="button primary">+ 添加知识点</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>知识模块</th>
            <th>所属单元</th>
            <th>知识点数量</th>
            <th>最近更新</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {knowledgePoints.map((kp) => (
            <tr key={kp.name}>
              <td>{kp.name}</td>
              <td>{kp.module}</td>
              <td>{kp.pointCount} 个</td>
              <td>{kp.lastUpdated}</td>
              <td>
                <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>编辑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
