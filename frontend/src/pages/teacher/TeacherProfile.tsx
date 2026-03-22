import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiListClasses, apiGetTeachingClasses, apiSetTeachingClasses, apiUpdateProfile, type ApiClassItem } from '../../auth/api';

interface ClassOption {
  id: string;
  name: string;
}

export function TeacherProfilePage() {
  const { user, updateProfile } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [allClasses, setAllClasses] = useState<ClassOption[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [savedClassIds, setSavedClassIds] = useState<string[]>([]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const classList = await apiListClasses();
      setAllClasses(classList.map((c) => ({ id: c.id, name: c.name })));
    } catch {
      // keep defaults on error
    }
    try {
      const teachingData = await apiGetTeachingClasses();
      setSelectedClassIds(teachingData.classIds);
      setSavedClassIds(teachingData.classIds);
    } catch {
      // keep defaults on error
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleClass = (id: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim() || saving) return;
    setSaving(true);
    try {
      await apiUpdateProfile({ displayName: displayName.trim() });
      updateProfile({ displayName: displayName.trim() });
      await apiSetTeachingClasses(selectedClassIds);
      setSavedClassIds(selectedClassIds);
      setEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err: any) {
      alert(err.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setDisplayName(user?.displayName ?? '');
    setSelectedClassIds(savedClassIds);
    setEditingProfile(false);
  };

  const handleSavePassword = () => {
    setPasswordError('');
    setPasswordSaved(false);
    if (newPassword.length < 8) {
      setPasswordError('新密码至少需要 8 位。');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('两次输入的密码不一致。');
      return;
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditingPassword(false);
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  const handleCancelPassword = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setEditingPassword(false);
  };

  return (
    <div className="stack-lg">
      <section className="card stack-md">
        <div className="row-between">
          <div>
            <div className="eyebrow">教师端 · 个人中心</div>
            <h3 style={{ margin: 0 }}>个人信息</h3>
          </div>
          {!editingProfile && (
            <button className="button" onClick={() => setEditingProfile(true)}>编辑</button>
          )}
        </div>

        <div className="form-grid">
          <label className="field readonly">
            <span>账号</span>
            <strong>{user?.account ?? '—'}</strong>
          </label>
          <label className="field readonly">
            <span>所属学校</span>
            <strong>示范高中</strong>
          </label>
        </div>

        <label className="field field--full">
          <span>姓名</span>
          {editingProfile ? (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="请输入姓名"
            />
          ) : (
            <strong style={{ padding: '10px 14px', display: 'block' }}>{user?.displayName ?? '—'}</strong>
          )}
        </label>

        <div>
          <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--muted)' }}>任教班级</div>
          {editingProfile ? (
            allClasses.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--muted)' }}>暂无班级，请先在班级管理中创建班级</p>
            ) : (
              <div className="chip-group">
                {allClasses.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    className={`chip ${selectedClassIds.includes(cls.id) ? 'active' : ''}`}
                    onClick={() => toggleClass(cls.id)}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            )
          ) : (
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              {selectedClassIds.length > 0
                ? selectedClassIds.map((id) => allClasses.find((c) => c.id === id)?.name ?? id).join(' / ')
                : '暂未设置'}
            </p>
          )}
        </div>

        {editingProfile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="button primary" onClick={handleSaveProfile}>保存</button>
            <button className="button" onClick={handleCancelProfile}>取消</button>
          </div>
        )}
        {profileSaved && <span style={{ color: 'var(--success-text)', fontSize: '0.875rem' }}>已保存 ✓</span>}
      </section>

      <section className="card stack-md">
        <div className="row-between">
          <h4 style={{ margin: 0, fontWeight: 600 }}>修改密码</h4>
          {!editingPassword && (
            <button className="button" onClick={() => setEditingPassword(true)}>修改密码</button>
          )}
        </div>
        {!editingPassword && (
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>点击"修改密码"按钮来更改您的登录密码。</p>
        )}
        {editingPassword && (
          <>
            <label className="field field--full">
              <span>当前密码</span>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="请输入当前密码" />
            </label>
            <label className="field field--full">
              <span>新密码</span>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="请输入新密码（至少 8 位）" />
            </label>
            <label className="field field--full">
              <span>确认新密码</span>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="请再次输入新密码" />
            </label>
            {passwordError && <p style={{ color: 'var(--danger-text)', fontSize: '0.875rem', margin: 0 }}>{passwordError}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="button primary" onClick={handleSavePassword}>保存</button>
              <button className="button" onClick={handleCancelPassword}>取消</button>
            </div>
          </>
        )}
        {passwordSaved && <span style={{ color: 'var(--success-text)', fontSize: '0.875rem' }}>已保存 ✓</span>}
      </section>
    </div>
  );
}
