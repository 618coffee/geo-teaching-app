import { demoRecords } from '../../data/demoData';

export function TeacherDemosPage() {
  return (
    <div className="card">
      <div className="row-between">
        <div>
          <div className="eyebrow">教师端 · 演示记录</div>
          <h3>课堂演示历史</h3>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>演示名称</th>
            <th>地图模式</th>
            <th>主讲教师</th>
            <th>演示时间</th>
            <th>参与人数</th>
          </tr>
        </thead>
        <tbody>
          {demoRecords.map((item) => (
            <tr key={item.time}>
              <td>{item.name}</td>
              <td>{item.mode}</td>
              <td>{item.teacher}</td>
              <td>{item.time}</td>
              <td>{item.participants} 人</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
