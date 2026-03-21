import { useState } from 'react';

interface ClassItem {
  name: string;
  students: number;
  teacher: string;
  status: string;
}

function AddClassModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: ClassItem) => void }) {
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('胡永宝');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), students: 0, teacher: teacher.trim() || '胡永宝', status: '正常' });
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

        <h3 style={{ margin: '0 0 4px', fontWeight: 700 }}>新增班级</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          为学校添加一个新的班级
        </p>

        <div className="stack-md">
          <label className="field field--full">
            <span>班级名称 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：高一（6）班"
            />
          </label>

          <label className="field field--full">
            <span>班主任</span>
            <input
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="输入班主任姓名"
            />
          </label>

          <button
            type="button"
            className="button primary"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={handleAdd}
          >
            新增
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeacherClassesPage() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([
    { name: '高一（1）班', students: 42, teacher: '胡永宝', status: '正常' },
    { name: '高一（2）班', students: 45, teacher: '胡永宝', status: '正常' },
    { name: '高一（3）班', students: 41, teacher: '胡永宝', status: '正常' },
    { name: '高一（4）班', students: 43, teacher: '胡永宝', status: '正常' },
    { name: '高一（5）班', students: 44, teacher: '胡永宝', status: '正常' },
  ]);

  const handleAdd = (c: ClassItem) => {
    setClasses((prev) => [...prev, c]);
  };

  return (
    <>
      {showModal && <AddClassModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
      <div className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">教师端 · 班级管理</div>
            <h3>我的班级</h3>
          </div>
          <button className="button primary" onClick={() => setShowModal(true)}>+ 新增班级</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>班级名称</th>
              <th>学生人数</th>
              <th>班主任</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.name}>
                <td>{cls.name}</td>
                <td>{cls.students} 人</td>
                <td>{cls.teacher}</td>
                <td>{cls.status}</td>
                <td>
                  <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>查看详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
