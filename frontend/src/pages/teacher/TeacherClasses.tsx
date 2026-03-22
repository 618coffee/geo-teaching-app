import { useState, useEffect, useCallback } from 'react';
import { apiListClasses, apiCreateClass, apiUpdateClass, apiDeleteClass, type ApiClassItem } from '../../auth/api';

interface ClassItem {
  id: string;
  name: string;
  students: number;
  teacher: string;
  status: string;
}

function ClassModal({ editing, onClose, onSaved }: {
  editing?: ClassItem;
  onClose: () => void;
  onSaved: (c: ClassItem, isNew: boolean) => void;
}) {
  const isEdit = !!editing;
  const [name, setName] = useState(editing?.name ?? '');
  const [teacher, setTeacher] = useState(editing?.teacher ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        const updated = await apiUpdateClass(editing!.id, {
          name: name.trim(),
          teacherName: teacher.trim() || undefined,
        });
        onSaved({ id: updated.id, name: updated.name, students: updated.students, teacher: updated.teacher, status: updated.status }, false);
      } else {
        const created = await apiCreateClass({
          name: name.trim(),
          teacherName: teacher.trim() || undefined,
        });
        onSaved({ id: created.id, name: created.name, students: created.students, teacher: created.teacher, status: created.status }, true);
      }
      onClose();
    } catch (err: any) {
      alert(err.message ?? (isEdit ? '修改失败' : '新增失败'));
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

        <h3 style={{ margin: '0 0 4px', fontWeight: 700 }}>{isEdit ? '修改班级' : '新增班级'}</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          {isEdit ? '修改班级信息' : '为学校添加一个新的班级'}
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
            onClick={handleSubmit}
          >
            {isEdit ? '保存' : '新增'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeacherClassesPage() {
  const [modalTarget, setModalTarget] = useState<ClassItem | 'new' | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    try {
      const list = await apiListClasses();
      setClasses(list.map((c) => ({ id: c.id, name: c.name, students: c.students, teacher: c.teacher, status: c.status })));
    } catch {
      // keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleSaved = (c: ClassItem, isNew: boolean) => {
    if (isNew) {
      setClasses((prev) => [c, ...prev]);
    } else {
      setClasses((prev) => prev.map((x) => x.id === c.id ? c : x));
    }
  };

  const handleDelete = async (cls: ClassItem) => {
    if (!confirm(`确定删除班级「${cls.name}」吗？`)) return;
    try {
      await apiDeleteClass(cls.id);
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
    } catch (err: any) {
      alert(err.message ?? '删除失败');
    }
  };

  return (
    <>
      {modalTarget && <ClassModal
        editing={modalTarget === 'new' ? undefined : modalTarget}
        onClose={() => setModalTarget(null)}
        onSaved={handleSaved}
      />}
      <div className="card">
        <div className="row-between">
          <div>
            <div className="eyebrow">教师端 · 班级管理</div>
            <h3>我的班级</h3>
          </div>
          <button className="button primary" onClick={() => setModalTarget('new')}>+ 新增班级</button>
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
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>加载中…</td></tr>
            ) : classes.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>暂无班级，点击右上角新增</td></tr>
            ) : classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.students} 人</td>
                <td>{cls.teacher}</td>
                <td>{cls.status}</td>
                <td>
                  <button className="button" style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: '6px' }} onClick={() => setModalTarget(cls)}>修改</button>
                  <button
                    className="button"
                    style={{ padding: '4px 10px', fontSize: '0.8rem', color: 'var(--danger, #e53e3e)' }}
                    onClick={() => handleDelete(cls)}
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
