import { MapBoard } from '../../components/MapBoard';
import { factoryProfiles, regions } from '../../data/demoData';
import { useDemoState } from '../../data/useDemoState';

export function StudentReversePage() {
  const { state, setState, analysis } = useDemoState();
  return (
    <div className="decision-layout">
      <section className="card">
        <MapBoard mode="abstract" regions={regions} selectedId={state.regionId} onSelect={(regionId) => setState({ ...state, regionId })} />
      </section>
      <aside className="card stack-md">
        <div className="eyebrow">反向推荐决策面板</div>
        <h3>从产业偏好反推最优选址</h3>
        <label className="field">
          <span>工厂类型</span>
          <select value={state.factoryType} onChange={(e) => setState({ ...state, factoryType: e.target.value as keyof typeof factoryProfiles })}>
            {Object.keys(factoryProfiles).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="field readonly">
          <span>推荐区域</span>
          <strong>{analysis.comparePlans[0]?.region}</strong>
          <small>当前选中区域：{analysis.region.name}</small>
        </div>
        <ul>
          <li>优先关注交通、市场、环境等多要素综合表现</li>
          <li>支持课堂上对“为什么不是别处”进行反向讲解</li>
          <li>后续可替换为真实 AI 推荐逻辑</li>
        </ul>
      </aside>
    </div>
  );
}
