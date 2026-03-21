import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const knowledgeModules = ['工业区位', '农业区位', '人口与城市', '交通运输', '资源开发', '区域发展'];
const classList = ['高一（1）班', '高一（2）班', '高一（3）班', '高一（4）班', '高一（5）班', '高二（1）班', '高二（2）班'];

export function TeacherCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [knowledgeModule, setKnowledgeModule] = useState('工业区位');
  const [targetClass, setTargetClass] = useState('');
  const [enableFactoryType, setEnableFactoryType] = useState(false);
  const [enableDirection, setEnableDirection] = useState(false);
  const templates: { factoryType: string; direction: string }[] = [];

  const handleSubmit = () => {
    navigate('/teacher/tasks');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="stack-lg">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          className="button"
          style={{ padding: '6px 12px', minWidth: 'unset' }}
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          ←
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>发布任务</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>为班级创建新的地理任务</p>
        </div>
      </div>

      <section className="card stack-md">
        <div>
          <h4 style={{ margin: '0 0 4px', fontWeight: 600 }}>任务信息</h4>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>填写任务的基本信息</p>
        </div>

        <label className="field field--full">
          <span>
            任务标题 <span style={{ color: 'var(--primary)' }}>*</span>
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：工业区位选择分析"
          />
        </label>

        <label className="field field--full">
          <span>任务说明</span>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述任务的背景、目标和要求..."
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span>
              知识模块 <span style={{ color: 'var(--primary)' }}>*</span>
            </span>
            <select value={knowledgeModule} onChange={(e) => setKnowledgeModule(e.target.value)}>
              {knowledgeModules.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>
              目标班级 <span style={{ color: 'var(--primary)' }}>*</span>
            </span>
            <select value={targetClass} onChange={(e) => setTargetClass(e.target.value)}>
              <option value="">选择班级</option>
              {classList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={enableFactoryType}
              onChange={(e) => setEnableFactoryType(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            工厂类型
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text)' }}>
            <input
              type="checkbox"
              checked={enableDirection}
              onChange={(e) => setEnableDirection(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            指向类型
          </label>
        </div>
      </section>

      <section className="card stack-md">
        <div className="row-between">
          <div>
            <h4 style={{ margin: '0 0 4px', fontWeight: 600 }}>快捷选址模板</h4>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.875rem' }}>
              提取预设工厂类型和指向类型，演示或学生任务时自动代入
            </p>
          </div>
          <button type="button" className="button" style={{ whiteSpace: 'nowrap' }}>
            + 添加模板
          </button>
        </div>

        {templates.length === 0 && (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '0.875rem', margin: 0 }}>
            暂无模板，默认需学生自行选择
          </p>
        )}
      </section>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="button" className="button primary" onClick={handleSubmit}>
          发布任务
        </button>
        <button type="button" className="button" onClick={handleCancel}>
          取消
        </button>
      </div>
    </div>
  );
}