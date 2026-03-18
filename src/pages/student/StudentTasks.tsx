import { Link } from 'react-router-dom';
import { tasks } from '../../data/mock';

export function StudentTasksPage() {
  return (
    <div className="stack-lg">
      <section className="grid-2">
        {tasks.map((task) => (
          <article key={task.id} className="card">
            <div className="row-between">
              <div>
                <div className="eyebrow">{task.topic}</div>
                <h3>{task.title}</h3>
              </div>
              <span className="tag success">{task.status}</span>
            </div>
            <p>{task.description}</p>
            <div className="meta-grid">
              <span>班级：{task.className}</span>
              <span>地图模式：{task.mode === 'realistic' ? '实景地图' : '抽象地图'}</span>
              <span>截止：{task.deadline}</span>
              <span>完成率：{task.completionRate}%</span>
            </div>
            <div className="row-gap">
              <Link className="button primary" to="/student/decision">开始作答</Link>
              <Link className="button" to="/student/report">查看示例报告</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
