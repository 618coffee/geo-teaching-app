const moduleUsage = [
  { name: '工业区位', value: 92 },
  { name: '人口分布', value: 76 },
  { name: '交通运输', value: 68 },
  { name: '环境保护', value: 54 },
];

const issueSummary = [
  { label: '待修正文案', value: '4', note: '集中在学生端解释语气' },
  { label: '待补充案例', value: '3', note: '城镇规划和环境保护优先' },
  { label: '高频访问模块', value: '工业区位', note: '最近 7 天访问最高' },
];

export function AdminInsightsPage() {
  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>数据洞察</h2>
          <p className="admin-page__subtitle">从模块访问、教学反馈和问题清单观察运营趋势</p>
        </div>
        <button type="button" className="admin-button">下载报告</button>
      </section>

      <section className="admin-metric-grid admin-metric-grid--three">
        {issueSummary.map((item) => (
          <article key={item.label} className="admin-metric">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>模块访问热度</h3>
              <p className="admin-panel__subtitle">近 7 天模块访问与使用反馈情况</p>
            </div>
          </div>

          <div className="admin-bar-list">
            {moduleUsage.map((item) => (
              <div key={item.name} className="admin-bar-row">
                <div className="admin-bar-row__label">
                  <strong>{item.name}</strong>
                  <span>{item.value}%</span>
                </div>
                <div className="admin-bar-track">
                  <span className="admin-bar-fill" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>关注建议</h3>
              <p className="admin-panel__subtitle">根据近阶段体验反馈整理的运营动作</p>
            </div>
          </div>

          <div className="admin-list">
            <div className="admin-list-card">
              <strong>优先补齐城镇规划内容</strong>
              <p>当前访问热度高于预期，但案例和图层说明仍不足。</p>
            </div>
            <div className="admin-list-card">
              <strong>继续优化学生端解释语气</strong>
              <p>减少结论重复，增强因果链条和课堂可讨论性。</p>
            </div>
            <div className="admin-list-card">
              <strong>把环境保护模块加入试运行</strong>
              <p>完成最后一轮案例审查后即可进入上架准备。</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}