import { submissions } from '../../data/mock';

export function TeacherReviewPage() {
  return (
    <div className="card">
      <div className="eyebrow">教师端 · 作业批阅</div>
      <h3>学生提交记录</h3>
      <table className="table">
        <thead>
          <tr><th>学生</th><th>班级</th><th>工厂类型</th><th>选址区域</th><th>得分</th><th>提交时间</th><th>状态</th></tr>
        </thead>
        <tbody>
          {submissions.map((item) => (
            <tr key={`${item.student}-${item.submittedAt}`}>
              <td>{item.student}</td><td>{item.className}</td><td>{item.factoryType}</td><td>{item.region}</td><td>{item.score}</td><td>{item.submittedAt}</td><td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
