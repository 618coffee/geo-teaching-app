import { Chart } from '../../components/Chart';
import { useDemoState } from '../../data/useDemoState';

export function StudentReportPage() {
  const { state, analysis } = useDemoState();

  const barOption = {
    tooltip: {},
    xAxis: { type: 'category' as const, data: ['预估利润', '运输成本', '集聚效应', '环境风险'] },
    yAxis: { type: 'value' as const, max: 100 },
    series: [
      {
        type: 'bar' as const,
        data: [analysis.profit + 50, analysis.transportCost, analysis.agglomeration, analysis.environmentRisk],
        itemStyle: { borderRadius: [8, 8, 0, 0] },
      },
    ],
  };

  return (
    <div className="stack-lg">
      <section className="grid-4">
        <article className="card stat"><span>班级码</span><strong>{state.classCode}</strong></article>
        <article className="card stat"><span>工厂类型</span><strong>{state.factoryType}</strong></article>
        <article className="card stat"><span>选址区域</span><strong>{analysis.region.name}</strong></article>
        <article className="card stat"><span>综合评分</span><strong>{analysis.score}</strong></article>
      </section>

      <section className="grid-2">
        <article className="card stack-md">
          <div className="eyebrow">核心指标分析</div>
          <div className="metric-list large">
            <div><span>预估利润</span><strong>{analysis.profit > 0 ? '+' : ''}{analysis.profit}</strong></div>
            <div><span>运输成本</span><strong>{analysis.transportCost}</strong></div>
            <div><span>集聚效应</span><strong>{analysis.agglomeration}</strong></div>
            <div><span>环境风险</span><strong>{analysis.environmentRisk}</strong></div>
          </div>
          <p>{analysis.summary}</p>
          <ul>
            {analysis.suggestions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article className="card">
          <div className="eyebrow">可视化对比图表</div>
          <Chart option={barOption} />
        </article>
      </section>
    </div>
  );
}
