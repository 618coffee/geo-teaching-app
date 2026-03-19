const entries = [
  { title: '工业区位基础概念', stage: '高一', tag: '核心知识', updatedAt: '2026-03-18', status: '已同步', note: '用于学生端报告与教师端讲评模板。' },
  { title: '城镇规划对比案例', stage: '高一', tag: '案例模板', updatedAt: '2026-03-16', status: '待完善', note: '补充城镇功能分区和人口迁移的联动关系。' },
  { title: '环境保护治理路径', stage: '高二', tag: '拓展模块', updatedAt: '2026-03-14', status: '已同步', note: '用于开放式讨论和反向推荐解释。' },
  { title: '交通运输网络示意', stage: '高一', tag: '图层素材', updatedAt: '2026-03-12', status: '待审核', note: '适配抽象地图与课堂演示模式。' },
];

export function AdminKnowledgePage() {
  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>知识库</h2>
          <p className="admin-page__subtitle">维护知识点模板、案例说明与图层素材</p>
        </div>
        <button type="button" className="admin-button admin-button--primary">新增条目</button>
      </section>

      <section className="admin-module-grid">
        {entries.map((entry) => (
          <article key={entry.title} className="admin-item-card">
            <div className="admin-item-card__meta">
              <span className="status-pill status-pill--neutral">{entry.tag}</span>
              <span className={`status-pill ${entry.status === '已同步' ? 'status-pill--live' : 'status-pill--draft'}`}>{entry.status}</span>
            </div>
            <h3>{entry.title}</h3>
            <p>{entry.note}</p>
            <div className="admin-item-card__footer">
              <span>{entry.stage} · 更新于 {entry.updatedAt}</span>
              <button type="button" className="admin-button admin-button--ghost admin-button--sm">编辑</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}