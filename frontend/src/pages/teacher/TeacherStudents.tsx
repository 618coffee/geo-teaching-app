import { useState } from 'react';

const classList = ['高一（1）班', '高一（2）班', '高一（3）班', '高一（4）班', '高一（5）班', '高二（1）班', '高二（2）班'];

interface Student {
  name: string;
  class: string;
  studentId: string;
  status: string;
}

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Student) => void }) {
  const [selectedClass, setSelectedClass] = useState(classList[0]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('123456');

  const handleAdd = () => {
    if (!studentId.trim() || !name.trim()) return;
    onAdd({ name: name.trim(), class: selectedClass, studentId: studentId.trim(), status: '正常' });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '28px 28px 24px',
          width: '100%', maxWidth: '440px',
          boxShadow: 'var(--shadow)',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1, padding: '4px',
          }}
        >
          ×
        </button>

        <h3 style={{ margin: '0 0 4px', fontWeight: 700 }}>添加学生</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          为选定的班级添加新学生
        </p>

        <div className="stack-md">
          <label className="field field--full">
            <span>选择班级 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {classList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label className="field field--full">
            <span>学号 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="输入学号"
            />
          </label>

          <label className="field field--full">
            <span>姓名 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入姓名"
            />
          </label>

          <label className="field field--full">
            <span>初始密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入初始密码"
            />
          </label>

          <button
            type="button"
            className="button primary"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={handleAdd}
          >
            添加
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeacherStudentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { name: '陈子昂', class: '高一（3）班', studentId: '230301', status: '正常' },
    { name: '黄芷晴', class: '高一（3）班', studentId: '230302', status: '正常' },
    { name: '李浩然', class: '高一（5）班', studentId: '230501', status: '需关注' },
    { name: '王思远', class: '高一（5）班', studentId: '230502', status: '正常' },
    { name: '刘晓雨', class: '高一（3）班', studentId: '230303', status: '正常' },
  ]);

  const handleAdd = (s: Student) => {
    setStudents((prev) => [...prev, s]);
  };

  return (
    <>
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <div className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">教师端 · 学生管理</div>
            <h3>学生列表</h3>
          </div>
          <button className="button primary" onClick={() => setShowModal(true)}>+ 添加学生</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>姓名</th>
              <th>班级</th>
              <th>学号</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentId}>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.studentId}</td>
                <td>{s.status}</td>
                <td>
                  <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
