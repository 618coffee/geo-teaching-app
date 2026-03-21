export function TeacherCasesPage() {
  const cases = [
    { title: '工业区位选择：钢铁厂布局分析', topic: '工业区位', difficulty: '标准', usageCount: 38 },
    { title: '农业区位：粮食主产区分布成因', topic: '农业区位', difficulty: '基础', usageCount: 25 },
    { title: '高新技术产业园区选址决策', topic: '工业区位', difficulty: '进阶', usageCount: 17 },
    { title: '城市功能区与人口分布', topic: '人口与城市', difficulty: '标准', usageCount: 31 },
    { title: '交通线路规划的区位因素', topic: '交通运输', difficulty: '标准', usageCount: 22 },
  ];

  return (
    <div className="card">
      <div className="row-between">
        <div>
          <div className="eyebrow">教师端 · 案例库</div>
          <h3>教学案例库</h3>
        </div>
        <button className="button primary">+ 新建案例</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>案例标题</th>
            <th>知识模块</th>
            <th>难度</th>
            <th>使用次数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.title}>
              <td>{c.title}</td>
              <td>{c.topic}</td>
              <td>{c.difficulty}</td>
              <td>{c.usageCount}</td>
              <td>
                <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>使用</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
