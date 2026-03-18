import { useMemo, useState } from 'react';
import { taskFocusOptions } from '../../data/mock';

export function TeacherCreatePage() {
  const [title, setTitle] = useState('工业区位选择：食品厂选址');
  const [topic, setTopic] = useState('工业区位选择');
  const [mapMode, setMapMode] = useState<'realistic' | 'abstract'>('realistic');
  const [className, setClassName] = useState('高一（3）班');
  const [difficulty, setDifficulty] = useState('标准');
  const [promptLevel, setPromptLevel] = useState('适中');
  const [deadline, setDeadline] = useState('2026-03-25T18:00');
  const [focusFactors, setFocusFactors] = useState<string[]>(['交通', '市场', '环境']);
  const [description, setDescription] = useState('请基于市场、交通、环境、集聚等因素，为指定工厂类型选择最优选址，并形成分析结论。');

  const summary = useMemo(
    () => `面向${className}发布“${title}”，使用${mapMode === 'realistic' ? '实景地图' : '抽象地图'}，重点考察${focusFactors.join('、')}，提示强度为${promptLevel}，难度为${difficulty}。`,
    [className, title, mapMode, focusFactors, promptLevel, difficulty],
  );

  const toggleFactor = (factor: string) => {
    setFocusFactors((current) =>
      current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor],
    );
  };

  return (
    <div className="grid-2">
      <section className="card stack-md">
        <div className="eyebrow">教师端 · 发布新任务</div>
        <h3>创建工业区位选择任务</h3>
        <div className="form-grid">
          <label className="field"><span>任务标题</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="field"><span>知识点</span><input value={topic} onChange={(e) => setTopic(e.target.value)} /></label>
          <label className="field"><span>地图模式</span><select value={mapMode} onChange={(e) => setMapMode(e.target.value as 'realistic' | 'abstract')}><option value="realistic">实景地图</option><option value="abstract">抽象地图</option></select></label>
          <label className="field"><span>班级</span><input value={className} onChange={(e) => setClassName(e.target.value)} /></label>
          <label className="field"><span>难度</span><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option>基础</option><option>标准</option><option>进阶</option></select></label>
          <label className="field"><span>提示强度</span><select value={promptLevel} onChange={(e) => setPromptLevel(e.target.value)}><option>低</option><option>适中</option><option>高</option></select></label>
          <label className="field field--full"><span>截止时间</span><input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
          <label className="field field--full"><span>任务说明</span><textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
        </div>

        <div className="stack-md">
          <div>
            <div className="eyebrow">重点考察因素</div>
            <div className="chip-group">
              {taskFocusOptions.map((factor) => (
                <button key={factor} type="button" className={`chip ${focusFactors.includes(factor) ? 'active' : ''}`} onClick={() => toggleFactor(factor)}>
                  {factor}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row-gap"><button className="button primary">保存草稿</button><button className="button">发布任务</button></div>
      </section>

      <aside className="card stack-md">
        <div className="eyebrow">教师预览</div>
        <h3>任务配置摘要</h3>
        <div className="callout">
          {summary}
        </div>
        <div className="meta-grid">
          <span>知识点：{topic}</span>
          <span>截止：{deadline.replace('T', ' ')}</span>
          <span>地图：{mapMode === 'realistic' ? '实景地图' : '抽象地图'}</span>
          <span>已选因子：{focusFactors.length} 个</span>
        </div>
        <ul>
          <li>适合在课前 3 分钟完成任务说明，下发班级码后开始课堂探究。</li>
          <li>可结合学情分析页观察学生是否过度依赖单一因素作答。</li>
          <li>后续可将该表单接入真实后端，实现保存草稿、版本复用和跨班级下发。</li>
        </ul>
      </aside>
    </div>
  );
}
