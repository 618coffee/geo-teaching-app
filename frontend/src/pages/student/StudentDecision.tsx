import { Link } from 'react-router-dom';
import { MapBoard } from '../../components/MapBoard';
import { factorLabels, factoryProfiles, regions, tasks } from '../../data/demoData';
import { useDemoState } from '../../data/useDemoState';

export function StudentDecisionPage() {
  const { state, setState, analysis } = useDemoState();
  const activeTask = tasks[0];
  const isClassCodeValid = state.classCode.length === 6;
  const canSubmit = isClassCodeValid && Boolean(state.factoryType) && Boolean(state.regionId);
  const topFactors = Object.entries(factoryProfiles[state.factoryType])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => factorLabels[key as keyof typeof factorLabels]);

  return (
    <div className="decision-layout">
      <section className="stack-lg">
        <article className="card stack-md">
          <div className="row-between">
            <div>
              <div className="eyebrow">任务情境</div>
              <h3>{activeTask.title}</h3>
            </div>
            <span className="tag success">{activeTask.status}</span>
          </div>
          <p>{activeTask.description}</p>
          <div className="meta-grid">
            <span>班级：{activeTask.className}</span>
            <span>地图模式：{activeTask.mode === 'realistic' ? '实景地图' : '抽象地图'}</span>
            <span>截止时间：{activeTask.deadline}</span>
            <span>重点考察：交通 / 市场 / 环境 / 集聚</span>
          </div>
          <div className="callout">
            <strong>课堂任务：</strong>
            你需要为 <strong>{state.factoryType}</strong> 选择最合适的建厂位置，并说明该位置在交通、市场、环境等方面的优势与风险。
          </div>
        </article>

        <section className="card">
          <MapBoard regions={regions} selectedId={state.regionId} onSelect={(regionId) => setState({ ...state, regionId })} />
        </section>
      </section>

      <aside className="card stack-md">
        <div>
          <div className="eyebrow">工厂决策面板</div>
          <h3>提交区位决策</h3>
        </div>
        <label className="field">
          <span>班级码</span>
          <input value={state.classCode} placeholder="请输入 6 位班级码" onChange={(e) => setState({ ...state, classCode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
          {!isClassCodeValid && <small>班级码需为 6 位数字</small>}
        </label>
        <label className="field">
          <span>工厂类型</span>
          <select value={state.factoryType} onChange={(e) => setState({ ...state, factoryType: e.target.value as keyof typeof factoryProfiles })}>
            {Object.keys(factoryProfiles).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <div className="field readonly">
          <span>当前选址区域</span>
          <strong>{analysis.region.name}</strong>
          <small>{analysis.region.tags.join(' · ')}</small>
        </div>
        <div className="metric-list">
          <div><span>市场</span><strong>{analysis.region.scores.market}</strong></div>
          <div><span>交通</span><strong>{analysis.region.scores.transport}</strong></div>
          <div><span>环境</span><strong>{analysis.region.scores.environment}</strong></div>
          <div><span>集聚</span><strong>{analysis.region.scores.agglomeration}</strong></div>
        </div>
        <div className="callout soft">
          <strong>该产业重点关注：</strong>
          {topFactors.join('、')}
        </div>
        <p className="hint">当前为规则引擎演示：根据工厂类型偏好 × 区域属性自动生成分析结果。</p>
        <div className="row-gap">
          <Link className={`button primary ${!canSubmit ? 'button-disabled' : ''}`} aria-disabled={!canSubmit} to={canSubmit ? '/student/report' : '/student/decision'}>提交决策并查看分析</Link>
          <Link className="button" to="/student/reverse">切换到反向推荐</Link>
        </div>
      </aside>
    </div>
  );
}
