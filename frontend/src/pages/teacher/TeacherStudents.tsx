import { useState, useEffect, useCallback } from 'react';
import { apiListClasses, apiListStudents, apiCreateStudent, apiUpdateStudent, apiDeleteStudent, type ApiClassItem } from '../../auth/api';

interface Student {
  id: string;
  name: string;
  class: string;
  classId: string;
  studentId: string;
  status: string;
}

interface ClassOption {
  id: string;
  name: string;
}

function StudentModal({ classes, editing, onClose, onSaved }: {
  classes: ClassOption[];
  editing?: Student;
  onClose: () => void;
  onSaved: (s: Student, isNew: boolean) => void;
}) {
  const isEdit = !!editing;
  const [selectedClassId, setSelectedClassId] = useState(editing?.classId ?? classes[0]?.id ?? '');
  const [studentId, setStudentId] = useState(editing?.studentId ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [password, setPassword] = useState('123456');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !selectedClassId || submitting) return;
    if (!isEdit && !studentId.trim()) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        const updated = await apiUpdateStudent(editing!.id, {
          name: name.trim(),
          classId: selectedClassId,
        });
        onSaved({
          id: updated.id,
          name: updated.name,
          class: updated.className,
          classId: updated.classId,
          studentId: updated.studentId,
          status: updated.status,
        }, false);
      } else {
        const created = await apiCreateStudent({
          classId: selectedClassId,
          studentNumber: studentId.trim(),
          name: name.trim(),
          password: password || undefined,
        });
        onSaved({
          id: created.id,
          name: created.name,
          class: created.className,
          classId: created.classId,
          studentId: created.studentId,
          status: created.status,
        }, true);
      }
      onClose();
    } catch (err: any) {
      alert(err.message ?? (isEdit ? '修改失败' : '添加失败'));
    } finally {
      setSubmitting(false);
    }
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

        <h3 style={{ margin: '0 0 4px', fontWeight: 700 }}>{isEdit ? '修改学生' : '添加学生'}</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          {isEdit ? '修改学生信息' : '为选定的班级添加新学生'}
        </p>

        <div className="stack-md">
          <label className="field field--full">
            <span>选择班级 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label className="field field--full">
            <span>学号 <span style={{ color: 'var(--primary)' }}>*</span></span>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="输入学号"
              disabled={isEdit}
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

          {!isEdit && (
            <label className="field field--full">
              <span>初始密码</span>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入初始密码"
              />
            </label>
          )}

          <button
            type="button"
            className="button primary"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={handleSubmit}
          >
            {isEdit ? '保存' : '添加'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeacherStudentsPage() {
  const [modalTarget, setModalTarget] = useState<Student | 'new' | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [classList, studentList] = await Promise.all([apiListClasses(), apiListStudents()]);
      setClasses(classList.map((c) => ({ id: c.id, name: c.name })));
      setStudents(studentList.map((s) => ({
        id: s.id,
        name: s.name,
        class: s.className,
        classId: s.classId,
        studentId: s.studentId,
        status: s.status,
      })));
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaved = (s: Student, isNew: boolean) => {
    if (isNew) {
      setStudents((prev) => [...prev, s]);
    } else {
      setStudents((prev) => prev.map((x) => x.id === s.id ? s : x));
    }
  };

  const handleDelete = async (s: Student) => {
    if (!confirm(`确定删除学生「${s.name}」吗？`)) return;
    try {
      await apiDeleteStudent(s.id);
      setStudents((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err: any) {
      alert(err.message ?? '删除失败');
    }
  };

  return (
    <>
      {modalTarget && <StudentModal
        classes={classes}
        editing={modalTarget === 'new' ? undefined : modalTarget}
        onClose={() => setModalTarget(null)}
        onSaved={handleSaved}
      />}
      <div className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">教师端 · 学生管理</div>
            <h3>学生列表</h3>
          </div>
          <button className="button primary" onClick={() => setModalTarget('new')} disabled={classes.length === 0}>+ 添加学生</button>
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
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>加载中…</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>暂无学生，请先创建班级再添加学生</td></tr>
            ) : students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.studentId}</td>
                <td>{s.status}</td>
                <td>
                  <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: '6px' }} onClick={() => setModalTarget(s)}>修改</button>
                  <button
                    className="button"
                    style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--danger, #e53e3e)' }}
                    onClick={() => handleDelete(s)}
                  >删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
