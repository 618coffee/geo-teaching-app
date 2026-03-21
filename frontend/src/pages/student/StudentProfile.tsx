import { useAuth } from '../../auth/AuthContext';

export function StudentProfilePage() {
  const { user } = useAuth();

  return (
    <div className="stack-lg">
      <section className="card stack-md">
        <div>
          <div className="eyebrow">学生端 · 个人中心</div>
          <h3 style={{ margin: 0 }}>个人信息</h3>
        </div>

        <div className="form-grid">
          <label className="field readonly">
            <span>账号</span>
            <strong>{user?.account ?? '—'}</strong>
          </label>
          <label className="field readonly">
            <span>角色</span>
            <strong>学生</strong>
          </label>
        </div>

        <label className="field field--full readonly">
          <span>姓名</span>
          <strong style={{ padding: '10px 14px', display: 'block' }}>{user?.displayName ?? '—'}</strong>
        </label>

        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>
          如需修改个人信息，请联系任课教师。
        </p>
      </section>
    </div>
  );
}