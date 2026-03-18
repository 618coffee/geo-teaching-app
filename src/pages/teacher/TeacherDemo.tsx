import { demoRecords } from '../../data/mock';

export function TeacherDemoPage() {
  return (
    <div className="grid-2">
      <section className="card stack-md">
        <div className="eyebrow">课堂演示配置</div>
        <h3>配置演示场景</h3>
        <label className="field"><span>地图模式</span><select><option>实景地图</option><option>抽象地图</option></select></label>
        <label className="field"><span>案例主题</span><input defaultValue="工业区位选择" /></label>
        <label className="field"><span>是否显示提示</span><select><option>显示</option><option>隐藏</option></select></label>
        <button className="button primary">开始演示</button>
      </section>
      <section className="card">
        <div className="eyebrow">课堂演示记录</div>
        <h3>最近演示</h3>
        <table className="table">
          <thead><tr><th>名称</th><th>模式</th><th>教师</th><th>时间</th><th>参与人数</th></tr></thead>
          <tbody>
            {demoRecords.map((item) => <tr key={item.time}><td>{item.name}</td><td>{item.mode}</td><td>{item.teacher}</td><td>{item.time}</td><td>{item.participants}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
