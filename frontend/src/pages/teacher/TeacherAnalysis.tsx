import { Chart } from '../../components/Chart';
import { teachingStats } from '../../data/demoData';

export function TeacherAnalysisPage() {
  const option = {
    tooltip: {},
    xAxis: { type: 'category' as const, data: teachingStats.regionDistribution.map((item) => item.name) },
    yAxis: { type: 'value' as const },
    series: [{ type: 'bar' as const, data: teachingStats.regionDistribution.map((item) => item.value), itemStyle: { color: '#4f8cff' } }],
  };

  return (
    <div className="stack-lg">
      <section className="grid-4">
        <article className="card stat"><span>班级完成率</span><strong>{teachingStats.classCompletion}%</strong></article>
        <article className="card stat"><span>平均得分</span><strong>{teachingStats.avgScore}</strong></article>
        <article className="card stat"><span>风险选址</span><strong>{teachingStats.riskyChoices}</strong></article>
        <article className="card stat"><span>最佳示例区域</span><strong>{teachingStats.bestRegion}</strong></article>
      </section>
      <section className="grid-2">
        <article className="card">
          <div className="eyebrow">学情分析</div>
          <h3>学生选址区域分布</h3>
          <Chart option={option} />
        </article>
        <article className="card stack-md">
          <div className="eyebrow">AI 归纳</div>
          <h3>班级共性问题</h3>
          <ul>
            <li>多数学生已经理解“交通便利”对工业布局的重要性，但仍容易低估环境约束。</li>
            <li>风险选址主要集中在靠近居民区或市场中心的位置，说明污染型工业区分还需强化。</li>
            <li>建议下一轮课堂讲评重点比较“铁路枢纽区”和“城镇中心”两个高频选项。</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
