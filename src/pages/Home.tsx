import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="stack-lg">
      <section className="hero card">
        <div className="hero__content">
          <div>
            <div className="eyebrow">MVP 范围</div>
            <h2>先用示例数据跑通完整教学应用</h2>
          </div>
          <p className="hero__intro">
            当前版本聚焦高中地理「工业区位选择」，已将学生端、教师端、运营端统一到一个前端应用中，优先完成页面、路由、交互流程和报告展示。
          </p>
        </div>
      </section>

      <section className="grid-3 home-role-grid">
        <article className="card home-role-card home-role-card--student">
          <div className="home-role-card__content">
            <div className="eyebrow">学习入口</div>
            <h3>学生端</h3>
            <p>任务列表、地图选址、分析报告、方案对比、反向推荐。</p>
          </div>
          <Link className="button home-role-card__button" to="/student/tasks">进入学生端</Link>
        </article>
        <article className="card home-role-card home-role-card--teacher">
          <div className="home-role-card__content">
            <div className="eyebrow">教学入口</div>
            <h3>教师端</h3>
            <p>任务管理、发布任务、作业批阅、学情分析、课堂演示。</p>
          </div>
          <Link className="button home-role-card__button" to="/teacher/tasks">进入教师端</Link>
        </article>
        <article className="card home-role-card home-role-card--admin">
          <div className="home-role-card__content">
            <div className="eyebrow">管理入口</div>
            <h3>运营端</h3>
            <p>模块管理、人员管理、Prompt 配置，支撑后续平台化扩展。</p>
          </div>
          <Link className="button home-role-card__button" to="/admin/modules">进入运营端</Link>
        </article>
      </section>
    </div>
  );
}
