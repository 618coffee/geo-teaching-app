import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero card">
        <div>
          <div className="eyebrow">MVP 范围</div>
          <h2>先用 mock 数据跑通完整教学应用</h2>
          <p>
            当前版本聚焦高中地理「工业区位选择」，已将学生端、教师端、运营端统一到一个前端应用中，优先完成页面、路由、交互流程和报告展示。
          </p>
        </div>
        <div className="hero__actions">
          <Link className="button primary" to="/student/tasks">进入学生端</Link>
          <Link className="button" to="/teacher/tasks">进入教师端</Link>
          <Link className="button" to="/admin/modules">进入运营端</Link>
        </div>
      </section>

      <section className="grid-3">
        <article className="card">
          <h3>学生端</h3>
          <p>任务列表、地图选址、分析报告、方案对比、反向推荐。</p>
        </article>
        <article className="card">
          <h3>教师端</h3>
          <p>任务管理、发布任务、作业批阅、学情分析、课堂演示。</p>
        </article>
        <article className="card">
          <h3>运营端</h3>
          <p>模块管理、人员管理、Prompt 配置，支撑后续平台化扩展。</p>
        </article>
      </section>
    </div>
  );
}
