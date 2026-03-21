import { useDemoState } from '../../data/useDemoState';

export function StudentComparePage() {
  const { state, analysis } = useDemoState();

  return (
    <div className="stack-lg">
      <section className="grid-3">
        <article className="card stat"><span>当前工厂类型</span><strong>{state.factoryType}</strong></article>
        <article className="card stat"><span>当前已选区域</span><strong>{analysis.region.name}</strong></article>
        <article className="card stat"><span>推荐首选区域</span><strong>{analysis.comparePlans[0]?.region}</strong></article>
      </section>

      <section className="card">
        <div className="eyebrow">方案对比报告</div>
        <h3>当前工厂类型下的优先候选区域</h3>
        <table className="table">
          <thead>
            <tr>
              <th>排名</th>
              <th>区域</th>
              <th>综合得分</th>
              <th>结论</th>
            </tr>
          </thead>
          <tbody>
            {analysis.comparePlans.map((plan, index) => (
              <tr key={plan.region}>
                <td>{index + 1}</td>
                <td>{plan.region}</td>
                <td>{plan.score}</td>
                <td>{index === 0 ? '推荐优先布局' : index === 1 ? '可作为备选' : '课堂对比样本'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card stack-md">
        <div className="eyebrow">对比解读</div>
        <ul>
          <li>如果推荐区域与当前选择不同，说明还可以进一步优化交通、市场或环境之间的平衡。</li>
          <li>课堂讲评时，教师可用第一名和第三名方案做对照，引导学生说出“为什么差”。</li>
          <li>后续接入真实地图数据后，可进一步展示路网距离、地价、污染敏感区等证据。</li>
        </ul>
      </section>
    </div>
  );
}
