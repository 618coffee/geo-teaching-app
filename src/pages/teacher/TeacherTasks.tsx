import { tasks } from '../../data/demoData';

export function TeacherTasksPage() {
  return (
    <div className="card">
      <div className="row-between">
        <div>
          <div className="eyebrow">教师端 · 任务管理</div>
          <h3>当前教学任务</h3>
        </div>
        <button className="button primary">新建任务</button>
      </div>
      <table className="table">
        <thead>
          <tr><th>任务名称</th><th>班级</th><th>模式</th><th>截止时间</th><th>完成率</th><th>状态</th></tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.className}</td>
              <td>{task.mode === 'realistic' ? '实景地图' : '抽象地图'}</td>
              <td>{task.deadline}</td>
              <td>{task.completionRate}%</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
