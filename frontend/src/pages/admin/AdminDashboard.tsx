import { demoRecords, prompts } from '../../data/demoData';

const queueItems = [
  { title: '模块发布审批', note: '工业区位模块等待内容运营复核', status: '待处理' },
  { title: '知识点补充', note: '城镇规划需补充课堂案例和配套题目', status: '进行中' },
  { title: 'Prompt 回归', note: '学生端反馈报告需要对比新旧策略差异', status: '已安排' },
];

export function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <section className="admin-page__header">
        <div className="admin-page__title-wrap">
          <h2>仪表盘</h2>
          <p className="admin-page__subtitle">查看模块、Prompt 与课堂演示的整体运行状态</p>
        </div>
        <button type="button" className="admin-button">导出概览</button>
      </section>

      <section className="admin-metric-grid admin-metric-grid--four">
        <article className="admin-metric">
          <span>已发布模块</span>
          <strong>6</strong>
          <p>当前展示 6 个知识点入口</p>
        </article>
        <article className="admin-metric">
          <span>启用 Prompt</span>
          <strong>16</strong>
          <p>已覆盖学生反馈与教师讲评场景</p>
        </article>
        <article className="admin-metric">
          <span>本周回归</span>
          <strong>5</strong>
          <p>含 2 个待继续优化的输出策略</p>
        </article>
        <article className="admin-metric">
          <span>课堂演示</span>
          <strong>{demoRecords.length}</strong>
          <p>近期课堂演示已同步到运营看板</p>
        </article>
      </section>

      <section className="admin-grid-2">
        <article className="admin-panel">
          <div className="admin-panel__header">
            <div>
              <h3>最近更新</h3>
              <p className="admin-panel__subtitle">Prompt 与演示课堂的最新变更</p>
            </div>
          </div>

          <div className="admin-list">
            {prompts.map((item) => (
              <div key={item.name} className="admin-list-card admin-list-card--row">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.scene} · {item.version}</p>
                </div>
                <span className={`status-pill ${item.status === '启用' ? 'status-pill--live' : 'status-pill--draft'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-panel admin-panel--subtle">
          <div className="admin-panel__header">
            <div>
              <h3>当前待办</h3>
              <p className="admin-panel__subtitle">按截图中的后台管理视角整理的运营任务</p>
            </div>
          </div>

          <div className="admin-list">
            {queueItems.map((item) => (
              <div key={item.title} className="admin-list-card">
                <div className="admin-inline-stat">{item.status}</div>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}